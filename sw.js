const CACHE_NAME = 'cvisual-v2'; // Chanje vèsyon an pou force update
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/services.html',
  '/pages/portfolio.html',
  '/pages/news.html',
  '/pages/about.html',
  '/pages/contact.html',
  '/assets/js/public.js',
  '/assets/js/admin.js'
];

// Install event
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force activation
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - Strategy: Network First, falling back to cache
self.addEventListener('fetch', (event) => {
  // Bypassing cache for API calls
  if (event.request.url.includes('/api/')) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If network request succeeds, update the cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try the cache
        return caches.match(event.request);
      })
  );
});
