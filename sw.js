const CACHE_NAME = "afit-dgm-offline-v1";
const OFFLINE_URL = "offline.html";


self.addEventListener("install", (event) => {
  console.log('[Service Worker] Installing & Caching Offline Page');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );
  self.skipWaiting();
});


self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );
  self.clients.claim();
});


self.addEventListener("fetch", (event) => {
  
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
         
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
  
          console.log('[Service Worker] Network failed. Serving offline page.');
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }
});