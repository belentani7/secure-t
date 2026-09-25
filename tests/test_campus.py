"""Tests de comportamiento del campus generado (sin depender del motor).

Validan los artefactos publicados: esquema de quizzes, coherencia de
evaluación, estructura de páginas de curso, i18n, honestidad de la
credencial y enlaces de la landing.
"""
import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
CAMPUS = ROOT / "campus"
CURSOS = sorted(d.name for d in (CAMPUS / "cursos").iterdir() if d.is_dir())


def test_hay_cursos():
    assert len(CURSOS) >= 4, "se esperaban al menos 4 cursos"


# ---------------- quizzes: esquema y calidad ----------------

@pytest.mark.parametrize("slug", CURSOS)
def test_quiz_esquema(slug):
    items = json.loads((CAMPUS / "cursos" / slug / "quiz.json")
                       .read_text(encoding="utf-8"))
    assert len(items) >= 6, "checkpoint débil: <6 ítems"
    for n, q in enumerate(items, 1):
        assert len(q["opciones"]) == 4, f"ítem {n}: se esperaban 4 opciones"
        assert 0 <= q["correcta"] < 4, f"ítem {n}: correcta fuera de rango"
        assert q["explicacion"].strip(), f"ítem {n}: sin explicación"


@pytest.mark.parametrize("slug", CURSOS)
def test_quiz_respuesta_valida_es_correcta_pedagogicamente(slug):
    """La opción marcada como correcta no debe ser obviamente absurda:
    debe existir y no estar vacía."""
    items = json.loads((CAMPUS / "cursos" / slug / "quiz.json")
                       .read_text(encoding="utf-8"))
    for q in items:
        elegida = q["opciones"][q["correcta"]]
        assert elegida.strip(), "opción correcta vacía"


# ---------------- evaluación: pesos 30/30/40 coherentes ----------------

@pytest.mark.parametrize("slug", CURSOS)
def test_rubrica_pesos(slug):
    rub = (CAMPUS / "cursos" / slug / "rubrica.md").read_text(encoding="utf-8")
    assert "30" in rub and "40" in rub, "sin pesos 30/30/40"
    assert re.search(r"0\.3·P1\s*\+\s*0\.3·P2\s*\+\s*0\.4·P3", rub), \
        "fórmula de nota final ausente"
    assert "Insuficiente" in rub and "Excelente" in rub, "sin niveles de rúbrica"


@pytest.mark.parametrize("slug", CURSOS)
def test_examen_tiene_proyecto_y_defensa(slug):
    exa = (CAMPUS / "cursos" / slug / "examen.md").read_text(encoding="utf-8")
    assert "Proyecto" in exa, "sin brief de proyecto"
    assert "Defensa" in exa or "defensa" in exa, "sin defensa del proyecto"
    assert "Entregables" in exa, "sin entregables"


# ---------------- páginas de curso (LMS) ----------------

@pytest.mark.parametrize("slug", CURSOS)
def test_pagina_curso_estructura_lms(slug):
    pag = (CAMPUS / "cursos" / slug / "index.html").read_text(encoding="utf-8")
    for seccion in ("overview", "syllabus", "semana-1", "semana-2",
                    "semana-3", "semana-4", "quiz", "laboratorio",
                    "proyecto", "rubrica", "glosario", "recursos"):
        assert f'id="{seccion}"' in pag, f"falta sección {seccion}"
    # quiz embebido: funciona también en file://
    assert "const QUIZ" in pag, "quiz no embebido"
    # navegación lateral y retorno al campus
    assert 'href="../../index.html"' in pag
    assert 'href="../../progreso.html"' in pag


@pytest.mark.parametrize("slug", CURSOS)
def test_pagina_curso_contenido_renderizado(slug):
    """Las semanas no deben servirse como markdown crudo: la página HTML
    contiene las lecciones renderizadas."""
    pag = (CAMPUS / "cursos" / slug / "index.html").read_text(encoding="utf-8")
    assert "<h3>" in pag or "<h2>" in pag, "sin encabezados renderizados"
    assert pag.count("<section") >= 10, "secciones insuficientes"


# ---------------- progreso: gating y estados ----------------

