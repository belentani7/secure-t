#!/usr/bin/env python3
"""Genera index.html (portada) a partir de ui/i18n.js.

- El texto PT (idioma por defecto del ecosistema) se incrusta en el HTML:
  la página funciona sin JavaScript y los buscadores la indexan.
- ES/EN se aplican en cliente con ui/i18n.js (data-i18n / data-i18n-html).
Uso:  python3 scripts/build_landing.py
"""
import html, json, re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JS = r'''global.window={};global.navigator={language:"pt"};global.location={search:""};
global.localStorage={getItem:()=>null,setItem:()=>{}};
global.document={documentElement:{},querySelectorAll:()=>[],querySelector:()=>null};
require(process.argv[1]);process.stdout.write(JSON.stringify(window.SecureTI18n.dict("pt")));'''
PT = json.loads(subprocess.run(["node", "-e", JS, str(ROOT / "ui/i18n.js")],
                               capture_output=True, text=True, check=True).stdout)

def t(k):   # texto plano
    return f'<span data-i18n="{k}">{html.escape(PT[k])}</span>'
def h(k, tag="p", cls=""):  # HTML confiable del diccionario (lo escribe el equipo)
    c = f' class="{cls}"' if cls else ""
    return f'<{tag}{c} data-i18n-html="{k}">{PT[k]}</{tag}>'

CURSOS = [("c1", "ciber-ofensiva", "var(--c-ofensiva)", "chip.off", "i-target"),
          ("c2", "ciber-defensiva", "var(--c-defensiva)", "chip.def", "i-shield"),
          ("c3", "ia-aplicada-segura", "var(--c-ia)", "chip.ai", "i-brain"),
          ("c4", "gobernanza-compliance", "var(--c-gobernanza)", "chip.gov", "i-scale")]

def curso(cid, slug, color, chip, ico):
    semanas = "".join(f"<li>{t(f'{cid}.w{i}')}</li>" for i in range(1, 5))
    return f'''
      <article class="card curso" style="--c:{color}">
        <div class="top"><span class="ico"><svg aria-hidden="true"><use href="#{ico}"/></svg></span>
          <span class="chip">{t(chip)}</span></div>
        <h3><a href="campus/cursos/{slug}/index.html">{t(cid + ".title")}</a></h3>
        <p class="meta">{t(cid + ".meta")}</p>
        <p class="t2">{t(cid + ".desc")}</p>
        <ol class="semanas-mini">{semanas}</ol>
        <div class="cta">
          <a class="btn" href="campus/cursos/{slug}/index.html#semana-1">{t("courses.start")}</a>
          <a class="btn btn-ghost" href="campus/cursos/{slug}/index.html">{t("courses.program")}</a>
        </div>
      </article>'''

def items(prefix, n, sub=("t", "d")):
    return "".join(f'<article class="card"><h3>{t(f"{prefix}{i}{sub[0]}")}</h3>'
                   f'<p class="t2">{t(f"{prefix}{i}{sub[1]}")}</p></article>' for i in range(1, n + 1))

faq = "".join(f'<details class="card faq"><summary>{t(f"faq.q{i}")}</summary>{h(f"faq.a{i}")}</details>'
              for i in range(1, 6))
anos = "".join(f'<article class="card ano"><span class="eyebrow">{t(f"program.y{i}n")}</span>'
               f'<h3>{t(f"program.y{i}t")}</h3><p class="t2">{t(f"program.y{i}d")}</p></article>' for i in range(1, 5))
plan = "".join(f"<li>✔ {t(f'plan.f{i}')}</li>" for i in range(1, 6))
certs = "".join(f"<li>{t(f'certs.b{i}')}</li>" for i in range(1, 4))
acceso = "".join(f'<li class="card paso"><b class="n">0{i}</b><h3>{t(f"access.s{i}t")}</h3>'
                 f'<p class="t2">{t(f"access.s{i}d")}</p></li>' for i in range(1, 4))
nav = "".join(f'<a class="btn btn-ghost" href="#{a}">{t("nav." + k)}</a>'
              for k, a in [("about", "quienes-somos"), ("courses", "cursos"), ("program", "programa"),
                           ("labs", "labs"), ("certs", "certs"), ("faq", "faq")])

