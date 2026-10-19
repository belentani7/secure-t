/* Secure T · offline curriculum mentor. Honest fallback, not a language model.
   Pure behavior: no requests, cookies, microphone or credentials. */
(() => {
  "use strict";
  const phrases={
    pt:{
      ask:"Escolha uma disciplina ou diga um tema. Posso explicar, propor um exercício, consultar fontes, criar um plano ou fazer uma pergunta de revisão.",
      limits:"Só posso orientar a aprendizagem em ambientes autorizados e com dados sintéticos. Defina o escopo de um laboratório próprio e vamos trabalhar análise e mitigação.",
      intro:"Vamos explorar {course}, no semestre {semester}.",
      explanation:"Leitura do módulo «{topic}»:\n{reading}\n\nPergunta: que evidência demonstraria que você compreendeu o conceito?",
      syllabus:"«{topic}» ainda tem plano de ensino, não uma aula completa. Comece por definir o problema, pesquisar na referência atribuída e produzir um exemplo seguro. O que precisaria comprovar na prática?",
      practice:"Atividade do módulo «{topic}»:\n{exercise}\n\nEntregável: registe objetivo, método, resultado observável e limitações na ficha do módulo. Este tutor não emite notas.",
      plannedPractice:"Atividade orientadora: crie um mapa do conceito «{topic}», compare duas abordagens, identifique riscos e proponha uma experiência apenas em ambiente próprio/autorizado. Documente o que realmente mediu.",
      sources:"Fontes externas associadas a {course}:\n{sources}\n\nAbra os links de referência na ficha da disciplina. A autoria é de cada docente ou instituição mencionada.",
      noSources:"Não há fonte externa atribuída a esta disciplina. Consulte a bibliografia do campus original; não vou inventar referências.",
      plan:"Trilha sugerida:\n1. {prereq}\n2. Estude as quatro unidades de {course}.\n3. Faça a atividade de {topic}.\n4. Registre evidências reais no caderno local.\n5. Reveja limitações, ética e fontes antes do projeto final.\nEsse roteiro não é matrícula nem diploma.",
      noPrereq:"Comece pelos fundamentos do semestre 1.",
      prereq:"Reveja primeiro a disciplina {course}.",
      quiz:"Pergunta aberta de revisão em «{topic}»: explique a finalidade do conceito, dê um exemplo observável e identifique um limite ou risco. Responda por texto ou voz; vou oferecer feedback formativo, não uma nota oficial.",
      feedback:"Obrigado pela reflexão sobre «{topic}». {detail}\n\nCompare a sua resposta com a leitura do módulo e documente uma evidência prática. Não consigo confirmar aprovação apenas por este texto.",
      feedbackShort:"Acrescente uma explicação mais completa, uma observação verificável e uma limitação.",
      feedbackLong:"Há material suficiente para revisar criticamente. Separe afirmações, evidências e incertezas antes de concluir.",
      review:"Para analisar seu trabalho em {course}, envie objetivo, metodologia, resultado e limites. Posso sugerir perguntas de revisão, mas sem correção acadêmica automática.",
      default:"Em «{topic}», minha recomendação é começar por um conceito, criar um exemplo pequeno e documentar como o verificaria. Diga «explica», «exercício», «fontes», «plano» ou «pergunta» para orientações específicas."
    },
    es:{
      ask:"Elige una asignatura o escribe un tema. Puedo explicar, proponer ejercicios, localizar fuentes, crear un plan o hacer preguntas de repaso.",
      limits:"Solo puedo guiar prácticas en entornos autorizados y con datos sintéticos. Define un laboratorio propio y trabajaremos análisis y mitigación.",
      intro:"Vamos a explorar {course}, del semestre {semester}.",
      explanation:"Lectura de «{topic}»:\n{reading}\n\nPregunta: ¿qué evidencia demostraría que entiendes el concepto?",
      syllabus:"«{topic}» todavía tiene un temario, no una lección desarrollada. Define el problema, consulta la referencia atribuida y prepara un ejemplo seguro. ¿Qué comprobarías en una práctica?",
      practice:"Actividad de «{topic}»:\n{exercise}\n\nEntrega: documenta el objetivo, el método, un resultado observable y sus límites en la ficha. Este tutor no concede notas.",
      plannedPractice:"Actividad orientadora: crea un mapa de «{topic}», compara dos enfoques, identifica riesgos y propón una experiencia solo en un entorno propio o autorizado. Anota lo que hayas medido.",
      sources:"Fuentes externas vinculadas a {course}:\n{sources}\n\nAbre los enlaces de la ficha de la asignatura. La autoría corresponde a sus docentes e instituciones.",
      noSources:"No hay fuentes externas atribuidas a esta asignatura. Consulta la bibliografía del campus original; no inventaré referencias.",
      plan:"Ruta sugerida:\n1. {prereq}\n2. Estudia las cuatro unidades de {course}.\n3. Realiza la actividad de {topic}.\n4. Registra evidencias reales en el cuaderno local.\n5. Revisa límites, ética y fuentes antes del proyecto final.\nEsta ruta no supone matrícula ni título.",
      noPrereq:"Empieza por los fundamentos del primer semestre.",
      prereq:"Repasa primero la asignatura {course}.",
      quiz:"Pregunta abierta de «{topic}»: explica para qué sirve el concepto, aporta un ejemplo observable y señala un límite o riesgo. Responde por texto o voz; recibirás orientación formativa, no calificación oficial.",
      feedback:"Gracias por reflexionar sobre «{topic}». {detail}\n\nContrasta tu respuesta con la lectura y documenta una prueba práctica. No puedo verificar una aprobación a partir de este texto.",
      feedbackShort:"Añade una explicación más completa, una observación verificable y una limitación.",
      feedbackLong:"Ya hay material para una revisión crítica. Separa afirmaciones, evidencia e incertidumbres antes de concluir.",
      review:"Para revisar tu trabajo en {course}, comparte objetivo, método, resultado y límites. Puedo sugerir comprobaciones, pero no realizar una evaluación académica oficial.",
      default:"En «{topic}», empezaría por un concepto, un ejemplo pequeño y una forma de verificarlo. Escribe «explica», «ejercicio», «fuentes», «plan» o «pregunta» para recibir orientaciones."
    },
    en:{
      ask:"Choose a course or name a topic. I can explain, suggest exercises, find attributed resources, plan your study or ask review questions.",
      limits:"I can guide learning only in authorized environments using synthetic data. Define your own lab scope and we can discuss analysis and mitigations.",
      intro:"Let's explore {course}, semester {semester}.",
      explanation:"Learning note for «{topic}»:\n{reading}\n\nQuestion: what evidence would demonstrate that you understand this idea?",
      syllabus:"«{topic}» currently has a syllabus, not a fully authored lecture. Define the problem, read an attributed resource and build a safe example. What would you verify experimentally?",
      practice:"Exercise for «{topic}»:\n{exercise}\n\nDeliverable: record purpose, method, observable result and limitations in the lesson notebook. This guide cannot award grades.",
      plannedPractice:"Guided activity: map «{topic}», compare two approaches, identify risks and design a test only on your own or authorized systems. Record what you actually observed.",
      sources:"External resources associated with {course}:\n{sources}\n\nOpen the original links in the course details. Authorship belongs to the credited teachers and institutions.",
      noSources:"No external resource is attributed to this course. Check the original campus bibliography; I will not invent references.",
      plan:"Suggested learning path:\n1. {prereq}\n2. Study the four units of {course}.\n3. Complete the {topic} exercise.\n4. Record actual evidence in your local notebook.\n5. Review limitations, ethics and sources before your final project.\nThis is not enrollment or a degree.",
      noPrereq:"Start with semester-one foundations.",
      prereq:"Review the {course} course first.",
      quiz:"Open-ended review question for «{topic}»: explain its purpose, give an observable example and identify a limitation or risk. Answer by typing or voice; feedback is formative, not a graded assessment.",
      feedback:"Thank you for reflecting on «{topic}». {detail}\n\nCompare your answer with the learning material and document a practical observation. I cannot certify successful completion from this text.",
      feedbackShort:"Include a fuller explanation, a verifiable observation and a limitation.",
      feedbackLong:"There is enough material for critical review. Separate claims, evidence and uncertainty before drawing conclusions.",
      review:"To review your {course} project, describe goals, method, outcomes and limitations. I can suggest review questions but cannot provide an official academic grade.",
      default:"For «{topic}», begin with one concept, a small example and a way to verify it. Ask for an explanation, exercise, resources, plan or review question."
    }
  };
  const norm=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const fill=(s,params)=>s.replace(/\{(\w+)\}/g,(_,key)=>String(params[key]??""));
  const select=(question,language,selected,dataset)=>{
    if(selected)return selected;
    const term=norm(question);
    let best=null,score=0;
    for(const c of dataset.courses){
      const names=[c.id,...Object.values(c.title)];
      const topics=Object.values(c.topicsI18n||{}).flat();
      let points=0;
      for(const n of names)if(n.length>4&&term.includes(norm(n)))points+=25;
      for(const n of topics)if(n.length>6&&term.includes(norm(n)))points+=12;
      if(points>score){score=points;best=c;}
    }
    if(best)return best;
    if(/(?:web|html|javascript|react|frontend|frontend|desarrollo web|desenvolvimento web)/.test(term))return dataset.courses.find(c=>c.track==="web");
    if(/(?:idioma|ingles|english|espanol|portugues|language|lingua)/.test(term))return dataset.courses.find(c=>c.track==="languages");
    if(/(?:redes|network|ciber|cyber|seguridad|seguranca|security|soc)/.test(term))return dataset.courses.find(c=>c.track==="cyber");
    return null;
  };
  function respond({message,lang="pt",selected=null,dataset,guides={},state={}}){
    const language=phrases[lang]?lang:"pt", D=phrases[language], q=norm(String(message||"").slice(0,1200));
    if(/(?:invadir sem|sin autorizacion|without (?:prior )?permission|sem permissao|roubar senhas|robar contrasenas|steal passwords|acessar conta alheia)/.test(q))return {text:D.limits,state:{},kind:"safety"};
    const course=select(message,language,selected,dataset);
    if(!course)return {text:D.ask,state:{},kind:"clarification"};
    const titles=course.topicsI18n?.[language]||course.topics;
    const topic=titles.find(t=>q.includes(norm(t)))||titles[0];
    const guideIndex=titles.indexOf(topic);
    const guide=guides[course.id+"/"+guideIndex];
    const vars={course:course.title[language],topic,semester:course.semester};
    const recognizedIntent=/(quiz|test|pergunta|pregunta|question|desafio|challenge|reto|exame|preguntame)/.test(q)?"quiz":
       /(exerc|pratic|pract|actividad|laboratori|exercise|projeto|project|tarea)/.test(q)?"practice":
       /(fonte|fuente|source|bibliograf|referenc|video|youtu|lesson|aula|clase)/.test(q)?"sources":
       /(plano|plan|roteiro|itiner|ruta|roadmap|semestre|semester)/.test(q)?"plan":
       /(feedback|corrig|revis|review|evalua|avalie|check my)/.test(q)?"review":
       /(explic|entend|conceit|defini|what|que es|que e|explai|teach me|cuentame)/.test(q)?"explain":"default";
    if(state.pendingCourse===course.id && q.length>3 && recognizedIntent==="default"){
      return {text:fill(D.feedback,{...vars,detail:q.length>=90?D.feedbackLong:D.feedbackShort}),state:{},kind:"reflection"};
    }
    if(recognizedIntent==="quiz")return {text:fill(D.quiz,vars),state:{pendingCourse:course.id},kind:"question"};
    if(recognizedIntent==="explain")return {text:guide?fill(D.explanation,{...vars,reading:guide.read[language]}):fill(D.syllabus,vars),state:{},kind:"explanation"};
    if(recognizedIntent==="practice")return {text:fill(guide?D.practice:D.plannedPractice,{...vars,exercise:guide?.exercise?.[language]||""}),state:{},kind:"practice"};
    if(recognizedIntent==="sources"){
      const sources=course.resources.map(id=>dataset.resources.find(x=>x.id===id)).filter(Boolean).slice(0,4);
      return {text:sources.length?fill(D.sources,{...vars,sources:sources.map((r,i)=>`${i+1}. ${r.creator}: ${r.title}`).join("\n")}):D.noSources,state:{},kind:"sources"};
    }
    if(recognizedIntent==="plan"){
      const prerequisite=dataset.courses.find(c=>c.id===course.requires);
      return {text:fill(D.plan,{...vars,prereq:prerequisite?fill(D.prereq,{course:prerequisite.title[language]}):D.noPrereq}),state:{},kind:"plan"};
    }
    if(recognizedIntent==="review")return {text:fill(D.review,vars),state:{},kind:"review"};
    if(guide)return {text:fill(D.explanation,{...vars,reading:guide.read[language]}),state:{},kind:"explanation"};
    return {text:fill(D.default,vars),state:{},kind:"syllabus"};
  }
  window.SecureTCurriculumTutor={respond};
})();