def test_progreso_tiene_labs_y_examen_con_gating():
    pag = (CAMPUS / "progreso.html").read_text(encoding="utf-8")
    assert '"laboratorio"' in pag, "progreso sin laboratorio"
    assert '"examen"' in pag, "progreso sin examen"
    assert "bloqueado" in pag, "examen sin gating"
    assert "localStorage" in pag and "crypto.randomUUID" in pag


def test_progreso_sin_pii():
    pag = (CAMPUS / "progreso.html").read_text(encoding="utf-8")
    assert 'type="email"' not in pag
    assert re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}", pag) is None, \
        "email hardcodeado en progreso"


# ---------------- credencial: honestidad ----------------

def test_credencial_honesta():
    pag = (CAMPUS / "credencial.html").read_text(encoding="utf-8")
    assert "SHA-256" in pag, "sin algoritmo declarado"
    assert "fase 2" in pag or "PLANNED" in pag, "blockchain sin etiquetar como fase 2"
    assert "crypto.subtle" in pag, "sin sellado real client-side"


def test_credencial_verificacion_real():
    """El verificador debe recomputar el hash, no solo mostrar texto."""
    pag = (CAMPUS / "credencial.html").read_text(encoding="utf-8")
    assert "verificar" in pag.lower()
    assert pag.count("sha256(") >= 2, "generación y verificación deben recompute"


@pytest.mark.parametrize("fichero", ["index.html", "ui/i18n.js", "STORY.md"])
def test_blockchain_siempre_cualificado(fichero):
    """Ninguna afirmación de blockchain sin etiqueta PLANNED/fase 2."""
    texto = (ROOT / fichero).read_text(encoding="utf-8")
    for m in re.finditer(r"[^.]*blockchain[^.]*\.", texto, re.IGNORECASE):
        frase = m.group(0)
        assert re.search(r"PLANNED|planejado|fase 2|futur|roadmap|integration",
                         frase, re.IGNORECASE) or "PLANNED" in frase, \
            f"claim de blockchain sin cualificar en {fichero}: {frase[:80]}"


# ---------------- i18n: paridad real via node ----------------

@pytest.mark.skipif(shutil.which("node") is None, reason="node no disponible")
def test_i18n_paridad_y_referencias():
    f_js = str(ROOT / "ui" / "i18n.js").replace("\\", "/")
    script = (
        "global.window={};global.navigator={language:'pt'};"
        "global.location={search:''};"
        "global.localStorage={getItem:()=>null,setItem:()=>{}};"
        "global.document={documentElement:{lang:'pt'},querySelectorAll:()=>[],"
        "title:'',querySelector:()=>null};"
        f'require("{f_js}");'
        "const a=window.SecureTI18n;"
        "const d={pt:a.dict('pt'),es:a.dict('es'),en:a.dict('en')};"
        "const ks=Object.fromEntries(Object.keys(d).map(l=>[l,new Set(Object.keys(d[l]))]));"
        "let bad=0;"
        "for(const [x,y] of [['pt','es'],['pt','en'],['es','en']]){"
        "for(const k of ks[x]) if(!ks[y].has(k)){console.log('missing '+y+' '+k);bad++;}}"
        "const html=require('fs').readFileSync(process.argv[1],'utf8');"
        "const used=[...html.matchAll(/data-i18n(?:-html|-aria)?=\"([^\"]+)\"/g)].map(m=>m[1]);"
        "for(const k of new Set(used)) if(!ks.pt.has(k)||!ks.es.has(k)||!ks.en.has(k)){"
        "console.log('missing-ref '+k);bad++;}"
        "process.exit(bad?1:0);")
    r = subprocess.run(["node", "-e", script, str(ROOT / "index.html")],
                       capture_output=True, text=True)
    assert r.returncode == 0, f"desajuste i18n:\n{r.stdout}"


def test_idiomas_matriz_honesta():
    m = (CAMPUS / "idiomas.md").read_text(encoding="utf-8")
    assert "PLANNED" in m and "VERIFIED" in m
    assert "PT" in m and "ES" in m and "EN" in m


# ---------------- landing: enlaces a páginas de curso ----------------

def test_landing_enlaza_paginas_curso_reales():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    enlaces = set(re.findall(r'href="(campus/cursos/[^"]+)"', html))
    assert enlaces, "landing sin enlaces a cursos"
    for e in enlaces:
        destino = e.split("#")[0]
        assert (ROOT / destino).exists(), f"enlace roto: {e}"
    # el viaje directo a semana 1 usa la página renderizada, no el .md crudo
    assert not re.search(r'href="campus/cursos/[^"]+\.md"', html), \
        "la landing aún enlaza .md crudo"


