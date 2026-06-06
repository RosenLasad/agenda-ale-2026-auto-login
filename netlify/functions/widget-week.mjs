import { getStore } from "@netlify/blobs";

const STORE_NAME = "agenda-ale";
const DEFAULT_TIME_ZONE = "Europe/Rome";
const CATEGORY_LABELS = {
  work: "Lavoro",
  priv: "Privato",
  sdac: "SDAC",
  other: "Altro"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, max-age=0"
    }
  });
}

function normalizeEventCategory(value) {
  const raw = String(value || "").trim().toLowerCase();
  const map = {
    work: "work",
    lavoro: "work",
    priv: "priv",
    private: "priv",
    privato: "priv",
    sdac: "sdac",
    other: "other",
    altro: "other"
  };
  return map[raw] || "other";
}

function constantTimeEqual(a, b) {
  const left = String(a || "");
  const right = String(b || "");
  let diff = left.length ^ right.length;
  const len = Math.max(left.length, right.length);
  for (let i = 0; i < len; i += 1) {
    diff |= left.charCodeAt(i % Math.max(left.length, 1)) ^ right.charCodeAt(i % Math.max(right.length, 1));
  }
  return diff === 0;
}

function getRequestToken(req) {
  const url = new URL(req.url);
  return url.searchParams.get("token") || req.headers.get("x-widget-token") || "";
}

function requireWidgetToken(req) {
  const configured = process.env.WIDGET_TOKEN || process.env.AGENDA_WIDGET_TOKEN || "";
  if (!configured) {
    return { ok: false, response: json({ ok: false, error: "Missing WIDGET_TOKEN environment variable" }, 500) };
  }

  const provided = getRequestToken(req);
  if (!provided || !constantTimeEqual(provided, configured)) {
    return { ok: false, response: json({ ok: false, error: "Unauthorized" }, 401) };
  }

  return { ok: true };
}

function datePartsInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const out = {};
  parts.forEach((part) => {
    if (part.type !== "literal") out[part.type] = part.value;
  });

  return {
    year: Number(out.year),
    month: Number(out.month),
    day: Number(out.day)
  };
}

function isoFromUTCNoon(date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}

function getTodayNoonInTimeZone(timeZone) {
  const parts = datePartsInTimeZone(new Date(), timeZone);
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12, 0, 0, 0));
}

function dateLabel(date, timeZone) {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(date).replace(/\./g, "");
}

function dayLabel(date, offset, timeZone) {
  if (offset === 0) return "Oggi";
  if (offset === 1) return "Domani";
  return new Intl.DateTimeFormat("it-IT", {
    timeZone,
    weekday: "short"
  }).format(date).replace(/\./g, "");
}

function cleanTitle(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text || "Senza titolo";
}

function cleanTime(value) {
  const text = String(value || "").trim();
  return /^\d{1,2}:\d{2}$/.test(text) ? text.padStart(5, "0") : text;
}

function sortedEventsFor(state, iso) {
  const events = Array.isArray(state?.events?.[iso]) ? state.events[iso] : [];
  return events
    .filter((event) => event && typeof event === "object")
    .map((event) => {
      const cat = normalizeEventCategory(event.cat);
      return {
        time: cleanTime(event.time) || "",
        title: cleanTitle(event.title),
        cat,
        catLabel: CATEGORY_LABELS[cat] || "Altro"
      };
    })
    .sort((a, b) => {
      const at = a.time || "";
      const bt = b.time || "";
      if (at !== bt) return at.localeCompare(bt);
      return a.title.localeCompare(b.title, "it-IT");
    });
}

function buildWeekFeed(state, options = {}) {
  const timeZone = options.timeZone || DEFAULT_TIME_ZONE;
  const start = getTodayNoonInTimeZone(timeZone);
  const days = [];

  for (let offset = 0; offset < 7; offset += 1) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + offset);
    const iso = isoFromUTCNoon(day);
    const events = sortedEventsFor(state, iso);

    days.push({
      iso,
      label: dayLabel(day, offset, timeZone),
      dateLabel: dateLabel(day, timeZone),
      count: events.length,
      events
    });
  }

  return days;
}

async function loadLatestAgendaState() {
  const store = getStore(STORE_NAME);
  const explicitKey = process.env.WIDGET_STATE_KEY || process.env.AGENDA_WIDGET_STATE_KEY || "";
  const meta = await store.get("owner-meta", {
    type: "json",
    consistency: "strong"
  }).catch(() => null);

  const key = explicitKey || meta?.key || "";
  if (!key) {
    return { state: null, key: null, meta };
  }

  const state = await store.get(key, {
    type: "json",
    consistency: "strong"
  });

  return { state: state || null, key, meta };
}

export default async (req) => {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const tokenCheck = requireWidgetToken(req);
  if (!tokenCheck.ok) return tokenCheck.response;

  try {
    const { state, meta } = await loadLatestAgendaState();
    if (!state || typeof state !== "object") {
      return json({ ok: false, error: "No saved Agenda state found" }, 404);
    }

    const timeZone = process.env.WIDGET_TIME_ZONE || DEFAULT_TIME_ZONE;
    const days = buildWeekFeed(state, { timeZone });

    return json({
      ok: true,
      type: "agenda-week-v1",
      timeZone,
      generatedAt: new Date().toISOString(),
      updatedAt: state.updatedAt || meta?.updatedAtUTC || null,
      days
    });
  } catch (err) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
};
