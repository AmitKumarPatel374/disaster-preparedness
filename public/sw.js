const CACHE_NAME = 'disaster-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/data/disasters.json',
  '/data/contacts.json',
  '/data/faq.json',
  '/data/quizzes/earthquake.json',
  '/data/quizzes/fire.json',
  '/data/quizzes/flood.json',
  '/data/quizzes/cyclone.json',
  '/data/quizzes/tsunami.json',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // If both cache and network fail, show offline page
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for emergency contacts
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Sync emergency contacts and other critical data
  return fetch('/data/contacts.json')
    .then(response => response.json())
    .then(data => {
      // Store in IndexedDB for offline access
      return new Promise((resolve) => {
        const request = indexedDB.open('DisasterPWA', 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('emergencyContacts')) {
            db.createObjectStore('emergencyContacts');
          }
        };
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['emergencyContacts'], 'readwrite');
          const store = transaction.objectStore('emergencyContacts');
          store.put(data, 'contacts');
          resolve();
        };
      });
    })
    .catch(error => {
      console.log('Background sync failed:', error);
    });
}

// Push notifications for emergency alerts
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Emergency alert!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-72x72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Disaster Alert', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
