const CACHE = "simpledzikir-v1";
const CORE = ["/", "/icon.svg", "/icons/icon.svg", "/manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.startsWith("/api/")) return;
  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) {
        // stale-while-revalidate untuk navigasi & HTML
        if (e.request.mode === "navigate" || url.pathname === "/") {
          fetch(e.request)
            .then((res) => {
              if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
            })
            .catch(() => {});
          return cached;
        }
        return cached;
      }
      return fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() =>
          e.request.mode === "navigate"
            ? caches.match("/").then((fallback) => fallback || Response.error())
            : Response.error()
        );
    })
  );
});

self.addEventListener("push", (e) => {
  let body = { title: "Simpel Dzikir", body: "", url: "/" };
  try {
    body = { ...body, ...e.data.json() };
  } catch {}
  e.waitUntil(
    self.registration.showNotification(body.title || "Simpel Dzikir", {
      body: body.body || "",
      icon: "/icon.svg",
      badge: "/icons/icon.svg",
      data: { url: body.url },
      vibrate: [100, 50, 100],
      tag: "simpledzikir-" + Date.now(),
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ("focus" in c) {
          c.navigate(url);
          c.focus();
          return;
        }
      }
      clients.openWindow(url);
    })
  );
});