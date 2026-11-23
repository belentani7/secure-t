(() => {
"use strict";
const config = JSON.parse(document.getElementById("lesson-config").textContent);
const $ = (q) => document.querySelector(q);
const content = $("#leccion");
const status = $("#estado");
const escape = (s) => String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const stash = [];
function rich(text) {
  let value = escape(text);
  value = value.replace(/`([^`]+)`/g, (_, match) => {
    const id = "___CODE_" + stash.length + "___";
    stash.push("<code>" + match + "</code>");
    return id;
  });
  value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    if (/^https:\/\//i.test(href)) return '<a href="' + escape(href) + '" rel="noopener noreferrer" target="_blank">' + label + "</a>";
    return label;
  });
  value = value.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>");
  value = value.replace(/\*([^*]+)\*/g,"<em>$1</em>");
  return value.replace(/___CODE_(\d+)___/g, (_, id) => stash[Number(id)]);
}
function renderMarkdown(markdown) {
  const result = [];
  let list = "", code = false, paragraph = [];
  function flush() {
    if (paragraph.length) { result.push("<p>" + rich(paragraph.join(" ")) + "</p>"); paragraph = []; }
    if (list) { result.push("</" + list + ">"); list = ""; }
  }
  for (const raw of markdown.replace(/\r/g,"").split("\n")) {
    const line = raw.trimEnd();
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      flush(); code = !code;
      result.push(code ? '<pre><code>' : "</code></pre>");
      continue;
    }
    if (code) { result.push(escape(raw) + "\n"); continue; }
    if (!trimmed) { flush(); continue; }
    const heading = trimmed.match(/^(#{1,5})\s+(.+)$/);
    if (heading) { flush(); const depth = Math.min(6,heading[1].length + 1); result.push("<h" + depth + ">" + rich(heading[2]) + "</h" + depth + ">"); continue; }
    if (/^---+$/.test(trimmed)) { flush(); result.push("<hr>"); continue; }
    const unordered = /^[-*]\s+(.+)$/.exec(trimmed);
    const ordered = /^\d+[.)]\s+(.+)$/.exec(trimmed);
    if (unordered || ordered) {
      if (paragraph.length) { result.push("<p>" + rich(paragraph.join(" ")) + "</p>"); paragraph = []; }
      const kind = unordered ? "ul" : "ol";
      if (list && list !== kind) { result.push("</" + list + ">"); list = ""; }
      if (!list) { result.push("<" + kind + ">"); list = kind; }
      result.push("<li>" + rich((unordered || ordered)[1]) + "</li>");
      continue;
    }
    if (trimmed.startsWith(">")) { flush(); result.push("<blockquote>" + rich(trimmed.replace(/^>\s*/,"")) + "</blockquote>"); continue; }
    if (list) { result.push("</" + list + ">"); list = ""; }
    paragraph.push(trimmed);
  }
  flush();
  if (code) result.push("</code></pre>");
  return result.join("\n");
}
function findSection(text, pattern) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex(line => /^#{2,3}\s+/.test(line) && pattern.test(line));
  if (start < 0) return "";
  const level = lines[start].match(/^#+/)[0].length;
  let end = start + 1;
  for (; end < lines.length; end++) {
    const heading = lines[end].match(/^(#+)\s/);
    if (heading && heading[1].length <= level) break;
  }
  return lines.slice(start,end).join("\n").trim();
}
function notebook(source) {
  const block = findSection(source,/objetivo|competencia/i);
  const goals = (block.match(/^[-*]\s+(.+)/gm) || []).map(line => line.replace(/^[-*]\s+/,"")).slice(0,8);
  if (!goals.length) goals.push("Comprender la temática: " + config.title, "Identificar una aplicación autorizada", "Documentar una evidencia y una duda");
  content.innerHTML = "<h2>Cuaderno de aprendizaje</h2><p>Marca lo que has contrastado. Las respuestas no se envían a ningún servidor; exporta tus notas cuando termines.</p>";
  const group=document.createElement("div");
  goals.forEach((goal,i)=>{
    const label=document.createElement("label");
    label.className="check-row";
    const box=document.createElement("input");box.type="checkbox";box.dataset.goal=String(i);
    const span=document.createElement("span");span.textContent=goal;
    label.append(box,span);group.appendChild(label);
  });
  content.appendChild(group);
  const form=document.createElement("div");form.className="notebook";
  const label=document.createElement("label");label.htmlFor="notas";label.textContent="Evidencias y reflexión";
  const field=document.createElement("textarea");field.id="notas";field.placeholder="Qué he comprendido, qué he comprobado, qué preguntas quedan…";
  const button=document.createElement("button");button.type="button";button.textContent="Exportar cuaderno .txt";
  const feedback=document.createElement("p");feedback.setAttribute("role","status");
  form.append(label,field,button,feedback);content.appendChild(form);
  function progress(){feedback.textContent=group.querySelectorAll("input:checked").length+" de "+goals.length+" objetivos revisados en esta sesión.";}
  group.addEventListener("change",progress);progress();
  button.addEventListener("click",()=>{
    const notes=[config.title,config.slug,"Semana "+config.num,"OBJETIVOS",...goals.map((g,i)=>(group.querySelectorAll("input")[i].checked?"[x] ":"[ ] ")+g),"EVIDENCIAS",field.value].join("\n");
    const object=URL.createObjectURL(new Blob([notes],{type:"text/plain;charset=utf-8"}));
    const a=document.createElement("a");a.href=object;a.download=config.slug+"-semana-"+String(config.num).padStart(2,"0")+"-evidencias.txt";a.click();
    setTimeout(()=>URL.revokeObjectURL(object),1000);
    feedback.textContent="Archivo preparado; guárdalo para conservar tus notas.";
  });
}
fetch(config.src,{credentials:"same-origin"})
 .then(async response=>{if(!response.ok)throw Error("HTTP "+response.status);return response.text();})
 .then(text=>{
   if(config.type==="lectura"){content.innerHTML=renderMarkdown(text);status.textContent="Lectura completa cargada desde el currículo original.";}
   else if(config.type==="practica"){
     const exer=findSection(text,/ejercicio|práctica|practica|actividad|laboratorio/i);
     if(exer && exer.length>70){content.innerHTML="<p>Actividad extraída del contenido de esta semana. Realízala solo en un entorno de laboratorio autorizado.</p>"+renderMarkdown(exer);status.textContent="Práctica del documento original cargada.";}
     else {content.innerHTML="<p>El origen no identifica una sección de práctica independiente: consulta el texto completo antes de formular una actividad.</p><p><a href='semana-"+String(config.num).padStart(2,"0")+"-lectura.html'>Ir a la lectura completa</a></p>";status.textContent="No hay sección de ejercicio diferenciada en la fuente.";}
   }else {notebook(text);status.textContent="Objetivos extraídos del documento original. Registro solo de la sesión actual.";}
 }).catch(()=>{
   status.textContent="No se ha podido cargar el Markdown desde esta instalación. Verifica que el sitio se ha compilado con el campus completo.";
   content.innerHTML='<p>La semana está identificada como <strong>'+escape(config.title)+'</strong>.</p><p><a href="'+escape(config.src)+'">Abrir documento fuente</a></p>';
 });
})();
