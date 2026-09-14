import webpush, { type PushSubscription as WebPushSubscription } from "web-push";

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || "",
  privateKey: process.env.VAPID_PRIVATE_KEY || "",
};

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:admin@simpledzikir.example",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

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