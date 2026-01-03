// A simple Service Worker to make the App Installable
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // Just load content normally
  e.respondWith(fetch(e.request));
});