import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext, Script} from 'node:vm';
import test from 'node:test';

const root=new URL('../campus/academia/',import.meta.url);
const read=file=>readFileSync(new URL(file,root),'utf8');
function makeElement(name='div'){
  const listeners={};
  return {
    nodeName:name,children:[],dataset:{},value:'',hidden:false,textContent:'',listeners,
    setAttribute(k,v){this[k]=v;},
    removeAttribute(k){delete this[k];},
    appendChild(child){this.children.push(child);return child;},
    replaceChildren(...items){this.children=items;},
    addEventListener(type,fn){listeners[type]=fn;},
    scrollIntoView(){},
  };
}
function boot(){
  const window={};
  for(const file of ['data.js','formative-bank.js']){
    new Script(read(file),{filename:file}).runInContext(createContext({window}));
  }
  const names='check-nav check-course check-course-select check-kicker check-title check-lead check-submit check-next check-source check-prompt check-question-label check-count check-choices check-feedback check-form autoevaluacao';
  const nodes=Object.fromEntries(names.split(' ').map(n=>[n,makeElement(n)]));
  const languages=['pt','es','en'].map(lang=>Object.assign(makeElement('button'),{dataset:{lang}}));
  let choice=null;
  const document={
    documentElement:{lang:'pt-BR'},
    getElementById:id=>nodes[id],
    createElement:makeElement,
    querySelectorAll:selector=>selector==='[data-lang]'?languages:[],
    querySelector:selector=>selector==='input[name="formative-choice"]:checked'?choice:null,
  };
  new Script(read('formative.js'),{filename:'formative.js'}).runInContext(createContext({window,document}));
  return {window,nodes,document,languages,answer(index){choice={value:String(index)}}};
}
test('24 authored competency checks match 24 subjects and are fully localized',()=>{
  const s=boot();
  assert.equal(s.window.SecureTFormativeBank.length,24);
  const ids=new Set;
  for(const q of s.window.SecureTFormativeBank){
    assert.ok(!ids.has(q.id));ids.add(q.id);
    assert.equal(s.window.SecureTAcademyData.courses.find(c=>c.id===q.course).semester<=4,true);
    for(const lang of ['pt','es','en']){
      assert.ok(q.question[lang].length>=15);
      assert.equal(q.options[lang].length,3);
      assert.ok(q.explanation[lang].length>=20);
      assert.ok(q.options[lang].every(x=>x.length>1));
    }
  }
  assert.equal(s.window.SecureTFormative.validateBank(s.window.SecureTFormativeBank),true);
  assert.equal(s.window.SecureTFormative.validateBank([...s.window.SecureTFormativeBank,s.window.SecureTFormativeBank[0]]),false);
});
test('questions are evaluated without storing grades or accessing network',()=>{
  const s=boot(),tool=s.window.SecureTFormative;
  for(const q of s.window.SecureTFormativeBank){
    assert.equal(tool.evaluate(q.id,q.correct).correct,true);
    assert.equal(tool.evaluate(q.id,(q.correct+1)%3).correct,false);
    assert.equal(tool.evaluate(q.id,-1).valid,false);
    assert.equal(tool.evaluate(q.id,3).valid,false);
  }
  assert.equal(tool.evaluate('fake',0).valid,false);
  assert.doesNotMatch(read('formative.js'),/fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|innerHTML/);
});
test('formative checks render accessible choices, feedback and all three languages',()=>{
  const s=boot(),first=s.window.SecureTFormativeBank[0];
  assert.match(s.nodes['check-title'].textContent,/compreendeu/);
  assert.equal(s.nodes['check-course-select'].children.length,24);
  assert.equal(s.nodes['check-choices'].children.length,3);
  assert.equal(s.nodes['check-choices'].children[0].children[0].type,'radio');
  s.answer(first.correct);
  s.nodes['check-form'].listeners.submit({preventDefault(){}});
  assert.equal(s.nodes['check-feedback'].dataset.outcome,'correct');
  assert.match(s.nodes['check-feedback'].textContent,/correta/);
  s.document.documentElement.lang='es';
  s.languages[1].listeners.click();
  assert.match(s.nodes['check-title'].textContent,/comprendido/);
  assert.equal(s.nodes['check-feedback'].hidden,true);
  s.document.documentElement.lang='en';
  s.languages[2].listeners.click();
  assert.match(s.nodes['check-title'].textContent,/understood/);
  assert.equal(s.window.SecureTFormative.selectCourse('ST-045'),true);
  assert.equal(s.nodes['check-course-select'].value,'22');
  assert.equal(s.window.SecureTFormative.selectCourse('ST-101'),false);
});
test('academic portal links the assessment and offers mobile keyboard-friendly choices',()=>{
  const html=read('index.html'),css=read('style.css');
  assert.match(html,/id="autoevaluacao"/);
  assert.match(html,/id="course-self-check"/);
  assert.match(html,/src="formative-bank.js"/);
  assert.match(html,/src="formative.js"/);
  assert.match(css,/\.check-choice/);
  assert.match(css,/\.formative-panel/);
});
