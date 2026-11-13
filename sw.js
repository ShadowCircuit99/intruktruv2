/* ================================================================
   SW Service Worker -- Offline support for Instruktur Pribadi 90 Hari
   ================================================================ */

const CACHE_NAME = 'instruktur90-v2';
const FILES_TO_CACHE = [
  '/',
  'index.html',
  'style.css',
  'script.js',
  'ilustrasi.js',
  'nutrition.js',
  'recipes.js',
  'notif.js',
  'manifest.webmanifest',
  'icon-180.png',
  'icon-192.png',
  'icon-512.png',
];

// Install event: cache essential files
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.clients.claim())
  );
});

// Activate event: clean old caches
self.addEventListener('activate', event => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  // Claim all clients immediately so they're under SW control
  return caches.keys().then(keyList => {
    return Promise.all(keyList.map(key => {
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }
    }));
  });
});

// Fetch event: serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Only handle same-origin requests for the app
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(networkResponse => {
          // Don't cache non-GET requests
          if (event.request.method !== 'GET') {
            return networkResponse;
          }
          // Clone the response for caching
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.addAll([event.request]).catch(() => {});
          });
          return networkResponse;
        }).catch(() => {
          // For navigation requests, return offline fallback
          if (event.request.mode === 'navigate') {
            return caches.match('index.html');
          }
        });
      })
    );
  }
});