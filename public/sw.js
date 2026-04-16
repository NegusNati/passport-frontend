const STATIC_CACHE = 'passport-et-static-v2'
const PAGE_CACHE = 'passport-et-pages-v2'
const DATA_CACHE = 'passport-et-data-v2'
const OFFLINE_URL = '/offline.html'
const APP_SHELL = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/favicon.ico',
  '/android-chrome-192x192.png',
]

function isSuccessfulResponse(response) {
  return response && (response.ok || response.type === 'opaque')
}

async function cacheResponse(cacheName, request, response) {
  if (!isSuccessfulResponse(response)) return response
  const cache = await caches.open(cacheName)
  await cache.put(request, response.clone())
  return response
}

async function fromCache(cacheName, request) {
  const cache = await caches.open(cacheName)
  return cache.match(request)
}

async function withTimeout(promise, timeoutMs) {
  let timeoutId
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('timeout')), timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    clearTimeout(timeoutId)
  }
}

async function networkFirst(request, cacheName, options = {}) {
  const { timeoutMs = 4000, fallbackUrl } = options
  const networkPromise = fetch(request).then((response) =>
    cacheResponse(cacheName, request, response),
  )

  try {
    return timeoutMs ? await withTimeout(networkPromise, timeoutMs) : await networkPromise
  } catch (error) {
    const cached = await fromCache(cacheName, request)
    if (cached) return cached
    if (fallbackUrl) {
      const fallback = await fromCache(STATIC_CACHE, fallbackUrl)
      if (fallback) return fallback
    }
    if (error instanceof Error && error.message === 'timeout') {
      return networkPromise
    }
    throw error
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await fromCache(cacheName, request)
  const networkPromise = fetch(request)
    .then((response) => cacheResponse(cacheName, request, response))
    .catch(() => null)

  if (cached) {
    void networkPromise
    return cached
  }

  const response = await networkPromise
  if (response) return response

  throw new Error('asset-unavailable')
}

function isSameOriginStaticAsset(url, request) {
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/media/') ||
      url.pathname.startsWith('/fonts/') ||
      request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image' ||
      request.destination === 'font')
  )
}

function isPublicDataRequest(url) {
  return /\/api\/v1\/(passports|articles|categories|tags|locations|advertisements)/.test(
    url.pathname,
  )
}

self.addEventListener('install', (event) => {
  self.skipWaiting()

  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches
        .keys()
        .then((cacheNames) =>
          Promise.all(
            cacheNames
              .filter((name) => ![STATIC_CACHE, PAGE_CACHE, DATA_CACHE].includes(name))
              .map((name) => caches.delete(name)),
          ),
        ),
    ]),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return

  const url = new URL(request.url)

  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, PAGE_CACHE, { timeoutMs: 4500, fallbackUrl: OFFLINE_URL }),
    )
    return
  }

  if (isSameOriginStaticAsset(url, request)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE))
    return
  }

  if (isPublicDataRequest(url)) {
    event.respondWith(networkFirst(request, DATA_CACHE, { timeoutMs: 3500 }))
  }
})
