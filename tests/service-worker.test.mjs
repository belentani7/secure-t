import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const code = readFileSync(new URL('../campus/sw.js', import.meta.url), 'utf8');
const scope = 'https://example.test/secure-t/campus/';

function worker({ keys = [], response = new Response('ok'), offline = false, cached, globalCached } = {}) {
  const handlers = {};
  const deleted = [], written = [], precache = [];
  const cache = { addAll: async entries => precache.push(...entries), put: async (...args) => written.push(args),
    match: async request => cached?.(request) };
  vm.runInNewContext(code, {
    self: { registration: { scope }, addEventListener: (name, fn) => { handlers[name] = fn; },
      skipWaiting() {}, clients: { claim: async () => {} } },
    URL, Response,
    caches: { keys: async () => keys, delete: async key => deleted.push(key),
      open: async () => cache, match: async request => (globalCached || cached)?.(request) },
    fetch: async () => { if (offline) throw new Error('offline'); return response; },
  });
  return { handlers, deleted, written, precache };
}

async function request(instance, url, mode = 'cors') {
  let result;
  const waiting = [];
  instance.handlers.fetch({ request: { url, method: 'GET', mode },
    respondWith: value => { result = value; }, waitUntil: p => waiting.push(p) });
  const response = result === undefined ? undefined : await result;
  await Promise.all(waiting);
  return response;
}

test('activation preserves caches owned by other applications', async () => {
  const instance = worker({ keys: ['other-app-v1', 'campus-v1'] });
  let pending;
  instance.handlers.activate({ waitUntil: p => { pending = p; } });
  await pending;
  assert.deepEqual(instance.deleted, []);
});

test('external and out-of-scope requests are not intercepted', async () => {
  const instance = worker();
  assert.equal(await request(instance, 'https://external.test/asset.js'), undefined);
  assert.equal(await request(instance, 'https://example.test/other-app/data'), undefined);
});

test('failed HTTP responses are not persisted as offline content', async () => {
  const instance = worker({ response: new Response('missing', { status: 404 }) });
  assert.equal((await request(instance, scope + 'missing.json')).status, 404);
  assert.equal(instance.written.length, 0);
});

test('offline requests return the previously visited resource', async () => {
  const instance = worker({ offline: true, cached: req => req.url?.endsWith('lesson.html')
    ? new Response('saved lesson') : undefined });
  assert.equal(await (await request(instance, scope + 'lesson.html', 'navigate')).text(), 'saved lesson');
});

test('offline missing scripts never receive fallback HTML', async () => {
  const instance = worker({ offline: true, cached: req => typeof req === 'string'
    ? new Response('<html>Campus</html>') : undefined });
  const response = await request(instance, scope + 'missing.js');
  assert.equal(response.type, 'error');
});

test('offline navigation can fall back to the cached campus index', async () => {
  const instance = worker({ offline: true, cached: req => req === scope + 'index.html'
    ? new Response('Campus index') : undefined });
  assert.equal(await (await request(instance, scope + 'unvisited.html', 'navigate')).text(), 'Campus index');
});

test('offline lookups ignore conflicting legacy and unrelated caches', async () => {
  const instance = worker({ offline: true,
    globalCached: () => new Response('stale legacy response'),
    cached: () => new Response('current campus response'),
  });
  assert.equal(await (await request(instance, scope + 'lesson.html', 'navigate')).text(), 'current campus response');
});

test('install pre-caches learning dependencies including the resumable-session module', async () => {
  const instance = worker();
  let pending;
  instance.handlers.install({waitUntil: promise => { pending = promise; }});
  await pending;
  assert.ok(instance.precache.includes('./academia/triage.html'));
  assert.ok(instance.precache.includes('./academia/threat-studio.html'));
  assert.ok(instance.precache.includes('./academia/lab-session.mjs'));
});

test('activation removes only obsolete Secure-T cache versions', async () => {
  assert.match(code, /v5-tab-resume/);
  const instance = worker({keys: ['other-app-cache', 'secure-t-campus:/secure-t/campus/:v4-threat-model']});
  let pending;
  instance.handlers.activate({waitUntil: promise => { pending = promise; }});
  await pending;
  assert.deepEqual(instance.deleted, ['secure-t-campus:/secure-t/campus/:v4-threat-model']);
});