# ---------------- sitemap / robots / deploy: sin ficciones ----------------

def test_sitemap_solo_rutas_reales():
    sm = (ROOT / "public" / "sitemap.xml").read_text(encoding="utf-8")
    assert "example.com" not in sm, "dominio ficticio en sitemap"
    rutas = re.findall(r"<loc>([^<]+)</loc>", sm)
    assert len(rutas) >= 10, "sitemap con pocas rutas"
    for loc in rutas:
        ruta = loc.replace("__BASE_URL__", "").lstrip("/")
        destino = ROOT / ruta if ruta else ROOT / "index.html"
        assert destino.exists() or (destino / "index.html").exists(), \
            f"sitemap apunta a ruta inexistente: {ruta}"


def test_robots_no_desindexa_contenido_real():
    rb = (ROOT / "public" / "robots.txt").read_text(encoding="utf-8")
    assert "Disallow: /campus" not in rb, "robots desindexa el campus"
    assert "Disallow: /courses" not in rb
    assert "Sitemap:" in rb


def test_netlify_404_real_no_mascara():
    nt = (ROOT / "netlify.toml").read_text(encoding="utf-8")
    # el catch-all debe servir 404.html con status 404, nunca 200 sobre index
    assert not re.search(r'status\s*=\s*200', nt), \
        "redirect con status 200 enmascara 404 reales"
    assert 'to = "/404.html"' in nt and "status = 404" in nt, \
        "sin catch-all honesto hacia 404.html"
    assert "X-Frame-Options" in nt, "sin security headers en netlify"


def test_vercel_sin_rewrites_con_headers():
    vc = (ROOT / "vercel.json").read_text(encoding="utf-8")
    assert "rewrites" not in vc, "vercel con rewrites SPA enmascara 404"
    for cabecera in ("X-Content-Type-Options", "X-Frame-Options",
                     "Referrer-Policy", "Permissions-Policy"):
        assert cabecera in vc, f"vercel sin {cabecera}"


def test_404_dedicado():
    f = ROOT / "404.html"
    assert f.exists(), "sin 404.html"
    html = f.read_text(encoding="utf-8")
    assert "noindex" in html, "404 sin noindex"
    assert 'id="ir-campus"' in html, "404 sin salida al campus"
    # trilingüe como el resto del producto
    for idioma in ("não existe", "no existe", "does not exist"):
        assert idioma in html


# ---------------- documentación sin contradicciones ----------------

def test_readme_documenta_la_realidad():
    rd = (ROOT / "README.md").read_text(encoding="utf-8")
    assert len(rd) > 1500, "README esqueleto"
    for palabra in ("pytest", "eduforge", "audit", "PLANNED"):
        assert palabra in rd, f"README no documenta {palabra}"
    assert re.search(r"tests?[^.\n]{0,40}pendiente", rd, re.IGNORECASE) is None, \
        "README dice que los tests están pendientes (existen 37+)"


def test_story_sin_claims_falsos():
    sv = (ROOT / "STORY.md").read_text(encoding="utf-8")
    for prohibido in ("READY FOR PRODUCTION", "MARCAR COMO FINAL",
                      "Reconocidas por industria", "W3C validation",
                      "producción inmediata"):
        assert prohibido not in sv, f"STORY contiene claim falso: {prohibido}"


# ---------------- progreso real: el quiz marca solo ----------------

@pytest.mark.parametrize("slug", CURSOS)
def test_quiz_superado_marca_progreso(slug):
    pag = (CAMPUS / "cursos" / slug / "index.html").read_text(encoding="utf-8")
    assert "stt-progreso" in pag, "quiz no escribe en el progreso"
    assert f"est[SLUG + '/quiz']" in pag or "SLUG + '/quiz'" in pag, \
        "quiz no auto-marca su ítem"


# ---------------- SEO básico sin ficción ----------------

def test_landing_seo_meta():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    assert "<title>" in html
    assert 'name="description"' in html
    assert 'property="og:' in html
    assert 'name="twitter:card"' in html
    # favicon presente (svg inline) y lang declarado
    assert "rel=\"icon\"" in html
    assert re.search(r"<html[^>]+lang=\"pt\"", html)


