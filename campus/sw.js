// Cache only this campus. Other applications can share the same hosting origin.
const SCOPE = new URL(self.registration.scope);
const PREFIX = `secure-t-campus:${SCOPE.pathname}:`;
const CACHE = `${PREFIX}v14-offline-courses`;
const CORE = ['./', './index.html', './tokens.css', './app.js',
  './sw-register.js',
  './workstation/index.html', './workstation/workstation.css',
  './workstation/workstation-data.js', './workstation/workstation.js',
  './workstation/mission.html', './workstation/mission.css',
  './workstation/mission-data.js', './workstation/mission.js',
  './observatorio/index.html', './observatorio/observatorio.css',
  './observatorio/data.js', './observatorio/observatorio.js',
  './observatorio/labs.html', './observatorio/labs.css',
  './observatorio/labs-data.js', './observatorio/labs.js',
  './academia/triage.html', './academia/triage-core.mjs',
  './academia/threat-studio.html', './academia/threat-core.mjs',
  './academia/lab-session.mjs'];

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
        // Cache /campus/observatorio/index.html also serves offline /campus/observatorio/.
        if (url.pathname.endsWith('/')) {
          const directoryIndex = await cache.match(url.origin + url.pathname + 'index.html');
          if (directoryIndex) return directoryIndex;
        }
        // Unknown offline URLs must fail explicitly: silently serving the
        // home page hides 404s, misleads students and breaks route validation.
        return Response.error();
      }
      // HTML cannot substitute for missing scripts, JSON, styles or audio.
      return Response.error();
    })
  );
});

// Offline library: only the four actually published courses, never aspirational programs.
// Fixed resource allowlist; clients cannot supply arbitrary URLs or credentials.
const COURSE_SLUGS = ['ciber-ofensiva', 'ciber-defensiva', 'ia-aplicada-segura', 'gobernanza-compliance'];
const COURSE_DOCUMENTS = ['index.html', 'quiz.json', 'syllabus.md', 'glosario.md',
  'chuleta.md', 'laboratorio.md', 'rubrica.md', 'examen.md'];
const COURSE_PATHS = COURSE_SLUGS.flatMap(slug => [
  ...COURSE_DOCUMENTS.map(name => './cursos/' + slug + '/' + name),
  ...Array.from({length: 20}, (_, index) =>
    './cursos/' + slug + '/semana-' + String(index + 1).padStart(2, '0') + '.md'),
]);

self.addEventListener('message', event => {
  if (event.data?.type !== 'SECURE_T_SAVE_COURSES' || !event.ports?.[0]) return;
  const port = event.ports[0];
  if (!event.source?.url || !event.source.url.startsWith(SCOPE.href)) {
    port.postMessage({type: 'error'});
    return;
  }
  const save = async () => {
    const cache = await caches.open(CACHE);
    let failed = 0;
    let completed = 0;
    for (let i = 0; i < COURSE_PATHS.length; i += 8) {
      // Bounded batches protect slow connections and limited-memory phones.
      const results = await Promise.all(COURSE_PATHS.slice(i, i + 8).map(async path => {
        const url = new URL(path, SCOPE).href;
        if (await cache.match(url)) return true;
        try {
          const response = await fetch(url, {credentials: 'omit'});
          if (response.status !== 200 || response.type === 'opaque' || response.redirected)
            return false;
          await cache.put(url, response);
          return true;
        } catch (_) {
          return false;
        }
      }));
      completed += results.length;
      failed += results.filter(ok => !ok).length;
      port.postMessage({type: 'progress', completed, total: COURSE_PATHS.length, failed});
    }
    port.postMessage({type: 'complete', total: COURSE_PATHS.length, failed});
  };
  event.waitUntil(save().catch(() => port.postMessage({type: 'error'})));
});
