/* Secure T Academia — genuine local learning interactions; no invented accounts or accreditation. */
(() => {
  "use strict";
  const dataset = window.SecureTAcademyData;
  if (!dataset || !Array.isArray(dataset.courses)) return;
  const LANGS = ["pt", "es", "en"];
  const WORDS = {
    pt:{
      "nav.learning":"SUA JORNADA","nav.home":"Visão geral","nav.courses":"Cursos e semestres","nav.library":"Biblioteca de aulas","nav.tutor":"Tutor interativo","nav.about":"Nossa origem","nav.original":"CAMPUS ORIGINAL","nav.originalCampus":"20 semanas por curso","nav.originalProgress":"Progresso legado","nav.threats":"Radar de ameaças",
      "rail.local":"Modo local · sem cadastro","rail.notaccredited":"Roteiro acadêmico aberto, sem titulação oficial.",
      "top.academy":"Academia","top.dashboard":"Campus digital","top.open":"Acesso livre",
      "hero.label":"ESTUDE SEM FRONTEIRAS · PROJETO ABERTO","hero.title1":"O conhecimento","hero.title2":"precisa de coragem.","hero.lead":"Uma jornada de cinco anos em segurança digital, engenharia web e idiomas. Aprenda com laboratórios éticos, projetos e acompanhamento de estudo no seu navegador.","hero.explore":"Explorar o currículo","hero.ask":"Conversar com o tutor","hero.disclaimer":"Plano acadêmico de cinco anos em elaboração. Os quatro cursos originais possuem aulas; as novas disciplinas apresentam planos de estudo e atividades, ainda não aulas completas.",
      "stat.years":"Horizonte de estudo","stat.yearsUnit":"anos","stat.planning":"Percurso planejado","stat.semesters":"Semestres planejados","stat.semesterFoot":"Do fundamental à pesquisa","stat.courses":"Disciplinas no mapa","stat.coursesFoot":"3 eixos formativos","stat.progress":"Seu progresso local","stat.selfReport":"Autodeclarado, sem verificação externa",
      "time.title":"Um campus, três fusos.","time.subtitle":"Rio de Janeiro · Barcelona · Dublin — horário local atualizado automaticamente, com horário de verão.",
      "courses.eyebrow":"ARQUITETURA DO CONHECIMENTO","courses.title":"Seu futuro, semestre por semestre.","courses.subtitle":"Explore 60 disciplinas e 240 unidades planejadas em três áreas. Selecione uma matéria para consultar seus conteúdos, exercícios e critérios de entrega.","courses.searchLabel":"Buscar matéria","courses.none":"Nenhuma disciplina corresponde aos filtros.","courses.searchPlaceholder":"Buscar disciplina, tema ou código...",
      "resources.eyebrow":"BIBLIOTECA ABERTA","resources.title":"Aprender com quem ensina de verdade.","resources.subtitle":"Aulas extensas e referências de instituições e professores externos. Abrimos a fonte original; não copiamos vídeos nem atribuímos autoria à Secure T.",
      "tutor.eyebrow":"ACOMPANHAMENTO INTERATIVO","tutor.title":"Uma conversa pode abrir caminhos.","tutor.subtitle":"Tutor socrático com recursos do currículo e voz do navegador. Quando disponível e autorizado, experimente o modelo local do seu próprio navegador — sem chave de servidor no cliente.","tutor.name":"Tutor de aprendizagem","tutor.audioOff":"Voz desligada","tutor.audioOn":"Voz ligada","tutor.question":"Sua pergunta","tutor.send":"Enviar","tutor.privacy":"O modo curricular funciona sem enviar mensagens para servidores. Reconhecimento de voz pode usar o serviço do fornecedor do navegador: só use com consentimento. Não introduza senhas nem dados sensíveis.","tutor.placeholder":"O que é Zero Trust? Pode me orientar?","tutor.engine":"Apoio curricular local · não é um LLM","tutor.engineAI":"Modelo de IA local do navegador · experimental","tutor.user":"VOCÊ","tutor.assistant":"TUTOR","tutor.hello":"Bem-vindo! Sou um guia de estudo. Escolha uma disciplina e pergunte sobre o tema, os módulos ou a evidência exigida. Minha resposta local é baseada no currículo — não substitui docentes.","tutor.ask":"Qual tema ou disciplina você está estudando? Escolha uma matéria para eu sugerir uma atividade e um próximo passo.","tutor.reply":"Vamos começar por {course}. Estude o tema «{topic}», escreva um exemplo concreto e registre o que conseguiu demonstrar. Depois compare suas conclusões com a referência do curso. Que evidência verificável você conseguiria produzir hoje?","tutor.noMic":"Este navegador não oferece reconhecimento de voz compatível.","tutor.consent":"O reconhecimento de voz pode enviar áudio ao serviço do fabricante do navegador. Deseja ativá-lo?","tutor.modelConsent":"Um modelo experimental poderá usar recursos do dispositivo e descarregar ficheiros conforme o navegador. Pretende ativá-lo?","tutor.noModel":"O modelo local não está disponível neste navegador; continua ativo o tutor curricular.",
      "about.label":"SOBRE A IDEIA","about.title":"Toda grande ideia começa com uma razão humana.","about.body":"A Secure T nasceu quando seu criador encontrou no amor a inspiração para compartilhar conhecimento. Uma ideia íntima tornou-se um compromisso público: abrir caminhos para quem quer aprender, atravessando fronteiras, idiomas e oportunidades.","about.second":"Sem promessas de diplomas oficiais; com curiosidade, responsabilidade e respeito por quem estuda.","about.quote":"Há afetos que não pedem reconhecimento. Eles apenas se tornam coisas boas no mundo.",
      "footer.legal":"Projeto educativo independente · sem acreditação universitária oficial.","footer.home":"Voltar ao início",
      "filter.all":"Todos","filter.year":"Ano {n}","filter.cyber":"Cibersegurança","filter.web":"Desenvolvimento web","filter.languages":"Idiomas","filter.result":"{n} disciplina(s) · seleção atual","filter.open":"Explorar módulos ↗","filter.modules":"4 unidades · {hours} h previstas","filter.semester":"Semestre {n}","detail.assessment":"Projeto e evidência","detail.ask":"Perguntar sobre esta matéria","detail.policy":"Marcar um módulo registra apenas uma autodeclaração local. Não equivale a aprovação, avaliação externa nem certificado.","detail.label":"PLANO DE ENSINO","detail.outcome":"Objetivo formativo","detail.lesson":"Unidade {n}","detail.activity":"Exercício: explique o tema com suas próprias palavras, contraste duas abordagens e produza um exemplo rastreável em ambiente autorizado.","detail.mark":"Estudei e registrei evidência","detail.guide":"Questão orientadora: que problema este conceito resolve, quais são seus limites e como você demonstraria isso?","detail.reference":"Fontes relacionadas","detail.back":"Fechar detalhes","resources.visit":"Abrir fonte ↗","resources.language":"Idioma","resources.external":"Conteúdo externo"
    },
    es:{
      "nav.learning":"TU TRAYECTORIA","nav.home":"Visión general","nav.courses":"Cursos y semestres","nav.library":"Biblioteca de clases","nav.tutor":"Tutor interactivo","nav.about":"Nuestro origen","nav.original":"CAMPUS ORIGINAL","nav.originalCampus":"20 semanas por curso","nav.originalProgress":"Progreso anterior","nav.threats":"Radar de amenazas",
      "rail.local":"Modo local · sin registro","rail.notaccredited":"Itinerario abierto, sin titulación oficial.","top.academy":"Academia","top.dashboard":"Campus digital","top.open":"Acceso abierto",
      "hero.label":"ESTUDIA SIN FRONTERAS · PROYECTO ABIERTO","hero.title1":"El conocimiento","hero.title2":"necesita valentía.","hero.lead":"Un itinerario de cinco años en ciberseguridad, desarrollo web e idiomas. Aprende con laboratorios éticos, proyectos y seguimiento de estudio en tu navegador.","hero.explore":"Explorar el currículo","hero.ask":"Hablar con el tutor","hero.disclaimer":"Plan académico de cinco años en desarrollo. Los cuatro cursos originales incluyen clases; las asignaturas nuevas tienen temarios y actividades, todavía no clases completas.",
      "stat.years":"Horizonte de estudio","stat.yearsUnit":"años","stat.planning":"Trayecto planificado","stat.semesters":"Semestres planificados","stat.semesterFoot":"De fundamentos a investigación","stat.courses":"Asignaturas previstas","stat.coursesFoot":"3 áreas formativas","stat.progress":"Tu progreso local","stat.selfReport":"Autodeclarado, sin verificación externa",
      "time.title":"Un campus, tres husos.","time.subtitle":"Río de Janeiro · Barcelona · Dublín: hora local automática, incluido el cambio de horario de verano.",
      "courses.eyebrow":"ARQUITECTURA DEL CONOCIMIENTO","courses.title":"Tu futuro, semestre a semestre.","courses.subtitle":"Explora 60 asignaturas y 240 unidades planificadas en tres áreas. Selecciona una asignatura para ver su temario, ejercicios y evidencias.","courses.searchLabel":"Buscar asignatura","courses.none":"Ninguna asignatura coincide con los filtros.","courses.searchPlaceholder":"Buscar asignatura, tema o código...",
      "resources.eyebrow":"BIBLIOTECA ABIERTA","resources.title":"Aprender de quienes enseñan.","resources.subtitle":"Clases extensas y fuentes de profesores e instituciones externas. Enlazamos la fuente original; no copiamos vídeos ni atribuimos su autoría a Secure T.",
      "tutor.eyebrow":"ACOMPAÑAMIENTO INTERACTIVO","tutor.title":"Una conversación puede abrir caminos.","tutor.subtitle":"Tutor socrático basado en el currículo y voz del navegador. Si está disponible, puedes probar el modelo local experimental del navegador sin exponer claves.","tutor.name":"Tutor de aprendizaje","tutor.audioOff":"Voz apagada","tutor.audioOn":"Voz encendida","tutor.question":"Tu pregunta","tutor.send":"Enviar","tutor.privacy":"El modo curricular no envía mensajes a servidores. El reconocimiento de voz puede usar servicios del fabricante del navegador: actívalo solo con consentimiento. No introduzcas contraseñas ni datos sensibles.","tutor.placeholder":"¿Qué es Zero Trust? ¿Puedes orientarme?","tutor.engine":"Apoyo curricular local · no es un LLM","tutor.engineAI":"Modelo local del navegador · experimental","tutor.user":"TÚ","tutor.assistant":"TUTOR","tutor.hello":"¡Bienvenido! Soy una guía de estudio. Elige una asignatura y pregunta por sus conceptos, unidades o evidencias. Las respuestas locales parten del temario y no sustituyen a docentes.","tutor.ask":"¿Qué tema o asignatura estudias? Elige una materia y te propondré una actividad y un siguiente paso.","tutor.reply":"Empecemos por {course}. Estudia «{topic}», redacta un ejemplo concreto y documenta lo que has demostrado. Después contrasta tus conclusiones con la fuente del curso. ¿Qué evidencia verificable podrías producir hoy?","tutor.noMic":"Este navegador no ofrece reconocimiento de voz compatible.","tutor.consent":"El reconocimiento de voz podría enviar audio al proveedor del navegador. ¿Quieres activarlo?","tutor.modelConsent":"Un modelo experimental podría consumir recursos y descargar archivos según el navegador. ¿Quieres activarlo?","tutor.noModel":"Este navegador no dispone de un modelo local; sigue disponible el tutor curricular.",
      "about.label":"SOBRE LA IDEA","about.title":"Toda gran idea nace de una razón humana.","about.body":"Secure T nació cuando su creador encontró en el amor la inspiración para compartir conocimiento. Una idea íntima se convirtió en un compromiso público: abrir caminos a quienes quieren aprender, cruzando fronteras, idiomas y oportunidades.","about.second":"Sin promesas de títulos oficiales; con curiosidad, responsabilidad y respeto por quienes aprenden.","about.quote":"Hay afectos que no piden reconocimiento. Simplemente se convierten en algo bueno para el mundo.",
      "footer.legal":"Proyecto educativo independiente · sin acreditación universitaria oficial.","footer.home":"Volver al inicio",
      "filter.all":"Todas","filter.year":"Año {n}","filter.cyber":"Ciberseguridad","filter.web":"Desarrollo web","filter.languages":"Idiomas","filter.result":"{n} asignatura(s) · selección actual","filter.open":"Explorar módulos ↗","filter.modules":"4 unidades · {hours} h previstas","filter.semester":"Semestre {n}","detail.assessment":"Proyecto y evidencia","detail.ask":"Preguntar sobre esta materia","detail.policy":"Marcar un módulo solo registra una declaración local. No equivale a aprobar, ser evaluado externamente ni obtener un certificado.","detail.label":"PLAN DE ESTUDIOS","detail.outcome":"Objetivo de aprendizaje","detail.lesson":"Unidad {n}","detail.activity":"Ejercicio: explica el tema con tus propias palabras, compara dos enfoques y produce un ejemplo trazable en un entorno autorizado.","detail.mark":"He estudiado y documentado una evidencia","detail.guide":"Pregunta guía: ¿qué problema resuelve este concepto, qué límites tiene y cómo lo demostrarías?","detail.reference":"Fuentes relacionadas","detail.back":"Cerrar detalles","resources.visit":"Abrir fuente ↗","resources.language":"Idioma","resources.external":"Contenido externo"
    },
    en:{
      "nav.learning":"YOUR LEARNING","nav.home":"Overview","nav.courses":"Courses & semesters","nav.library":"Lecture library","nav.tutor":"Interactive tutor","nav.about":"Our origin","nav.original":"ORIGINAL CAMPUS","nav.originalCampus":"20 weeks per course","nav.originalProgress":"Legacy progress","nav.threats":"Threat intelligence",
      "rail.local":"Local mode · no account","rail.notaccredited":"Open study pathway, not an accredited degree.","top.academy":"Academy","top.dashboard":"Digital campus","top.open":"Open access",
      "hero.label":"LEARN WITHOUT BORDERS · OPEN PROJECT","hero.title1":"Knowledge","hero.title2":"takes courage.","hero.lead":"A five-year learning pathway through cybersecurity, web engineering and languages. Explore ethical labs, practical projects and personal progress tracking in your browser.","hero.explore":"Explore the curriculum","hero.ask":"Talk to the tutor","hero.disclaimer":"The five-year academic plan is in development. Four original courses include lessons; new subjects provide syllabi and exercises, not yet complete lecture series.",
      "stat.years":"Learning horizon","stat.yearsUnit":"years","stat.planning":"Planned pathway","stat.semesters":"Planned semesters","stat.semesterFoot":"Foundations to research","stat.courses":"Planned subjects","stat.coursesFoot":"3 learning areas","stat.progress":"Your local progress","stat.selfReport":"Self-reported, not externally verified",
      "time.title":"One campus, three time zones.","time.subtitle":"Rio de Janeiro · Barcelona · Dublin — automatic local time and daylight saving adjustments.",
      "courses.eyebrow":"THE KNOWLEDGE ARCHITECTURE","courses.title":"Your future, semester by semester.","courses.subtitle":"Explore 60 planned subjects and 240 learning units across three pathways. Choose a subject to view the syllabus, exercises and submission criteria.","courses.searchLabel":"Search a subject","courses.none":"No subjects match your filters.","courses.searchPlaceholder":"Find a subject, topic or code...",
      "resources.eyebrow":"OPEN LIBRARY","resources.title":"Learn from the people who teach.","resources.subtitle":"Long-form classes and references by external teachers and institutions. We link to original sources; we do not copy videos or claim authorship.",
      "tutor.eyebrow":"INTERACTIVE STUDY SUPPORT","tutor.title":"A conversation can open a path.","tutor.subtitle":"Curriculum-grounded Socratic guidance and browser speech. If supported, opt in to an experimental on-device browser language model; no API key in the frontend.","tutor.name":"Learning tutor","tutor.audioOff":"Voice off","tutor.audioOn":"Voice on","tutor.question":"Your question","tutor.send":"Send","tutor.privacy":"Curriculum guidance doesn't send messages to servers. Speech recognition may use your browser vendor's service: enable with informed consent. Never enter passwords or sensitive information.","tutor.placeholder":"What is Zero Trust? Can you guide me?","tutor.engine":"Local curriculum guide · not an LLM","tutor.engineAI":"Experimental on-device language model","tutor.user":"YOU","tutor.assistant":"TUTOR","tutor.hello":"Welcome! I'm a study guide. Pick a course and ask about its concepts, learning units or assignment. My local replies come from the curriculum and do not replace human teachers.","tutor.ask":"What subject are you learning? Choose one and I'll suggest an activity and next step.","tutor.reply":"Let's start with {course}. Study «{topic}», write a concrete example, and document what you have demonstrated. Then compare your findings with the original course resource. What verifiable evidence could you produce today?","tutor.noMic":"Speech recognition isn't supported in this browser.","tutor.consent":"Your browser's speech recognition may send audio to a vendor service. Do you want to enable it?","tutor.modelConsent":"An experimental on-device model may consume device resources and download model files as your browser permits. Enable it?","tutor.noModel":"No on-device language model is available; the curriculum guide remains active.",
      "about.label":"ABOUT THE IDEA","about.title":"Every great idea begins with a human reason.","about.body":"Secure T was born when its creator found in love the inspiration to share knowledge. An intimate idea became a public commitment: opening paths for people who want to learn across borders, languages and opportunities.","about.second":"No promises of official degrees, only curiosity, responsibility and respect for learners.","about.quote":"Some forms of love ask for no recognition. They simply become something good in the world.",
      "footer.legal":"Independent educational project · not an accredited university.","footer.home":"Back to start",
      "filter.all":"All","filter.year":"Year {n}","filter.cyber":"Cybersecurity","filter.web":"Web development","filter.languages":"Languages","filter.result":"{n} subject(s) · current selection","filter.open":"Explore modules ↗","filter.modules":"4 units · {hours} planned hours","filter.semester":"Semester {n}","detail.assessment":"Project & evidence","detail.ask":"Ask about this subject","detail.policy":"Checking a module records a local self-report, not course approval, external assessment or a credential.","detail.label":"COURSE SYLLABUS","detail.outcome":"Learning objective","detail.lesson":"Unit {n}","detail.activity":"Exercise: explain the concept in your own words, compare two approaches and produce a traceable example in an authorized environment.","detail.mark":"I studied and documented evidence","detail.guide":"Guiding question: what problem does this concept solve, what are its limitations and how would you demonstrate it?","detail.reference":"Related references","detail.back":"Close details","resources.visit":"Open source ↗","resources.language":"Language","resources.external":"External resource"
    }
  };
  Object.assign(WORDS.pt,{"resources.watch":"Assistir aqui ▶","resources.videoPrivacy":"O player do YouTube só carrega após clicar. Políticas de terceiros podem aplicar-se; a fonte original continua disponível."});
  Object.assign(WORDS.es,{"resources.watch":"Ver aquí ▶","resources.videoPrivacy":"El reproductor de YouTube solo se carga al pulsar. Pueden aplicarse políticas de terceros; la fuente original sigue disponible."});
  Object.assign(WORDS.en,{"resources.watch":"Watch here ▶","resources.videoPrivacy":"The YouTube player only loads after you click. Third-party policies may apply; the original resource remains available."});

  Object.assign(WORDS.pt,{"progress.note":"Seu caderno e seus marcos ficam apenas no navegador. Exporte para continuar em outro dispositivo. Não inclua segredos nas anotações.","progress.export":"Exportar caderno JSON","progress.import":"Importar caderno JSON","progress.importOk":"Caderno importado com validação.","progress.importBad":"Ficheiro inválido (máx. 1 MiB).","progress.exportOk":"Caderno exportado.","detail.notes":"Evidência de estudo (mínimo de 80 caracteres para autodeclarar esta unidade):"});
  Object.assign(WORDS.es,{"progress.note":"Tu cuaderno y tu progreso se guardan solo en el navegador. Exporta una copia para seguir en otro dispositivo. No guardes secretos.","progress.export":"Exportar cuaderno JSON","progress.import":"Importar cuaderno JSON","progress.importOk":"Cuaderno importado y validado.","progress.importBad":"Archivo no válido (máx. 1 MiB).","progress.exportOk":"Cuaderno exportado.","detail.notes":"Evidencia de estudio (mínimo 80 caracteres para marcar esta unidad):"});
  Object.assign(WORDS.en,{"progress.note":"Your notebook and progress live only in this browser. Export a copy to continue on another device. Never store secrets.","progress.export":"Export notebook JSON","progress.import":"Import notebook JSON","progress.importOk":"Notebook validated and imported.","progress.importBad":"Invalid file (max 1 MiB).","progress.exportOk":"Notebook exported.","detail.notes":"Study evidence (at least 80 characters before self-reporting this unit):"});
  // These guides are actually authored content; the remainder of the five-year
  // programme remains an honest syllabus, not generated "completed" lectures.
  const authoredGuides=window.SecureTStudyGuides || {};
  Object.assign(WORDS.pt,{
    "detail.read":"LEITURA GUIADA","detail.practical":"ATIVIDADE APLICADA",
    "detail.planned":"Esta unidade é um plano curricular em desenvolvimento. O material completo ainda não foi redigido.",
    "filter.authored":"aulas produzidas","filter.syllabus":"plano em expansão"
  });
  Object.assign(WORDS.es,{
    "detail.read":"LECTURA GUIADA","detail.practical":"ACTIVIDAD APLICADA",
    "detail.planned":"Esta unidad es un temario en desarrollo. El material completo todavía no está redactado.",
    "filter.authored":"lecciones redactadas","filter.syllabus":"temario en desarrollo"
  });
  Object.assign(WORDS.en,{
    "detail.read":"GUIDED READING","detail.practical":"APPLIED EXERCISE",
    "detail.planned":"This unit is a developing syllabus. Complete teaching material has not yet been written.",
    "filter.authored":"authored lessons","filter.syllabus":"developing syllabus"
  });
  const el = id => document.getElementById(id);
  const text = (node,value) => { node.textContent = String(value); return node; };
  const make = (tag,cls) => { const node=document.createElement(tag); if(cls)node.className=cls; return node; };
  const persist = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key,val) => { try { localStorage.setItem(key,val); } catch { /* privacy/storage blocked */ } };
  const readLang = persist("stt-academia-lang");
  let lang = LANGS.includes(readLang) ? readLang : "pt"; // Never infer another initial language.
  let selectedYear=0, selectedTrack="all", search="", selected=null, voice=false, listening=false, aiSession=null, aiInitializing=false, chatHistory=[];
  const permittedIds = new Set(dataset.courses.flatMap(c=>c.topics.map((_,i)=>c.id+"/"+i)));
  let progress={};
  try {
    const candidate=JSON.parse(persist("stt-academia-progress")||"{}");
    if(candidate && typeof candidate==="object" && !Array.isArray(candidate)){
      for(const [key,value] of Object.entries(candidate))if(permittedIds.has(key) && value===true)progress[key]=true;
    }
  }catch{progress={}}
  let evidence={};
  try {
    const stored=JSON.parse(persist("stt-academia-evidence")||"{}");
    if(stored && typeof stored==="object" && !Array.isArray(stored)){
      for(const [key,value] of Object.entries(stored))
        if(permittedIds.has(key)&&typeof value==="string"&&value.length<=4000)evidence[key]=value;
    }
  }catch{evidence={}}
  const tr=(key,args={}) => (WORDS[lang][key] || WORDS.pt[key] || key).replace(/\{(\w+)\}/g,(_,x)=>String(args[x]??""));
  const localizedTopics = c => c.topicsI18n?.[lang] || c.topics;
  const tracks = () => ({cyber:tr("filter.cyber"),web:tr("filter.web"),languages:tr("filter.languages")});
  const append=(parent,child)=>{parent.appendChild(child);return child};
  const button=(label,cls,handler)=>{const b=make("button",cls);b.type="button";b.textContent=label;b.addEventListener("click",handler);return b};
  const setLang=(next)=>{
    if(!LANGS.includes(next))return;
    lang=next;save("stt-academia-lang",lang);document.documentElement.lang=lang==="pt"?"pt-BR":lang;
    document.querySelectorAll("[data-i18n]").forEach(node=>{ const v=WORDS[lang][node.dataset.i18n];if(v!==undefined)text(node,v); });
    document.querySelectorAll("[data-lang]").forEach(node=>node.setAttribute("aria-pressed",String(node.dataset.lang===lang)));
    el("search-courses").placeholder=tr("courses.searchPlaceholder");
    el("tutor-input").placeholder=tr("tutor.placeholder");
    el("tutor-engine").textContent=tr(aiSession?"tutor.engineAI":"tutor.engine");
    el("voice-toggle").querySelector("[data-i18n]").textContent=tr(voice?"tutor.audioOn":"tutor.audioOff");
    renderFilters();renderCourses();renderResources();if(selected)renderDetail();
    chatHistory.forEach(m=>{if(m.intro)m.node.querySelector("p").textContent=tr("tutor.hello")});
    if(window.speechSynthesis)window.speechSynthesis.cancel();
    document.title = {pt:"Secure T · Universidade Digital Aberta",es:"Secure T · Universidad Digital Abierta",en:"Secure T · Open Digital University"}[lang];
  };
  function renderFilters(){
    const years=el("year-filters");years.replaceChildren();
    append(years,button(tr("filter.all"),selectedYear===0?"selected":"",()=>{selectedYear=0;renderFilters();renderCourses()}));
    for(let y=1;y<=5;y++)append(years,button(tr("filter.year",{n:y}),selectedYear===y?"selected":"",()=>{selectedYear=y;renderFilters();renderCourses()}));
    const trackEl=el("track-filters");trackEl.replaceChildren();
    for(const [track,label] of [["all",tr("filter.all")],...Object.entries(tracks())]){
      append(trackEl,button(label,selectedTrack===track?"selected":"",()=>{selectedTrack=track;renderFilters();renderCourses()}));
    }
  }
  function renderCourses(){
    const grid=el("course-grid");grid.replaceChildren();
    const needle=search.trim().toLocaleLowerCase();
    const matches=dataset.courses.filter(c=>(!selectedYear||c.year===selectedYear)&&(selectedTrack==="all"||c.track===selectedTrack)&&(!needle||[c.id,c.title[lang],c.title.pt,c.title.es,c.title.en,...c.topics,...localizedTopics(c)].join(" ").toLocaleLowerCase().includes(needle)));
    for(const c of matches){
      const article=make("article","course-card");article.dataset.track=c.track;
      const top=append(article,make("div","course-top"));
      text(append(top,make("span","course-code")),c.id+" · "+tr("filter.semester",{n:c.semester}));
      text(append(top,make("span","course-track")),tracks()[c.track]);
      text(append(article,make("h3")),c.title[lang]);
      text(append(article,make("p")),c.outcome[lang]);
      const bottom=append(article,make("div","course-bottom"));
      const authoredCount=c.topics.filter((_,i)=>Boolean(authoredGuides[c.id+"/"+i])).length;
      text(append(bottom,make("small")),tr("filter.modules",{hours:c.hours})+" · "+(authoredCount ? authoredCount+" "+tr("filter.authored") : tr("filter.syllabus")));
      append(bottom,button(tr("filter.open"),"",()=>openCourse(c)));
      append(grid,article);
    }
    el("course-empty").hidden=matches.length!==0;
    el("course-summary").textContent=tr("filter.result",{n:matches.length});
  }
  function openCourse(course){
    selected=course;renderDetail();
    el("course-detail").hidden=false;
    el("course-detail").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});
  }
  function renderDetail(){
    if(!selected)return;
    const c=selected;
    text(el("detail-label"),tr("detail.label")+" · "+c.id);
    text(el("detail-title"),c.title[lang]);
    text(el("detail-meta"),tr("filter.semester",{n:c.semester})+" · "+tr("filter.modules",{hours:c.hours})+" · "+tracks()[c.track]);
    text(el("detail-outcome"),tr("detail.outcome")+": "+c.outcome[lang]);
    text(el("detail-assessment-text"),c.assessment[lang]);
    const lessons=el("detail-lessons");lessons.replaceChildren();
    localizedTopics(c).forEach((topic,i)=>{
      const card=append(lessons,make("article","lesson"));
      const col=append(card,make("div"));
      text(append(col,make("span","lesson-number")),tr("detail.lesson",{n:i+1}));
      text(append(col,make("h4")),topic);
      const key=c.id+"/"+i;
      const guide=authoredGuides[key];
      if(guide && guide.read?.[lang] && guide.exercise?.[lang]){
        const guided=append(col,make("div","lesson-guide"));
        text(append(guided,make("span","lesson-guide-label")),tr("detail.read"));
        text(append(guided,make("p","lesson-reading")),guide.read[lang]);
        text(append(guided,make("span","lesson-guide-label")),tr("detail.practical"));
        text(append(guided,make("p","lesson-practice")),guide.exercise[lang]);
      }else{
        text(append(col,make("p","lesson-pending")),tr("detail.planned"));
        const extra=append(col,make("p"));extra.style.marginTop="7px";extra.textContent=tr("detail.guide");
      }
      const notebook=append(card,make("div","lesson-notebook"));
      const label=append(notebook,make("label"));label.textContent=tr("detail.notes");label.htmlFor="evidence-"+key;
      const field=append(notebook,make("textarea"));field.id="evidence-"+key;field.maxLength=4000;field.rows=4;field.value=evidence[key]||"";
      field.placeholder=tr("detail.guide");
      const checkbox=append(notebook,make("label","lesson-complete"));
      const input=append(checkbox,make("input"));input.type="checkbox";input.checked=Boolean(progress[key]);input.disabled=field.value.trim().length<80;input.setAttribute("aria-label",topic+" · "+tr("detail.mark"));
      append(checkbox,make("span")).textContent=tr("detail.mark");
      field.addEventListener("input",()=>{
        evidence[key]=field.value;
        save("stt-academia-evidence",JSON.stringify(evidence));
        if(field.value.trim().length<80){
          input.disabled=true;if(input.checked){input.checked=false;delete progress[key];save("stt-academia-progress",JSON.stringify(progress));renderStats();}
        }else input.disabled=false;
      });
      input.addEventListener("change",()=>{
        if(field.value.trim().length<80){input.checked=false;return;}
        if(input.checked)progress[key]=true;else delete progress[key];
        save("stt-academia-progress",JSON.stringify(progress));renderStats();
      });
    });
    const refs=el("detail-resources");refs.replaceChildren();
    for(const id of c.resources){const r=dataset.resources.find(x=>x.id===id);if(!r)continue;const a=append(refs,make("a"));a.href=r.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=r.creator+" ↗";}
  }
  function renderResources(){
    const grid=el("resource-grid");grid.replaceChildren();
    for(const r of dataset.resources){
      const article=append(grid,make("article","resource-card"));
      const top=append(article,make("div","resource-top"));
      text(append(top,make("span")),tracks()[r.track]||tr("filter.languages"));
      text(append(top,make("span")),r.language.toUpperCase()+" · "+r.kind);
      text(append(article,make("h3")),r.title);
      text(append(article,make("p")),r.creator+" · "+tr("resources.external"));
      const link=append(article,make("a"));link.href=r.url;link.rel="noopener noreferrer";link.target="_blank";link.textContent=tr("resources.visit");
      // Privacy: activate third-party iframe only in response to an explicit user click.
      try{
        const original=new URL(r.url);
        const id=original.hostname==="www.youtube.com" && original.pathname==="/watch"
          ? original.searchParams.get("v") : null;
        if(id && /^[a-zA-Z0-9_-]{11}$/.test(id)){
          append(article,button(tr("resources.watch"),"watch-button",()=>openVideo(id,r.title)));
        }
      }catch{ /* External references may be unavailable offline. */ }
    }
  }
  function openVideo(id,title){
    if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
    const area=el("video-viewer"),mount=el("video-mount");
    mount.replaceChildren();
    const frame=append(mount,make("iframe"));
    frame.src="https://www.youtube-nocookie.com/embed/"+id+"?rel=0";
    frame.title=title+" — YouTube";
    frame.setAttribute("allowfullscreen","");
    frame.setAttribute("loading","lazy");
    frame.setAttribute("referrerpolicy","strict-origin-when-cross-origin");
    frame.setAttribute("allow","accelerometer; encrypted-media; gyroscope; picture-in-picture");
    text(el("video-title"),title);
    area.hidden=false;area.scrollIntoView({behavior:"smooth",block:"center"});
  }
  function setupNotebook(){
    const status=el("data-status");
    const announce=message=>{status.textContent=message};
    el("export-progress").addEventListener("click",()=>{
      const data={version:1,progress,evidence};
      const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob);
      const link=make("a");link.href=url;link.download="secure-t-caderno.json";document.body.appendChild(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),5000);
      announce(tr("progress.exportOk"));
    });
    el("import-progress").addEventListener("click",()=>el("import-file").click());
    el("import-file").addEventListener("change",async event=>{
      const file=event.target.files?.[0];event.target.value="";
      if(!file||file.size>1024*1024){announce(tr("progress.importBad"));return;}
      try{
        const incoming=JSON.parse(await file.text());
        if(!incoming||incoming.version!==1||typeof incoming.progress!=="object"||!incoming.progress||
           Array.isArray(incoming.progress)||typeof incoming.evidence!=="object"||!incoming.evidence||
           Array.isArray(incoming.evidence))throw Error("schema");
        const nextEvidence={}, nextProgress={};
        if(Object.keys(incoming.progress).length>240||Object.keys(incoming.evidence).length>240)throw Error("entries");
        for(const [key,value] of Object.entries(incoming.evidence)){
          if(!permittedIds.has(key)||typeof value!=="string"||value.length>4000)throw Error("evidence");
          nextEvidence[key]=value;
        }
        for(const [key,value] of Object.entries(incoming.progress)){
          if(!permittedIds.has(key)||value!==true||(nextEvidence[key]||"").trim().length<80)throw Error("progress");
          nextProgress[key]=true;
        }
        evidence=nextEvidence;progress=nextProgress;
        save("stt-academia-evidence",JSON.stringify(evidence));
        save("stt-academia-progress",JSON.stringify(progress));
        renderStats();if(selected)renderDetail();
        announce(tr("progress.importOk"));
      }catch{announce(tr("progress.importBad"));}
    });
  }
  function renderStats(){
    el("count-courses").textContent=String(dataset.courses.length);
    const value=Object.keys(progress).length/permittedIds.size*100;
    // The first completed unit is 0.4% of the roadmap: never display 0%.
    el("count-progress").textContent=(value>0&&value<1?value.toFixed(1):String(Math.round(value)))+"%";
  }
  const zoneFormats=[
    ["rio","America/Sao_Paulo"],["barcelona","Europe/Madrid"],["dublin","Europe/Dublin"]
  ];
  function renderClocks(){
    for(const [id,timeZone] of zoneFormats){
      const node=el("clock-"+id);
      if(node)node.textContent=new Intl.DateTimeFormat(lang==="pt"?"pt-BR":lang==="es"?"es-ES":"en-GB",{timeZone,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date());
    }
  }
  const say=(utterance)=>{
    if(!voice||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;
    window.speechSynthesis.cancel();
    const speech=new SpeechSynthesisUtterance(utterance.slice(0,1100));
    speech.lang=lang==="pt"?"pt-BR":lang==="es"?"es-ES":"en-GB";
    speech.rate=.95;speech.pitch=1;
    const available=window.speechSynthesis.getVoices();
    const target=available.find(v=>v.lang.toLowerCase().startsWith(lang));
    if(target)speech.voice=target;
    speech.onstart=()=>document.querySelector(".tutor-portrait").classList.add("speaking");
    speech.onend=speech.onerror=()=>document.querySelector(".tutor-portrait").classList.remove("speaking");
    window.speechSynthesis.speak(speech);
  };
  function addMessage(role,body,intro=false){
    const wrap=append(el("chat-history"),make("div","chat-message"+(role==="user"?" mine":"")));
    text(append(wrap,make("small")),tr(role==="user"?"tutor.user":"tutor.assistant"));
    text(append(wrap,make("p")),body);
    chatHistory.push({role,body,node:wrap,intro});
    if(chatHistory.length>22){const item=chatHistory.shift();item.node.remove();}
    el("chat-history").scrollTop=el("chat-history").scrollHeight;
  }
  // Stateful, privacy-preserving academic coaching remains available without
  // browser AI APIs or server calls. It is labeled curricular guidance, not an LLM.
  let tutorState={};
  function localTutor(question){
    const coach=window.SecureTCurriculumTutor;
    if(!coach)return tr("tutor.ask");
    const result=coach.respond({message:question,lang,selected,dataset,guides:authoredGuides,state:tutorState});
    tutorState=result.state;
    return result.text;
  }
  async function tutorReply(message){
    if(!aiSession)return localTutor(message);
    const course=selected;const context=course?course.title[lang]+" / "+localizedTopics(course).join("; "):"Cybersecurity, secure web development, technical languages";
    const prompt="You are a Socratic study tutor for an open, unaccredited cybersecurity and web development academy. Reply in "+lang+". Never claim grades or credentials. Do not give harmful intrusion instructions or fabricate citations. Curriculum: "+context+". Learner question: "+message.slice(0,1200);
    try {return (await aiSession.prompt(prompt)).slice(0,1400);}
    catch {return localTutor(message);}
  }
  async function onSubmit(event){
    event.preventDefault();
    const box=el("tutor-input"),q=box.value.trim();
    if(!q)return;
    box.value="";addMessage("user",q);
    const send=el("tutor-send");send.disabled=true;
    try{const answer=await tutorReply(q);addMessage("assistant",answer);say(answer);}
    finally{send.disabled=false;box.focus();}
  }
  async function enableModel(btn){
    if(aiSession||aiInitializing)return;
    const factory=window.LanguageModel;
    if(!factory||typeof factory.create!=="function"){addMessage("assistant",tr("tutor.noModel"));return;}
    if(!window.confirm(tr("tutor.modelConsent")))return;
    aiInitializing=true;btn.disabled=true;
    try{
      aiSession=await factory.create();
      el("tutor-engine").textContent=tr("tutor.engineAI");
      btn.setAttribute("aria-pressed","true");
    }catch{addMessage("assistant",tr("tutor.noModel"));}
    finally{aiInitializing=false;btn.disabled=false;}
  }
  function setupTutor(){
    addMessage("assistant",tr("tutor.hello"),true);
    el("tutor-form").addEventListener("submit",onSubmit);
    el("tutor-input").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();el("tutor-form").requestSubmit();}});
    const btn=button("IA LOCAL ◇","control",()=>enableModel(btn));
    btn.id="local-ai-optin";btn.setAttribute("aria-label","Opt in to an on-device language model if your browser supports it");
    document.querySelector(".tutor-controls").appendChild(btn);
    el("voice-toggle").addEventListener("click",()=>{
      voice=!voice;el("voice-toggle").setAttribute("aria-pressed",String(voice));
      el("voice-toggle").querySelector("[data-i18n]").textContent=tr(voice?"tutor.audioOn":"tutor.audioOff");
      if(!voice&&window.speechSynthesis)window.speechSynthesis.cancel();
    });
    el("voice-stop").addEventListener("click",()=>{if(window.speechSynthesis)window.speechSynthesis.cancel();document.querySelector(".tutor-portrait").classList.remove("speaking");});
    el("open-tutor").addEventListener("click",()=>el("tutor").scrollIntoView({behavior:"smooth"}));
    el("ask-course").addEventListener("click",()=>{
      el("tutor").scrollIntoView({behavior:"smooth"});
      if(selected)el("tutor-input").value=selected.title[lang]+" — "+localizedTopics(selected)[0]+"?";
      el("tutor-input").focus();
    });
    const recognitionCtor=window.SpeechRecognition||window.webkitSpeechRecognition;
    const mic=el("voice-listen");
    if(!recognitionCtor){mic.disabled=true;mic.title=tr("tutor.noMic");}
    else mic.addEventListener("click",()=>{
      if(listening)return;
      if(!window.confirm(tr("tutor.consent")))return;
      const rec=new recognitionCtor();rec.lang=lang==="pt"?"pt-BR":lang==="es"?"es-ES":"en-GB";rec.maxAlternatives=1;rec.interimResults=false;
      rec.onresult=e=>{const transcript=e.results?.[0]?.[0]?.transcript||"";el("tutor-input").value=transcript;el("tutor-input").focus();};
      rec.onend=rec.onerror=()=>{listening=false;mic.setAttribute("aria-pressed","false");};
      try{rec.start();listening=true;mic.setAttribute("aria-pressed","true");}catch{listening=false;}
    });
  }
  document.querySelectorAll("[data-lang]").forEach(node=>node.addEventListener("click",()=>setLang(node.dataset.lang)));
  el("search-courses").addEventListener("input",e=>{search=e.target.value.slice(0,120);renderCourses();});
  el("close-detail").addEventListener("click",()=>{el("course-detail").hidden=true;selected=null;});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!el("course-detail").hidden){el("course-detail").hidden=true;selected=null;}});
  el("video-close").addEventListener("click",()=>{
    el("video-mount").replaceChildren();el("video-viewer").hidden=true;
  });
  el("year").textContent=String(new Date().getFullYear());
  if("serviceWorker" in navigator && location.protocol!=="file:"){
    navigator.serviceWorker.register("../sw.js").catch(()=>{});
  }
  setupNotebook();setupTutor();setLang(lang);renderStats();renderClocks();setInterval(renderClocks,30000);
})();