# ---------------- recursos: reales y verificados, cero prohibidos ----------------

def test_cero_referencias_prohibidas():
    """El repositorio externo retirado y las URLs ficticias, fuera."""
    prohibido_1 = "drivedo" + "pobre"           # sin literal en este archivo
    ficticio = "example" + ".com/"              # idem
    for f in ROOT.rglob("*"):
        if f.suffix in {".md", ".html", ".js", ".json", ".toml", ".xml",
                        ".txt", ".py"} and ".git" not in f.parts \
                and f.name != Path(__file__).name:
            texto = f.read_text(encoding="utf-8", errors="replace").lower()
            assert prohibido_1 not in texto, \
                f"referencia prohibida en {f.relative_to(ROOT)}"
            assert ficticio not in texto, \
                f"URL ficticia en {f.relative_to(ROOT)}"


@pytest.mark.parametrize("slug", CURSOS)
def test_recursos_solo_repos_verificados(slug):
    rec = (CAMPUS / "cursos" / slug / "recursos.md").read_text(encoding="utf-8")
    assert rec.count("https://github.com/") >= 2, \
        "recursos sin repos GitHub verificados"
    assert "erificados" in rec, "sección de repos verificados ausente"


def test_plan_finalizacion_existe_y_es_honesto():
    plan = (ROOT / "docs" / "plan-finalizacion.md").read_text(encoding="utf-8")
    assert "REALITY > CLAIMS" in plan
    assert plan.count("✅ VERIFIED") >= 15, "plan sin criterios verificados"
    assert "WARN" in plan, "plan sin advertencias honestas"


# ---------------- expansión 20 semanas + plugins + mejoras LMS ----------------

@pytest.mark.parametrize("slug", CURSOS)
def test_curso_tiene_20_semanas(slug):
    """La expansión curricular (content_expanded.json absorbido por el motor)
    llega entera al producto: 20 semanas por curso, en .md y en la página."""
    mds = list((CAMPUS / "cursos" / slug).glob("semana-*.md"))
    assert len(mds) == 20, f"{slug}: {len(mds)} semanas en .md (se esperaban 20)"
    pag = (CAMPUS / "cursos" / slug / "index.html").read_text(encoding="utf-8")
    assert 'id="semana-20"' in pag, "index.html sin la semana 20"
    assert pag.count('id="semana-') == 20


@pytest.mark.parametrize("slug", CURSOS)
def test_navegacion_entre_semanas(slug):
    pag = (CAMPUS / "cursos" / slug / "index.html").read_text(encoding="utf-8")
    assert '<a href="#semana-2">Semana 2' in pag or 'href="#semana-2"' in pag
    assert 'href="#quiz">Quiz del curso →' in pag, "última semana no lleva al quiz"
    assert pag.count('class="sem-nav"') == 20


@pytest.mark.parametrize("slug", CURSOS)
def test_mejoras_lms_presentes(slug):
    pag = (CAMPUS / "cursos" / slug / "index.html").read_text(encoding="utf-8")
    assert 'id="tema-btn"' in pag, "sin toggle de tema"
    assert 'id="fs-mas"' in pag and 'id="fs-menos"' in pag, "sin A-/A+"
    assert 'id="barra-lectura"' in pag, "sin barra de lectura"
    assert "barajar" in pag, "quiz sin barajar opciones"
    assert "Reintentar quiz" in pag, "quiz sin botón reintentar"


def test_plugin_fuse_vendoreado_con_licencia():
    fuse = CAMPUS / "vendor" / "fuse.min.js"
    lic = CAMPUS / "vendor" / "FUSE-LICENSE"
    assert fuse.exists() and fuse.stat().st_size > 20000, "fuse.min.js ausente"
    assert lic.exists() and "Apache" in lic.read_text(encoding="utf-8")[:200]
    buscar = (CAMPUS / "buscar.html").read_text(encoding="utf-8")
    assert 'src="vendor/fuse.min.js"' in buscar, "buscar no carga fuse"
    assert "window.Fuse" in buscar, "sin integración fuse"
    assert "INDICE.filter" in buscar, "sin fallback a subcadena"


