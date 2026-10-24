'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..','campus','workstation');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const dataSource=read('mission-data.js');
const script=read('mission.js');
const html=read('mission.html');
const windowData={};
vm.runInNewContext(dataSource,{window:windowData});
const db=windowData.SecureTMissionControl;
class Mock{
  constructor(tag='div'){
    this.tagName=tag.toUpperCase();this.children=[];this.listeners={};this.dataset={};this.attrs={};
    this.value='';this.textContent='';this.hidden=false;this.checked=false;this.disabled=false;this.style={};
    this.classList={toggle(){}};
  }
  append(...items){this.children.push(...items);}
  replaceChildren(...items){this.children=[...items];}
  addEventListener(type,fn){this.listeners[type]=fn;}
  setAttribute(name,value){this.attrs[name]=value;}
  focus(){}
  click(){this.listeners.click?.({preventDefault(){}});}
  remove(){}
  querySelector(selector){
    if(selector==='input[name="choice"]:checked'){
      return this.children.map(x=>x.children[0]).find(x=>x.checked)||null;
    }
    return null;
  }
}
function app(initial={}){
  const elements=Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>[m[1],new Mock()]));
  const tabs=['cases','cards','journal','about'].map(v=>{const n=new Mock('button');n.dataset.view=v;return n;});
  const ratings=[0,1,2,3].map(v=>{const n=new Mock('button');n.dataset.rating=String(v);return n;});
  const document={
    body:new Mock('body'),getElementById:id=>elements[id],
    createElement:tag=>new Mock(tag),
    querySelectorAll:selector=>selector==='[data-view]'?tabs:selector==='[data-rating]'?ratings:[],
    addEventListener(){}
  };
  let storage={...initial};
  const localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>{storage[k]=v;}};
  const fakeWindow={SecureTMissionControl:db,confirm:()=>true,print(){}};
  const URL={createObjectURL:()=>'blob:mock',revokeObjectURL(){}};
  vm.runInNewContext(script,{window:fakeWindow,document,localStorage,URL,Blob,Date,Map,Set,Number,Math,setTimeout:fn=>fn()});
  return {e:elements,tabs,ratings,storage};
}
function fire(element,type='click'){
  assert.equal(typeof element.listeners[type],'function','missing event '+type);
  element.listeners[type]({preventDefault(){},target:element});
}
test('six case pathways contain 24 constrained decisions and 48 unique spaced repetition cards',()=>{
  assert.equal(db.schema,'secure-t.mission-control.v1');
  assert.equal(db.cases.length,6);assert.equal(db.flashcards.length,48);
  assert.equal(new Set(db.flashcards.map(c=>c.id)).size,48);
  for(const c of db.cases){
    assert.equal(c.steps.length,4);
    assert.equal(c.signals.length,3);
    assert.ok(db.references[c.source]);
    for(const s of c.steps){
      assert.equal(s.length,4);assert.equal(s[1].length,3);
      assert.ok(Number.isInteger(s[2])&&s[2]>=0&&s[2]<3);
      assert.ok(s[3].length>=50);
    }
  }
});
test('references are official HTTPS and HTML enforces local security boundaries',()=>{
  for(const entry of Object.values(db.references))assert.match(entry.url,/^https:\/\//);
  assert.match(html,/connect-src 'none'/);
  assert.match(html,/form-action 'none'/);
  assert.match(html,/lang="es"/);
  for(const name of ['mission.css','mission.js','mission-data.js'])assert.ok(html.includes(name));
  assert.doesNotMatch(script,/\b(?:eval|fetch|WebSocket)\s*\(|innerHTML|sendBeacon/);
  new Function(script);
});
test('bootstraps six mission cards, 48 due reviews and zero completed',()=>{
  const {e}=app();
  assert.equal(e['case-list'].children.length,6);
  assert.equal(e['stat-complete'].textContent,'0 / 6');
  assert.equal(e['stat-due'].textContent,'48');
  assert.equal(e['decision-count'].textContent,'Decisión 1 de 4');
});
test('wrong choice does not advance; 4 correct decisions plus evidence complete the case',()=>{
  const {e,storage}=app();
  const answers=db.cases[0].steps.map(s=>s[2]);
  e['decision-options'].children[(answers[0]+1)%3].children[0].checked=true;
  fire(e['decision-form'],'submit');
  assert.match(e['decision-feedback'].textContent,/no está sustentada/);
  assert.equal(e['decision-next'].hidden,true);
  for(let i=0;i<4;i++){
    e['decision-options'].children[answers[i]].children[0].checked=true;
    fire(e['decision-form'],'submit');
    assert.equal(e['decision-next'].hidden,false);
    fire(e['decision-next']);
  }
  assert.equal(e['stat-complete'].textContent,'0 / 6');
  assert.equal(e['decision-count'].textContent,'Simulación completada · 4/4');
  for(const id of ['journal-facts','journal-uncertainty','journal-action'])e[id].value='Ejemplo de documento sintético con observaciones y límites de la investigación adecuada.';
  e['journal-attest'].checked=true;
  fire(e['journal-form'],'submit');
  assert.equal(e['stat-complete'].textContent,'1 / 6');
  const x=JSON.parse(storage['secure-t.mission-control.v1']);
  assert.equal(x.cases.auth.cursor,4);assert.equal(x.cases.auth.attempts,5);
  assert.equal(x.cases.auth.documented,true);
});
test('short drafts and imported forged progress cannot award case completion',()=>{
  const forged=JSON.stringify({schema:db.schema,cases:{auth:{cursor:4,correct:[false,false,false,false],documented:true,notes:{facts:'x',uncertainty:'x',action:'x'},extra:'evil'}},cards:{}});
  const {e}=app({'secure-t.mission-control.v1':forged});
  assert.equal(e['stat-complete'].textContent,'0 / 6');
  e['journal-facts'].value='short';e['journal-uncertainty'].value='short';e['journal-action'].value='short';
  e['journal-attest'].checked=true;fire(e['journal-form'],'submit');
  assert.match(e['journal-feedback'].textContent,/40 caracteres/);
});
test('spaced repetition schedules the first card in 3 UTC days on Bien, and decreases due count',()=>{
  const {e,ratings,storage}=app();
  fire(e['show-answer']);
  fire(ratings[2]);
  const state=JSON.parse(storage['secure-t.mission-control.v1']);
  assert.equal(state.cards['ai-01'].reviews,1);
  assert.equal(state.cards['ai-01'].interval,3);
  assert.equal(e['stat-due'].textContent,'47');
  assert.equal(e['card-session'].textContent,'1 revisadas en esta sesión');
});
test('read-only navigation, reset and source references are wired',()=>{
  const {e,tabs}=app();
  fire(tabs[3]);
  assert.equal(e['view-about'].hidden,false);
  assert.equal(e['source-list'].children.length,3);
  fire(e['reset-state']);
  assert.equal(e['stat-due'].textContent,'48');
});
