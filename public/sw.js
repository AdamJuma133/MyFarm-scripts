const CACHE_NAME = 'myfarm-cache-v1';
const STATIC_CACHE = 'myfarm-static-v2';
const DYNAMIC_CACHE = 'myfarm-dynamic-v2';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // For API requests, try network first, then cache
  if (url.pathname.includes('/functions/') || url.pathname.includes('/rest/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // For static assets, try cache first, then network
  event.respondWith(cacheFirstStrategy(request));
});

// Cache first strategy - good for static assets
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Return cached response and update cache in background
      fetchAndCache(request);
      return cachedResponse;
    }
    return await fetchAndCache(request);
  } catch (error) {
    console.log('[Service Worker] Cache first failed:', error);
    return await caches.match('/');
  }
}

// Network first strategy - good for API requests
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network first failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline fallback for API requests
    return new Response(
      JSON.stringify({ error: 'Offline', message: 'No cached data available' }),
      { 
        status: 503, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Fetch and cache helper
async function fetchAndCache(request) {
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

// Background sync for pending scans
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event:', event.tag);
  
  if (event.tag === 'sync-pending-scans') {
    event.waitUntil(syncPendingScans());
  }
});

// Sync pending scans
async function syncPendingScans() {
  console.log('[Service Worker] Syncing pending scans...');
  
  // Notify all clients to trigger sync
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'SYNC_PENDING_SCANS'
    });
  });
}

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }

  if (event.data.type === 'REGISTER_SYNC') {
    // Register background sync if supported
    if ('sync' in self.registration) {
      self.registration.sync.register('sync-pending-scans')
        .then(() => console.log('[Service Worker] Background sync registered'))
        .catch((err) => console.log('[Service Worker] Background sync failed:', err));
    }
  }
});

// Push notification for sync completion
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Your scans have been synced!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'view', title: 'View Results' },
      { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MyFarm Sync', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      self.clients.openWindow('/history')
    );
  }
});
