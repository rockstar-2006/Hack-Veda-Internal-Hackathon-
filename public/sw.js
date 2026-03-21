const CACHE_NAME = 'hackveda-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/']);
    }).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only cache GET requests
  if (request.method !== 'GET') {
    // For non-GET requests, just fetch without caching
    event.respondWith(
      fetch(request, { timeout: 10000 }).catch((error) => {
        console.error('Fetch failed:', error);
        return new Response(JSON.stringify({ error: 'Network error' }), {
          status: 0,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // For GET requests, use network-first strategy with timeout
  event.respondWith(
    Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Fetch timeout')), 4000))
    ])
      .then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Return cached response on network failure
        return caches.match(request);
      })
  );
});
