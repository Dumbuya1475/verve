const CACHE_NAME = 'verve-offline-v2';
const PRECACHE_URLS = [
  '/',
  '/cover',
  '/login',
  '/signup',
  '/feedback',
  '/manifest.webmanifest',
  '/verve_logo.png',
  '/cover_logo/LUCT.jpeg',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(
        PRECACHE_URLS.map((url) => cache.add(url).catch(() => undefined)),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

function shouldBypass(request, url) {
  if (request.method !== 'GET') return true;
  if (url.origin !== self.location.origin) return true;
  if (url.pathname.startsWith('/api/')) return true;
  if (url.pathname.includes('webpack-hmr')) return true;
  return false;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (shouldBypass(request, url)) return;

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const copy = response.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, copy);
        }
        return response;
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
          return (
            (await caches.match('/cover')) ||
            (await caches.match('/')) ||
            Response.error()
          );
        }
        return Response.error();
      }
    })(),
  );
});
