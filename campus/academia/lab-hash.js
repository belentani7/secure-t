/* Secure T — opt-in SHA-256 lab, entirely in the learner's browser. */
(() => {
  "use strict";
  const byId = id => document.getElementById(id);
  const panel = byId("lab-hash"), tab = byId("lab-tab-hash");
  if (!panel || !tab) return;
  const dictionaries = {
    pt: {
      hash:"Laboratório SHA-256",title:"Integridade criptográfica — experimento local",
      desc:"Compare duas mensagens com SHA-256 gerado dentro do seu navegador. Uma letra pode alterar toda a impressão digital.",
      run:"Calcular e comparar ↗",first:"Mensagem original",second:"Mensagem modificada",
      hint:"Edite uma letra e calcule as duas impressões digitais. O texto não é enviado.",
      safety:"Um hash verifica integridade, não identidade do autor; não substitui assinaturas nem diplomas.",
      different:"Mensagens e impressões digitais diferentes, como esperado.",
      same:"As duas mensagens e impressões digitais são iguais.",
      unavailable:"SHA-256 não está disponível aqui. Use HTTPS ou localhost em navegador compatível.",
      collision:"Atenção: mensagens diferentes geraram a mesma impressão digital; investigue."
    },
    es: {
      hash:"Laboratorio SHA-256",title:"Integridad criptográfica — experimento local",
      desc:"Compara dos mensajes mediante SHA-256 calculado en tu navegador. Una letra puede cambiar toda la huella.",
      run:"Calcular y comparar ↗",first:"Mensaje original",second:"Mensaje modificado",
      hint:"Cambia una letra y calcula ambas huellas. No enviamos el texto a ningún servidor.",
      safety:"El hash comprueba integridad, no identifica al autor; no sustituye firmas ni títulos.",
      different:"Mensajes y huellas diferentes, como se esperaba.",
      same:"Los mensajes y sus huellas son idénticos.",
      unavailable:"SHA-256 no está disponible aquí. Utiliza HTTPS o localhost en un navegador compatible.",
      collision:"Atención: dos textos distintos dieron la misma huella. Hay que investigarlo."
    },
    en: {
      hash:"SHA-256 laboratory",title:"Cryptographic integrity — local experiment",
      desc:"Compare two messages using SHA-256 in your browser. One letter may change the entire digest.",
      run:"Calculate and compare ↗",first:"Original message",second:"Modified message",
      hint:"Change one letter and compute both fingerprints. No text is sent to a server.",
      safety:"A hash checks integrity, not authorship; it does not replace signatures or accredited credentials.",
      different:"Messages and their fingerprints differ, as expected.",
      same:"Messages and fingerprints are identical.",
      unavailable:"SHA-256 is not available here. Use HTTPS or localhost in a supported browser.",
      collision:"Warning: different messages yielded the same digest; investigate."
    }
  };
  const getLang = () => {
    const code = document.documentElement.lang.toLowerCase();
    return code.startsWith("es") ? "es" : code.startsWith("en") ? "en" : "pt";
  };
  function translate() {
    const t = dictionaries[getLang()];
    const keys = {
      "labs.hash":"hash","labs.hashTitle":"title","labs.hashDesc":"desc",
      "labs.hashRun":"run","labs.hashFirst":"first","labs.hashSecond":"second",
      "labs.hashHint":"hint","labs.hashSafety":"safety"
    };
    for(const [attribute,key] of Object.entries(keys)){
      document.querySelectorAll('[data-i18n="'+attribute+'"]').forEach(node => {
        node.textContent = t[key];
      });
    }
  }
  function hide() {
    panel.hidden = true;
    tab.setAttribute("aria-selected","false");
  }
  for(const id of ["lab-tab-web","lab-tab-soc"]) {
    byId(id)?.addEventListener("click",hide);
  }
  tab.addEventListener("click",() => {
    // Let the existing two-lab selector close the active panel first.
    byId("lab-tab-web")?.click();
    byId("lab-web").hidden = true;
    byId("lab-tab-web").setAttribute("aria-selected","false");
    tab.setAttribute("aria-selected","true");
    panel.hidden = false;
  });
  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256",bytes);
    return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("");
  }
  async function compare() {
    const t = dictionaries[getLang()], button = byId("hash-compare");
    button.disabled = true;
    try {
      if(!globalThis.crypto?.subtle)throw new Error("Unavailable Web Crypto");
      const left = byId("hash-left").value.slice(0,4000);
      const right = byId("hash-right").value.slice(0,4000);
      const [a,b] = await Promise.all([sha256(left),sha256(right)]);
      byId("hash-left-result").textContent = a;
      byId("hash-right-result").textContent = b;
      byId("hash-verdict").textContent = left === right ? t.same : a === b ? t.collision : t.different;
    } catch {
      byId("hash-left-result").textContent = "—";
      byId("hash-right-result").textContent = "—";
      byId("hash-verdict").textContent = t.unavailable;
    } finally { button.disabled = false; }
  }
  byId("hash-compare").addEventListener("click",compare);
  document.querySelectorAll("[data-lang]").forEach(button=>button.addEventListener("click",translate));
  translate();
  window.SecureTHashLab = { sha256 };
})();
