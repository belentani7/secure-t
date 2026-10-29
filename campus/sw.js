// Cache only this campus. Other applications can share the same hosting origin.
const SCOPE = new URL(self.registration.scope);
const PREFIX = `secure-t-campus:${SCOPE.pathname}:`;
const CACHE = `${PREFIX}v5-tab-resume`;
const CORE = ['./', './index.html', './tokens.css', './app.js', './academia/triage.html', './academia/triage-core.mjs', './academia/threat-studio.html', './academia/threat-core.mjs', './academia/lab-session.mjs'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE)
      .map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && r.type !== 'opaque') {
        const copy = r.clone();
        e.waitUntil(caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}));
      }
      return r;
    }).catch(async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(e.request);
      if (cached) return cached;
      if (e.request.mode === 'navigate') {
        const index = await cache.match(new URL('index.html', SCOPE).href);
        if (index) return index;
      }
      // HTML cannot substitute for missing scripts, JSON, styles or audio.
      return Response.error();
    })
  );
});
