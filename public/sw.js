const CACHE_NAME = 'verve-offline-v3';
const PRECACHE_URLS = [
  '/',
  '/cover',
  '/document',
  '/login',
  '/signup',
  '/feedback',
  '/manifest.webmanifest',
  '/verve_logo.png',
  '/cover_logo/LUCT.jpeg',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/offline',
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

// App-shell routes that always resolve, even when the cache is cold.
function isAppShellNavigation(request) {
  return request.mode === 'navigate' && request.method === 'GET';
}

// JS/CSS chunks: they must load offline after the first visit, otherwise
// dynamic imports (docx/jspdf/html2canvas/file-saver) fail offline.
function isStaticAsset(url) {
  return url.pathname.startsWith('/_next/static/');
}

// Images/fonts: serve from cache while revalidating so the cover logo and
// icons survive a lost connection.
function isCacheableMedia(url) {
  if (url.pathname === '/cover_logo/LUCT.jpeg') return true;
  if (url.pathname === '/verve_logo.png') return true;
  if (url.pathname === '/web-app-manifest-192x192.png') return true;
  if (url.pathname === '/web-app-manifest-512x512.png') return true;
  return false;
}

async function networkFirst(request) {
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
    throw new Error('offline');
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    // Refresh in the background so returning visitors get fresh assets.
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
      })
      .catch(() => undefined);
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const copy = response.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, copy);
    }
    return response;
  } catch {
    // Dynamic chunks that were never downloaded cannot be synthesized.
    return Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (shouldBypass(request, url)) return;

  // Navigations: network-first, fall back to the cached page, then /offline.
  if (isAppShellNavigation(request)) {
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
          return (
            (await caches.match(request)) ||
            (await caches.match('/cover')) ||
            (await caches.match('/offline')) ||
            (await caches.match('/')) ||
            Response.error()
          );
        }
      })(),
    );
    return;
  }

  // Next.js static assets + cover/icon media: cache-first so export
  // dependencies and preview images keep working offline.
  if (isStaticAsset(url) || isCacheableMedia(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(
    (async () => {
      try {
        return await networkFirst(request);
      } catch {
        if (request.mode === 'navigate') {
          return (
            (await caches.match('/cover')) ||
            (await caches.match('/offline')) ||
            (await caches.match('/')) ||
            Response.error()
          );
        }
        return Response.error();
      }
    })(),
  );
});

