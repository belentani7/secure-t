import test from 'node:test';
import assert from 'node:assert/strict';
import {loadLabSession, saveLabSession, clearLabSession} from '../campus/academia/lab-session.mjs';

const key = 'secure-t:test-session';
const signature = 'case-one|case-two|case-three';
const state = (overrides = {}) => ({
  lang: 'es', step: 1, answers: [2], reviewed: false, pendingChoice: 0, ...overrides,
});
function storage() {
  const values = new Map();
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
    removeItem(key) { values.delete(key); },
  };
}

test('reload restores language, completed decisions and a pending choice', () => {
  const box = storage();
  assert.equal(saveLabSession(box, key, 3, signature, state()), true);
  assert.deepEqual(loadLabSession(box, key, 3, signature), state());
});

test('reviewed feedback and a fully completed session can be restored', () => {
  const box = storage();
  const reviewed = state({step: 1, answers: [2, 0], reviewed: true, pendingChoice: null});
  assert.equal(saveLabSession(box, key, 3, signature, reviewed), true);
  assert.deepEqual(loadLabSession(box, key, 3, signature), reviewed);
  const completed = state({step: 3, answers: [2, 0, 1], reviewed: false, pendingChoice: null});
  assert.equal(saveLabSession(box, key, 3, signature, completed), true);
  assert.deepEqual(loadLabSession(box, key, 3, signature), completed);
});

test('rejects malformed, oversized, stale or inconsistent stored progress', () => {
  const box = storage();
  for (const raw of ['{', '"hello"', 'x'.repeat(2100),
    JSON.stringify({...state(), version: 1, signature, answers: [99]}),
    JSON.stringify({...state(), version: 1, signature, step: 2}),
    JSON.stringify({...state(), version: 1, signature, lang: 'fr'}),
    JSON.stringify({...state(), version: 1, signature, pendingChoice: -1}),
    JSON.stringify({...state(), version: 1, signature, reviewed: true})]) {
    box.setItem(key, raw);
    assert.equal(loadLabSession(box, key, 3, signature), null);
  }
  assert.equal(saveLabSession(box, key, 3, signature, state({answers: [9]})), false);
  assert.equal(saveLabSession(box, key, 3, signature, state()), true);
  assert.equal(loadLabSession(box, key, 3, 'changed-case-IDs'), null);
});

test('never throws when browser session storage is unavailable', () => {
  const blocked = {
    getItem() { throw new Error('denied'); },
    setItem() { throw new Error('denied'); },
    removeItem() { throw new Error('denied'); },
  };
  assert.equal(loadLabSession(blocked, key, 3, signature), null);
  assert.equal(saveLabSession(blocked, key, 3, signature, state()), false);
  assert.equal(clearLabSession(blocked, key), false);
  assert.equal(loadLabSession(null, key, 3, signature), null);
});

test('restart clears progress without affecting other labs', () => {
  const box = storage();
  saveLabSession(box, 'soc', 3, signature, state());
  saveLabSession(box, 'threat', 3, signature, state());
  assert.equal(clearLabSession(box, 'soc'), true);
  assert.equal(loadLabSession(box, 'soc', 3, signature), null);
  assert.deepEqual(loadLabSession(box, 'threat', 3, signature), state());
});
