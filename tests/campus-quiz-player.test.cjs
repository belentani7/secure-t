const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const {runInNewContext} = require('node:vm');

const source = readFileSync(join(__dirname,'../campus/app.js'),'utf8');
const start = source.indexOf('const $ =');
const end = source.indexOf('// stagger sutil',start);
assert.ok(start >= 0 && end > start, 'Quiz loader can be exercised independently');
const quizSource = source.slice(start,end);
const url = 'cursos/ciber-ofensiva/quiz.json';
const questions = [
  {pregunta:'¿Cuál es el primer paso?',opciones:['Pedir autorización','Atacar'],correcta:0,explicacion:'El alcance debe estar autorizado.'},
  {pregunta:'¿Qué demuestra un hallazgo?',opciones:['Rumores','Evidencias'],correcta:1,explicacion:'Documentar la evidencia importa.'}
];
function element(){
  return {textContent:'',hidden:false,disabled:false,children:[],handlers:{},
    classList:{add(){}},
    replaceChildren(){this.children=[]},
    append(node){this.children.push(node)},
    addEventListener(name,handler){this.handlers[name]=handler}};
}
function browser(fetchImpl){
  const parts=Object.fromEntries(['.quiz-titulo','.opciones','.feedback','.marcador','.quiz-siguiente'].map(k=>[k,element()]));
  const box={querySelector(name){return parts[name]}};
  const document={querySelector(name){return name==='.quiz-box'?box:null},createElement(){return element()}};
  const context={document,fetch:fetchImpl,AbortController};
  runInNewContext(quizSource,context);
  return {parts,load:(path=url)=>runInNewContext('loadQuiz('+JSON.stringify(path)+')',context)};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));

test('quiz does not skip unanswered questions or count repeated clicks',async()=>{
  const b=browser(async()=>({ok:true,json:async()=>questions}));
  b.load();await flush();
  const next=b.parts['.quiz-siguiente'];
  assert.equal(next.hidden,true);
  next.onclick();
  assert.match(b.parts['.quiz-titulo'].textContent,/1\/2/);
  const firstClick=b.parts['.opciones'].children[0].handlers.click;
  firstClick();firstClick();
  assert.match(b.parts['.marcador'].textContent,/Aciertos: 1/);
  next.onclick();
  firstClick();
  assert.match(b.parts['.quiz-titulo'].textContent,/2\/2/);
  assert.match(b.parts['.marcador'].textContent,/Aciertos: 1/);
  b.parts['.opciones'].children[0].handlers.click();
  assert.match(b.parts['.feedback'].textContent,/Respuesta correcta: Evidencias/);
  next.onclick();
  assert.match(b.parts['.quiz-titulo'].textContent,/Práctica finalizada: 1\/2/);
  assert.match(b.parts['.marcador'].textContent,/50%/);
  assert.equal(next.hidden,true);
});

test('unapproved URLs cannot trigger fetch',()=>{
  let calls=0;const b=browser(async()=>{calls++;return {ok:true,json:async()=>questions}});
  for(const path of ['https://other.test/quiz.json','../credentials','cursos/unknown/quiz.json']) {
    b.load(path);
    assert.match(b.parts['.quiz-titulo'].textContent,/no disponible/);
    assert.equal(b.parts['.opciones'].children.length,0);
  }
  assert.equal(calls,0);
});

test('malformed payloads and HTTP failures show a safe empty state',async()=>{
  for(const fetchImpl of [
    async()=>({ok:true,json:async()=>[{pregunta:'Bad',opciones:[],correcta:12,explicacion:''}]}),
    async()=>({ok:false,status:500})
  ]){
    const b=browser(fetchImpl);b.load();await flush();
    assert.match(b.parts['.quiz-titulo'].textContent,/No se pudo cargar/);
    assert.equal(b.parts['.opciones'].children.length,0);
    assert.equal(b.parts['.quiz-siguiente'].hidden,true);
  }
});

test('late responses cannot overwrite the current course',async()=>{
  const pending=[];
  const b=browser((path,{signal})=>new Promise(resolve=>pending.push({signal,resolve})));
  b.load();b.load('cursos/ciber-defensiva/quiz.json');
  assert.equal(pending[0].signal.aborted,true);
  pending[1].resolve({ok:true,json:async()=>questions});await flush();
  pending[0].resolve({ok:true,json:async()=>[{...questions[0],pregunta:'OLD QUIZ'}]});await flush();
  assert.match(b.parts['.quiz-titulo'].textContent,/primer paso/);
  assert.doesNotMatch(b.parts['.quiz-titulo'].textContent,/OLD QUIZ/);
});

test('campus quiz is announced accessibly and action is not a submit button',()=>{
  const html=readFileSync(join(__dirname,'../campus/index.html'),'utf8');
  assert.match(html,/class="feedback" aria-live="polite"/);
  assert.match(html,/class="btn quiz-siguiente" type="button"/);
});