def test_tema_claro_en_tokens_y_print_css():
    css = (CAMPUS / "tokens.css").read_text(encoding="utf-8")
    assert '[data-theme="light"]' in css, "tokens sin tema claro"
    assert "@media print" in css, "sin estilos de impresión"


def test_comparacion_plugins_documentada():
    doc = (ROOT / "docs" / "comparacion-plugins.md").read_text(encoding="utf-8")
    assert "fuse.js" in doc and "26 415" in doc and "Apache-2.0" in doc
    assert "fallback" in doc.lower()


# ---------------- live en Pages + credencial anti-atajo + profundidad ----------------

def test_pages_workflow_sin_secrets_externos():
    wf = (ROOT / ".github" / "workflows" / "pages.yml").read_text(encoding="utf-8")
    assert "id-token: write" in wf and "pages: write" in wf
    assert "actions/deploy-pages@v4" in wf, "no usa la acción oficial de Pages"
    assert "belentani7.github.io/secure-t-university" in wf, "SITE_URL real ausente"
    # sin tokens personales: solo OIDC con GITHUB_TOKEN
    assert "TOKEN" not in wf.replace("GITHUB_TOKEN", "")


def test_credencial_anti_atajo():
    pag = (CAMPUS / "credencial.html").read_text(encoding="utf-8")
    assert "REQUISITOS" in pag, "sin requisitos embebidos por curso"
    assert "Recorrido incompleto" in pag, "el sellado no se niega sin progreso"
    assert 'semana-20' in pag, "los requisitos no cubren las 20 semanas"


def test_404_rutas_relativas_seguras():
    html = (ROOT / "404.html").read_text(encoding="utf-8")
    assert 'href="/campus/"' not in html, "404 con ruta absoluta rompe en subpath"
    assert "ir-campus" in html and "location.pathname" in html


@pytest.mark.parametrize("slug", ["ciber-ofensiva", "ciber-defensiva",
                                  "ia-aplicada-segura", "gobernanza-compliance"])
def test_profundidad_inyectada(slug):
    """Las semanas 5-8 llevan lectura densa + práctica guiada del motor."""
    md = (CAMPUS / "cursos" / slug / "semana-05.md").read_text(encoding="utf-8")
    assert "Objetivo de la semana" in md or "🎯 Objetivo de la semana" in md, "sin objetivo"
    assert "Lectura principal" in md or "📖 Lectura principal" in md, "sin lectura principal"
    assert "Práctica guiada" in md or "🛠️ Práctica guiada" in md, "sin práctica guiada"
    cuerpo = md.split("Lectura principal", 1)[1] if "Lectura principal" in md else md.split("📖 Lectura principal", 1)[1]
    assert len(cuerpo) > 900, "lectura principal insuficientemente densa"
    # y llega renderizada a la página LMS
    pag = (CAMPUS / "cursos" / slug / "index.html").read_text(encoding="utf-8")
    assert "Práctica guiada" in pag or "🛠️ Práctica guiada" in pag


# ═══════════════════════════════════════════════════════════════════
# E2E: viaje home → catálogo → curso → semana con profundidad
# ═══════════════════════════════════════════════════════════════════

