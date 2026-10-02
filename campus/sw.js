// campus sw — offline-first (cache de lectura, red para lo nuevo)
const CACHE = 'campus-v3-passa-adiante';
const CORE = [
  './',
  './index.html',
  './tokens.css',
  './app.js',
  './passa-adiante.html',
  './comecar.html',
  './progreso.html',
  './credencial.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './voces/pt/bienvenida.mp3',
  '../ui/voz.js',
  '../ui/biblia.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./')))
  );
});
