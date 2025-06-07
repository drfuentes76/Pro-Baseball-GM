self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('gm-cache').then(cache => {
      return cache.addAll([
        'index.html',
        'main.js',
        'style.css',
        'rosters/mlb_2024_rosters.json',
        'manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});