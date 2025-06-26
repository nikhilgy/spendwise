
const CACHE_NAME = 'spendwise-lite-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Add other critical assets like main JS/CSS bundles if not loaded from CDN
  // '/app.js', - Example, ensure this matches your build output if applicable
  '/manifest.json',
  '/icons/icon-192x192.png', // Ensure you have these placeholder icons
  '/icons/icon-512x512.png'  // or actual icons in your public/icons folder
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to open cache or add URLs:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip caching for external resources like CDNs or API calls for now for simplicity
  // This basic SW will mainly cache the app shell defined in urlsToCache.
  // For Tailwind CDN, it's better to let the browser cache it.
  // For API calls, a network-first or stale-while-revalidate strategy would be more appropriate.
  if (event.request.url.startsWith('http') && !urlsToCache.includes(new URL(event.request.url).pathname)) {
     // For non-cached resources, try network first, then cache if network fails (cache-falling-back-to-network for specific assets can be done)
     // Or just go to network:
     // event.respondWith(fetch(event.request));
     // return;
  }


  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              // type 'opaque' for cross-origin resources (like CDNs) won't be cached by this logic
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            // Only cache our own assets, not CDNs for this simple setup
            if (urlsToCache.includes(new URL(event.request.url).pathname)) {
                caches.open(CACHE_NAME)
                .then(cache => {
                    cache.put(event.request, responseToCache);
                });
            }
            
            return networkResponse;
          }
        ).catch(error => {
          console.error('Fetching failed:', error);
          // If fetch fails (e.g., offline) and not in cache, you might want to return a custom offline page.
          // For simplicity, this basic service worker doesn't include an offline fallback page beyond cached assets.
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});
