const CACHE_NAME = "xiao1000-v8";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=20261103-8",
  "./app.js?v=20261103-8",
  "./icon.svg?v=20261103-8",
  "./icon-192.png?v=20261103-8",
  "./icon-512.png?v=20261103-8",
  "./manifest.webmanifest",
  "./data/questions.json",
  "./assets/wallpapers/wallpapers.json"
];

async function cacheApplication() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(APP_ASSETS);
  try {
    const response = await fetch("./assets/wallpapers/wallpapers.json", {
      cache: "no-store"
    });
    if (!response.ok) return;
    const data = await response.json();
    const wallpaperUrls = (data.items || []).flatMap((item) => [item.src, item.thumb]);
    await Promise.allSettled(wallpaperUrls.map((url) => cache.add(url)));
  } catch {}
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheApplication().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
