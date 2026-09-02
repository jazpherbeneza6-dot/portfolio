// Service Worker: High-Performance Media & Video Cache Storage Engine
const CACHE_NAME = 'media-asset-cache-v1';
const STATIC_MEDIA = [
  './public/image/Flame%20Backround.mp4',
  './public/image/spark_audio.mp3'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Precache looping flame video and spark audio
      return cache.addAll(STATIC_MEDIA).catch((err) => {
        console.warn('Pre-caching non-fatal warning:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Intercept video (.mp4) and audio (.mp3) files to serve directly from cache
  if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request, { ignoreSearch: true });
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return cachedResponse || new Response('Media offline', { status: 503 });
        }
      })
    );
  }
});
