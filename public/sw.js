// ParentLogs Service Worker - PWA with Push Notifications
const CACHE_NAME = 'parentlogs-v1';
const OFFLINE_URL = '/offline';

// Assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/offline',
  '/manifest.json',
];

// Install event - precache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.log('[SW] Precache failed, continuing:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip API requests - always fetch from network
  if (url.pathname.startsWith('/api/')) return;

  // Skip auth-related paths
  if (url.pathname.startsWith('/auth/')) return;

  // For navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match(OFFLINE_URL) || new Response('Offline', { status: 503 });
          });
        })
    );
    return;
  }

  // For static assets - stale-while-revalidate
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Default: network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'You have a new notification',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/dashboard',
        timestamp: Date.now(),
      },
      actions: data.actions || [],
      tag: data.tag || 'default',
      renotify: true,
      requireInteraction: data.requireInteraction || false,
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'ParentLogs', options)
    );
  } catch (error) {
    console.error('[SW] Push notification error:', error);
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/dashboard';

  // Handle action clicks
  if (event.action === 'complete') {
    console.log('[SW] Complete action clicked');
  } else if (event.action === 'snooze') {
    console.log('[SW] Snooze action clicked');
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(url);
            return;
          }
        }
        // Otherwise open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  if (event.tag === 'sync-logs') {
    event.waitUntil(syncLogs());
  } else if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }
});

async function syncLogs() {
  console.log('[SW] Syncing offline logs...');
  // Implementation would read from IndexedDB and POST to API
}

async function syncTasks() {
  console.log('[SW] Syncing offline tasks...');
  // Implementation would read from IndexedDB and POST to API
}

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data === 'clearCache') {
    caches.delete(CACHE_NAME);
  }
});

console.log('[SW] Service worker loaded');
