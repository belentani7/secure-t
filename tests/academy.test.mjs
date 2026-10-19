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
test('every learning unit has native PT, ES and EN topic titles',()=>{
  const localizedIds=new Set;
  for(const c of academy.courses){
    assert.ok(c.topicsI18n,'Missing translated topic titles: '+c.id);
    for(const language of ['pt','es','en']){
      assert.equal(c.topicsI18n[language].length,4,c.id+' / '+language);
      c.topicsI18n[language].forEach((title,index)=>{
        assert.ok(typeof title==='string'&&title.length>=5,c.id+' / '+language+' / '+index);
        localizedIds.add(c.id+':'+language+':'+index);
      });
    }
  }
  assert.equal(localizedIds.size,720);
  assert.ok(app.includes('localizedTopics(c).forEach'));
});

test('first-semester original lessons include reading and exercises in all three languages',()=>{
  const guideSource=readFileSync(new URL('../campus/academia/lesson-content.js',import.meta.url),'utf8');
  const guideContext=createContext({window:{}});
  new Script(guideSource,{filename:'academy/lesson-content.js'}).runInContext(guideContext);
  const guides=guideContext.window.SecureTStudyGuides;
  const ids=Object.keys(guides);
  assert.equal(ids.length,24);
  for(const id of ids){
    assert.ok(academy.courses.some(c=>c.id===id.split('/')[0] && c.semester===1));
    for(const language of ['pt','es','en']){
      assert.ok(guides[id].read[language].length>=100,id+' reading '+language);
      assert.ok(guides[id].exercise[language].length>=60,id+' activity '+language);
    }
  }
  assert.ok(html.includes('<script defer src="lesson-content.js"></script>'));
  assert.ok(app.includes('authoredGuides[key]'));
  assert.ok(app.includes('detail.planned'));
});

test('second semester now has authored and localized readings and practice',()=>{
  const source=readFileSync(new URL('../campus/academia/lesson-content.js',import.meta.url),'utf8');
  const extension=readFileSync(new URL('../campus/academia/lesson-content-2.js',import.meta.url),'utf8');
  const ctx=createContext({window:{}});
  new Script(source).runInContext(ctx);
  new Script(extension).runInContext(ctx);
  const guides=ctx.window.SecureTStudyGuides;
  assert.equal(Object.keys(guides).length,48);
  const second=Object.entries(guides).filter(([key])=>key.startsWith('ST-02'));
  assert.equal(second.length,24);
  for(const [key,guide] of second){
    const course=academy.courses.find(c=>c.id===key.split('/')[0]);
    assert.equal(course.semester,2);
    for(const lang of ['pt','es','en']){
      assert.ok(guide.read[lang].length>=100,key+' reading '+lang);
      assert.ok(guide.exercise[lang].length>=65,key+' exercise '+lang);
    }
  }
  assert.ok(html.includes('<script defer src="lesson-content-2.js"></script>'));
});

test('offline tutor offers trilingual explanations, exercises, Socratic checks and credits',()=>{
  const guideSource=readFileSync(new URL('../campus/academia/lesson-content.js',import.meta.url),'utf8');
  const tutorSource=readFileSync(new URL('../campus/academia/tutor-guide.js',import.meta.url),'utf8');
  const ctx=createContext({window:{}});
  new Script(guideSource).runInContext(ctx);
  new Script(tutorSource).runInContext(ctx);
  const tutor=ctx.window.SecureTCurriculumTutor;
  const selected=academy.courses[0];
  const base={selected,dataset:academy,guides:ctx.window.SecureTStudyGuides};
  for(const [lang,q,a] of [['pt','Explica','Exercício'],['es','Explica','Ejercicio'],['en','Explain','Exercise']]){
    const explained=tutor.respond({...base,lang,message:q});
    assert.equal(explained.kind,'explanation');
    assert.ok(explained.text.length>250);
    const practiced=tutor.respond({...base,lang,message:a});
    assert.equal(practiced.kind,'practice');
    assert.ok(practiced.text.length>170);
    const quiz=tutor.respond({...base,lang,message:'quiz'});
    assert.equal(quiz.kind,'question');
    const answered=tutor.respond({...base,lang,message:'I mapped the CPU and memory and checked the observed behavior.',state:quiz.state});
    assert.equal(answered.kind,'reflection');
    const sources=tutor.respond({...base,lang,message:lang==='pt'?'fontes':lang==='es'?'fuentes':'sources'});
    assert.equal(sources.kind,'sources');
    assert.ok(sources.text.includes('Cisco Networking Academy'));
  }
  const unsafe=tutor.respond({...base,lang:'es',message:'quiero robar contraseñas sin autorización'});
  assert.equal(unsafe.kind,'safety');
  assert.doesNotMatch(tutorSource,/fetch\\(|XMLHttpRequest|sendBeacon/);
  assert.ok(html.includes('<script defer src="tutor-guide.js"></script>'));
});

test('learning progress is private and self-reported',()=>{
  assert.ok(app.includes('permittedIds.has(key) && value===true'));
  assert.ok(app.includes('stt-academia-progress'));
  assert.ok(html.includes('Não equivale a aprovação'));
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.ok(html.includes('O que foi inspirado pelo amor'));
});
