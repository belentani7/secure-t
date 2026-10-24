'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..','campus','observatorio');
const source=n=>fs.readFileSync(path.join(root,n),'utf8');
const html=source('index.html'),script=source('observatorio.js'),data=source('data.js');
const moduleSandbox={window:{}};vm.runInNewContext(data,moduleSandbox);
const d=moduleSandbox.window.SecureTObservatorioData;
class Mock{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.textContent='';this.value='';this.checked=false;this.hidden=false;this.children=[];this.listeners={};this.attrs={};this.dataset={};this.style={};this.classList={toggle(){}};}
 append(...parts){this.children.push(...parts);}replaceChildren(...parts){this.children=[...parts];}
 addEventListener(type,fn){this.listeners[type]=fn;}setAttribute(name,value){this.attrs[name]=value;}
 focus(){}click(){this.listeners.click?.({preventDefault(){},target:this});}remove(){}
 get childElementCount(){return this.children.length;}
}
function start(initial={}){
 const elements=Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>[x[1],new Mock()]));
 elements['domain-filter'].value='all';
 const nav=['rutas','herramientas','biblioteca','actualidad','mi-plan'].map(name=>{const n=new Mock('button');n.dataset.section=name;return n;});
 const document={body:new Mock('body'),getElementById:id=>{assert.ok(elements[id],'Missing ID '+id);return elements[id];},
  createElement:tag=>new Mock(tag),querySelectorAll:selector=>selector==='[data-section]'?nav:[],addEventListener(){}};
 const storage={...initial};
 const localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>{storage[k]=v;}};
 const window={SecureTObservatorioData:d,confirm:()=>true};
 const URL={createObjectURL:()=> 'blob:test',revokeObjectURL(){}};
 vm.runInNewContext(script,{window,document,localStorage,URL,Blob,Date,Set,Map,Number,Math,setTimeout:fn=>fn()});
 return {e:elements,nav,storage};
}
const trigger=(node,event='click')=>{
 assert.equal(typeof node.listeners[event],'function','Missing '+event+' handler');
 node.listeners[event]({target:node,preventDefault(){}});
};
test('canonical dataset: 14 routes / 56 modules, 40 tools, 33 references, 6 dated sources',()=>{
 assert.equal(d.schema,'secure-t.observatorio.v1');
 assert.equal(d.tracks.length,14);assert.equal(d.tracks.flatMap(x=>x.modules).length,56);
 assert.equal(d.tools.length,40);assert.equal(d.sources.length,33);assert.equal(d.news.length,6);
 for(const t of d.tracks){assert.equal(t.modules.length,4);
  for(const m of t.modules)assert.ok(m.title&&m.goal&&m.evidence);
 }
 for(const kind of ['tracks','tools','sources','news'])assert.equal(new Set(d[kind].map(x=>x.id)).size,d[kind].length);
 for(const n of d.news){
  assert.ok(/^\d{4}-\d\d-\d\d$/.test(n.date)&&n.date<=d.edition);
  assert.match(n.url,/^https:\/\//);
 }
 for(const res of [...d.sources,...d.tools])assert.match(res.url,/^https:\/\//);
});
test('page enforces no-connect CSP and scripts avoid unsafe HTML sinks',()=>{
 assert.match(html,/connect-src 'none'/);
 assert.match(html,/lang="es"/);
 assert.match(html,/label for="search"/);
 assert.match(html,/role="status"/);
 assert.doesNotMatch(script,/\b(?:eval|fetch|WebSocket|sendBeacon)\s*\(|\.innerHTML\s*=/);
 new Function(script);
});
test('initial rendering and every navigation section have complete result sets',()=>{
 const {e,nav}=start();
 assert.equal(e['rutas-grid'].children.length,14);
 assert.equal(e['stat-progress'].textContent,'0/56');
 trigger(nav[1]);assert.equal(e['herramientas-grid'].children.length,40);
 trigger(nav[2]);assert.equal(e['biblioteca-grid'].children.length,33);
 trigger(nav[3]);assert.equal(e['actualidad-grid'].children.length,6);
 assert.equal(e['watch-grid'].children.length,8);
 trigger(nav[4]);assert.ok(e['section-mi-plan'].hidden===false);
});
test('search across routes, reset filter and structured learning progress',()=>{
 const {e,storage}=start();
 e.search.value='NIS2';trigger(e.search,'input');
 assert.equal(e['rutas-grid'].children.length,1);
 trigger(e['clear-filters']);
 assert.equal(e['rutas-grid'].children.length,14);
 const first=e['rutas-grid'].children[0];
 trigger(first.children.at(-1).children[0]);
 assert.equal(e['route-detail'].hidden,false);
 assert.equal(e['route-modules'].children.length,4);
 const checkbox=e['route-modules'].children[0].children.at(-1).children[0];
 checkbox.checked=true;trigger(checkbox,'change');
 assert.equal(e['stat-progress'].textContent,'1/56');
 const saved=JSON.parse(storage['secure-t.observatorio.v1']);
 assert.deepEqual(saved.done,['soc:1']);
 trigger(e['route-close']);assert.equal(e['route-detail'].hidden,true);
});
test('saving a route filters to favorites and clear resets all',()=>{
 const {e}=start();
 const button=e['rutas-grid'].children[0].children.at(-1).children.at(-1);
 trigger(button);
 e['saved-only'].checked=true;trigger(e['saved-only'],'change');
 assert.equal(e['rutas-grid'].children.length,1);
 trigger(e['reset-progress']);
 assert.equal(e['rutas-grid'].children.length,0);
 trigger(e['clear-filters']);
 assert.equal(e['rutas-grid'].children.length,14);
});
test('invalid or forged saved state is normalized; no unknown modules or bookmarks count',()=>{
 const forged=JSON.stringify({schema:d.schema,done:['soc:1','soc:1','unknown:999'],favorites:['route:soc','evil','route:soc'],__proto__: {admin:true}});
 const {e,storage}=start({'secure-t.observatorio.v1':forged});
 assert.equal(e['stat-progress'].textContent,'1/56');
 trigger(e['reset-progress']);
 const newState=JSON.parse(storage['secure-t.observatorio.v1']);
 assert.equal(newState.done.length,0);assert.equal(newState.favorites.length,0);
});

test('linked educational workspaces show strictly local, validated completion counts',()=>{
 const notes='Documentación de práctica sintética con hechos, limitaciones y comprobación autorizada.'.repeat(2);
 const lab={schema:'secure-t.observatorio.labs.v1',cases:{soc:{answers:[true,true],notes,complete:true},dfir:{answers:[false,true],notes,complete:true}}};
 const mission={schema:'secure-t.mission-control.v1',cases:{auth:{cursor:4,correct:[true,true,true,true],documented:true,notes:{facts:notes,uncertainty:notes,action:notes}},mail:{cursor:4,correct:[true,false,true,true],documented:true,notes:{facts:notes,uncertainty:notes,action:notes}}}};
 const {e,nav}=start({'secure-t.observatorio.labs.v1':JSON.stringify(lab),'secure-t.mission-control.v1':JSON.stringify(mission)});
 trigger(nav[4]);
 assert.match(e['plan-labs'].children[0].textContent,/1\/14/);
 assert.match(e['plan-mission'].children[0].textContent,/1\/6/);
 assert.equal(e['plan-labs'].children[1].tagName,'A');
 assert.equal(e['plan-mission'].children[1].tagName,'A');
});
