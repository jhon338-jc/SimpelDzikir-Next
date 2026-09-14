import webpush, { type PushSubscription as WebPushSubscription } from "web-push";

const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@simpledzikir.example";

function getVapidKeys(): { publicKey: string; privateKey: string } | null {
  const publicKey = process.env.VAPID_PUBLIC_KEY || "";
  const privateKey = process.env.VAPID_PRIVATE_KEY || "";
  if (!publicKey || !privateKey) return null;
  return { publicKey, privateKey };
}

let vapidReady = false;
function ensureVapid(): boolean {
  if (vapidReady) return true;
  const keys = getVapidKeys();
  if (!keys) return false;
  webpush.setVapidDetails(VAPID_SUBJECT, keys.publicKey, keys.privateKey);
  vapidReady = true;
  return true;
}

export function isVapidConfigured(): boolean {
  return getVapidKeys() !== null;
}

export type SubPayload = {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
};

export type SendPushResult = "sent" | "dead" | "error";

export async function sendPush(sub: SubPayload, title: string, body: string): Promise<SendPushResult> {
  const wsub: WebPushSubscription = {
    endpoint: sub.endpoint,
    keys: {
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
  };

  try {
    if (!ensureVapid()) return "error";
    await webpush.sendNotification(wsub, JSON.stringify({ title, body, url: "/jadwal" }));
    return "sent";
  } catch (err: any) {
    // 404/410 -> langganan sudah tidak valid (hapus dari DB)
    if (err?.statusCode === 404 || err?.statusCode === 410) {
      return "dead";
    }
    // Kesalahan lain (jaringan, notif service tidak stabil, dsb) — jangan crash,
    // langganan tetap dipertahankan agar bisa dicoba lagi.
    return "error";
  }
}