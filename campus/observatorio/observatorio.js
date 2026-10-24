/* Secure T Observatorio: curated static knowledge base; no network, eval or telemetry. */
(() => {
'use strict';
const d=window.SecureTObservatorioData;
if(!d || d.schema!=='secure-t.observatorio.v1'||d.tracks.length!==14||d.sources.length!==33||d.tools.length!==40){
 document.body.textContent='No se pudo cargar el índice editorial.';return;
}
const $=id=>document.getElementById(id);
const KEY='secure-t.observatorio.v1';
const sections=['rutas','herramientas','biblioteca','actualidad','mi-plan'];
const domains=['all',...new Set(d.tracks.map(x=>x.domain).concat(d.sources.map(x=>x.domain)))];
const trackIDs=new Set(d.tracks.map(x=>x.id));
const allowedFavorites=new Set([...d.tracks.map(x=>'route:'+x.id),...d.tools.map(x=>'tool:'+x.id),...d.sources.map(x=>'src:'+x.id),...d.news.map(x=>'news:'+x.id)]);
const modIDs=new Set(d.tracks.flatMap(x=>x.modules.map(m=>x.id+':'+m.order)));
const fresh=()=>({schema:d.schema,done:[],favorites:[]});
function sanitize(x){
 const raw=x&&typeof x==='object'&&!Array.isArray(x)?x:{};
 return {schema:d.schema,done:Array.isArray(raw.done)?[...new Set(raw.done.filter(y=>typeof y==='string'&&modIDs.has(y)))]:[],favorites:Array.isArray(raw.favorites)?[...new Set(raw.favorites.filter(y=>typeof y==='string'&&allowedFavorites.has(y)))]:[]};
}
let state=fresh();
try {const text=localStorage.getItem(KEY);if(text&&text.length<55000)state=sanitize(JSON.parse(text));}catch(_){}
let current='rutas',selectedRoute=null;
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
const status=text=>$('app-status').textContent=text;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){status('No fue posible guardar en este navegador. Usa exportar si quieres conservar el progreso.');}}
function fav(id){return state.favorites.includes(id);}
function toggleFav(id){if(!allowedFavorites.has(id))return;state.favorites=fav(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();renderAll();}
function bookmark(id){
 const b=el('button','bookmark',fav(id)?'★ Guardado':'☆ Guardar');b.type='button';
 b.setAttribute('aria-label',(fav(id)?'Quitar de guardados: ':'Guardar en mis recursos: ')+id);
 b.setAttribute('aria-pressed',String(fav(id)));b.addEventListener('click',()=>toggleFav(id));return b;
}
function anchor(href,caption,cls){const a=el('a',cls||'',caption);a.href=href;a.target='_blank';a.rel='noopener noreferrer';return a;}
function cardShell(tag){return el(tag,'card');}
function filtersMatch(text,domain,resourceKey){const q=$('search').value.trim().toLocaleLowerCase('es');const filter=$('domain-filter').value;const only=$('saved-only').checked;return (!q||text.toLocaleLowerCase('es').includes(q))&&(filter==='all'||domain===filter)&&(!only||fav(resourceKey));}
function countIndicator(kind,count){const empty=$(kind+'-empty');if(empty)empty.hidden=count>0;return count;}
function trackProgress(t){return t.modules.filter(m=>state.done.includes(t.id+':'+m.order)).length;}
function renderTracks(){
 const grid=$('rutas-grid');grid.replaceChildren();let n=0;
 for(const t of d.tracks){
  if(!filtersMatch(t.name+' '+t.domain+' '+t.level+' '+t.role+' '+t.outcome+' '+t.modules.map(m=>m.title+' '+m.goal).join(' '),t.domain,'route:'+t.id))continue;
  n++;const c=cardShell('article');
  const meta=el('div','card-meta');meta.append(el('span','',t.domain.toUpperCase()),el('span','badge',t.level));
  const name=el('h3','',t.name),desc=el('p','',t.outcome);
  const footer=el('div','card-footer'),open=el('button','', 'Explorar ruta ↗');open.type='button';open.addEventListener('click',()=>openRoute(t.id));
  footer.append(open,bookmark('route:'+t.id));c.append(meta,name,desc,el('span','tag',trackProgress(t)+'/4 módulos revisados'),footer);grid.append(c);
 }
 countIndicator('rutas',n);return n;
}
function openRoute(id){
 const t=d.tracks.find(x=>x.id===id);if(!t)return;
 selectedRoute=id;showSection('rutas',false);
 $('rutas-grid').hidden=true;$('rutas-empty').hidden=true;$('route-detail').hidden=false;
 $('route-code').textContent='RUTA / '+t.domain.toUpperCase()+' · 4 MÓDULOS';
 $('route-title').textContent=t.name;$('route-outcome').textContent=t.outcome;
 $('route-role').textContent='Rol de referencia: '+t.role;$('route-level').textContent=t.level;
 $('route-completion').textContent=trackProgress(t)+'/4 revisados';
 const holder=$('route-modules');holder.replaceChildren();
 for(const m of t.modules){
  const block=el('article','module');const id=t.id+':'+m.order;
  block.append(el('span','overline','MÓDULO 0'+m.order),el('h4','',m.title),el('p','',m.goal),el('p','output','Evidencia a producir: '+m.evidence));
  const label=el('label');const checkbox=el('input');checkbox.type='checkbox';checkbox.checked=state.done.includes(id);
  checkbox.addEventListener('change',()=>{state.done=checkbox.checked?[...new Set([...state.done,id])]:state.done.filter(x=>x!==id);save();$('route-completion').textContent=trackProgress(t)+'/4 revisados';updateStats();});
  label.append(checkbox,el('span','','He estudiado el módulo (autodeclaración local)'));block.append(label);holder.append(block);
 }
 const links=$('route-course-link');links.replaceChildren();
 if(t.course){const a=el('a','','Ir al curso base del campus →');a.href='../cursos/'+encodeURIComponent(t.course)+'/index.html';links.append(a);}
 $('route-title').setAttribute('tabindex','-1');$('route-title').focus({preventScroll:false});
}
function closeRoute(){selectedRoute=null;$('route-detail').hidden=true;$('rutas-grid').hidden=false;renderTracks();$('h-rutas').focus({preventScroll:true});}
function renderTools(){
 const grid=$('herramientas-grid');grid.replaceChildren();let n=0;
 for(const t of d.tools){
  if(!filtersMatch(t.name+' '+t.purpose+' '+t.domain+' '+t.scope,t.domain,'tool:'+t.id))continue;n++;
  const c=cardShell('article'),meta=el('div','card-meta');meta.append(el('span','',t.domain.toUpperCase()),el('span','tag','RECURSO EXTERNO'));
  const footer=el('div','card-footer');footer.append(anchor(t.url,'Sitio del proyecto ↗'),bookmark('tool:'+t.id));
  c.append(meta,el('h3','',t.name),el('p','',t.purpose+' · Úsalo solo sobre equipos propios, datos ficticios o dentro de permisos explícitos.'),footer);grid.append(c);
 }
 countIndicator('herramientas',n);return n;
}
function renderSources(){
 const grid=$('biblioteca-grid');grid.replaceChildren();let n=0;
 for(const s of d.sources){
  if(!filtersMatch(s.name+' '+s.publisher+' '+s.domain+' '+s.type,s.domain,'src:'+s.id))continue;n++;
  const c=cardShell('article'),meta=el('div','card-meta');meta.append(el('span','',s.publisher),el('span','tag',s.type));
  const footer=el('div','card-footer');footer.append(anchor(s.url,'Fuente primaria ↗'),bookmark('src:'+s.id));
  c.append(meta,el('h3','',s.name),el('p','',s.domain+' · Enlace editorial a la organización que publica o mantiene la documentación.'),footer);grid.append(c);
 }
 countIndicator('biblioteca',n);return n;
}
function renderNews(){
 const grid=$('actualidad-grid');grid.replaceChildren();let n=0;
 for(const v of d.news){
  if(!filtersMatch(v.title+' '+v.publisher+' '+v.domain+' '+v.summary,v.domain,'news:'+v.id))continue;n++;
  const item=el('article','news-item'),line=el('div','card-meta');
  const time=el('time','',v.date);time.dateTime=v.date;line.append(time,el('span','tag',v.publisher));
  const footer=el('div','card-footer');footer.append(anchor(v.url,'Leer publicación original ↗'),bookmark('news:'+v.id));
  item.append(line,el('h3','',v.title),el('p','',v.summary),footer);grid.append(item);
 }
 const watch=$('watch-grid');if(!watch.childElementCount){for(const v of d.monitor){const a=anchor(v.url,v.name,'');a.append(el('small','',v.check+' · revisión manual'));watch.append(a);}}
 countIndicator('actualidad',n);return n;
}
function renderPlan(){
 const routes=$('plan-routes'),resources=$('plan-resources');routes.replaceChildren();resources.replaceChildren();
 let have=0;for(const t of d.tracks){const count=trackProgress(t);if(count||fav('route:'+t.id)){have++;const item=el('p','',t.name+' · '+count+'/4 módulos');routes.append(item);}}
 if(!have)routes.append(el('p','','No hay rutas guardadas ni módulos revisados.'));
 let saved=0;for(const key of state.favorites){if(key.startsWith('route:'))continue;
  const id=key.slice(key.indexOf(':')+1);
  const obj=d.tools.find(x=>x.id===id)||d.sources.find(x=>x.id===id)||d.news.find(x=>x.id===id);
  if(!obj)continue;saved++;resources.append(el('p','',obj.name||obj.title));
 }
 if(!saved)resources.append(el('p','','Marca ☆ Guardar en recursos para crear tu biblioteca personal.'));
}
function updateStats(){
 $('stat-progress').textContent=state.done.length+'/56';$('count-done').textContent=String(state.done.length);
}
function renderAll(){
 const counts={rutas:renderTracks(),herramientas:renderTools(),biblioteca:renderSources(),actualidad:renderNews()};
 renderPlan();updateStats();
 if(selectedRoute)openRoute(selectedRoute);
 const label=current==='mi-plan'?'Tus preferencias guardadas':counts[current]+' resultados visibles';
 $('result-count').textContent=label+'. '+(current==='actualidad'?'Instantánea editorial, no feed en directo.':'');
}
function showSection(name,clear=true){
 if(!sections.includes(name))return;
 if(clear&&selectedRoute)closeRoute();
 current=name;
 for(const key of sections)$('section-'+key).hidden=key!==name;
 document.querySelectorAll('[data-section]').forEach(b=>{const active=b.dataset.section===name;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
 $('breadcrumb').textContent='SECURE T / '+name.toUpperCase();
 if(name==='mi-plan')renderPlan();else if(name==='actualidad')renderNews();
 renderAll();
 if(clear)$('h-'+name).focus({preventScroll:true});
}
function exportState(){
 const payload=JSON.stringify({...state,exportedAt:new Date().toISOString(),notice:'Progreso autoevaluado, no certificación.'},null,2);
 const url=URL.createObjectURL(new Blob([payload],{type:'application/json'})),a=el('a');
 a.href=url;a.download='secure-t-observatorio-progreso.json';document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);status('Archivo JSON preparado en este dispositivo, sin transmisión externa.');
}
async function importState(event){
 const file=event.target.files&&event.target.files[0];event.target.value='';
 if(!file)return;
 if(file.size>55000){status('Archivo rechazado: límite de 55 KB.');return;}
 try{const raw=JSON.parse(await file.text());if(!raw||raw.schema!==d.schema||!Array.isArray(raw.done)||!Array.isArray(raw.favorites))throw Error('schema');
  state=sanitize(raw);save();renderAll();status('Datos importados. Los campos y códigos desconocidos se descartaron.');}
 catch(_){status('Importación cancelada: archivo inválido o versión no compatible.');}
}
function reset(){
 if(!window.confirm('¿Borrar todos los módulos revisados y recursos guardados de este navegador?'))return;
 state=fresh();save();renderAll();status('Progreso local reiniciado.');
}
for(const value of domains){if(value==='all')continue;const o=el('option','',value);o.value=value;$('domain-filter').append(o);}
document.querySelectorAll('[data-section]').forEach(b=>b.addEventListener('click',()=>showSection(b.dataset.section)));
$('search').addEventListener('input',()=>{if(selectedRoute)closeRoute();renderAll();});
$('domain-filter').addEventListener('change',()=>{if(selectedRoute)closeRoute();renderAll();});
$('saved-only').addEventListener('change',()=>{if(selectedRoute)closeRoute();renderAll();});
$('clear-filters').addEventListener('click',()=>{$('search').value='';$('domain-filter').value='all';$('saved-only').checked=false;if(selectedRoute)closeRoute();renderAll();$('search').focus();});
$('route-close').addEventListener('click',closeRoute);
$('export-progress').addEventListener('click',exportState);
$('import-progress').addEventListener('click',()=>$('import-file').click());
$('import-file').addEventListener('change',importState);
$('reset-progress').addEventListener('click',reset);
document.addEventListener('keydown',event=>{
 if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();$('search').focus();}
 if(event.key==='Escape' && selectedRoute){closeRoute();}
});
renderAll();showSection('rutas');
})();