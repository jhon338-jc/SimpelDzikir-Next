export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (!["https:", "http:"].includes(window.location.protocol) && window.location.hostname !== "localhost") return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* PWA opsional */
    });
  });
}

export async function subscribePush(userId: string): Promise<{ ok: boolean; error?: string }> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false, error: "Browser tidak mendukung push notification" };
  }
  if (!navigator.serviceWorker.controller) {
    await navigator.serviceWorker.ready;
  }
  const reg = await navigator.serviceWorker.ready;

  let existing = await reg.pushManager.getSubscription();
  if (!existing) {
    existing = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BF6a9WNuq5bM-Jh9ZlEzZulYPPjuCKsagJ71gvu4dP6HpXuvPBVPzIQNbOLVapvVNnTj_9QjGC1E-pQl7rF-730"
      ) as BufferSource,
    });
  }

  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      endpoint: existing.endpoint,
      keys: existing.toJSON().keys,
      lat: 0,
      lon: 0,
    }),
  });
  if (!res.ok) return { ok: false, error: "Gagal menyimpan langganan" };
  return { ok: true };
}

export async function unsubscribePush(): Promise<{ ok: boolean; error?: string }> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return { ok: true };
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) await sub.unsubscribe();
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message };
  }
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}