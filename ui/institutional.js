/* Secure T institutional landing: no external dependencies, no analytics, no HTML injection. */
(() => {
  'use strict';
  const translations = {
    pt: {
      'skip':'Ir para o conteúdo','brand.sub':'FORMAÇÃO EM SEGURANÇA DIGITAL','nav.paths':'Como começar','nav.courses':'Cursos','nav.method':'Método','nav.academy':'Academia','language.label':'Idioma',
      'hero.label':'EDUCAÇÃO ABERTA · CIBERSEGURANÇA','hero.title':'Segurança digital, aprendida com critério.','hero.lead':'Aprenda a identificar riscos, interpretar evidências e tomar decisões responsáveis. Formação estruturada, exercícios práticos e cenários simulados.','hero.primary':'Entrar no campus','hero.secondary':'Explorar os cursos','hero.note':'Acesso gratuito e sem cadastro. Projeto educativo independente; não emite diplomas oficiais.',
      'case.series':'CADERNO DE PRÁTICA','case.mode':'EXEMPLO DIDÁTICO','case.tag':'ANÁLISE DE INCIDENTES','case.title':'De um alerta a uma decisão fundamentada.','case.body':'Um exercício não se resume a clicar em botões: é preciso explicar o que foi observado e justificar a decisão.','case.step1':'Analisar o sinal e seu contexto','case.step2':'Confrontar hipóteses com evidências','case.step3':'Priorizar e documentar a resposta','case.note':'Caso didático. Sem conexão com sistemas reais.',
      'paths.label':'SEU PONTO DE PARTIDA','route.title':'O que você gostaria de aprender primeiro?','paths.intro':'Você não precisa entender toda a plataforma antes de começar. Escolha uma entrada, avance no seu ritmo e descubra as outras ferramentas quando precisar.',
      'paths.first.label':'ORIENTAÇÃO','paths.second.label':'FORMAÇÃO','paths.third.label':'PRÁTICA','route.first.title':'Comece com sua primeira missão','route.first.desc':'Um percurso guiado para encontrar uma prática adequada ao seu momento.','route.second.title':'Aprenda a defender sistemas','route.second.desc':'Aulas, exercícios e evidências de resposta a incidentes.','route.third.title':'Tome uma decisão SOC','route.third.desc':'Entre em uma simulação de triagem de segurança e pratique com contexto.',
      'courses.label':'FORMAÇÃO DISPONÍVEL','courses.title':'Quatro áreas para construir uma base sólida.','courses.intro':'Cada curso tem um programa de vinte semanas, aulas e recursos para praticar. Acesse o conteúdo sem matrícula ou promessa de certificação oficial.',
      'course.def.title':'Cibersegurança defensiva','course.def.desc':'Telemetria, análise de alertas, resposta a incidentes e operações de SOC.','course.off.title':'Cibersegurança ofensiva','course.off.desc':'Ética, escopo autorizado, reconhecimento, riscos web e documentação técnica.','course.ai.title':'IA aplicada e segura','course.ai.desc':'Modelos, avaliação de riscos e uso responsável de inteligência artificial.','course.gov.title':'Governança e conformidade','course.gov.desc':'Gestão de riscos, políticas, controles e referenciais aplicados.','course.meta':'20 semanas · Acesso aberto',
      'method.label':'APRENDER · PRATICAR · ARGUMENTAR','method.title':'A prática precisa deixar uma explicação.','method.body':'Priorizamos o raciocínio acima dos efeitos de interface. Os laboratórios usam cenários sintéticos, oferecem feedback e mantêm o progresso localmente no navegador quando disponível.','method.link':'Abrir Threat Studio','method.item1':'Compreender o que você está observando.','method.item2':'Tomar uma decisão em um ambiente seguro.','method.item3':'Rever as evidências e aprender com o resultado.',
      'academy.label':'O PROJETO A LONGO PRAZO','academy.title':'Uma academia digital em construção.','academy.body':'Além dos quatro cursos disponíveis, há um roteiro curricular de cinco anos. As novas disciplinas são planos de estudo — ainda não são cursos completos nem diplomas reconhecidos.','academy.link':'Ver o plano acadêmico',
      'footer.text':'© Secure T · Educação aberta e responsável. Projeto independente.','footer.campus':'Campus','footer.story':'História','footer.security':'Segurança','footer.code':'Código-fonte'
    },
    es: {
      'skip':'Saltar al contenido','brand.sub':'FORMACIÓN EN SEGURIDAD DIGITAL','nav.paths':'Cómo empezar','nav.courses':'Cursos','nav.method':'Método','nav.academy':'Academia','language.label':'Idioma',
      'hero.label':'EDUCACIÓN ABIERTA · CIBERSEGURIDAD','hero.title':'Seguridad digital, aprendida con criterio.','hero.lead':'Aprende a identificar riesgos, interpretar evidencias y tomar decisiones responsables. Formación estructurada, ejercicios prácticos y escenarios de simulación.','hero.primary':'Entrar al campus','hero.secondary':'Explorar los cursos','hero.note':'Acceso gratuito y sin registro. Proyecto educativo independiente; no emite títulos oficiales.',
      'case.series':'CUADERNO DE PRÁCTICA','case.mode':'EJEMPLO FORMATIVO','case.tag':'ANÁLISIS DE INCIDENTES','case.title':'De una alerta a una decisión fundamentada.','case.body':'Un ejercicio no consiste en pulsar botones: consiste en explicar lo observado y justificar lo que harías.','case.step1':'Analizar la señal y su contexto','case.step2':'Contrastar hipótesis con evidencias','case.step3':'Priorizar y documentar la respuesta','case.note':'Caso didáctico. Sin conexión a sistemas reales.',
      'paths.label':'TU PUNTO DE PARTIDA','route.title':'¿Qué quieres aprender primero?','paths.intro':'No necesitas entender toda la plataforma antes de empezar. Elige una entrada y avanza a tu ritmo; el resto de herramientas permanece disponible cuando lo necesites.',
      'paths.first.label':'ORIENTACIÓN','paths.second.label':'FORMACIÓN','paths.third.label':'PRÁCTICA','route.first.title':'Empieza tu primera misión','route.first.desc':'Una ruta guiada para encontrar prácticas adaptadas a tu experiencia.','route.second.title':'Aprende a defender sistemas','route.second.desc':'Clases, ejercicios y evidencias de respuesta a incidentes.','route.third.title':'Toma una decisión SOC','route.third.desc':'Entra en una simulación de triaje y practica decisiones de seguridad.',
      'courses.label':'FORMACIÓN DISPONIBLE','courses.title':'Cuatro áreas para construir una base sólida.','courses.intro':'Cada curso tiene un temario de veinte semanas, lecciones y recursos para practicar. Puedes entrar directamente al contenido, sin matrícula ni promesas de certificación oficial.',
      'course.def.title':'Ciberseguridad defensiva','course.def.desc':'Telemetría, análisis de alertas, respuesta a incidentes y operaciones de un SOC.','course.off.title':'Ciberseguridad ofensiva','course.off.desc':'Ética, alcance autorizado, reconocimiento, riesgos web y documentación técnica.','course.ai.title':'IA aplicada y segura','course.ai.desc':'Modelos, evaluación de riesgos y uso responsable de inteligencia artificial.','course.gov.title':'Gobernanza y cumplimiento','course.gov.desc':'Gestión de riesgos, políticas, controles y marcos de referencia aplicados.','course.meta':'20 semanas · Acceso abierto',
      'method.label':'APRENDER · PRACTICAR · ARGUMENTAR','method.title':'La práctica tiene que dejar una explicación.','method.body':'Priorizamos el razonamiento sobre los efectos de interfaz. Los laboratorios usan escenarios sintéticos, las respuestas incluyen retroalimentación y el progreso se conserva localmente en tu navegador cuando la herramienta lo permite.','method.link':'Abrir Threat Studio','method.item1':'Comprender qué estás observando.','method.item2':'Tomar una decisión dentro de un entorno seguro.','method.item3':'Revisar la evidencia y aprender del resultado.',
      'academy.label':'EL PROYECTO A LARGO PLAZO','academy.title':'Una academia digital en construcción.','academy.body':'Además de los cuatro cursos disponibles, existe un itinerario curricular de cinco años. Las nuevas asignaturas son planes de estudio; todavía no representan cursos completos ni títulos acreditados.','academy.link':'Ver el plan académico',
      'footer.text':'© Secure T · Educación abierta y responsable. Proyecto independiente.','footer.campus':'Campus','footer.story':'Historia','footer.security':'Seguridad','footer.code':'Código fuente'
    },
    en: {
      'skip':'Skip to content','brand.sub':'DIGITAL SECURITY EDUCATION','nav.paths':'Where to start','nav.courses':'Courses','nav.method':'Approach','nav.academy':'Academy','language.label':'Language',
      'hero.label':'OPEN EDUCATION · CYBERSECURITY','hero.title':'Digital security, learned with judgment.','hero.lead':'Learn to identify risks, interpret evidence and make responsible decisions. Structured learning, hands-on exercises and safe simulated scenarios.','hero.primary':'Enter the campus','hero.secondary':'Explore courses','hero.note':'Free access with no registration. An independent learning project; no accredited degrees are issued.',
      'case.series':'PRACTICE NOTEBOOK','case.mode':'LEARNING EXAMPLE','case.tag':'INCIDENT ANALYSIS','case.title':'From one alert to a reasoned decision.','case.body':'Practice is more than clicking buttons: explain what you observed and justify the decision you would make.','case.step1':'Analyse the signal and context','case.step2':'Test hypotheses against evidence','case.step3':'Prioritise and document a response','case.note':'Training scenario. No connection to live systems.',
      'paths.label':'START HERE','route.title':'What would you like to learn first?','paths.intro':'You do not need to understand the entire platform to get started. Choose a route, proceed at your pace and explore more tools only when needed.',
      'paths.first.label':'ORIENTATION','paths.second.label':'LEARNING','paths.third.label':'PRACTICE','route.first.title':'Start your first mission','route.first.desc':'A guided path to find hands-on learning suited to your experience.','route.second.title':'Learn to defend systems','route.second.desc':'Lessons, exercises and incident-response evidence.','route.third.title':'Make a SOC decision','route.third.desc':'Try an incident triage simulation and practice security decisions.',
      'courses.label':'AVAILABLE EDUCATION','courses.title':'Four disciplines to build a solid foundation.','courses.intro':'Each course has a twenty-week syllabus, lessons and practice resources. Access the material directly, with no enrolment or claims of official accreditation.',
      'course.def.title':'Defensive cybersecurity','course.def.desc':'Telemetry, alert analysis, incident response and security operations.','course.off.title':'Offensive cybersecurity','course.off.desc':'Ethics, authorised scope, reconnaissance, web risks and technical reporting.','course.ai.title':'Applied and safe AI','course.ai.desc':'Models, risk evaluation and responsible use of artificial intelligence.','course.gov.title':'Governance and compliance','course.gov.desc':'Risk management, policies, controls and applied frameworks.','course.meta':'20 weeks · Open access',
      'method.label':'LEARN · PRACTISE · EXPLAIN','method.title':'Good practice leaves a clear explanation.','method.body':'Reasoning matters more than flashy interfaces. Labs use synthetic scenarios, provide feedback and keep your progress locally in your browser when supported.','method.link':'Open Threat Studio','method.item1':'Understand what you are observing.','method.item2':'Make a decision in a safe environment.','method.item3':'Review the evidence and learn from the result.',
      'academy.label':'THE LONG-TERM PROJECT','academy.title':'A digital academy in development.','academy.body':'Alongside four available courses, there is a five-year curriculum roadmap. New subjects are study plans, not yet complete courses or accredited degrees.','academy.link':'View the academic plan',
      'footer.text':'© Secure T · Open and responsible education. Independent project.','footer.campus':'Campus','footer.story':'Our story','footer.security':'Security','footer.code':'Source code'
    }
  };
  const selector = document.getElementById('language');
  if (!selector) return;
  const allowed = new Set(Object.keys(translations));
  function initialLanguage() {
    let chosen;
    try {
      const query = new URL(location.href).searchParams.get('lang');
      if (allowed.has(query)) return query;
      chosen = localStorage.getItem('stt-lang');
    } catch { /* no storage available */ }
    if (allowed.has(chosen)) return chosen;
    const browser = (navigator.language || '').slice(0, 2).toLowerCase();
    return allowed.has(browser) ? browser : 'es';
  }
  function apply(lang) {
    if (!allowed.has(lang)) return;
    const dict = translations[lang];
    document.documentElement.lang = lang;
    selector.value = lang;
    document.querySelectorAll('[data-copy], [data-i18n]').forEach(el => {
      const key = el.getAttribute('data-copy') || el.getAttribute('data-i18n');
      if (Object.prototype.hasOwnProperty.call(dict, key)) el.textContent = dict[key];
    });
    document.title = {
      es:'Secure T — Formación en seguridad digital',
      pt:'Secure T — Formação em segurança digital',
      en:'Secure T — Digital security education'
    }[lang];
    try { localStorage.setItem('stt-lang', lang); } catch { /* optional */ }
  }
  selector.addEventListener('change', () => apply(selector.value));
  apply(initialLanguage());
})();