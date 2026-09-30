// secure T campus — service worker offline-first
// Estrategia: red primero para HTML/JSON/MD (contenido fresco), caché primero
// para estáticos. Solo se guardan respuestas OK del mismo origen.
const VERSION = 'campus-v2-2026-09-30';
const CORE = ['./', './index.html', './tokens.css', './app.js', './lector.html',
  './buscar.html', './progreso.html', './credencial.html', './indice.json',
  './manifest.webmanifest', './vendor/fuse.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function cacheable(req, res) {
  return res && res.ok && res.type === 'basic' && new URL(req.url).origin === self.location.origin;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const dinamico = req.mode === 'navigate' || /\.(html|json|md)$/.test(new URL(req.url).pathname);

  if (dinamico) {
    e.respondWith(
      fetch(req).then(res => {
        if (cacheable(req, res)) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: req.mode === 'navigate' })
        .then(r => r || caches.match('./index.html')))
    );
  } else {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (cacheable(req, res)) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
