import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, Script } from 'node:vm';
import test from 'node:test';

const root=new URL('../campus/academia/',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const boot=()=>{
  const window={};
  new Script(read('data.js')).runInContext(createContext({window}));
  new Script(read('lesson-content.js')).runInContext(createContext({window}));
  class Control{
    constructor(data={}){
      this.dataset=data;this.listeners={};this.textContent='';
      this.value='';this.hidden=false;this.placeholder='';
    }
    addEventListener(type,fn){this.listeners[type]=fn}
    click(){this.listeners.click?.()}
    scrollIntoView(){}
  }
  const ids=[
    'review-task','review-nav-label','review-label','review-title','review-intro',
    'review-context','review-task-label','review-reveal','review-speak','review-skip',
    'review-solution-label','review-notice','review-answer','review-course',
    'review-topic','review-explanation','review-count','review-solution','review-status',
  ];
  const controls=Object.fromEntries(ids.map(id=>[id,new Control]));
  const score=[1,2,3].map(n=>new Control({reviewScore:String(n)}));
  const languages=['pt','es','en'].map(lang=>new Control({lang}));
  const storage={};
  const doc={
    documentElement:{lang:'pt-BR'},
    getElementById:id=>controls[id],
    querySelectorAll:selector=>selector==='[data-review-score]'?score:selector==='[data-lang]'?languages:[],
  };
  const store={getItem:id=>storage[id]??null,setItem:(id,value)=>{storage[id]=value}};
  const context=createContext({window,document:doc,localStorage:store,Date,Number,Object,JSON,String,Set});
  new Script(read('study-review.js'),{filename:'study-review.js'}).runInContext(context);
  return {window,doc,controls,score,languages,storage};
};

test('self-review initializes with 24 authored lessons and no external service',()=>{
  const page=boot();
  assert.match(page.controls['review-count'].textContent,/1\/24/);
  assert.match(page.controls['review-task'].textContent,/Desenhe um diagrama/);
  assert.match(page.controls['review-status'].textContent,/24 unidade/);
  assert.equal(Object.keys(page.storage).length,0);
  assert.doesNotMatch(read('study-review.js'),/fetch\s*\(|XMLHttpRequest\s*\(|navigator\.sendBeacon/);
});
test('review feedback is only shown after explicit reveal and persists due date locally',()=>{
  const page=boot();
  assert.equal(page.controls['review-solution'].hidden,true);
  page.controls['review-reveal'].click();
  assert.equal(page.controls['review-solution'].hidden,false);
  assert.match(page.controls['review-explanation'].textContent,/arquitetura distingue CPU/);
  page.score[1].click();
  assert.ok(page.storage['stt-academia-review-v1']);
  const state=JSON.parse(page.storage['stt-academia-review-v1']);
  assert.equal(state['ST-011/0'].count,1);
  const gap=state['ST-011/0'].next-Date.now();
  assert.ok(gap>2*24*60*60*1000 && gap<=4*24*60*60*1000);
  assert.equal(page.controls['review-solution'].hidden,true);
  assert.match(page.controls['review-count'].textContent,/1\/24/);
});
test('a language click changes the active review's question',()=>{
  const page=boot();
  page.doc.documentElement.lang='es';
  page.languages[1].click();
  assert.match(page.controls['review-task'].textContent,/Dibuja un esquema/);
  page.doc.documentElement.lang='en';
  page.languages[2].click();
  assert.match(page.controls['review-task'].textContent,/Draw a CPU/);
});
test('tampered or unknown review records are ignored',()=>{
  const page=boot(),tool=page.window.SecureTReview;
  const out=tool.parseSchedule({
    'ST-011/0':{next:Date.now()+60_000,count:3},
    'unknown':{next:Date.now(),count:999},
    'ST-011/1':{next:-1,count:8},
    'ST-011/2':{next:Date.now(),count:Infinity}
  });
  assert.deepEqual(Object.keys(out),['ST-011/0']);
  assert.throws(()=>tool.step(null,9),/confidence/);
  assert.equal(tool.step(null,1,1000).next,1000+86400000);
  assert.equal(tool.step({count:2},3,1000).next,1000+7*86400000);
});
