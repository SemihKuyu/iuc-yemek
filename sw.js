'use strict';
const CACHE = 'iuc-yemek-v4';
const ASSETS = ['./', 'index.html', 'style.css', 'app.js', 'parse.js', 'manifest.json',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  const put = (res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; };

  // Menü: önce ağ (güncel), çevrimdışıysa önbellek
  if (url.pathname.endsWith('/data/menu.txt')) {
    e.respondWith(fetch(req, { cache: 'no-store' }).then(put).catch(() => caches.match(req)));
    return;
  }
  // Uygulama dosyaları: önbellekten anında aç, arka planda yenile (sonraki açılışta güncel olur)
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => {
    const net = fetch(req).then(put).catch(() => hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined));
    return hit || net;
  }));
});
