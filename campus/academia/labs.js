/* Secure T: local-only browser laboratories. No live targets, credentials or network fetch. */
(() => {
"use strict";
const $=id=>document.getElementById(id);
if(!$("lab-frame"))return;
const dict={
pt:{label:"LABORATÓRIOS ABERTOS · 100% NAVEGADOR",title:"Da teoria à prática segura.",lead:"Experimente criar interfaces e investigar incidentes fictícios. Estes laboratórios usam apenas dados locais, nunca sistemas externos.",web:"Estúdio HTML / CSS",soc:"Simulador SOC",webTitle:"Laboratório de interfaces seguras",webDesc:"Edite HTML e CSS em um iframe isolado. Scripts, formulários e acessos externos estão bloqueados.",run:"Atualizar prévia ↗",reset:"Restaurar exemplo",preview:"PRÉVIA ISOLADA",webSafety:"Sem execução de JavaScript, rede externa, downloads ou formulários. Este não é um editor de aplicações completas.",socTitle:"Triagem de um alerta fictício",socDesc:"Leia os eventos sintéticos e selecione uma primeira resposta defensiva.",synthetic:"DADOS SINTÉTICOS",socQuestion:"Qual é a melhor primeira ação?",ignore:"Ignorar: a sessão foi aberta.",triage:"Verificar legitimidade com logs adicionais e iniciar a triagem.",attack:"Executar scans em máquinas desconhecidas sem autorização.",check:"Conferir hipótese",correct:"Boa decisão: após falhas seguidas de sucesso, o analista deve validar contexto, fonte e identidade antes de concluir algo. Escale ao procedimento autorizado; os dados sintéticos não demonstram uma intrusão.",wrong:"Reavalie o risco. Um login bem-sucedido após falhas exige verificação contextual, mas jamais justifica acessar sistemas sem autorização.",select:"Selecione uma hipótese para avaliá-la."},
es:{label:"LABORATORIOS ABIERTOS · 100% NAVEGADOR",title:"De la teoría a la práctica segura.",lead:"Diseña interfaces e investiga incidentes ficticios. Los laboratorios utilizan únicamente datos locales, nunca sistemas externos.",web:"Estudio HTML / CSS",soc:"Simulador SOC",webTitle:"Laboratorio de interfaces seguras",webDesc:"Edita HTML y CSS en un iframe aislado. Los scripts, formularios y conexiones externas están bloqueados.",run:"Actualizar vista ↗",reset:"Restaurar ejemplo",preview:"VISTA AISLADA",webSafety:"Sin JavaScript, red externa, descargas ni formularios. Este no es un editor de aplicaciones completas.",socTitle:"Clasificación de una alerta ficticia",socDesc:"Lee los eventos sintéticos y elige una primera respuesta defensiva.",synthetic:"DATOS SINTÉTICOS",socQuestion:"¿Cuál es la primera acción adecuada?",ignore:"Ignorar: se abrió la sesión.",triage:"Comprobar la legitimidad con más registros e iniciar el protocolo de análisis.",attack:"Escanear equipos desconocidos sin autorización.",check:"Comprobar hipótesis",correct:"Buena decisión: tras varios fallos y un acierto, analiza el contexto, la fuente y la identidad antes de concluir algo. Escala mediante un procedimiento autorizado; no hay pruebas suficientes de intrusión.",wrong:"Reevalúa el riesgo. Una conexión correcta después de fallos merece una investigación contextual, pero nunca autoriza intervenir sistemas externos.",select:"Selecciona una hipótesis para evaluarla."},
en:{label:"OPEN LABS · 100% IN-BROWSER",title:"From theory to safe practice.",lead:"Build interfaces and investigate simulated incidents. These labs only use local data; they never test external systems.",web:"HTML / CSS studio",soc:"SOC simulator",webTitle:"Safe interface design studio",webDesc:"Edit HTML and CSS in an isolated iframe. Scripts, forms and external requests are blocked.",run:"Update preview ↗",reset:"Reset example",preview:"ISOLATED PREVIEW",webSafety:"No JavaScript execution, external network, downloads or forms. This is not a full web-app editor.",socTitle:"Synthetic alert triage",socDesc:"Read the synthetic logs and choose a first defensive action.",synthetic:"SYNTHETIC DATA",socQuestion:"What is the most appropriate first action?",ignore:"Ignore it: the login eventually succeeded.",triage:"Verify the legitimacy with additional logs and follow the incident triage process.",attack:"Scan unknown systems without authorization.",check:"Review hypothesis",correct:"Good decision: after several failures followed by success, confirm context, source and identity before drawing conclusions. Escalate via authorized procedures; synthetic logs cannot prove compromise.",wrong:"Reassess the risk. A successful login after failures merits contextual investigation, never unauthorized access to other systems.",select:"Choose a hypothesis first."}
};
const initialHtml=$("lab-html").value,initialCss=$("lab-css").value;
const SAFE_CSP="default-src 'none'; script-src 'none'; connect-src 'none'; img-src data:; style-src 'unsafe-inline'; font-src 'none'; form-action 'none'; base-uri 'none'";
function getLanguage(){const code=document.documentElement.lang.toLowerCase();return code.startsWith("es")?"es":code.startsWith("en")?"en":"pt";}
function translate(){const t=dict[getLanguage()];
 for(const [key,value] of Object.entries({
"labs.label":t.label,"labs.title":t.title,"labs.lead":t.lead,"labs.web":t.web,
"labs.soc":t.soc,"labs.webTitle":t.webTitle,"labs.webDesc":t.webDesc,
"labs.run":t.run,"labs.reset":t.reset,"labs.preview":t.preview,
"labs.webSafety":t.webSafety,"labs.socTitle":t.socTitle,"labs.socDesc":t.socDesc,
"labs.synthetic":t.synthetic,"labs.socQuestion":t.socQuestion,
"labs.optionIgnore":t.ignore,"labs.optionTriage":t.triage,"labs.optionAttack":t.attack,
"labs.check":t.check
})){
   document.querySelectorAll('[data-i18n="'+key+'"]').forEach(el=>el.textContent=value);
 }
}
function preview(){
 // No allow-scripts, allow-forms, allow-top-navigation or allow-same-origin.
 // CSP blocks remote images, scripts, fetch, frames, beacons and submissions.
 const html=$("lab-html").value.slice(0,20000);
 const css=$("lab-css").value.slice(0,20000).replace(/<\/style/gi,"<\\/style");
 // The iframe is an opaque-origin sandbox with network-denying CSP.
 const csp='<meta http-equiv="Content-Security-Policy" content="'+SAFE_CSP+'">';
 $("lab-frame").srcdoc='<!doctype html><html><head><meta charset="utf-8">'+csp+'<style>'+css+'</style></head><body>'+html+'</body></html>';
}
function choose(active){
 const web=active==="web";
 $("lab-web").hidden=!web;$("lab-soc").hidden=web;
 $("lab-tab-web").setAttribute("aria-selected",String(web));
 $("lab-tab-soc").setAttribute("aria-selected",String(!web));
}
$("lab-tab-web").addEventListener("click",()=>choose("web"));
$("lab-tab-soc").addEventListener("click",()=>choose("soc"));
$("web-run").addEventListener("click",preview);
$("web-reset").addEventListener("click",()=>{
 $("lab-html").value=initialHtml;$("lab-css").value=initialCss;preview();
});
$("soc-check").addEventListener("click",()=>{
 const selected=document.querySelector('input[name="soc-choice"]:checked');
 const t=dict[getLanguage()];
 $("soc-result").textContent=!selected?t.select:selected.value==="triage"?t.correct:t.wrong;
 $("soc-result").dataset.correct=String(Boolean(selected&&selected.value==="triage"));
});
document.querySelectorAll("[data-lang]").forEach(button=>button.addEventListener("click",translate));
translate();preview();choose("web");
})();