class TestE2EViaje:
    """Verifica el viaje completo del estudiante desde la home hasta
    el contenido de la primera semana de cada curso."""

    def test_home_explica_quien_somos(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        assert "quiénes somos" in html.lower() or "quem somos" in html.lower(), \
            "la home debe explicar quién es la universidad"

    def test_home_enlaza_cursos(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        for slug in CURSOS:
            assert slug in html, f"la home no enlaza al curso {slug}"

    def test_home_enlaza_campus(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        assert "campus" in html.lower()

    @pytest.mark.parametrize("slug", CURSOS)
    def test_curso_lms_tiene_secciones(self, slug):
        lms = CAMPUS / "cursos" / slug / "index.html"
        html = lms.read_text(encoding="utf-8")
        for seccion in ["syllabus", "quiz", "laboratorio", "rubrica",
                        "glosario", "chuleta", "recursos"]:
            assert seccion in html, f"LMS de {slug} falta sección {seccion}"

    @pytest.mark.parametrize("slug", CURSOS)
    def test_semana_01_profundidad(self, slug):
        """Cada semana 1 debe tener contenido real, no esqueleto."""
        sem = CAMPUS / "cursos" / slug / "semana-01.md"
        texto = sem.read_text(encoding="utf-8")
        lineas = len(texto.strip().split("\n"))
        palabras = len(texto.split())
        assert lineas >= 50, f"{slug}/semana-01: solo {lineas} líneas (esperaba ≥50)"
        assert palabras >= 500, f"{slug}/semana-01: solo {palabras} palabras (esperaba ≥500)"

    @pytest.mark.parametrize("slug", CURSOS)
    def test_semanas_tienen_objetivos(self, slug):
        for n in range(1, 5):
            sem = CAMPUS / "cursos" / slug / f"semana-{n:02d}.md"
            texto = sem.read_text(encoding="utf-8")
            assert "## Objetivos" in texto or "## Objetivo de la semana" in texto or "## Objetivos de aprendizaje" in texto, \
                f"{slug}/semana-{n:02d} sin sección de objetivos"

    @pytest.mark.parametrize("slug", CURSOS)
    def test_semanas_tienen_caso_real(self, slug):
        for n in range(1, 5):
            sem = CAMPUS / "cursos" / slug / f"semana-{n:02d}.md"
            texto = sem.read_text(encoding="utf-8")
            assert ("## Caso real" in texto or "## CASO:" in texto or "## CASO: Caso real" in texto), \
                f"{slug}/semana-{n:02d} sin caso real"

    @pytest.mark.parametrize("slug", CURSOS)
    def test_semanas_tienen_ejercicio(self, slug):
        for n in range(1, 5):
            sem = CAMPUS / "cursos" / slug / f"semana-{n:02d}.md"
            texto = sem.read_text(encoding="utf-8")
            assert ("## Ejercicio guiado" in texto or "## EJERCICIO:" in texto or "## Ejercicio guiado:" in texto), \
                f"{slug}/semana-{n:02d} sin ejercicio guiado"

    @pytest.mark.parametrize("slug", CURSOS)
    def test_semanas_tienen_recursos_abiertos(self, slug):
        for n in range(1, 5):
            sem = CAMPUS / "cursos" / slug / f"semana-{n:02d}.md"
            texto = sem.read_text(encoding="utf-8")
            assert "## Recursos abiertos" in texto or "## Recursos" in texto, \
                f"{slug}/semana-{n:02d} sin recursos abiertos"

    @pytest.mark.parametrize("slug", CURSOS)
    def test_semanas_referencias_estandares(self, slug):
        """El contenido debe referenciar estándares reales."""
        todo = ""
        for n in range(1, 5):
            sem = CAMPUS / "cursos" / slug / f"semana-{n:02d}.md"
            todo += sem.read_text(encoding="utf-8")
        patrones = [r"MITRE|ATT&CK|OWASP|NIST|CWE|ISO 27001|RGPD|CIS|CVE|CVSS"]
        assert any(re.search(p, todo) for p in patrones), \
            f"{slug}: sin referencias a estándares de seguridad"

    @pytest.mark.parametrize("slug", CURSOS)
    def test_quiz_combinado_supera_16(self, slug):
        """Con didactico.py, cada curso debe tener ≥16 quiz items (6 base + 16 semanales)."""
        lms = CAMPUS / "cursos" / slug / "index.html"
        html = lms.read_text(encoding="utf-8")
        m = re.search(r"quiz (\d+) ítems", html)
        assert m, f"no se encuentra el badge de quiz en LMS de {slug}"
        count = int(m.group(1))
        assert count >= 16, f"{slug}: solo {count} quiz items (esperaba ≥16)"

    def test_navegacion_home_a_semana1(self):
        """Verifica que la cadena de enlaces home → curso → semana-01 existe."""
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        for slug in CURSOS:
            assert f"campus/cursos/{slug}" in home, \
                f"home no enlaza a {slug}"
            lms = CAMPUS / "cursos" / slug / "index.html"
            assert lms.exists(), f"LMS de {slug} no existe"
            sem1 = CAMPUS / "cursos" / slug / "semana-01.md"
            assert sem1.exists(), f"semana-01 de {slug} no existe"

    @pytest.mark.parametrize("slug", CURSOS)
    def test_todas_semanas_4(self, slug):
        for n in range(1, 5):
            sem = CAMPUS / "cursos" / slug / f"semana-{n:02d}.md"
            assert sem.exists(), f"{slug}/semana-{n:02d}.md no existe"
