/* Secure T Workstation: educational command interpreter, never a system shell.
   Static datasets only. No fetch, WebSocket, eval, external requests or code execution. */
(() => {
  "use strict";
  const cases = window.SecureTWorkstationCases;
  const readme = window.SecureTWorkstationReadme;
  if (!Array.isArray(cases) || cases.length !== 3) {
    throw new Error("No se han podido cargar los escenarios educativos.");
  }
  const $ = id => document.getElementById(id);
  const caseIds = cases.map(item => item.id);
  const storageKey = "secure-t.workstation.v1";
  const emptyRecord = () => ({ action: "", confidence: "low", notes: "", reviewed: false });
  const byId = id => cases.find(item => item.id === id) || cases[0];
  const cleanRecord = raw => {
    const input = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    return {
      action: ["verify", "quarantine", "preserve", "ignore", "scan"].includes(input.action) ? input.action : "",
      confidence: ["low", "medium", "high"].includes(input.confidence) ? input.confidence : "low",
      notes: typeof input.notes === "string" ? input.notes.slice(0, 4000) : "",
      reviewed: input.reviewed === true
    };
  };
  function normalize(raw) {
    const records = Object.create(null);
    for (const id of caseIds) records[id] = cleanRecord(raw && raw.records && raw.records[id]);
    return { schema: "secure-t.workstation.v1", records };
  }
  function initialState() {
    try {
      const text = localStorage.getItem(storageKey);
      return text && text.length <= 65000 ? normalize(JSON.parse(text)) : normalize(null);
    } catch (_) { return normalize(null); }
  }
  let data = initialState();
  let current = "auth";
  let activePanel = "dashboard";
  let storageAvailable = true;
  const files = Object.create(null);
  for (const entry of cases) files["/cases/" + entry.id + ".log"] = entry.logs.join("\n");
  files["/cases/README.txt"] = readme;
  const fileNames = Object.keys(files);
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(data)); storageAvailable = true; }
    catch (_) { storageAvailable = false; }
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function setStatus(message) { $("evidence-result").textContent = message; }
  function reviewedCount() { return caseIds.filter(id => data.records[id].reviewed).length; }
  function refreshProgress() {
    $("progress-count").textContent = reviewedCount() + " / " + cases.length;
    $("dashboard-cases").replaceChildren();
    for (const c of cases) {
      const card = element("article", "scenario");
      const head = element("header");
      head.append(element("span", "tag", c.code), element("span", "severity", c.level));
      card.append(head, element("h3", "", c.name), element("p", "", c.description));
      const button = element("button", "", data.records[c.id].reviewed ? "Revisado ✓ · reabrir ↗" : "Investigar caso ↗");
      button.type = "button";
      button.addEventListener("click", () => { current = c.id; renderCase(); openPanel("cases"); });
      card.append(button);
      $("dashboard-cases").append(card);
    }
    renderCaseList();
  }
  function openPanel(panel) {
    const panels = ["dashboard", "terminal", "cases", "notebook", "guide"];
    if (!panels.includes(panel)) return;
    activePanel = panel;
    const names = { dashboard: "Escritorio de aprendizaje", terminal: "Terminal simulado", cases: "Centro de incidentes", notebook: "Cuaderno de evidencia", guide: "Guía de estudio" };
    $("location-title").textContent = names[panel];
    for (const name of panels) $("panel-" + name).hidden = name !== panel;
    document.querySelectorAll("[data-panel]").forEach(button => {
      const active = button.dataset.panel === panel;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (panel === "cases") renderCase();
    if (panel === "notebook") loadNotebook();
    if (panel === "terminal") $("terminal-command").focus();
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  document.querySelectorAll("[data-panel]").forEach(button => {
    button.addEventListener("click", () => openPanel(button.dataset.panel));
  });
  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => openPanel(button.dataset.go));
  });
  function renderCaseList() {
    $("case-list").replaceChildren();
    for (const c of cases) {
      const button = element("button");
      button.type = "button";
      button.setAttribute("aria-current", String(c.id === current));
      button.append(element("strong", "", c.code + " · " + c.area), element("small", "", c.name));
      button.addEventListener("click", () => { current = c.id; renderCase(); });
      $("case-list").append(button);
    }
  }
  function renderCase() {
    renderCaseList();
    const c = byId(current);
    const target = $("case-detail");
    target.replaceChildren();
    target.append(element("span", "chip", c.level + " / FICTICIO"), element("h2", "", c.name), element("p", "", c.description));
    target.append(element("h3", "", "Registros observables"));
    const pre = element("pre", "", c.logs.join("\n"));
    pre.tabIndex = 0;
    target.append(pre, element("h3", "", "Indicadores en el dataset"));
    const ul = element("ul");
    for (const indicator of c.indicators) ul.append(element("li", "", indicator));
    target.append(ul, element("h3", "", "Pregunta de análisis"), element("p", "", c.task));
    target.append(element("h3", "", "Pauta del instructor"), element("p", "", c.lesson));
    const actions = element("div", "case-cta");
    const terminal = element("button", "secondary", "Investigar en terminal ↗");
    terminal.type = "button";
    terminal.addEventListener("click", () => {
      openPanel("terminal");
      execute("cat " + c.paths[0]);
    });
    const notebook = element("button", "primary", "Documentar evidencia ↗");
    notebook.type = "button";
    notebook.addEventListener("click", () => { $("evidence-case").value = c.id; openPanel("notebook"); });
    actions.append(terminal, notebook);
    target.append(actions);
  }
  function execute(input) {
    const line = String(input).trim().slice(0, 160);
    if (!line) return;
    print("student@secure-t:~$ " + line, "command");
    const tokens = line.split(/\s+/);
    const cmd = tokens[0].toLowerCase();
    let output = "";
    let error = false;
    if (tokens.length > 3 || /[;&|<>\`$(){}]/.test(line)) {
      output = "Este entorno no admite shell, tuberías, redirecciones ni scripts.";
      error = true;
    } else if (cmd === "help") {
      output = "COMANDOS DIDÁCTICOS\nhelp           muestra ayuda\npwd            ubicación simulada\nls             lista archivos ficticios\ncat <ruta>     muestra un archivo disponible\ngrep <texto> <ruta>  filtra registros (texto sin espacios)\nhead <ruta>    primeras cinco líneas\ntimeline       cronología conjunta de casos\ncase <id>      abre un caso: auth, mail, integrity\nwhoami         identidad simulada\nclear          limpiar salida";
    } else if (cmd === "whoami") output = "student (rol ficticio, sin acceso a sistemas reales)";
    else if (cmd === "pwd") output = "/cases";
    else if (cmd === "ls") output = fileNames.join("\n");
    else if (cmd === "cat" || cmd === "head") {
      if (tokens.length !== 2 || !Object.hasOwn(files, tokens[1])) {
        output = "Archivo inexistente. Usa ls para ver las rutas permitidas."; error = true;
      } else {
        output = cmd === "head" ? files[tokens[1]].split("\n").slice(0, 5).join("\n") : files[tokens[1]];
      }
    } else if (cmd === "grep") {
      if (tokens.length !== 3 || !Object.hasOwn(files, tokens[2]) || !tokens[1]) {
        output = "Uso: grep <texto> <ruta-que-aparece-en-ls>"; error = true;
      } else {
        output = files[tokens[2]].split("\n").filter(row => row.toLowerCase().includes(tokens[1].toLowerCase())).join("\n") || "(Sin coincidencias)";
      }
    } else if (cmd === "timeline") {
      output = cases.flatMap(c => c.logs).sort().join("\n");
    } else if (cmd === "case") {
      if (tokens.length === 2 && caseIds.includes(tokens[1])) {
        current = tokens[1]; output = "Caso " + current + " abierto en Centro de incidentes."; openPanel("cases");
      } else { output = "Casos válidos: " + caseIds.join(", "); error = true; }
    } else if (cmd === "clear") {
      $("terminal-output").replaceChildren(); return;
    } else {
      output = "Comando no disponible: " + cmd + ". Escribe help. Ningún comando se ejecuta fuera de esta página.";
      error = true;
    }
    print(output, error ? "error" : "info");
  }
  function print(text, className) {
    const box = $("terminal-output");
    box.append(element("p", "line " + className, text));
    while (box.childElementCount > 100) box.firstElementChild.remove();
    box.scrollTop = box.scrollHeight;
  }
  $("terminal-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("terminal-command");
    execute(input.value);
    input.value = "";
  });
  $("terminal-clear").addEventListener("click", () => $("terminal-output").replaceChildren());
  function loadNotebook() {
    const id = $("evidence-case").value;
    const record = data.records[id] || emptyRecord();
    $("evidence-action").value = record.action;
    $("evidence-confidence").value = record.confidence;
    $("evidence-notes").value = record.notes;
    $("evidence-attest").checked = false;
    setStatus(record.reviewed ? "Caso revisado previamente. Puedes editar la evidencia; una revisión nueva actualizará el estado." : "");
  }
  function storeDraft() {
    const id = $("evidence-case").value;
    if (!caseIds.includes(id)) return;
    const record = data.records[id];
    const changed = record.action !== $("evidence-action").value || record.notes !== $("evidence-notes").value || record.confidence !== $("evidence-confidence").value;
    record.action = $("evidence-action").value;
    record.confidence = $("evidence-confidence").value;
    record.notes = $("evidence-notes").value.slice(0, 4000);
    if (changed) record.reviewed = false;
    persist();
    if (!storageAvailable) setStatus("Atención: el navegador bloquea el guardado. Exporta el JSON antes de cerrar la pestaña.");
  }
  $("evidence-case").addEventListener("change", loadNotebook);
  for (const id of ["evidence-action", "evidence-confidence", "evidence-notes"]) {
    $(id).addEventListener("input", () => { storeDraft(); refreshProgress(); });
  }
  $("evidence-form").addEventListener("submit", event => {
    event.preventDefault();
    storeDraft();
    const c = byId($("evidence-case").value);
    const record = data.records[c.id];
    const length = record.notes.trim().length;
    const correct = record.action === c.response;
    const committed = $("evidence-attest").checked;
    if (!correct || length < 100 || !committed) {
      data.records[c.id].reviewed = false;
      persist(); refreshProgress();
      const guidance = !correct ? "La primera respuesta no es proporcional al escenario. Pista: " + c.conclusion :
        length < 100 ? "Describe al menos 100 caracteres entre observaciones, hipótesis y próximos pasos." :
          "Confirma el alcance autorizado y diferencia hechos de hipótesis.";
      setStatus("Revisión incompleta. " + guidance);
      return;
    }
    record.reviewed = true;
    persist(); refreshProgress();
    setStatus("Autoevaluación estructural superada para " + c.code + ". Aún requiere revisión humana de la calidad y exactitud del informe. " +
      (!storageAvailable ? "Exporta el archivo: el guardado local no está disponible." : "Progreso guardado solo en este dispositivo."));
  });
  function exportEvidence() {
    storeDraft();
    const payload = JSON.stringify({ schema: "secure-t.workstation.v1", exportedAt: new Date().toISOString(), records: data.records }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "secure-t-cuaderno.json";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    setStatus("Archivo JSON preparado para descarga local. No se ha enviado a ningún servidor.");
  }
  $("export-evidence").addEventListener("click", exportEvidence);
  $("import-evidence").addEventListener("click", () => $("evidence-file").click());
  $("evidence-file").addEventListener("change", async event => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 65000) { setStatus("Archivo rechazado: tamaño máximo 65 KB."); return; }
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || parsed.schema !== "secure-t.workstation.v1" || !parsed.records || typeof parsed.records !== "object" || Array.isArray(parsed.records)) {
        throw new Error("Formato incompatible");
      }
      data = normalize(parsed);
      persist(); refreshProgress(); loadNotebook();
      setStatus("Cuaderno importado y validado. Solo se han aceptado los campos conocidos.");
    } catch (_) { setStatus("No se ha importado: JSON inválido o formato no compatible."); }
  });
  $("reset-workstation").addEventListener("click", () => {
    if (!window.confirm("¿Borrar los apuntes y las revisiones locales de esta estación? Exporta una copia antes si deseas conservarlos.")) return;
    data = normalize(null); persist(); refreshProgress(); loadNotebook();
    $("terminal-output").replaceChildren();
    setStatus("Progreso local reiniciado.");
  });
  const select = $("evidence-case");
  for (const c of cases) {
    const option = element("option", "", c.code + " — " + c.name);
    option.value = c.id;
    select.append(option);
  }
  function updateClock() {
    $("clock").textContent = new Intl.DateTimeFormat("es", { hour: "2-digit", minute: "2-digit" }).format(new Date());
  }
  updateClock();
  setInterval(updateClock, 60000);
  refreshProgress();
  print("Secure T Workstation · edición educativa 1.0\nDatos 100 % sintéticos. No hay shell, red ni objetivos reales.\nEscribe help para comenzar.", "info");
  openPanel(activePanel);
})();