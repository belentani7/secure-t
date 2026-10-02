/* Secure T — voz discreta (PT primero).
 * Usa Web Speech API cuando el MP3 no existe o falla.
 * Sin telemetría, sin claves, sin UI ruidosa.
 */
(function (root) {
  "use strict";

  var SCRIPTS = {
    pt: "Bem-vindo ao Secure T. Este projeto nasceu do amor: formação aberta, sem cadastro e sem barreiras. Se te servir, passa adiante.",
    es: "Bienvenido a Secure T. Este proyecto nace del amor: formación abierta, sin registro y sin barreras. Si te sirve, pásalo adelante.",
    en: "Welcome to Secure T. This project was born from love: open learning, no signup, no barriers. If it helps you, pass it on.",
    ca: "Benvingut a Secure T. Aquest projecte neix de l'amor: formació oberta, sense registre i sense barreres. Si et serveix, passa-ho endavant."
  };

  var VOICE_PREF = {
    pt: ["pt-BR", "pt-PT", "pt"],
    es: ["es-ES", "es-MX", "es"],
    en: ["en-US", "en-GB", "en"],
    ca: ["ca-ES", "ca", "es-ES"]
  };

  function pickVoice(lang) {
    if (!root.speechSynthesis) return null;
    var voices = root.speechSynthesis.getVoices() || [];
    var prefs = VOICE_PREF[lang] || VOICE_PREF.pt;
    for (var i = 0; i < prefs.length; i++) {
      var pref = prefs[i].toLowerCase();
      for (var j = 0; j < voices.length; j++) {
        var v = voices[j];
        var code = (v.lang || "").toLowerCase();
        if (code === pref || code.indexOf(pref) === 0) return v;
      }
    }
    return voices[0] || null;
  }

  function speak(lang, text) {
    if (!root.speechSynthesis) return false;
    var utter = new SpeechSynthesisUtterance(text || SCRIPTS[lang] || SCRIPTS.pt);
    utter.lang = (VOICE_PREF[lang] && VOICE_PREF[lang][0]) || "pt-BR";
    var voice = pickVoice(lang);
    if (voice) utter.voice = voice;
    utter.rate = 0.96;
    utter.pitch = 1;
    root.speechSynthesis.cancel();
    root.speechSynthesis.speak(utter);
    return true;
  }

  function bindPlayer(opts) {
    var sel = opts.select;
    var audio = opts.audio;
    var source = opts.source;
    var btn = opts.speakBtn;
    var note = opts.note;

    function lang() {
      return (sel && sel.value) || "pt";
    }

    function tryMp3() {
      if (!audio || !source) return;
      source.src = "voces/" + lang() + "/bienvenida.mp3";
      audio.load();
    }

    if (sel) {
      sel.addEventListener("change", function () {
        tryMp3();
        if (note) note.textContent = SCRIPTS[lang()] || SCRIPTS.pt;
      });
    }

    if (audio) {
      audio.addEventListener("error", function () {
        // MP3 ausente: no gritar error; la voz del navegador basta.
        if (note) {
          note.textContent =
            (SCRIPTS[lang()] || SCRIPTS.pt) +
            " · Voz do navegador (pt-BR quando disponível).";
        }
      });
      tryMp3();
    }

    if (btn) {
      btn.addEventListener("click", function () {
        var ok = speak(lang());
        if (!ok && note) {
          note.textContent = "Este navegador não oferece síntese de voz.";
        }
      });
    }

    if (note) note.textContent = SCRIPTS[lang()] || SCRIPTS.pt;
  }

  root.SecureTVoz = { scripts: SCRIPTS, speak: speak, bindPlayer: bindPlayer };
})(typeof window !== "undefined" ? window : globalThis);
