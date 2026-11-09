import { getStore } from "@netlify/blobs";
import webpush from "web-push";

import { readAccount, accountPrefix, pushPrefix, digest, strong, checkedSetJSON } from "../lib/state-store.mjs";
const TIME_ZONE = "Europe/Rome";
const LOOKBACK_MS = 30 * 60 * 1000;
const LOOKAHEAD_MS = 30 * 1000;

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
  const now=Date.now();
  let sentCount=0;
  const states=new Map();
  for await(const page of store.list({prefix:"push-v2/",paginate:true})){
    for(const blob of page.blobs){
      if(!/^push-v2\/[^/]+\/[^/]+$/.test(blob.key))continue;
      const entry=await store.get(blob.key,strong);
      if(!entry?.ownerId || !entry.subscription || !blob.key.startsWith(pushPrefix(entry.ownerId)))continue;
      if(!states.has(entry.ownerId)){
        try{states.set(entry.ownerId,(await readAccount(store,entry.ownerId)).data?.state);}
        catch(error){console.error("Archivio sveglie non leggibile",error.message);states.set(entry.ownerId,null);}
      }
      const state=states.get(entry.ownerId);
      if(!state?.events)continue;
      const subscription=entry.subscription;
      for(const [dateISO,events] of Object.entries(state.events)){
        for(const event of events){
          const candidate=alarmCandidate(dateISO,event);
          if(!candidate || candidate.fireAt.getTime()<now-LOOKBACK_MS || candidate.fireAt.getTime()>now+LOOKAHEAD_MS)continue;
          const deliveryKey=`${accountPrefix(entry.ownerId)}deliveries/${digest(candidate.occurrenceKey+"|"+subscription.endpoint)}`;
          const existing=await store.getWithMetadata(deliveryKey,strong);
          if(existing && (existing.data.sent || now-Date.parse(existing.data.claimedAt)<120000))continue;
          const claim=await checkedSetJSON(store,deliveryKey,{claimedAt:new Date(now).toISOString()},existing?{onlyIfMatch:existing.etag}:{onlyIfNew:true});
          if(!claim.modified)continue;
          try{
            await webpush.sendNotification(subscription,notificationPayload(candidate,process.env.URL));
            await store.setJSON(deliveryKey,{sent:true,claimedAt:new Date(now).toISOString()});
            sentCount++;
          }catch(error){
            await store.delete(deliveryKey);
            if(error?.statusCode===404 || error?.statusCode===410)await store.delete(blob.key);
            else console.error("Invio Web Push non riuscito",error?.statusCode,error?.message);
          }
        }
      }
    }
  }

  return Response.json({ ok: true, sent: sentCount });
};

export const config = {
  schedule: "* * * * *"
};
