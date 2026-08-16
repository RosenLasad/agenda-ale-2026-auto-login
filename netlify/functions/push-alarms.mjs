import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import webpush from "web-push";

const REGISTRY_KEY = "push-registry-v1";
const DELIVERIES_KEY = "push-deliveries-v1";
const TIME_ZONE = "Europe/Rome";
const LOOKBACK_MS = 30 * 60 * 1000;
const LOOKAHEAD_MS = 30 * 1000;
const KEEP_DELIVERIES_MS = 14 * 24 * 60 * 60 * 1000;

function getUpdatedAtMillis(value) {
  const parsed = Date.parse(value?.updatedAt || "");
  return Number.isFinite(parsed) ? parsed : 0;
}

async function loadBestState(store, aliases) {
  const candidates = await Promise.all((aliases || []).map(async (alias) => ({
    data: await store.get(`state-v1-${alias}`, { type: "json", consistency: "strong" })
  })));
  return candidates
    .filter((item) => item.data && typeof item.data === "object")
    .sort((a, b) => getUpdatedAtMillis(b.data) - getUpdatedAtMillis(a.data))[0]?.data || null;
}

function zonedLocalToUtc(dateISO, time) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateISO || ""));
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(String(time || ""));
  if (!dateMatch || !timeMatch) return null;

  const desired = {
    year: Number(dateMatch[1]), month: Number(dateMatch[2]), day: Number(dateMatch[3]),
    hour: Number(timeMatch[1]), minute: Number(timeMatch[2])
  };
  let timestamp = Date.UTC(desired.year, desired.month - 1, desired.day, desired.hour, desired.minute);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(timestamp))
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, Number(part.value)])
    );
    const represented = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
    const wanted = Date.UTC(desired.year, desired.month - 1, desired.day, desired.hour, desired.minute);
    const correction = wanted - represented;
    timestamp += correction;
    if (correction === 0) break;
  }
  return new Date(timestamp);
}

function alarmLabel(offsetMinutes) {
  const offset = Number(offsetMinutes) || 0;
  return offset > 0 ? `${offset} minuti prima` : "all'orario";
}

function alarmCandidate(dateISO, event) {
  if (!event?.alarm?.enabled || !event.time) return null;
  const offset = Math.max(0, Number(event.alarm.offsetMinutes) || 0);
  let fireAt;
  let alarmKey;
  if (event.alarm.snoozeUntil) {
    fireAt = new Date(event.alarm.snoozeUntil);
    alarmKey = `${dateISO}|${event.id || ""}|snooze|${event.alarm.snoozeUntil}`;
  } else {
    const eventAt = zonedLocalToUtc(dateISO, event.time);
    if (!eventAt) return null;
    fireAt = new Date(eventAt.getTime() - offset * 60000);
    alarmKey = `${dateISO}|${event.id || ""}|${offset}`;
  }
  if (!Number.isFinite(fireAt.getTime()) || event.alarm.lastFiredKey === alarmKey) return null;
  const occurrenceKey = `${alarmKey}|${fireAt.toISOString()}`;
  return { dateISO, event, fireAt, alarmKey, occurrenceKey, offset };
}

function endpointKey(endpoint) {
  return crypto.createHash("sha256").update(String(endpoint)).digest("hex").slice(0, 24);
}

function notificationPayload(candidate, siteUrl) {
  const event = candidate.event;
  const url = new URL("/", siteUrl || "https://digenda.app");
  url.searchParams.set("view", "calendar");
  url.searchParams.set("date", candidate.dateISO);
  if (event.id) url.searchParams.set("event", event.id);
  return JSON.stringify({
    title: `Digenda · ${event.title || "Evento"}`,
    body: `${event.time || "--:--"} · Sveglia ${alarmLabel(candidate.offset)}`,
    tag: `digenda-alarm-${candidate.occurrenceKey}`,
    dateISO: candidate.dateISO,
    eventId: event.id || "",
    url: url.pathname + url.search,
    timestamp: candidate.fireAt.getTime()
  });
}

export default async () => {
  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY || "";
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY || "";
  const subject = process.env.WEB_PUSH_SUBJECT || process.env.URL || "https://digenda.app";
  if (!publicKey || !privateKey) {
    return new Response("Web Push non configurato", { status: 503 });
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);

  const store = getStore("agenda-ale");
  const registry = (await store.get(REGISTRY_KEY, { type: "json", consistency: "strong" })) || { users: {} };
  const deliveries = (await store.get(DELIVERIES_KEY, { type: "json", consistency: "strong" })) || { sent: {} };
  if (!deliveries.sent || typeof deliveries.sent !== "object") deliveries.sent = {};

  const now = Date.now();
  const lowerBound = now - LOOKBACK_MS;
  const upperBound = now + LOOKAHEAD_MS;
  let sentCount = 0;
  let registryChanged = false;

  for (const entry of Object.values(registry.users || {})) {
    const state = await loadBestState(store, entry.aliases || []);
    if (!state?.events) continue;

    const due = [];
    for (const [dateISO, events] of Object.entries(state.events)) {
      for (const event of Array.isArray(events) ? events : []) {
        const candidate = alarmCandidate(dateISO, event);
        if (!candidate) continue;
        const fireTime = candidate.fireAt.getTime();
        if (fireTime >= lowerBound && fireTime <= upperBound) due.push(candidate);
      }
    }

    const activeSubscriptions = [];
    for (const subscription of entry.subscriptions || []) {
      let keepSubscription = true;
      for (const candidate of due) {
        const deliveryKey = `${candidate.occurrenceKey}|${endpointKey(subscription.endpoint)}`;
        if (deliveries.sent[deliveryKey]) continue;
        try {
          await webpush.sendNotification(subscription, notificationPayload(candidate, process.env.URL));
          deliveries.sent[deliveryKey] = new Date().toISOString();
          sentCount += 1;
        } catch (error) {
          if (error?.statusCode === 404 || error?.statusCode === 410) {
            keepSubscription = false;
            registryChanged = true;
            break;
          }
          console.error("Invio Web Push non riuscito", error?.statusCode || "", error?.message || error);
        }
      }
      if (keepSubscription) activeSubscriptions.push(subscription);
    }
    entry.subscriptions = activeSubscriptions;
  }

  for (const [key, value] of Object.entries(deliveries.sent)) {
    const sentAt = Date.parse(value);
    if (!Number.isFinite(sentAt) || sentAt < now - KEEP_DELIVERIES_MS) delete deliveries.sent[key];
  }
  deliveries.updatedAt = new Date().toISOString();
  await store.setJSON(DELIVERIES_KEY, deliveries);

  if (registryChanged) {
    for (const [key, entry] of Object.entries(registry.users || {})) {
      if (!(entry.subscriptions || []).length) delete registry.users[key];
    }
    registry.updatedAt = new Date().toISOString();
    await store.setJSON(REGISTRY_KEY, registry);
  }

  return Response.json({ ok: true, sent: sentCount });
};

export const config = {
  schedule: "* * * * *"
};
