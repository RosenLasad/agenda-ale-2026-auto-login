import { getStore } from "@netlify/blobs";
import { getUser } from "@netlify/identity";
import webpush from "web-push";

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

function findUserEntry(registry, aliases) {
  const aliasSet = new Set(aliases);
  return Object.values(registry.users || {}).find((entry) =>
    (entry.aliases || []).some((alias) => aliasSet.has(alias))
  ) || null;
}

export default async (req, context) => {
  if (req.method !== "POST") return json({ ok: false, error: "Method Not Allowed" }, 405);

  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY || "";
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY || "";
  if (!publicKey || !privateKey) {
    return json({ ok: false, configured: false, error: "Web Push non configurato" }, 503);
  }

  const user = (await getUser().catch(() => null)) || getIdentityUserFromContext(context);
  if (!user) return json({ ok: false, error: "Unauthorized" }, 401);

  let endpoint = "";
  try {
    endpoint = String((await req.json())?.endpoint || "");
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }
  if (!endpoint) return json({ ok: false, error: "Subscription endpoint required" }, 400);

  try {
    const store = getStore("agenda-ale");
    const registry = (await store.get(REGISTRY_KEY, { type: "json", consistency: "strong" })) || { users: {} };
    const entry = findUserEntry(registry, buildUserAliases(user));
    const subscription = (entry?.subscriptions || []).find((item) => item.endpoint === endpoint);
    if (!subscription) return json({ ok: false, error: "Dispositivo non registrato" }, 404);

    webpush.setVapidDetails(
      process.env.WEB_PUSH_SUBJECT || process.env.URL || "https://digenda.app",
      publicKey,
      privateKey
    );
    await webpush.sendNotification(subscription, JSON.stringify({
      title: "Digenda · Notifica di prova",
      body: "Le notifiche degli eventi sono attive su questo dispositivo.",
      tag: "digenda-push-test-" + Date.now(),
      url: "/?view=calendar",
      timestamp: Date.now()
    }));
    return json({ ok: true, sent: true });
  } catch (error) {
    if (error?.statusCode === 404 || error?.statusCode === 410) {
      return json({ ok: false, error: "Registrazione del dispositivo scaduta" }, 410);
    }
    return json({ ok: false, error: String(error?.message || error) }, 500);
  }
};
