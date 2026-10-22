/* Secure T · independent, browser-only formative competency checks.
   No enrollment, analytics, automated grading, certificates, or network access. */
(() => {
  "use strict";
  const bank=window.SecureTFormativeBank;
  const data=window.SecureTAcademyData;
  const $=id=>document.getElementById(id);
  if(!$("check-course")||!Array.isArray(bank)||!data)return;
  const langs=["pt","es","en"];
  const dict={
    pt:{nav:"Autoavaliação",kicker:"CONHECIMENTO APLICADO · EXERCÍCIO LOCAL",title:"O que compreendeu até agora?",lead:"24 perguntas formativas originais — uma por disciplina dos dois primeiros anos. Pratique, veja a explicação e tente novamente. Não há nota nem certificação.",course:"Escolha a disciplina",submit:"Conferir resposta",next:"Outra pergunta →",right:"Boa! Esta opção está correta.",wrong:"Reveja a explicação e tente outra vez.",pick:"Escolha uma alternativa antes de conferir.",status:"Exercício {i} de {total}. As respostas não são armazenadas.",source:"Revisão formativa local, sem avaliação institucional.",question:"Pergunta de compreensão"},
    es:{nav:"Autoevaluación",kicker:"CONOCIMIENTO APLICADO · EJERCICIO LOCAL",title:"¿Qué has comprendido?",lead:"24 preguntas formativas originales: una por asignatura de los dos primeros años. Practica, revisa la explicación e inténtalo de nuevo. Sin nota ni certificación.",course:"Elige la asignatura",submit:"Comprobar respuesta",next:"Otra pregunta →",right:"¡Bien! Es la respuesta correcta.",wrong:"Revisa la explicación e inténtalo de nuevo.",pick:"Elige una opción antes de comprobar.",status:"Ejercicio {i} de {total}. No guardamos las respuestas.",source:"Repaso formativo local, sin evaluación institucional.",question:"Pregunta de comprensión"},
    en:{nav:"Self-check",kicker:"APPLIED KNOWLEDGE · LOCAL EXERCISE",title:"What have you understood?",lead:"24 original formative questions, one per subject in the first two years. Practice, read the explanation, and try again. No grades or credentials.",course:"Choose a subject",submit:"Check answer",next:"Next question →",right:"Well done! This choice is correct.",wrong:"Review the explanation and try again.",pick:"Choose an answer first.",status:"Exercise {i} of {total}. Answers are not stored.",source:"Local formative practice, not institutional assessment.",question:"Knowledge check"}
  };
  const validCourses=new Map(data.courses.map(c=>[c.id,c]));
  const validateBank=(items)=>{
    if(!Array.isArray(items)||items.length===0||items.length>240)return false;
    const ids=new Set;
    for(const x of items){
      if(!x||typeof x.id!=="string"||ids.has(x.id)||!validCourses.has(x.course)||x.correct<0||!Number.isInteger(x.correct)||x.correct>2)return false;
      ids.add(x.id);
      for(const l of langs){
        if(typeof x.question?.[l]!=="string"||x.question[l].length<15||
           !Array.isArray(x.options?.[l])||x.options[l].length!==3||
           x.options[l].some(y=>typeof y!=="string"||!y.trim())||
           typeof x.explanation?.[l]!=="string"||x.explanation[l].length<20)return false;
      }
    }
    return true;
  };
  const evaluate=(id,choice)=>{
    const q=bank.find(x=>x.id===id);
    return q && Number.isInteger(choice)&&choice>=0&&choice<=2
      ? {valid:true,correct:choice===q.correct,answer:q.correct}
      : {valid:false,correct:false,answer:null};
  };
  if(!validateBank(bank)){
    $("check-status").textContent="O banco de exercícios não está disponível.";
    return;
  }
  window.SecureTFormative={validateBank,evaluate,selectCourse};
  let position=0;
  const locale=()=>{const h=document.documentElement.lang.toLowerCase();return h.startsWith("es")?"es":h.startsWith("en")?"en":"pt"};
  const sentence=(key,params={})=>dict[locale()][key].replace(/\{(\w+)\}/g,(_,name)=>String(params[name]??""));
  const set=(id,value)=>{$(id).textContent=value};
  function selectCourse(courseId){
    const ix=bank.findIndex(x=>x.course===courseId);
    if(ix<0)return false;
    position=ix;render();
    $("autoevaluacao").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
    return true;
  }
  function render(){
    const l=locale(),q=bank[position],course=validCourses.get(q.course);
    set("check-nav",sentence("nav"));
    for(const key of ["kicker","title","lead","course","submit","next","source"]){set("check-"+key,sentence(key));}
    set("check-prompt",q.question[l]);set("check-question-label",sentence("question"));
    set("check-count",sentence("status",{i:position+1,total:bank.length}));
    const selector=$("check-course-select");
    selector.replaceChildren();
    for(const [i,item] of bank.entries()){
      const option=document.createElement("option");
      option.value=String(i);
      option.textContent=validCourses.get(item.course).title[l];
      selector.appendChild(option);
    }
    selector.value=String(position);
    const field=$("check-choices");field.replaceChildren();
    for(let i=0;i<3;i++){
      const label=document.createElement("label");label.className="check-choice";
      const input=document.createElement("input");input.type="radio";input.name="formative-choice";input.value=String(i);
      const desc=document.createElement("span");desc.textContent=q.options[l][i];
      label.appendChild(input);label.appendChild(desc);field.appendChild(label);
    }
    $("check-feedback").hidden=true;
    set("check-feedback","");
    $("check-feedback").removeAttribute("data-outcome");
  }
  $("check-course-select").addEventListener("change",event=>{
    const i=Number(event.target.value);
    if(Number.isSafeInteger(i)&&i>=0&&i<bank.length){position=i;render();}
  });
  $("check-form").addEventListener("submit",event=>{
    event.preventDefault();
    const picked=document.querySelector('input[name="formative-choice"]:checked');
    const feedback=$("check-feedback");feedback.hidden=false;
    if(!picked){feedback.removeAttribute("data-outcome");feedback.textContent=sentence("pick");return;}
    const outcome=evaluate(bank[position].id,Number(picked.value)),q=bank[position],l=locale();
    if(!outcome.valid)return;
    feedback.dataset.outcome=outcome.correct?"correct":"review";
    feedback.textContent=sentence(outcome.correct?"right":"wrong")+" "+q.explanation[l];
  });
  $("check-next").addEventListener("click",()=>{position=(position+1)%bank.length;render();});
  document.querySelectorAll("[data-lang]").forEach(btn=>btn.addEventListener("click",render));
  render();
})();
