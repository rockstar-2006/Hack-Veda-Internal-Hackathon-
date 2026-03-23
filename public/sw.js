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
  
  // Only handle GET requests for caching
  if (request.method !== 'GET') {
    return; // Let the browser handle non-GET requests normally
  }

  // Define URLs to exclude from caching (like Firebase APIs, Auth, etc.)
  const excludeUrls = [
    'identitytoolkit.googleapis.com',
    'securetoken.googleapis.com',
    'firestore.googleapis.com',
    '/_next/',
    '/api/',
    'webpack',
    'hot-update',
    'chrome-extension',
    '.json'
  ];

  if (excludeUrls.some(url => request.url.includes(url)) || request.url.startsWith('chrome-extension')) {
    return; // Pass through to browser
  }

  // For GET requests, try network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Success! Clone and cache if it's a valid 200 response
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(async () => {
        // Network failed! Check the cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If everything fails and it's a page navigation, we could return a fallback page
        // For now, we'll just let the error propagate or return a generic offline response
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
        
        // Final fallback: return a basic offline error response
        return new Response('Network error occurred' , {
          status: 408,
          statusText: 'Network Error',
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});
