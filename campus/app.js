// campus app: quiz player + stagger + audit (sin dependencias)
document.documentElement.classList.add('js');

const $ = (sel, root = document) => root.querySelector(sel);

let quizController = null;
function loadQuiz(url) {
  const box = $('.quiz-box');
  if (!box) return;
  quizController?.abort();
  const controller = new AbortController();
  quizController = controller;
  const titulo = $('.quiz-titulo', box), opciones = $('.opciones', box);
  const feedback = $('.feedback', box), marcador = $('.marcador', box);
  const next = $('.quiz-siguiente', box);
  opciones.replaceChildren();
  feedback.textContent = '';
  marcador.textContent = '';
  next.hidden = true;
  next.onclick = null;
  if (!/^cursos\/(?:ciber-ofensiva|ciber-defensiva|ia-aplicada-segura|gobernanza-compliance)\/quiz\.json$/.test(url)) {
    titulo.textContent = 'Cuestionario no disponible.';
    return;
  }
  titulo.textContent = 'Cargando preguntas…';
  fetch(url, {signal: controller.signal}).then(response => {
    if (!response.ok) throw Error('HTTP ' + response.status);
    return response.json();
  }).then(items => {
    if (controller.signal.aborted) return;
    if (!Array.isArray(items) || items.length < 1 || items.length > 50 || items.some(q =>
      !q || typeof q !== 'object' || Array.isArray(q) ||
      typeof q.pregunta !== 'string' || !q.pregunta.trim() || q.pregunta.length > 800 ||
      !Array.isArray(q.opciones) || q.opciones.length < 2 || q.opciones.length > 6 ||
      !q.opciones.every(o => typeof o === 'string' && !!o.trim() && o.length <= 500) ||
      !Number.isInteger(q.correcta) || q.correcta < 0 || q.correcta >= q.opciones.length ||
      typeof q.explicacion !== 'string' || !q.explicacion.trim() || q.explicacion.length > 1500))
      throw Error('Invalid quiz');
    let idx = 0, score = 0, answered = false;
    const render = () => {
      answered = false;
      const q = items[idx];
      titulo.textContent = (idx + 1) + '/' + items.length + ' · ' + q.pregunta;
      opciones.replaceChildren();
      feedback.textContent = '';
      marcador.textContent = 'Aciertos: ' + score;
      next.hidden = true;
      q.opciones.forEach((option, i) => {
        const choice = document.createElement('button');
        choice.type = 'button';
        choice.className = 'opcion';
        choice.textContent = option;
        choice.addEventListener('click', () => {
          if (answered || controller.signal.aborted) return;
          answered = true;
          Array.from(opciones.children).forEach((el, j) => {
            el.classList.add(j === q.correcta ? 'correcta' : 'fallo');
            el.disabled = true;
          });
          if (i === q.correcta) score++;
          feedback.textContent = (i === q.correcta ? 'Correcto. ' :
            'Incorrecto. Respuesta correcta: ' + q.opciones[q.correcta] + '. ') + q.explicacion;
          marcador.textContent = 'Aciertos: ' + score;
          next.textContent = idx === items.length - 1 ? 'Finalizar' : 'Siguiente';
          next.hidden = false;
        }, {once: true});
        opciones.append(choice);
      });
    };
    next.onclick = () => {
      if (controller.signal.aborted || !answered) return;
      if (idx === items.length - 1) {
        titulo.textContent = 'Práctica finalizada: ' + score + '/' + items.length;
        opciones.replaceChildren();
        feedback.textContent = 'Práctica formativa: no constituye una certificación.';
        marcador.textContent = 'Resultado: ' + Math.round(score * 100 / items.length) + '%';
        next.hidden = true;
        next.onclick = null;
      } else {
        idx++;
        render();
      }
    };
    render();
  }).catch(() => {
    if (controller.signal.aborted) return;
    titulo.textContent = 'No se pudo cargar el cuestionario.';
    opciones.replaceChildren();
    marcador.textContent = '';
    feedback.textContent = 'Comprueba la conexión o prepara el campus para uso offline.';
    next.hidden = true;
    next.onclick = null;
  });
}

// stagger sutil de tarjetas (respeta reduced-motion)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduced) {
  document.querySelectorAll('.card').forEach((el, i) => {
    el.style.animation = 'rise var(--dur-slow) var(--ease-out) both';
    el.style.animationDelay = `${Math.min(i * 60, 300)}ms`;
  });
  const st = document.createElement('style');
  st.textContent = '@keyframes rise{from{opacity:0;transform:translateY(8px)}}';
  document.head.appendChild(st);
}

// auditoria rapida de accesibilidad (consola)
window.uiAudit = () => {
  const issues = [];
  document.querySelectorAll('img:not([alt])').forEach(() =>
    issues.push('img sin alt'));
  document.querySelectorAll('a, button').forEach(el => {
    const r = el.getBoundingClientRect();
    if ((r.width < 44 || r.height < 44) && !el.disabled)
      issues.push(`Target pequeno: ${el.tagName}`);
  });
  return issues;
};

// registro offline
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

document.querySelectorAll('.quiz-json').forEach(el => loadQuiz(el.dataset.src));
