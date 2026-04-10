// ============================================================
// Andhra University Portal — Service Worker v4
// Works on both localhost and GitHub Pages subdirectory
// ============================================================

const CACHE_NAME = 'au-portal-v4';

// Detect base path automatically (works for both localhost and GitHub Pages)
const BASE = self.registration.scope;

const SHELL_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'css/style.css',
  BASE + 'manifest.json',
  BASE + 'js/app.js',
  BASE + 'js/data.js',
  BASE + 'js/chatbot.js',
  BASE + 'js/pages/dashboard.js',
  BASE + 'js/pages/students.js',
  BASE + 'js/pages/faculty.js',
  BASE + 'js/pages/classes.js',
  BASE + 'js/pages/events.js',
  BASE + 'js/pages/exams.js',
  BASE + 'js/pages/departments.js',
  BASE + 'js/pages/analytics.js',
  BASE + 'js/pages/fees.js',
  BASE + 'js/pages/placements.js',
  BASE + 'js/pages/certificates.js',
  BASE + 'js/pages/map.js',
  BASE + 'js/pages/library.js',
  BASE + 'js/pages/hostel.js',
  BASE + 'js/pages/alumni.js',
  BASE + 'icons/icon.svg',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
];

const CDN_HOSTS = [
  'cdn.tailwindcss.com',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ── Install ──────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(
        SHELL_ASSETS.map(url =>
          cache.add(url).catch(() => console.warn('[SW] Skipped:', url))
        )
      )
    )
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // CDN — stale while revalidate
  if (CDN_HOSTS.some(h => url.hostname.includes(h))) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // App shell — cache first, network fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          if (response.ok && url.origin === self.location.origin) {
            caches.open(CACHE_NAME).then(c => c.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match(BASE + 'index.html');
          }
        });
    })
  );
});

function staleWhileRevalidate(request) {
  return caches.open(CACHE_NAME).then(cache =>
    cache.match(request).then(cached => {
      const fresh = fetch(request).then(r => {
        if (r.ok) cache.put(request, r.clone());
        return r;
      }).catch(() => {});
      return cached || fresh;
    })
  );
}