PAGE = f'''<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b1117">
  <title>{html.escape(PT["doc.title"])}</title>
  <meta name="description" content="{html.escape(PT["doc.desc"])}">
  <link rel="canonical" href="https://belentani7.github.io/secure-t/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{html.escape(PT["doc.title"])}">
  <meta property="og:description" content="{html.escape(PT["doc.desc"])}">
  <meta property="og:url" content="https://belentani7.github.io/secure-t/">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M16 2 4 7v8c0 7.5 5.1 13.4 12 15 6.9-1.6 12-7.5 12-15V7z' fill='%2334d399'/%3E%3Cpath d='M11 13h10M16 13v9' stroke='%230b1117' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="campus/tokens.css">
  <style>
    section {{ scroll-margin-top: 80px; }}
    .semanas-mini {{ margin: 0; padding-left: 1.2rem; color: var(--text-2); font-size: var(--fs-sm); }}
    .cta {{ display: flex; gap: var(--sp-3); flex-wrap: wrap; }}
    .pasos {{ list-style: none; padding: 0; display: grid; gap: var(--sp-4); grid-template-columns: repeat(auto-fit, minmax(min(16rem,100%),1fr)); }}
    .paso .n {{ font: 800 var(--fs-2xl) var(--font-mono); }}
    .plan {{ max-width: 30rem; margin-inline: auto; text-align: center; }}
    .plan .precio {{ font: 800 3.5rem var(--font-mono); }}
    .plan ul {{ list-style: none; padding: 0; text-align: left; display: grid; gap: .4rem; }}
    .faq summary {{ cursor: pointer; font-weight: 700; min-height: 44px; display: flex; align-items: center; }}
    .lang-switch {{ display: flex; gap: 4px; }}
    .lang-switch button {{ min-width: 44px; min-height: 44px; border-radius: var(--r-sm); border: 1px solid var(--border);
      background: transparent; color: var(--text-2); font: 700 .8rem var(--font-mono); cursor: pointer; }}
    .lang-switch button.lang-active {{ background: var(--grad); color: var(--accent-ink); border-color: transparent; }}
    .banda {{ text-align: center; padding: var(--sp-12) var(--sp-6); margin: var(--sp-12) 0;
      border: 1px solid var(--border); border-radius: var(--r-lg);
      background: radial-gradient(40rem 20rem at 50% 0%, hsl(152 70% 40% / .18), transparent 70%), var(--glass); }}
    .banda p {{ margin-inline: auto; }}
    .trust {{ display: flex; gap: var(--sp-5); flex-wrap: wrap; justify-content: center; color: var(--text-3); font: 600 var(--fs-sm) var(--font-mono); }}
    footer .cols {{ display: grid; gap: var(--sp-6); grid-template-columns: 2fr 1fr 1fr; }}
    footer .cols a {{ display: block; color: var(--text-2); padding: .2rem 0; }}
    @media (max-width: 760px) {{ footer .cols {{ grid-template-columns: 1fr; }} .topbar nav .btn-ghost[href^="#"] {{ display: none; }} }}
  </style>
  <script>try{{document.documentElement.dataset.theme=localStorage.getItem('stt-theme')||'dark'}}catch(e){{}}</script>
</head>
<body>
<a class="skip-link" href="#contenido">Saltar al contenido</a>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-logo" viewBox="0 0 32 32"><path d="M16 2 4 7v8c0 7.5 5.1 13.4 12 15 6.9-1.6 12-7.5 12-15V7z" fill="currentColor"/><path d="M11 13h10M16 13v9" stroke="#0b1117" stroke-width="3" stroke-linecap="round"/></symbol>
  <symbol id="i-target" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></symbol>
  <symbol id="i-brain" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></symbol>
  <symbol id="i-scale" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 21h14M3 7h18"/><path d="m6 7-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0z"/></symbol>
</svg>

<header class="topbar">
  <a class="brand" href="./"><svg class="logo" style="color:var(--accent)" aria-hidden="true"><use href="#i-logo"/></svg>secure&nbsp;<span>T</span>&nbsp;University</a>
  <nav aria-label="Principal">
    {nav}
    <a class="btn" href="campus/">{t("nav.campus")}</a>
    <div class="lang-switch" role="group" data-i18n-aria="aria.lang" aria-label="{PT["aria.lang"]}">
      <button data-lang-btn="pt">PT</button><button data-lang-btn="es">ES</button><button data-lang-btn="en">EN</button>
    </div>
    <button class="btn btn-ghost" id="tema-btn" data-i18n-aria="aria.theme" aria-label="{PT["aria.theme"]}">◐</button>
  </nav>
</header>

<main class="wrap" id="contenido">
  <section class="hero-v2">
    <div>
      <p class="eyebrow">{t("hero.label")}</p>
      <h1 class="text-grad" data-i18n="hero.h1">{html.escape(PT["hero.h1"])}</h1>
      {h("hero.lead", cls="lead")}
      <div class="cta"><a class="btn" href="campus/">{t("hero.cta1")}</a><a class="btn btn-ghost" href="#cursos">{t("hero.cta2")}</a></div>
    </div>
    <div class="terminal" role="img" data-i18n-aria="access.term.aria" aria-label="{html.escape(PT["access.term.aria"])}">
      <div class="dots"><i></i><i></i><i></i></div>
      <div><span class="p">~$</span> curl -s secure-t/campus</div>
      <div class="c"># 0 contas · 0 cookies · 0 €</div>
      <div>✔ 4 cursos · 80 semanas</div><div>✔ quizzes + labs + rubricas</div>
      <div>✔ credencial SHA-256</div><div><span class="p">~$</span> <span class="cursor"></span></div>
    </div>
  </section>

  <section class="stats" aria-label="Cifras">
    <div class="stat"><b class="text-grad">4</b>{t("hero.stat1")}</div>
    <div class="stat"><b class="text-grad">80</b>{t("hero.stat2")}</div>
    <div class="stat"><b class="text-grad">208</b>{t("hero.stat3")}</div>
    <div class="stat"><b class="text-grad">0&nbsp;€</b>{t("hero.stat4")}</div>
  </section>
  <p class="trust"><span data-i18n="trust.label">{PT["trust.label"]}</span>: <span>Harvard CS50</span><span>MIT OCW</span><span>OWASP</span><span>NIST</span><span>Khan Academy</span></p>

  <section id="quienes-somos">
    <div class="section-head"><div><p class="eyebrow">{t("about.label")}</p><h2>{t("about.h2")}</h2></div></div>
    {h("about.p1")}{h("about.p2")}{h("about.p3")}
    <div class="feature-grid">{items("about.v", 3)}</div>
  </section>

  <section id="acceso">
    <div class="section-head"><div><p class="eyebrow">{t("access.label")}</p><h2>{t("access.h2")}</h2></div></div>
    <p class="lead t2">{t("access.lead")}</p>
    <ol class="pasos">{acceso}</ol>
  </section>

  <section id="cursos">
    <div class="section-head"><div><p class="eyebrow">{t("courses.label")}</p><h2>{t("courses.h2")}</h2></div></div>
    <p class="t2">{t("courses.lead")}</p>
    <div class="grid-cursos">{"".join(curso(*c) for c in CURSOS)}</div>
    {h("courses.eval", cls="meta")}
  </section>

  <section id="programa">
    <div class="section-head"><div><p class="eyebrow">{t("program.label")}</p><h2>{t("program.h2")}</h2></div>
      <a class="chip" href="campus/lector.html?doc=mapa-curricular.md">Mapa NICE/CAE →</a></div>
    <div class="feature-grid">{anos}</div>
  </section>

  <section id="labs">
    <div class="section-head"><div><p class="eyebrow">{t("labs.label")} · <span data-i18n="labs.badge">{PT["labs.badge"]}</span></p><h2>{t("labs.h2")}</h2></div></div>
    <p class="t2">{t("labs.lead")}</p>
    <div class="feature-grid">{items("labs.l", 3)}</div>
  </section>

  <section id="certs">
    <div class="section-head"><div><p class="eyebrow">{t("certs.label")}</p><h2>{t("certs.h2")}</h2></div>
      <a class="chip" href="campus/credencial.html">credencial.html →</a></div>
    <p class="t2">{t("certs.lead")}</p><ul>{certs}</ul>
  </section>

  <section id="plan">
    <div class="section-head"><div><p class="eyebrow">{t("plan.label")}</p><h2>{t("plan.h2")}</h2></div></div>
    <article class="card plan"><h3>{t("plan.name")}</h3><div class="precio text-grad">{t("plan.price")}</div>
      <p class="meta">{t("plan.period")}</p><ul>{plan}</ul><a class="btn" href="campus/">{t("plan.cta")}</a></article>
  </section>

  <section id="faq">
    <div class="section-head"><div><p class="eyebrow">{t("faq.label")}</p><h2>{t("faq.h2")}</h2></div></div>
    <div style="display:grid;gap:var(--sp-3)">{faq}</div>
  </section>

  <section class="banda"><p class="eyebrow">{t("cta.label")}</p><h2>{t("cta.h2")}</h2><p class="t2">{t("cta.p")}</p>
    <a class="btn" href="campus/">{t("hero.cta1")}</a></section>
</main>

<footer class="wrap">
  <div class="cols">
    <div><p><b>secure T University</b></p><p>{t("footer.tag")}</p><p class="meta">{t("footer.langs")}</p></div>
    <div><p><b>{t("footer.nav")}</b></p><a href="campus/">{t("footer.campus")}</a><a href="#cursos">{t("footer.courses")}</a>
      <a href="#programa">{t("footer.program")}</a><a href="#faq">{t("footer.faq")}</a></div>
    <div><p><b>{t("footer.project")}</b></p><a href="https://github.com/belentani7/secure-t">{t("footer.github")}</a>
      <a href="STORY.md">{t("footer.story")}</a><a href="public/.well-known/security.txt">{t("footer.security")}</a></div>
  </div>
  <p class="meta">{t("footer.rights")}</p>
</footer>

<script src="ui/i18n.js"></script>
<script>
(function () {{
  var I = window.SecureTI18n; if (!I) return;
  var lang = I.detect(); if (lang !== "pt") I.apply(lang); else I.apply("pt");
  document.querySelectorAll("[data-lang-btn]").forEach(function (b) {{
    b.addEventListener("click", function () {{ I.apply(b.getAttribute("data-lang-btn")); }});
  }});
  document.getElementById("tema-btn").addEventListener("click", function () {{
    var r = document.documentElement; r.dataset.theme = r.dataset.theme === "light" ? "dark" : "light";
    try {{ localStorage.setItem("stt-theme", r.dataset.theme); }} catch (e) {{}}
  }});
}})();
</script>
</body>
</html>
'''
(ROOT / "index.html").write_text(PAGE, encoding="utf-8")
print("index.html generado:", len(PAGE), "bytes")
