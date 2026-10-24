/* Secure T Labs — purely local defensive learning, without remote execution. */
(()=>{
'use strict';
const db=window.SecureTObservatoryLabs;
if(!db||db.schema!=='secure-t.observatorio.labs.v1'||db.lessons.length!==14){
 document.body.textContent='No se han cargado los laboratorios de Secure T.';return;
}
const $=id=>document.getElementById(id);
const KEY='secure-t.observatorio.labs.v1';
const cases=new Map(db.lessons.map(x=>[x.id,x]));
const empty=()=>({answers:[false,false],notes:'',complete:false});
const sanitize=raw=>{
 const v=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const result={schema:db.schema,cases:Object.create(null)};
 for(const lesson of db.lessons){
  const r=v.cases&&typeof v.cases==='object'&&!Array.isArray(v.cases)&&v.cases[lesson.id]&&typeof v.cases[lesson.id]==='object'?v.cases[lesson.id]:{};
  const answers=Array.isArray(r.answers)&&r.answers.length===2?r.answers.map(x=>x===true):[false,false];
  const notes=typeof r.notes==='string'?r.notes.slice(0,3000):'';
  const complete=r.complete===true&&answers.every(Boolean)&&notes.trim().length>=120;
  result.cases[lesson.id]={answers,notes,complete};
 }
 return result;
};
let state=sanitize(null);
try{const saved=localStorage.getItem(KEY);if(saved&&saved.length<100000)state=sanitize(JSON.parse(saved));}catch(_){}
const create=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
const safeSave=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch(_){$('lab-global').textContent='No se pudo guardar localmente. Exporta el progreso antes de cerrar.';return false;}};
let current=db.lessons[0];
let dirty=false;
const record=()=>state.cases[current.id];
const completed=()=>db.lessons.filter(x=>state.cases[x.id].complete).length;
function stats(){
 $('labs-total').textContent=completed()+' / 14 completados';
 $('labs-bar').value=completed();
 $('lab-status').textContent=record().complete?'EJERCICIO COMPLETADO':'EN PROGRESO · NO ACREDITADO';
}
function renderMenu(){
 const menu=$('labs-list');menu.replaceChildren();
 const filter=$('labs-search').value.trim().toLocaleLowerCase('es');
 let found=0;
 for(const lesson of db.lessons){
  if(filter&&!(lesson.title+' '+lesson.id+' '+lesson.points.join(' ')).toLocaleLowerCase('es').includes(filter))continue;
  found++;
  const button=create('button','lab-side-button');button.type='button';
  if(lesson.id===current.id){button.classList.add('current');button.setAttribute('aria-current','true');}
  button.append(create('span','',lesson.title));
  button.append(create('small','',state.cases[lesson.id].complete?'✓ Revisado':'Practicar →'));
  button.addEventListener('click',()=>selectLesson(lesson.id));
  menu.append(button);
 }
 if(!found)menu.append(create('p','lab-empty','Sin coincidencias. Prueba otro concepto.'));
}
function setAnswerFeedback(index,text,pass){
 const n=$('lab-q-feedback-'+index);
 n.textContent=text;n.classList.toggle('good',pass===true);n.classList.toggle('bad',pass===false);
}
function renderQuestions(){
 const host=$('lab-questions');host.replaceChildren();
 current.questions.forEach((q,i)=>{
  const wrap=create('section','lab-question');
  wrap.append(create('p','lab-question-number','PREGUNTA 0'+(i+1)));
  wrap.append(create('h3','',q[0]));
  const form=create('form','lab-answer-form');form.setAttribute('aria-label','Pregunta '+(i+1));
  const fieldset=create('fieldset');const legend=create('legend','sr-only','Selecciona una respuesta');
  fieldset.append(legend);
  q[1].forEach((labelText,idx)=>{
   const label=create('label','lab-answer');
   const radio=create('input');radio.type='radio';radio.value=String(idx);radio.name='answer-'+i;radio.required=true;
   radio.disabled=record().answers[i];
   label.append(radio,create('span','',labelText));fieldset.append(label);
  });
  const action=create('button','lab-primary',record().answers[i]?'Respuesta revisada ✓':'Comprobar respuesta');action.type='submit';action.disabled=record().answers[i];
  form.append(fieldset,action);
  form.addEventListener('submit',event=>{
   event.preventDefault();
   if(record().answers[i])return;
   const selected=form.querySelector('input[type="radio"]:checked');
   if(!selected){setAnswerFeedback(i,'Elige una opción antes de comprobar.',false);return;}
   if(Number(selected.value)!==q[2]){
    setAnswerFeedback(i,'Respuesta no sostenida por los datos. '+q[3]+' Puedes intentarlo otra vez.',false);
    return;
   }
   record().answers[i]=true;record().complete=false;safeSave();
   setAnswerFeedback(i,'Correcto. '+q[3],true);
   form.querySelectorAll('input').forEach(r=>r.disabled=true);
   action.disabled=true;action.textContent='Respuesta revisada ✓';
   renderMenu();stats();message();
  });
  wrap.append(form);
  const feedback=create('p','lab-answer-feedback');feedback.id='lab-q-feedback-'+i;
  feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
  if(record().answers[i]){feedback.textContent='Respuesta revisada correctamente en este dispositivo. '+q[3];feedback.classList.add('good');}
  wrap.append(feedback);host.append(wrap);
 });
}
function message(){
 const n=record().answers.filter(Boolean).length;
 $('lab-check-status').textContent=n+'/2 respuestas razonadas. '+(n===2?'Escribe tu reflexión para completar el ejercicio.':'Todavía quedan preguntas.');
}
function selectLesson(id){
 const lesson=cases.get(id);if(!lesson)return;
 current=lesson;dirty=false;
 $('lab-title').textContent=lesson.title;
 $('lab-meta').textContent=lesson.level+' · '+lesson.durationMinutes+' min orientativos · Dos preguntas + un cuaderno';
 $('lab-path').textContent='/training/'+id+'.log';
 const points=$('lab-principles');points.replaceChildren();
 lesson.points.forEach(p=>points.append(create('li','',p)));
 $('lab-events').textContent=lesson.sample.join('\n');
 $('lab-prompt').textContent=lesson.notesPrompt;
 $('lab-notes').value=record().notes;
 $('lab-confirm').checked=false;
 $('lab-charcount').textContent=record().notes.length+' / 3000 caracteres';
 $('lab-journal-status').textContent=record().complete?'Completado localmente. Puedes revisar el cuaderno; los cambios requieren nueva confirmación.':'Sin enviar contenido a servidores. Los apuntes se guardan en este navegador.';
 renderQuestions();message();stats();renderMenu();
 $('lab-title').focus({preventScroll:true});
}
function saveDraft(){
 const notes=$('lab-notes').value.slice(0,3000);
 $('lab-charcount').textContent=notes.length+' / 3000 caracteres';
 if(record().notes!==notes){
  record().notes=notes;
  if(record().complete){record().complete=false;stats();renderMenu();}
  dirty=true;safeSave();
 }
}
function finish(event){
 event.preventDefault();saveDraft();
 if(!record().answers.every(Boolean)){
  $('lab-journal-status').textContent='Primero comprueba las dos decisiones comentadas.';return;
 }
 if(record().notes.trim().length<120){
  $('lab-journal-status').textContent='Faltan observaciones: escribe al menos 120 caracteres y separa hechos de hipótesis.';return;
 }
 if(!$('lab-confirm').checked){
  $('lab-journal-status').textContent='Debes confirmar el uso exclusivo de información ficticia y el alcance autorizado.';return;
 }
 record().complete=true;dirty=false;safeSave();stats();renderMenu();
 $('lab-journal-status').textContent='Ejercicio autoevaluado y cuaderno guardado. No se ha validado la calidad del texto ni emitido acreditación.';
}
function next(){
 const index=db.lessons.findIndex(x=>x.id===current.id);
 const id=db.lessons[(index+1)%db.lessons.length].id;
 selectLesson(id);
 $('lab-title').scrollIntoView({block:'start',behavior:'instant'});
}
function exportData(){
 saveDraft();
 const text=JSON.stringify({schema:db.schema,exportedAt:new Date().toISOString(),cases:state.cases,notice:'Autoevaluación educativa: no constituye título ni expediente académico.'},null,2);
 const u=URL.createObjectURL(new Blob([text],{type:'application/json'}));
 const a=create('a');a.href=u;a.download='secure-t-labs-cuaderno.json';
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);
 $('lab-global').textContent='Cuaderno exportado como JSON en este dispositivo.';
}
async function importFile(event){
 const f=event.target.files&&event.target.files[0];event.target.value='';
 if(!f)return;
 if(f.size>100000){$('lab-global').textContent='Archivo rechazado: máximo 100 KB.';return;}
 try{
  const raw=JSON.parse(await f.text());
  if(!raw||raw.schema!==db.schema||!raw.cases||typeof raw.cases!=='object'||Array.isArray(raw.cases))throw Error('schema');
  state=sanitize(raw);safeSave();selectLesson(current.id);$('lab-global').textContent='Datos importados y normalizados. Se han descartado identificadores ajenos al esquema.';
 }catch(_){$('lab-global').textContent='No importado: JSON inválido o esquema incompatible.';}
}
function reset(){
 if(!window.confirm('¿Borrar los 14 cuadernos y respuestas de este navegador? Exporta antes si quieres conservarlos.'))return;
 state=sanitize(null);safeSave();selectLesson(db.lessons[0].id);$('lab-global').textContent='Se reiniciaron las prácticas locales.';
}
$('labs-search').addEventListener('input',renderMenu);
$('lab-notes').addEventListener('input',saveDraft);
$('lab-journal-form').addEventListener('submit',finish);
$('lab-next').addEventListener('click',next);
$('lab-export').addEventListener('click',exportData);
$('lab-import').addEventListener('click',()=>$('lab-file').click());
$('lab-file').addEventListener('change',importFile);
$('lab-reset').addEventListener('click',reset);
const query=new URLSearchParams(window.location.search);
const selected=query.get('topic');
selectLesson(cases.has(selected)?selected:db.lessons[0].id);
})();
