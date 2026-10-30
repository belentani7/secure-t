import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const code = readFileSync(new URL('../campus/sw.js', import.meta.url), 'utf8');
const scope = 'https://example.test/secure-t/campus/';

function makeWorker() {
  const handlers = {};
  const stored = new Set();
  const fetched = [];
  const missing = new Set();
  const cache = {
    addAll: async () => {},
    match: async url => stored.has(url) ? new Response('cached') : undefined,
    put: async url => { stored.add(url); },
  };
  vm.runInNewContext(code, {
    URL, Response,
    self: {
      registration: {scope},
      addEventListener: (name, fn) => {handlers[name] = fn;},
      skipWaiting() {},
      clients: {claim: async () => {}},
    },
    caches: {open: async () => cache, keys: async () => [], delete: async () => true},
    fetch: async url => {
      fetched.push(url);
      return new Response('synthetic course', {status: missing.has(url) ? 404 : 200});
    },
  });
  async function save(sourceUrl = scope + 'index.html', data = {type: 'SECURE_T_SAVE_COURSES'}) {
    const messages = [];
    let pending;
    handlers.message({
      data,
      source: {url: sourceUrl},
      ports: [{postMessage: msg => messages.push(msg)}],
      waitUntil: work => {pending = work;},
    });
    if (pending) await pending;
    return messages;
  }
  return {save, stored, fetched, missing};
}

test('student offline download includes the four real 20-week programs', async () => {
  const worker = makeWorker();
  const messages = await worker.save();
  const last = messages.at(-1);
  assert.equal(last.type, 'complete');
  assert.equal(last.failed, 0);
  assert.equal(last.total, 112);
  assert.equal(worker.stored.size, 112);
  assert.equal(worker.fetched.length, 112);
  for (const slug of ['ciber-ofensiva', 'ciber-defensiva', 'ia-aplicada-segura', 'gobernanza-compliance']) {
    for (const path of ['index.html', 'quiz.json', 'semana-01.md', 'semana-20.md', 'glosario.md']) {
      assert.ok(worker.stored.has(scope + 'cursos/' + slug + '/' + path), slug + '/' + path);
    }
  }
  assert.equal(messages.filter(msg => msg.type === 'progress').length, 14);
  // A second download reuses the same app-owned cache rather than downloading again.
  assert.equal((await worker.save()).at(-1).failed, 0);
  assert.equal(worker.fetched.length, 112);
});

test('failed resources are reported and retried without claiming a complete download', async () => {
  const worker = makeWorker();
  const missing = scope + 'cursos/ciber-defensiva/semana-20.md';
  worker.missing.add(missing);
  const first = await worker.save();
  assert.equal(first.at(-1).failed, 1);
  assert.equal(worker.stored.has(missing), false);
  worker.missing.delete(missing);
  assert.equal((await worker.save()).at(-1).failed, 0);
  assert.equal(worker.stored.has(missing), true);
});

test('messages from other scopes cannot fill the cache and arbitrary paths are ignored', async () => {
  const worker = makeWorker();
  assert.equal((await worker.save('https://example.test/other/index.html')).at(-1).type, 'error');
  assert.equal(worker.fetched.length, 0);
  await worker.save(scope + 'index.html',
    {type: 'SECURE_T_SAVE_COURSES', paths: ['https://attacker.test/private']});
  assert.equal(worker.fetched.length, 112);
  assert.ok(worker.fetched.every(url => url.startsWith(scope + 'cursos/')));
  assert.ok(worker.fetched.every(url => !url.includes('private')));
});
