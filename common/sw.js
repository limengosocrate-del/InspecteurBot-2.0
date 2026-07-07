const CACHE = 'inspectorbot-v1';
const ASSETS = ['/fiche.html', '/common/common.css', '/common/common.js'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
