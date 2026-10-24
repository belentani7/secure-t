const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const root = join(__dirname, '..', 'campus', 'workstation');
const casesSource = readFileSync(join(root, 'workstation-data.js'), 'utf8');
const appSource = readFileSync(join(root, 'workstation.js'), 'utf8');

class MockElement {
  constructor() {
    this.value = ''; this.textContent = ''; this.dataset = {}; this.children = [];
    this.listeners = {}; this.attrs = {}; this.checked = false; this.hidden = false;
    this.classList = { toggle() {} };
  }
  addEventListener(event, callback) { this.listeners[event] = callback; }
  setAttribute(key, value) { this.attrs[key] = value; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = [...nodes]; }
  remove() { this.removed = true; }
  focus() { this.focused = true; }
  get childElementCount() { return this.children.filter(x => !x.removed).length; }
  get firstElementChild() { return this.children.find(x => !x.removed); }
  get scrollHeight() { return 100; }
  set scrollTop(value) { this.scroll = value; }
}

function start() {
  const window = { scrollTo() {}, confirm: () => true };
  runInNewContext(casesSource, { window });
  const ids = ['clock', 'location-title', 'progress-count', 'case-count',
    'dashboard-cases', 'case-list', 'case-detail', 'terminal-output', 'terminal-form',
    'terminal-command', 'terminal-clear', 'evidence-form', 'evidence-case',
    'evidence-action', 'evidence-confidence', 'evidence-notes', 'evidence-attest',
    'export-evidence', 'import-evidence', 'evidence-file', 'evidence-result',
    'reset-workstation'];
  const elements = Object.fromEntries(ids.map(id => [id, new MockElement()]));
  const panels = ['dashboard', 'terminal', 'cases', 'notebook', 'guide'];
  const buttons = panels.map(name => {
    const node = new MockElement();
    node.dataset.panel = name;
    elements['panel-' + name] = new MockElement();
    return node;
  });
  const document = {
    getElementById: id => elements[id],
    querySelectorAll: selector => selector === '[data-panel]' ? buttons : [],
    createElement: () => new MockElement(),
  };
  const storage = Object.create(null);
  const localStorage = {
    getItem: key => storage[key] ?? null,
    setItem: (key, value) => { storage[key] = value; }
  };
  const forbidden = () => { throw new Error('unexpected network or execution'); };
  const context = { window, document, localStorage, setInterval() {}, Blob, URL,
    fetch: forbidden, WebSocket: forbidden, eval: forbidden };
  runInNewContext(appSource, context);
  return { window, elements, storage, document };
}

function submit(element) { element.listeners.submit({ preventDefault() {} }); }

test('six real teaching scenarios render in the student workstation', () => {
  const { elements } = start();
  assert.equal(elements['dashboard-cases'].childElementCount, 6);
  assert.equal(elements['case-list'].childElementCount, 6);
  assert.equal(elements['evidence-case'].childElementCount, 6);
  assert.equal(elements['case-count'].textContent, '06');
});

test('terminal interprets only known virtual resources and has keyboard history', () => {
  const { elements } = start();
  const input = elements['terminal-command'];
  input.value = 'grep FAILED /cases/auth.log';
  submit(elements['terminal-form']);
  assert.match(elements['terminal-output'].children.at(-1).textContent, /result=FAILED/);
  input.listeners.keydown({ key: 'ArrowUp', preventDefault() {} });
  assert.equal(input.value, 'grep FAILED /cases/auth.log');
  input.value = 'cat /etc/passwd';
  submit(elements['terminal-form']);
  assert.match(elements['terminal-output'].children.at(-1).textContent, /Archivo inexistente/);
  input.value = 'ls; rm -rf /';
  submit(elements['terminal-form']);
  assert.match(elements['terminal-output'].children.at(-1).textContent, /no admite shell/);
});

test('learning evidence for six courses is structured, saved and not a credential', () => {
  const { elements, storage } = start();
  const index = ['auth','mail','integrity','cloud','ai','privacy'];
  const action = ['verify','quarantine','preserve','restrict','review','minimize'];
  const text = 'El hecho observable requiere correlación documental y revisión humana autorizada. '
    + 'No se trata de una prueba de acceso no autorizado; diferenciaremos hipótesis '
    + 'y hechos antes de recomendar una medida proporcional, sin tocar sistemas externos.';
  for (let i=0; i<index.length; i++) {
    elements['evidence-case'].value = index[i];
    elements['evidence-action'].value = action[i];
    elements['evidence-confidence'].value = 'medium';
    elements['evidence-notes'].value = text;
    elements['evidence-attest'].checked = true;
    submit(elements['evidence-form']);
    assert.match(elements['evidence-result'].textContent, /Autoevaluación estructural superada/);
  }
  assert.equal(elements['progress-count'].textContent, '6 / 6');
  const state = JSON.parse(storage['secure-t.workstation.v1']);
  assert.equal(Object.values(state.records).filter(entry => entry.reviewed).length, 6);
  assert.doesNotMatch(elements['evidence-result'].textContent, /certificado emitido/i);
});

test('rejects ungrounded self-evaluation and keeps progress unchanged', () => {
  const { elements } = start();
  elements['evidence-case'].value = 'auth';
  elements['evidence-action'].value = 'scan';
  elements['evidence-notes'].value = 'todo';
  elements['evidence-attest'].checked = true;
  submit(elements['evidence-form']);
  assert.match(elements['evidence-result'].textContent, /Revisión incompleta/);
  assert.equal(elements['progress-count'].textContent, '0 / 6');
});
