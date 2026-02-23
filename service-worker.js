const CACHE_NAME = "math-ai-v1";

const FILES_TO_CACHE = [
  "./",
  "./newtab.html",
  "./newtab.js"
];

// 安裝時快取
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// 攔截請求 → 離線優先
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});