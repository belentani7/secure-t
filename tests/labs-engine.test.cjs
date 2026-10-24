'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..','campus','observatorio');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const html=read('labs.html'),code=read('labs.js'),src=read('labs-data.js');
const init={window:{}};vm.runInNewContext(src,init);const db=init.window.SecureTObservatoryLabs;
class NodeMock{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.listeners={};this.dataset={};this.checked=false;this.value='';this.textContent='';this.disabled=false;this.hidden=false;this.attrs={};this.classList={add(){},toggle(){}};}
 append(...items){this.children.push(...items);}replaceChildren(...items){this.children=[...items];}
 addEventListener(type,fn){this.listeners[type]=fn;}setAttribute(k,v){this.attrs[k]=v;}
 focus(){}scrollIntoView(){}click(){this.listeners.click?.({preventDefault(){},target:this});}remove(){}
 querySelector(selector){const a=this.querySelectorAll(selector);return a[0]||null;}
 querySelectorAll(selector){
  const all=[];
  function walk(node){for(const c of node.children||[]){all.push(c);walk(c);}}
  walk(this);
  if(selector==='input[type="radio"]:checked')return all.filter(n=>n.tagName==='INPUT'&&n.type==='radio'&&n.checked);
  if(selector==='input')return all.filter(n=>n.tagName==='INPUT');
  return [];
 }
}
function load(initial={},query=''){
 const elements=Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>[m[1],new NodeMock()]));
 const storage={...initial};
 const document={body:new NodeMock('body'),getElementById:id=>{assert.ok(elements[id],id);return elements[id];},createElement:tag=>new NodeMock(tag)};
 const localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>{storage[k]=v;}};
 const window={SecureTObservatoryLabs:db,location:{search:query},confirm:()=>true};
 vm.runInNewContext(code,{window,document,localStorage,URLSearchParams,URL,Blob,Date,Map,Set,setTimeout:()=>{}});
 return{e:elements,storage};
}
function fire(el,event='click'){assert.equal(typeof el.listeners[event],'function');el.listeners[event]({preventDefault(){},target:el});}
function answer(e,i,answer){
 const host=e['lab-questions'].children[i];const form=host.children.find(n=>n.tagName==='FORM');
 const radios=form.querySelectorAll('input');
 for(const r of radios)r.checked=false;
 radios[answer].checked=true;
 fire(form,'submit');
 return host.children.at(-1).textContent;
}
test('14 defensively scoped lessons contain 28 explained questions and concrete evidence',()=>{
 assert.equal(db.schema,'secure-t.observatorio.labs.v1');assert.equal(db.lessons.length,14);
 assert.equal(new Set(db.lessons.map(x=>x.id)).size,14);
 for(const l of db.lessons){
  assert.equal(l.points.length,3);assert.equal(l.sample.length,2);assert.equal(l.questions.length,2);
  for(const q of l.questions){assert.equal(q.length,4);assert.equal(q[1].length,3);assert.ok([0,1,2].includes(q[2]));assert.ok(q[3].length>35);}
  assert.ok(l.notesPrompt.length>60);
 }
});
test('boot builds 14 lesson buttons, sample events and requires correct answers',()=>{
 const{e}=load();
 assert.equal(e['labs-list'].children.length,14);
 assert.equal(e['labs-total'].textContent,'0 / 14 completados');
 assert.equal(e['lab-questions'].children.length,2);
 assert.match(e['lab-events'].textContent,/198\.51\.100/);
 assert.match(answer(e,0,0),/no sostenida/i);
 assert.match(answer(e,0,1),/Correcto/);
 assert.match(answer(e,1,1),/Correcto/);
 assert.match(e['lab-check-status'].textContent,/2\/2/);
});
test('journal requires decisions, 120 characters and ethical scope confirmation',()=>{
 const{e,storage}=load();
 e['lab-notes'].value='Hechos con registro ficticio, no podemos atribuir una acción a una persona. El paso siguiente requiere permiso y más evidencia contextual para validar la observación.';
 fire(e['lab-journal-form'],'submit');
 assert.match(e['lab-journal-status'].textContent,/Primero comprueba/);
 answer(e,0,1);answer(e,1,1);
 e['lab-notes'].value='poco';fire(e['lab-notes'],'input');e['lab-confirm'].checked=true;fire(e['lab-journal-form'],'submit');
 assert.match(e['lab-journal-status'].textContent,/120 caracteres/);
 e['lab-notes'].value='Observo un acceso correcto después de un intento fallido en el registro simulado. Desconozco identidad y MFA; contrastaría la sesión con un supervisor autorizado y conservaría la evidencia.';
 fire(e['lab-notes'],'input');e['lab-confirm'].checked=false;fire(e['lab-journal-form'],'submit');
 assert.match(e['lab-journal-status'].textContent,/Debes confirmar/);
 e['lab-confirm'].checked=true;fire(e['lab-journal-form'],'submit');
 assert.equal(e['labs-total'].textContent,'1 / 14 completados');
 assert.equal(JSON.parse(storage['secure-t.observatorio.labs.v1']).cases.soc.complete,true);
 e['lab-notes'].value+=' Anotación de revisión.';fire(e['lab-notes'],'input');
 assert.equal(e['labs-total'].textContent,'0 / 14 completados');
});
test('URL query selects only allowlisted lessons and notes survive reload',()=>{
 const{e,storage}=load({},'?topic=ai');
 assert.match(e['lab-title'].textContent,/IA/);
 e['lab-notes'].value='Texto de práctica sintética';fire(e['lab-notes'],'input');
 const more=load(storage,'?topic=ai');
 assert.equal(more.e['lab-notes'].value,'Texto de práctica sintética');
 const wrong=load(storage,'?topic=__proto__');
 assert.match(wrong.e['lab-title'].textContent,/SOC/);
});
test('forged import state cannot mark a lesson complete without length and answers',()=>{
 const crafted=JSON.stringify({schema:db.schema,cases:{soc:{answers:[false,true],notes:'no',complete:true},unknown:{answers:[true,true],notes:'x'.repeat(200),complete:true}}});
 const{e}=load({'secure-t.observatorio.labs.v1':crafted});
 assert.equal(e['labs-total'].textContent,'0 / 14 completados');
});
test('CSP denies connections and dynamic renderer avoids HTML interpolation',()=>{
 assert.match(html,/connect-src 'none'/);
 assert.match(html,/form-action 'none'/);
 assert.doesNotMatch(code,/\.innerHTML\s*=|\beval\s*\(|\bfetch\s*\(/);
 new Function(code);
});
