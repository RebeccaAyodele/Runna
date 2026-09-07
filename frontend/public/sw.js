/// <reference lib="webworker" />

/**
 * Runna service worker.
 *
 * What it caches is deliberately narrow. This is a payments app: task
 * descriptions, prices, names and proof photos all belong to a specific signed-in
 * student, and a shared on-device cache is the wrong place for any of it — a
 * cached page can outlive a sign-out and be served to whoever opens the browser
 * next. So:
 *
 *   - Only same-origin GETs for build assets and static files are cached.
 *   - Anything to the API, anything with an Authorization header, and every
 *     non-GET request goes straight to the network, uncached.
 *   - Navigations are network-first with an offline fallback page, not a cached
 *     copy of the last screen the student was looking at.
 *
 * Written as plain JS rather than TypeScript because it's registered by URL and
 * served as-is, not compiled through the app's bundler.
 */

const VERSION = "runna-v1";
const ASSET_CACHE = `${VERSION}-assets`;
const OFFLINE_URL = "/offline";

/** Precached so the offline fallback works on the very first disconnection. */
const PRECACHE_URLS = [OFFLINE_URL, "/icons/runna-icon.svg", "/icons/runna-maskable.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(ASSET_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      // A failed precache shouldn't block activation — the worker still works,
      // it just won't have an offline page until the next fetch fills it.
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== ASSET_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

/** Build output and static files — content-hashed or rarely changing. */
function isCacheableAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:css|js|woff2?|png|jpe?g|svg|webp|avif|ico)$/.test(url.pathname)
  );
}

/**
 * A sign-out has to take the cached shell with it, otherwise the next person on
 * the device can be served pages from the previous session. The client posts
 * this after clearing the session cookie.
 */
self.addEventListener("message", (event) => {
  if (event.data === "runna:clear-caches") {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))));
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Never touch writes, cross-origin requests (the API included), or anything
  // carrying credentials.
  if (request.method !== "GET") return;
  if (request.headers.has("Authorization")) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    // Network-first: the student sees live task state, and the fallback only
    // appears when the network genuinely isn't there.
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(OFFLINE_URL);
        return cached ?? new Response("You're offline.", { status: 503, headers: { "Content-Type": "text/plain" } });
      }),
    );
    return;
  }

  if (!isCacheableAsset(url)) return;

  // Cache-first for immutable build output; a miss fills the cache in passing.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
