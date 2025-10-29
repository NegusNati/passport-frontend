// Minimal service worker for PWA installability
// Satisfies Chrome/Edge/Safari PWA requirements

const CACHE_NAME = 'passport-et-v1'
const OFFLINE_URL = '/offline.html'

// Install: cache critical shell assets
self.addEventListener('install', (event) => {
  self.skipWaiting()

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Optional: cache essential assets for offline fallback
      // For now, keep it minimal to avoid cache management complexity
      return Promise.resolve()
    }),
  )
})

// Activate: claim clients and clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)),
        )
      }),
    ]),
  )
})

// Fetch: network-first strategy (no-op for now)
// This handler is required for PWA installability
self.addEventListener('fetch', (event) => {
  // Let all requests pass through to the network
  // Future: implement offline fallback or cache strategies
})
