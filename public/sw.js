// KILL SWITCH service worker:
// The live site is still serving JS "from service worker", which can mix old/new hashed chunks and crash
// (`Cannot access '<minified>' before initialization`). This SW disables itself and forces a reload.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch (_) {
        // ignore
      }

      // Unregister this service worker so future loads are network-only.
      try {
        await self.registration.unregister();
      } catch (_) {
        // ignore
      }

      // Reload all open tabs so they drop the SW controller.
      try {
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        await Promise.all(clients.map((c) => c.navigate(c.url)));
      } catch (_) {
        // ignore
      }

      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
