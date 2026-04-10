// ============================================================
// Andhra University Portal — Service Worker v3
// Strategy: Cache-first for app shell, network-first for CDN
// ============================================================

const CACHE_NAME    = 'au-portal-v3';
const CDN_CACHE     = 'au-cdn-v3';

// App shell — cache on install
const SHELL_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './manifest.json',
  './js/app.js',
  './js/data.js',
  './js/chatbot.js',
  './js/pages/dashboard.js',
  './js/pages/students.js',
  './js/pages/faculty.js',
  './js/pages/classes.js',
  './js/pages/events.js',
  './js/pages/exams.js',
  './js/pages/departments.js',
  './js/pages/analytics.js',
  './js/pages/fees.js',
  './js/pages/placements.js',
  './js/pages/certificates.js',
  './js/pages/map.js',
  './js/pages/library.js',
  './js/pages/hostel.js',
  './js/pages/alumni.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// CDN assets — cache after first fetch
const CDN_HOSTS = [
  'cdn.tailwindcss.com',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ── Install ──────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache shell assets, skip missing ones (e.g. PNGs not yet generated)
      return Promise.allSettled(
        SHELL_ASSETS.map(url =>
          cache.add(url).catch(() => console.warn('[SW] Skipped:', url))
        )
      );
    })
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== CDN_CACHE)
          .map(k => { console.log('[SW] Deleting old cache:', k); return caches.delete(k); })
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and browser-extension requests
  if (event.request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // CDN assets — stale-while-revalidate
  if (CDN_HOSTS.some(h => url.hostname.includes(h))) {
    event.respondWith(staleWhileRevalidate(event.request, CDN_CACHE));
    return;
  }

  // App shell — cache-first, fallback to index.html for navigation
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          // Cache successful same-origin responses
          if (response.ok && url.origin === self.location.origin) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback — serve app shell for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});

// ── Stale-while-revalidate helper ────────────────────────────
function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then(cache =>
    cache.match(request).then(cached => {
      const networkFetch = fetch(request).then(response => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      }).catch(() => {});
      return cached || networkFetch;
    })
  );
}
