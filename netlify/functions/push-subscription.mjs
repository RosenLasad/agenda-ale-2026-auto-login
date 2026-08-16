import { getStore } from "@netlify/blobs";
import { getUser } from "@netlify/identity";

const REGISTRY_KEY = "push-registry-v1";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function safeKey(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "_");
}

function getIdentityUserFromContext(context) {
  try {
    const raw = context?.clientContext?.custom?.netlify;
    if (raw) {
      const decoded = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
      if (decoded?.user) return decoded.user;
    }
  } catch {}
  return context?.clientContext?.user || null;
}

function buildUserAliases(user) {
  const values = [user?.sub, user?.id, user?.email, user?.email?.toLowerCase()];
  return [...new Set(values.map(safeKey).filter(Boolean))];
}

function normalizeSubscription(value) {
  const subscription = value && typeof value === "object" ? value : {};
  const endpoint = String(subscription.endpoint || "");
  const p256dh = String(subscription.keys?.p256dh || "");
  const auth = String(subscription.keys?.auth || "");
  if (!endpoint.startsWith("https://") || !p256dh || !auth) return null;
  return {
    endpoint,
    expirationTime: subscription.expirationTime || null,
    keys: { p256dh, auth }
  };
}

function findUserEntry(registry, aliases) {
  const aliasSet = new Set(aliases);
  for (const [key, entry] of Object.entries(registry.users || {})) {
    if ((entry.aliases || []).some((alias) => aliasSet.has(alias))) return { key, entry };
  }
  return null;
}

export default async (req, context) => {
  if (req.method === "GET") {
    const publicKey = process.env.WEB_PUSH_PUBLIC_KEY || "";
    if (!publicKey) return json({ ok: false, configured: false, error: "Web Push non configurato" }, 503);
    return json({ ok: true, configured: true, publicKey });
  }

  const user = (await getUser().catch(() => null)) || getIdentityUserFromContext(context);
  if (!user) return json({ ok: false, error: "Unauthorized" }, 401);
  if (req.method !== "POST" && req.method !== "DELETE") {
    return json({ ok: false, error: "Method Not Allowed" }, 405);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const subscription = normalizeSubscription(body?.subscription || body);
  if (!subscription) return json({ ok: false, error: "Invalid push subscription" }, 400);

  const store = getStore("agenda-ale");
  const aliases = buildUserAliases(user);
  if (!aliases.length) return json({ ok: false, error: "Invalid user" }, 400);

  try {
    const registry = (await store.get(REGISTRY_KEY, { type: "json", consistency: "strong" })) || {
      version: 1,
      users: {}
    };
    if (!registry.users || typeof registry.users !== "object") registry.users = {};

    const found = findUserEntry(registry, aliases);
    const userKey = found?.key || aliases[0];
    const entry = found?.entry || { aliases: [], subscriptions: [] };
    entry.aliases = [...new Set([...(entry.aliases || []), ...aliases])];
    entry.email = user.email || entry.email || null;
    entry.subscriptions = Array.isArray(entry.subscriptions) ? entry.subscriptions : [];

    if (req.method === "POST") {
      const existing = entry.subscriptions.find((item) => item.endpoint === subscription.endpoint);
      if (existing) {
        existing.expirationTime = subscription.expirationTime;
        existing.keys = subscription.keys;
        existing.updatedAt = new Date().toISOString();
      } else {
        entry.subscriptions.push({
          ...subscription,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      registry.users[userKey] = entry;
    } else {
      entry.subscriptions = entry.subscriptions.filter((item) => item.endpoint !== subscription.endpoint);
      if (entry.subscriptions.length) registry.users[userKey] = entry;
      else delete registry.users[userKey];
    }

    registry.updatedAt = new Date().toISOString();
    await store.setJSON(REGISTRY_KEY, registry);
    return json({ ok: true, subscribed: req.method === "POST" });
  } catch (error) {
    return json({ ok: false, error: String(error?.message || error) }, 500);
  }
};
