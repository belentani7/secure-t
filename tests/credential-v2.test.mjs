import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { webcrypto } from 'node:crypto';
import { runInNewContext } from 'node:vm';

const html = readFileSync(resolve('campus/credencial.html'), 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 1, 'the static credential contains exactly one inline script');

test('v2 receipt uses a versioned, domain-separated checksum input', () => {
  assert.match(html, /secure-t\/v2/);
  assert.doesNotMatch(html, /secure-t\/v1/);
});

function instance({ complete = true, token = 'anon-example-course-2026', evidence = 'Portfolio and reflections' } = {}) {
  const milestones = Array.from({ length: 20 }, (_, i) => `semana-${String(i + 1).padStart(2, '0')}`)
    .concat(['quiz', 'laboratorio', 'proyecto', 'examen']);
  const progress = Object.fromEntries(milestones.map(id => [`ciber-defensiva/${id}`, true]));
  if (!complete) delete progress['ciber-defensiva/examen'];
  const storage = new Map([
    ['stt-token', token],
    ['stt-progreso', JSON.stringify(progress)],
  ]);
  const elements = Object.fromEntries(
    ['curso', 'token', 'evidencia', 'salida', 'bloque', 'veredicto', 'sellar', 'btn-verificar'].map(id => [id, {
      value: '', hidden: true, textContent: '', className: '', innerHTML: '',
    }]),
  );
  elements.curso.value = 'ciber-defensiva';
  elements.token.value = token;
  elements.evidencia.value = evidence;
  runInNewContext(scripts[0][1], {
    crypto: webcrypto, TextEncoder,
    document: { getElementById: id => elements[id] },
    localStorage: { getItem: key => storage.get(key) ?? null },
  }, { timeout: 5_000 });
  return elements;
}

function extractBlock(elements) {
  const result = elements.salida.textContent;
  const marker = 'Bloque verificable (cópialo entero):\n';
  assert.ok(result.includes(marker), result);
  return JSON.parse(result.slice(result.indexOf(marker) + marker.length));
}

test('exports a fully reproducible v2 digest without the plain local token', async () => {
  const elements = instance();
  await elements.sellar.onclick();
  assert.equal(elements.salida.hidden, false);
  const block = extractBlock(elements);
  assert.equal(block.v, 2);
  assert.match(block.sujeto, /^[a-f0-9]{64}$/);
  assert.match(block.sello, /^[a-f0-9]{64}$/);
  assert.ok(!JSON.stringify(block).includes(elements.token.value), 'never publish local token');
  elements.bloque.value = JSON.stringify(block);
  await elements['btn-verificar'].onclick();
  assert.match(elements.veredicto.textContent, /Huella coherente/);
  assert.match(elements.veredicto.textContent, /NO acredita emisor/);
});

test('a modified evidence cannot pass checksum verification', async () => {
  const elements = instance();
  await elements.sellar.onclick();
  const modified = extractBlock(elements);
  modified.evidencia = 'Fabricated evidence';
  elements.bloque.value = JSON.stringify(modified);
  await elements['btn-verificar'].onclick();
  assert.match(elements.veredicto.textContent, /Huella diferente/);
});

test('legacy v1 and invalid digest blocks are rejected explicitly', async () => {
  const elements = instance();
  elements.bloque.value = JSON.stringify({
    v: 1, curso: 'ciber-defensiva', token: 'anon...', fecha: '2026-10-19',
    evidencia: 'Some evidence', sello: '0'.repeat(64),
  });
  await elements['btn-verificar'].onclick();
  assert.match(elements.veredicto.textContent, /versión antigua/);
});

test('an incomplete local journey cannot export a completion record', async () => {
  const elements = instance({ complete: false });
  await elements.sellar.onclick();
  assert.match(elements.salida.textContent, /Recorrido incompleto/);
  assert.doesNotMatch(elements.salida.textContent, /Bloque verificable/);
});

test('the local token must match browser storage', async () => {
  const elements = instance();
  elements.token.value = 'different-student';
  await elements.sellar.onclick();
  assert.match(elements.salida.textContent, /token debe coincidir/);
});
