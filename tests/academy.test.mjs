import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';

const source=readFileSync(new URL('../campus/academia/data.js',import.meta.url),'utf8');
const context=createContext({window:{}});
new Script(source,{filename:'academy/data.js'}).runInContext(context);
const academy=context.window.SecureTAcademyData;
const html=readFileSync(new URL('../campus/academia/index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../campus/academia/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../campus/academia/style.css',import.meta.url),'utf8');
new Script(app,{filename:'academy/app.js'});

test('five-year roadmap has 10 semesters, 60 subjects, 240 units',()=>{
  assert.equal(academy.years,5);
  assert.equal(academy.semesters,10);
  assert.equal(academy.courses.length,60);
  assert.equal(academy.courses.reduce((n,c)=>n+c.topics.length,0),240);
  assert.deepEqual([...new Set(academy.courses.map(c=>c.year))],[1,2,3,4,5]);
  assert.deepEqual([...new Set(academy.courses.map(c=>c.semester))],[1,2,3,4,5,6,7,8,9,10]);
});
test('prerequisites, three tracks, topics, outcomes and titles',()=>{
  const ids=new Set(academy.courses.map(c=>c.id));
  assert.equal(ids.size,60);
  for(const c of academy.courses){
    assert.ok(['cyber','web','languages'].includes(c.track));
    assert.equal(c.topics.length,4);
    assert.ok(c.topics.every(t=>typeof t==='string'&&t.length>=5));
    assert.ok(c.resources.length>=1);
    for(const language of ['pt','es','en']){
      assert.ok(c.title[language].length>=8);
      assert.ok(c.outcome[language].length>=30);
      assert.ok(c.assessment[language].length>=20);
    }
    if(c.semester===1)assert.equal(c.requires,null);
    else assert.ok(ids.has(c.requires),'Missing prerequisite '+c.requires);
  }
});
test('external media has original HTTPS links and attributions',()=>{
  const resources=new Set;
  for(const r of academy.resources){
    assert.ok(!resources.has(r.id));resources.add(r.id);
    assert.equal(new URL(r.url).protocol,'https:');
    assert.ok(r.creator.length>=5);
    assert.equal(r.status,'verified');
  }
  for(const c of academy.courses)for(const id of c.resources)assert.ok(resources.has(id));
});
test('Portuguese initial experience and timezone database',()=>{
  assert.match(html,/<html lang="pt-BR"/);
  assert.ok(app.includes('let lang = LANGS.includes(readLang) ? readLang : "pt"'));
  for(const zone of ['America/Sao_Paulo','Europe/Madrid','Europe/Dublin'])assert.ok(app.includes(zone));
  assert.ok(app.includes('Intl.DateTimeFormat'));
});
test('opt-in speech and local model and offline curricular fallback',()=>{
  assert.ok(app.includes('window.confirm(tr("tutor.consent"))'));
  assert.ok(app.includes('window.confirm(tr("tutor.modelConsent"))'));
  assert.ok(app.includes('window.speechSynthesis'));
  assert.ok(app.includes('window.SpeechRecognition||window.webkitSpeechRecognition'));
  assert.ok(app.includes('localTutor(message)'));
  assert.ok(app.includes('window.LanguageModel'));
  assert.ok(!/(sk-[A-Za-z0-9_-]{20,}|github_pat_[A-Za-z0-9_]{30,})/.test(app+html));
});
test('learning progress is private and self-reported',()=>{
  assert.ok(app.includes('permittedIds.has(key) && value===true'));
  assert.ok(app.includes('stt-academia-progress'));
  assert.ok(html.includes('Não equivale a aprovação'));
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.ok(html.includes('O que foi inspirado pelo amor'));
});
