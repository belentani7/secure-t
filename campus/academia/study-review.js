/* Secure T University · privacy-preserving spaced-repetition study room.
   Never claims a grade, an institutionally verified result or AI assessment.
   Records due dates only. Draft answers are never uploaded or persisted here. */
(() => {
  "use strict";
  const D=window.SecureTAcademyData, G=window.SecureTStudyGuides;
  const get=id=>document.getElementById(id);
  if(!D||!G||!get("review-task"))return;
  const lang=()=>{const code=document.documentElement.lang.toLowerCase();return code.startsWith("es")?"es":code.startsWith("en")?"en":"pt"};
  const messages={
    pt:{nav:"Revisão ativa",label:"ESTUDO ATIVO · RECORDAÇÃO ESPAÇADA",title:"Transforme leitura em memória.",intro:"Reveja as 96 unidades desenvolvidas dos quatro primeiros semestres. Responda antes de abrir a referência e escolha quando precisa revisar novamente. As respostas não recebem nota automática.",context:"CADERNO · PRIMEIROS DOIS ANOS",task:"EXERCÍCIO DE RECORDAÇÃO",placeholder:"Responda com as suas palavras. Nenhuma resposta é enviada a um servidor.",reveal:"Ver referência ↗",speak:"Ouvir pergunta ♫",skip:"Próximo tema →",solution:"NOTAS PARA COMPARAR · NÃO É GABARITO OFICIAL",notice:"Compare a sua resposta com a leitura e decida quando revisar. A autoavaliação não substitui provas verificadas.",tomorrow:"Rever amanhã",three:"Rever em 3 dias",seven:"Rever em 7 dias",waiting:"Nenhuma unidade atrasada. Você ainda pode continuar a estudar.",due:"{n} unidade(s) para revisar agora · {completed}/96 revisões registradas",saved:"Revisão marcada. Sem notas automáticas nem dados enviados.",empty:"Complete a leitura com as notas originais. Este é um exercício formativo.",notSupported:"A leitura em voz alta não está disponível neste navegador."},
    es:{nav:"Repaso activo",label:"ESTUDIO ACTIVO · REPASO ESPACIADO",title:"Convierte lectura en memoria.",intro:"Repasa las 96 unidades desarrolladas de los cuatro primeros semestres. Responde antes de revelar las notas y programa el próximo repaso. No hay calificación automática.",context:"CUADERNO · DOS PRIMEROS AÑOS",task:"EJERCICIO DE MEMORIA",placeholder:"Escribe tu respuesta. No se envía a ningún servidor.",reveal:"Ver las notas ↗",speak:"Escuchar pregunta ♫",skip:"Siguiente tema →",solution:"NOTAS PARA COMPARAR · NO SON UNA RESPUESTA OFICIAL",notice:"Compara tu respuesta con la lectura y decide cuándo repasarla. La autoevaluación no sustituye las pruebas verificadas.",tomorrow:"Revisar mañana",three:"Revisar en 3 días",seven:"Revisar en 7 días",waiting:"No hay unidades atrasadas. Puedes seguir estudiando.",due:"{n} unidad(es) pendientes · {completed}/96 repasos registrados",saved:"Repaso programado. Sin notas automáticas ni datos enviados.",empty:"Lee la explicación y compárala con tu propia respuesta. Este ejercicio es formativo.",notSupported:"La voz no está disponible en este navegador."},
    en:{nav:"Active recall",label:"ACTIVE LEARNING · SPACED REPETITION",title:"Turn reading into memory.",intro:"Review 96 authored lessons across the first four semesters. Answer before revealing the study notes, then schedule your next review. No automatic grades.",context:"NOTEBOOK · FIRST TWO YEARS",task:"ACTIVE RECALL PROMPT",placeholder:"Write an answer in your own words. It is never sent to a server.",reveal:"Reveal notes ↗",speak:"Read question aloud ♫",skip:"Next topic →",solution:"STUDY NOTES TO COMPARE · NOT AN OFFICIAL ANSWER KEY",notice:"Compare your explanation to the lesson and decide when to revisit it. Self-rating is not a verified assessment.",tomorrow:"Review tomorrow",three:"Review in 3 days",seven:"Review in 7 days",waiting:"No units are overdue. You can still keep studying.",due:"{n} due now · {completed}/96 reviews recorded",saved:"Review scheduled. No automatic grades or data submitted.",empty:"Read the lesson notes and compare your response. This is formative practice.",notSupported:"Speech synthesis is unavailable in this browser."}
  };
  const t=(k,arg={})=>(messages[lang()][k]||messages.pt[k]).replace(/\{(\w+)\}/g,(_,v)=>String(arg[v]??""));
  const allowed=new Set(Object.keys(G));
  const scheduleKey="stt-academia-review-v1";
  const parseSchedule=(input)=>{
    const safe={};
    if(!input||typeof input!=="object"||Array.isArray(input))return safe;
    for(const [id,value] of Object.entries(input)){
      if(!allowed.has(id)||!value||typeof value!=="object"||Array.isArray(value))continue;
      const next=Number(value.next),count=Number(value.count);
      if(!Number.isSafeInteger(next)||next<0||next>4102444800000)continue;
      if(!Number.isSafeInteger(count)||count<1||count>20000)continue;
      safe[id]={next,count};
    }
    return safe;
  };
  const nextDue=(entries,state,now=Date.now())=>{
    const never=entries.filter(e=>!state[e.key]);
    const due=entries.filter(e=>state[e.key]&&state[e.key].next<=now);
    const later=entries.filter(e=>state[e.key]&&state[e.key].next>now).sort((a,b)=>state[a.key].next-state[b.key].next);
    return [...due,...never,...later];
  };
  const step=(old,score,now=Date.now())=>{
    const days=score===1?1:score===2?3:score===3?7:0;
    if(!days)throw new Error("Unsupported review confidence");
    return {next:now+days*24*60*60*1000,count:Math.min(20000,(old?.count||0)+1)};
  };
  window.SecureTReview={parseSchedule,nextDue,step};
  const lessons=D.courses.filter(c=>c.semester<=4).flatMap(c=>c.topics.map((_,i)=>({
    key:c.id+"/"+i,course:c,topicIndex:i,guide:G[c.id+"/"+i]
  }))).filter(e=>e.guide);
  let state={};
  try{state=parseSchedule(JSON.parse(localStorage.getItem(scheduleKey)||"{}"))}catch{state={}}
  let index=0,active=null,revealed=false,queue=[];
  const format=(node,key,args)=>{node.textContent=t(key,args)};
  function updateLabels(){
    const controls={
      "review-nav-label":"nav","review-label":"label","review-title":"title","review-intro":"intro","review-context":"context","review-task-label":"task",
      "review-reveal":"reveal","review-speak":"speak","review-skip":"skip","review-solution-label":"solution","review-notice":"notice"
    };
    for(const [id,key] of Object.entries(controls))format(get(id),key);
    get("review-answer").placeholder=t("placeholder");
    const buttons=document.querySelectorAll("[data-review-score]");
    for(const button of buttons){
      button.textContent=t(button.dataset.reviewScore==="1"?"tomorrow":button.dataset.reviewScore==="2"?"three":"seven");
    }
  }
  function buildQueue(){queue=nextDue(lessons,state);if(index>=queue.length)index=0;active=queue[index];}
  function render(){
    buildQueue();
    updateLabels();
    if(!active){get("review-course").textContent="—";get("review-task").textContent=t("waiting");return;}
    const l=lang();get("review-course").textContent=active.course.title[l];
    const subject=active.course.topicsI18n?.[l]?.[active.topicIndex]||active.course.topics[active.topicIndex];
    get("review-topic").textContent=subject;
    get("review-task").textContent=active.guide.exercise[l];
    get("review-explanation").textContent=active.guide.read[l];
    get("review-count").textContent=String(index+1)+"/"+String(lessons.length);
    get("review-solution").hidden=!revealed;
    const due=lessons.filter(entry=>!state[entry.key]||state[entry.key].next<=Date.now()).length;
    get("review-status").textContent=t("due",{n:due,completed:Object.keys(state).length});
  }
  function next(){
    index=(index+1)%Math.max(1,lessons.length);
    revealed=false;
    get("review-answer").value="";
    get("review-solution").hidden=true;
    render();
  }
  get("review-reveal").addEventListener("click",()=>{
    revealed=true;
    get("review-solution").hidden=false;
    get("review-explanation").scrollIntoView({block:"nearest",behavior:"smooth"});
  });
  get("review-skip").addEventListener("click",next);
  document.querySelectorAll("[data-review-score]").forEach(btn=>btn.addEventListener("click",()=>{
    if(!active||!revealed)return;
    const score=Number(btn.dataset.reviewScore);
    state[active.key]=step(state[active.key],score);
    try{localStorage.setItem(scheduleKey,JSON.stringify(state))}catch{ /* study still works in private mode */ }
    index=0; // Reprioritize due cards after scheduling; never skip the next overdue unit.
    revealed=false;
    get("review-answer").value="";
    get("review-solution").hidden=true;
    render();
    get("review-status").textContent=t("saved");
  }));
  get("review-speak").addEventListener("click",()=>{
    if(!active)return;
    if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){get("review-status").textContent=t("notSupported");return;}
    window.speechSynthesis.cancel();
    const voice=new SpeechSynthesisUtterance(get("review-task").textContent.slice(0,500));
    voice.lang=lang()==="pt"?"pt-BR":lang()==="es"?"es-ES":"en-GB";
    voice.rate=.95;window.speechSynthesis.speak(voice);
  });
  document.querySelectorAll("[data-lang]").forEach(btn=>btn.addEventListener("click",()=>{
    revealed=false;get("review-answer").value="";render();
  }));
  render();
})();
