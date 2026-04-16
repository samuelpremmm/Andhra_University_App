// ============================================================
// Andhra University Portal — Service Worker v7
// Network-first for JS so updates show immediately
// ============================================================

const CACHE_NAME = 'au-portal-v7';

const BASE = self.registration.scope;

const SHELL_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'css/style.css',
  BASE + 'manifest.json',
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

// ── Activate — delete ALL old caches ─────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
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

  // JS files — network first so updates show immediately
  if (url.pathname.endsWith('.js')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // App shell (HTML, CSS, icons) — cache first, network fallback
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

// ── Network first (JS files) ──────────────────────────────────
function networkFirst(request) {
  return caches.open(CACHE_NAME).then(cache =>
    fetch(request)
      .then(response => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
      .catch(() => cache.match(request))
  );
}

// ── Stale while revalidate (CDN) ─────────────────────────────
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
