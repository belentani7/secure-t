/* Secure T Mission Control: local educational simulator. No network, shell, eval or telemetry. */
(() => {
  "use strict";
  const db = window.SecureTMissionControl;
  if (!db || db.schema !== "secure-t.mission-control.v1" || db.cases.length !== 6 || db.flashcards.length !== 48) {
    document.body.textContent = "Falta el banco de casos de Secure T.";
    return;
  }
  const $ = id => document.getElementById(id);
  const key = "secure-t.mission-control.v1";
  const day = 86400000;
  const today = () => Math.floor(Date.now() / day) * day;
  const byCase = new Map(db.cases.map(c => [c.id, c]));
  const cardById = new Map(db.flashcards.map(c => [c.id, c]));
  const noteFields = ["facts", "uncertainty", "action"];
  function safeText(x, limit) { return typeof x === "string" ? x.slice(0, limit) : ""; }
  function freshCase() { return {cursor:0,correct:[false,false,false,false],attempts:0,documented:false,notes:{facts:"",uncertainty:"",action:""}}; }
  function freshCard() { return {interval:0,reviews:0,dueAt:0,lastRating:-1}; }
  function sanitize(raw) {
    const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    const result = {schema:db.schema,cases:Object.create(null),cards:Object.create(null)};
    for (const c of db.cases) {
      const v = src.cases && typeof src.cases === "object" && src.cases[c.id] && typeof src.cases[c.id] === "object" ? src.cases[c.id] : {};
      const notes = Object.create(null);
      for (const field of noteFields) notes[field] = safeText(v.notes && v.notes[field], 2000);
      const correct = Array.isArray(v.correct) && v.correct.length === 4 ? v.correct.map(x => x === true) : [false,false,false,false];
      const cursor = Number.isInteger(v.cursor) && v.cursor >= 0 && v.cursor <= 4 ? v.cursor : 0;
      const validCursor = correct.slice(0,cursor).every(Boolean) ? cursor : correct.findIndex(x => !x) === -1 ? 4 : Math.max(0,correct.findIndex(x => !x));
      const documented = v.documented === true && noteFields.every(field => notes[field].trim().length >= 40);
      result.cases[c.id] = {cursor:validCursor,correct:correct.map((x,i) => i < validCursor && x),attempts:Number.isInteger(v.attempts) && v.attempts >= 0 && v.attempts <= 100000 ? v.attempts : 0,documented,notes};
    }
    for (const c of db.flashcards) {
      const v = src.cards && typeof src.cards === "object" && src.cards[c.id] && typeof src.cards[c.id] === "object" ? src.cards[c.id] : {};
      result.cards[c.id] = {
        interval:Number.isInteger(v.interval) && v.interval >= 0 && v.interval <= 365 ? v.interval : 0,
        reviews:Number.isInteger(v.reviews) && v.reviews >= 0 && v.reviews <= 100000 ? v.reviews : 0,
        dueAt:Number.isFinite(v.dueAt) && v.dueAt >= 0 && v.dueAt <= 4102444800000 ? Math.floor(v.dueAt / day) * day : 0,
        lastRating:Number.isInteger(v.lastRating) && v.lastRating >= 0 && v.lastRating <= 3 ? v.lastRating : -1
      };
    }
    return result;
  }
  function load() { try { const text = localStorage.getItem(key); return text && text.length <= 100000 ? sanitize(JSON.parse(text)) : sanitize(null); } catch(_) { return sanitize(null); } }
  let state = load();
  let currentCase = db.cases[0];
  let view = "cases";
  let stepReady = false;
  let activeCard = null;
  let revealed = false;
  let reviewedSession = new Set();
  let onlyDue = true;
  let filterId = "all";
  let persistence = true;
  function notify(text) { $("global-status").textContent = text; }
  function save() { try { localStorage.setItem(key, JSON.stringify(state)); persistence = true; } catch(_) { persistence = false; notify("El navegador impide guardar; exporta tu informe antes de salir."); } }
  function el(tag, className, value) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (value !== undefined) n.textContent = value;
    return n;
  }
  function caseRecord(id = currentCase.id) { return state.cases[id]; }
  function finished(id) { const r = caseRecord(id); return r.cursor === 4 && r.documented; }
  function countDue() { return db.flashcards.filter(c => state.cards[c.id].dueAt <= today()).length; }
  function fillStats() {
    const complete = db.cases.filter(c => finished(c.id)).length;
    const written = db.cases.filter(c => caseRecord(c.id).documented).length;
    const due = countDue();
    $("stat-complete").textContent = String(complete) + " / 6";
    $("stat-due").textContent = String(due);
    $("stat-notes").textContent = String(written) + " / 6";
    $("nav-cases").textContent = String(complete) + "/6";
    $("nav-due").textContent = String(due);
    $("nav-entries").textContent = String(written);
  }
  function showView(name) {
    if (!["cases","cards","journal","about"].includes(name)) return;
    view = name;
    for (const section of ["cases","cards","journal","about"]) $("view-"+section).hidden = section !== name;
    document.querySelectorAll("[data-view]").forEach(button => {
      const on = button.dataset.view === name;
      button.classList.toggle("active",on);
      button.setAttribute("aria-pressed",String(on));
    });
    const labels = {cases:"INVESTIGATION",cards:"ACTIVE RECALL",journal:"EVIDENCE NOTEBOOK",about:"METHOD / REFERENCES"};
    $("breadcrumb").textContent = "WORKSTATION / " + labels[name];
    if (name === "cards") renderCard();
    if (name === "journal") openJournal(currentCase.id);
    $("heading-"+name).focus({preventScroll:true});
  }
  function feedback(id, message, good) {
    const node = $(id);
    node.textContent = message;
    node.classList.toggle("good",good === true);
    node.classList.toggle("bad",good === false);
  }
  function renderCaseList() {
    const text = $("case-filter").value.trim().toLocaleLowerCase("es");
    const container = $("case-list"); container.replaceChildren();
    let seen = 0;
    for (const c of db.cases) {
      if (text && !(c.title+" "+c.topic+" "+c.code+" "+c.goal).toLocaleLowerCase("es").includes(text)) continue;
      seen++;
      const button = el("button","case-option");
      button.type = "button";
      button.classList.toggle("selected",c.id === currentCase.id);
      if (c.id === currentCase.id) button.setAttribute("aria-current","true");
      const topline = el("span");
      topline.append(el("small","",c.code),el("i","",finished(c.id) ? "✓ TERMINADO" : caseRecord(c.id).cursor+"/4"));
      button.append(topline,el("span","",c.title));
      button.addEventListener("click",() => selectCase(c.id));
      container.append(button);
    }
    if (seen === 0) container.append(el("p","subtle","No hay coincidencias."));
  }
  function selectCase(id) {
    const c = byCase.get(id);
    if (!c) return;
    currentCase = c; stepReady = false;
    $("case-filter").value = "";
    $("case-code").textContent = c.code + " / " + c.topic;
    $("case-title").textContent = c.title;
    $("case-goal").textContent = c.goal;
    $("case-priority").textContent = c.priority.toLocaleUpperCase("es");
    $("terminal-link").href = "index.html?case=" + encodeURIComponent(c.id) + "&panel=terminal";
    const list = $("case-signals");list.replaceChildren();
    for (const line of c.signals) list.append(el("li","",line));
    renderCaseList(); renderDecision(); fillStats();
    $("case-title").focus({preventScroll:true});
  }
  function renderDecision() {
    const r = caseRecord();
    const container = $("decision-options");
    container.replaceChildren();
    const completed = r.cursor === 4;
    $("decision-count").textContent = completed ? "Simulación completada · 4/4" : "Decisión " + (r.cursor+1) + " de 4";
    const track = $("decision-track");track.replaceChildren();
    for (let i = 0; i < 4; i++) {const piece = el("span");piece.classList.toggle("done",i<r.cursor);track.append(piece);}
    $("decision-form").hidden = completed || stepReady;
    $("decision-next").hidden = !stepReady;
    $("decision-restart").hidden = !completed;
    if (completed) {
      $("decision-prompt").textContent = "Has respondido a las cuatro fases del caso. Abre Cuaderno, registra hechos e incertidumbres, y documenta la decisión responsable.";
      feedback("decision-feedback",r.documented ? "La simulación y el cuaderno local están completos. Esto NO equivale a una evaluación profesional." : "Decisiones terminadas. Falta documentar este caso en el Cuaderno.",true);
      return;
    }
    const [prompt, options] = currentCase.steps[r.cursor];
    $("decision-prompt").textContent = prompt;
    for (let i = 0; i < options.length; i++) {
      const label = el("label");
      const radio = el("input");
      radio.type = "radio";radio.name="choice";radio.value=String(i);radio.required=true;
      label.append(radio,el("span","",options[i]));container.append(label);
    }
    feedback("decision-feedback",stepReady ? "Decisión registrada." : "Elige la explicación más defendible. Puedes reintentar y aprender de los errores.",null);
    $("decision-submit").disabled=false;
  }
  function submitDecision(e) {
    e.preventDefault();
    const r = caseRecord();
    if (r.cursor === 4 || stepReady) return;
    const selected = $("decision-form").querySelector('input[name="choice"]:checked');
    if (!selected) { feedback("decision-feedback","Selecciona una opción antes de comprobar.",false); return; }
    const [prompt,options,correct,explanation] = currentCase.steps[r.cursor];
    const answer = Number(selected.value);
    r.attempts++;
    if (answer !== correct) {
      feedback("decision-feedback","Esta respuesta no está sustentada por el conjunto de datos. "+explanation+" Puedes intentarlo de nuevo.",false);
      save();return;
    }
    r.correct[r.cursor] = true;
    stepReady = true;
    save();
    feedback("decision-feedback","Decisión fundamentada. "+explanation,true);
    $("decision-form").hidden=true;
    $("decision-next").hidden=false;
    $("decision-next").textContent=r.cursor===3 ? "Cerrar simulación →" : "Siguiente fase →";
  }
  function nextDecision() {
    if (!stepReady) return;
    const r = caseRecord();
    r.cursor=Math.min(4,r.cursor+1);
    stepReady=false;
    save();fillStats();renderCaseList();renderDecision();
    if (r.cursor===4) notify("Simulación completada. Documenta el caso para registrar el aprendizaje.");
  }
  function resetCase() {
    if (!window.confirm("¿Reiniciar las cuatro decisiones de este caso? Se conservará su cuaderno.")) return;
    const existing = caseRecord();
    state.cases[currentCase.id] = {...freshCase(),notes:existing.notes,documented:existing.documented};
    stepReady=false;save();fillStats();renderCaseList();renderDecision();
  }
  function initChoices() {
    const select = $("journal-case"), filter = $("card-filter");
    for (const c of db.cases) {
      const option=el("option","",c.code+" · "+c.title);option.value=c.id;select.append(option);
      const cardOption=el("option","",c.topic);cardOption.value=c.id;filter.append(cardOption);
    }
    const list=$("source-list");
    for (const entry of Object.values(db.references)) {
      const li=el("li");const a=el("a","",entry.name+" ↗");
      a.href=entry.url;a.target="_blank";a.rel="noopener noreferrer";
      li.append(a);list.append(li);
    }
  }
  function openJournal(id) {
    if (!byCase.has(id)) return;
    $("journal-case").value=id;
    const r=caseRecord(id);
    for(const field of noteFields) $("journal-"+field).value=r.notes[field];
    $("journal-attest").checked=false;
    feedback("journal-feedback",r.documented ? "El caso ya tiene un cuaderno guardado localmente. Puedes corregirlo." : "Los textos se guardan en esta estación; no se envían a terceros.",null);
  }
  function saveJournalDraft() {
    const id=$("journal-case").value;
    if (!byCase.has(id)) return;
    const r=caseRecord(id);
    let changed=false;
    for(const field of noteFields){
      const value=$("journal-"+field).value.slice(0,2000);
      if (r.notes[field] !== value) {r.notes[field]=value;changed=true;}
    }
    if(changed){r.documented=false;save();fillStats();renderCaseList();}
  }
  function submitJournal(e) {
    e.preventDefault();saveJournalDraft();
    const r=caseRecord($("journal-case").value);
    if (!noteFields.every(field => r.notes[field].trim().length>=40)) {
      feedback("journal-feedback","Cada apartado exige al menos 40 caracteres. Una frase breve no basta para documentar una investigación.",false);return;
    }
    if (!$("journal-attest").checked) {
      feedback("journal-feedback","Confirma que no has introducido datos personales reales ni mezclado observaciones y suposiciones.",false);return;
    }
    r.documented=true;save();fillStats();renderCaseList();
    feedback("journal-feedback","Cuaderno registrado localmente. No se ha evaluado su calidad ni emitido ninguna credencial.",true);
  }
  function clearJournal() {
    if (!window.confirm("¿Vaciar solo este cuaderno?")) return;
    const r=caseRecord($("journal-case").value);
    r.notes={facts:"",uncertainty:"",action:""};r.documented=false;
    save();fillStats();renderCaseList();openJournal($("journal-case").value);
  }
  function cardPool() {
    return db.flashcards.filter(c=> (filterId==="all" || c.caseId===filterId) && (!onlyDue || state.cards[c.id].dueAt<=today()));
  }
  function renderCard() {
    const available=cardPool().filter(c=>!reviewedSession.has(c.id));
    if (!available.length) {
      activeCard=null;revealed=false;
      $("card-tag").textContent="SESIÓN COMPLETADA";
      $("card-front").textContent=onlyDue ? "No quedan tarjetas pendientes de este filtro." : "Has repasado todas las tarjetas de este filtro.";
      $("card-back").hidden=true;
      $("card-interval").textContent="✓";
      $("card-status").textContent="Puedes cambiar el filtro o volver otro día. El progreso queda en este dispositivo.";
      $("show-answer").hidden=true;$("rating-panel").hidden=true;
      return;
    }
    available.sort((a,b)=>state.cards[a.id].dueAt-state.cards[b.id].dueAt || a.id.localeCompare(b.id));
    activeCard=available[0];revealed=false;
    const meta=state.cards[activeCard.id];
    $("card-tag").textContent=activeCard.caseId.toUpperCase()+" / "+activeCard.id.toUpperCase();
    $("card-interval").textContent=meta.reviews ? "INTERVALO "+meta.interval+" DÍAS" : "CONCEPTO NUEVO";
    $("card-front").textContent=activeCard.front;
    $("card-back").textContent=activeCard.back;
    $("card-back").hidden=true;
    $("card-status").textContent="Piensa en el significado antes de revelar la respuesta.";
    $("show-answer").hidden=false;$("rating-panel").hidden=true;
    $("card-session").textContent=reviewedSession.size+" revisadas en esta sesión";
  }
  function revealCard() {
    if(!activeCard||revealed)return;
    revealed=true;$("card-back").hidden=false;$("show-answer").hidden=true;
    $("rating-panel").hidden=false;
    $("card-status").textContent="Valora tu recuerdo, no lo bien que sonó la explicación.";
  }
  function rateCard(value) {
    if (!activeCard || !revealed || !Number.isInteger(value) || value<0 || value>3) return;
    const id=activeCard.id;
    const v=state.cards[id];
    const next=value===0?1:value===1?2:value===2?(v.interval?Math.ceil(v.interval*2.1):3):(v.interval?Math.ceil(v.interval*3):5);
    v.interval=Math.min(365,next);
    v.dueAt=today()+v.interval*day;
    v.reviews=Math.min(100000,v.reviews+1);
    v.lastRating=value;
    reviewedSession.add(id);
    save();fillStats();renderCard();
  }
  function exportState() {
    saveJournalDraft();
    const payload=JSON.stringify({schema:db.schema,generatedAt:new Date().toISOString(),cases:state.cases,cards:state.cards,note:"Autoevaluación local; no es nota ni título académico."},null,2);
    const url=URL.createObjectURL(new Blob([payload],{type:"application/json"}));
    const link=el("a");link.href=url;link.download="secure-t-mission-control.json";
    document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
    notify("Exportado a JSON. No se ha transmitido contenido a un servidor.");
  }
  async function importState(event) {
    const file=event.target.files && event.target.files[0];event.target.value="";
    if(!file)return;
    if(file.size>100000){notify("Importación rechazada: tamaño máximo 100 KB.");return;}
    try{
      const raw=JSON.parse(await file.text());
      if(!raw || raw.schema!==db.schema || !raw.cases || !raw.cards || Array.isArray(raw.cases) || Array.isArray(raw.cards))throw Error("schema");
      state=sanitize(raw);reviewedSession=new Set();save();fillStats();selectCase(currentCase.id);openJournal(currentCase.id);renderCard();
      notify("Progreso importado y normalizado. Se descartaron campos ajenos al esquema.");
    }catch(_){notify("No se importó: JSON corrupto o versión incompatible.");}
  }
  function resetAll() {
    if (!window.confirm("¿Borrar las seis simulaciones, los 48 repasos y todos los cuadernos? Exporta antes si los necesitas."))return;
    state=sanitize(null);reviewedSession=new Set();stepReady=false;
    save();fillStats();selectCase(db.cases[0].id);renderCard();openJournal(db.cases[0].id);
    notify("La estación se ha reiniciado. No se han modificado cuentas ni servicios externos.");
  }
  document.querySelectorAll("[data-view]").forEach(button=>button.addEventListener("click",()=>showView(button.dataset.view)));
  $("case-filter").addEventListener("input",renderCaseList);
  $("decision-form").addEventListener("submit",submitDecision);
  $("decision-next").addEventListener("click",nextDecision);
  $("decision-restart").addEventListener("click",resetCase);
  $("journal-case").addEventListener("change",event=>openJournal(event.target.value));
  $("journal-form").addEventListener("submit",submitJournal);
  ["journal-facts","journal-uncertainty","journal-action"].forEach(id=>$(id).addEventListener("input",saveJournalDraft));
  $("journal-clear").addEventListener("click",clearJournal);
  $("show-answer").addEventListener("click",revealCard);
  document.querySelectorAll("[data-rating]").forEach(button=>button.addEventListener("click",()=>rateCard(Number(button.dataset.rating))));
  $("study-all").addEventListener("click",()=>{onlyDue=false;reviewedSession=new Set();renderCard();});
  $("study-due").addEventListener("click",()=>{onlyDue=true;reviewedSession=new Set();renderCard();});
  $("card-filter").addEventListener("change",event=>{filterId=event.target.value;reviewedSession=new Set();renderCard();});
  $("export-state").addEventListener("click",exportState);
  $("import-state").addEventListener("click",()=>$("import-file").click());
  $("import-file").addEventListener("change",importState);
  $("reset-state").addEventListener("click",resetAll);
  $("print-report").addEventListener("click",()=>window.print());
  document.addEventListener("keydown",event=>{
    if(view!=="cards"||event.altKey||event.ctrlKey||event.metaKey||event.repeat)return;
    const tag=event.target && event.target.tagName;
    if(["INPUT","TEXTAREA","SELECT"].includes(tag)||event.target.isContentEditable)return;
    if(event.key===" " && !revealed && activeCard && (!tag || tag==="BODY"||tag==="MAIN")){
      event.preventDefault();revealCard();return;
    }
    if(revealed && ["1","2","3","4"].includes(event.key)) {event.preventDefault();rateCard(Number(event.key)-1);}
  });
  initChoices();fillStats();selectCase(db.cases[0].id);renderCard();showView("cases");
  if (!persistence) notify("Almacenamiento no disponible; exporta tus avances.");
})();
