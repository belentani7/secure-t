import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const slugs=['ciber-ofensiva','ciber-defensiva','ia-aplicada-segura','gobernanza-compliance'];
function player(slug,stored='{}'){
  const html=readFileSync(new URL('../campus/cursos/'+slug+'/index.html',import.meta.url),'utf8');
  const start=html.indexOf('const QUIZ =');
  const end=html.indexOf('// nav activa',start);
  assert.ok(start>=0&&end>start,'real published quiz script must exist');
  const nodes={};
  function element(){return {textContent:'',hidden:false,disabled:false,children:[],dataset:{},
    style:{},classList:{add(){}},set innerHTML(value){this.children=[];},
    appendChild(node){this.children.push(node);},after(node){nodes.retry=node;},remove(){}};}
  for(const id of ['q-titulo','q-opciones','q-feedback','q-marcador','q-next'])nodes[id]=element();
  const storage=new Map([['stt-progreso',stored]]);
  const context={document:{getElementById:id=>nodes[id],createElement:element},
    localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}};
  vm.runInNewContext(html.slice(start,end)+'\nglobalThis.count=QUIZ.length;',context);
  return {nodes,storage,count:context.count,
    choose(correct=true){const options=nodes['q-opciones'].children;
      const first=options.find(b=>Number(b.dataset.i)===(correct?1:0))||options[0];first.onclick();},
    next(){nodes['q-next'].onclick();}};
}

for(const slug of slugs){
  test(slug+': hidden Next cannot skip an unanswered question',()=>{
    const p=player(slug);const title=p.nodes['q-titulo'].textContent;
    p.next();assert.equal(p.nodes['q-titulo'].textContent,title);
  });
  test(slug+': repeated choice events count only one answer and final Next stays closed',()=>{
    const p=player(slug);
    for(let i=0;i<p.count;i++){
      const button=p.nodes['q-opciones'].children[0];button.onclick();
      const score=p.nodes['q-marcador'].textContent;button.onclick();
      assert.equal(p.nodes['q-marcador'].textContent,score);p.next();
    }
    const title=p.nodes['q-titulo'].textContent;p.next();
    assert.equal(p.nodes['q-titulo'].textContent,title);
    assert.equal(p.nodes['q-next'].hidden,true);
    p.nodes.retry.onclick();assert.match(p.nodes['q-titulo'].textContent,/^1\//);
  });
  test(slug+': completion retains questions and correction for review',()=>{
    const p=player(slug);
    for(let i=0;i<p.count;i++){p.choose(false);p.next();}
    assert.match(p.nodes['q-feedback'].textContent,/Repaso de respuestas/);
    assert.match(p.nodes['q-feedback'].textContent,/Respuesta correcta:/);
  });
}

for(const slug of slugs) test(slug+': detached choices cannot submit a later question',()=>{
  const p=player(slug);const old=p.nodes['q-opciones'].children[0];
  old.onclick();p.next();const feedback=p.nodes['q-feedback'].textContent;
  old.onclick();assert.equal(p.nodes['q-feedback'].textContent,feedback);
  assert.equal(p.nodes['q-next'].hidden,true);
});
