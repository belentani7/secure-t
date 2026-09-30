# secure T University

**Universidad digital abierta de ciberseguridad e IA.** Cuatro cursos universitarios de 20 semanas,
con quiz, laboratorio, rúbrica, examen y credencial verificable. Gratis, sin registro y *offline-first*.

🌐 **En vivo:** https://belentani7.github.io/secure-t/ · 🎓 **Campus:** https://belentani7.github.io/secure-t/campus/

**Idiomas:** PT > ES > EN (+ CA), con ese orden de prioridad.

---

## Estado real (2026-09-30)

| Pieza | Estado | Dónde |
|---|---|---|
| Portada trilingüe (PT/ES/EN) | ✅ VERIFIED | `index.html`, generada con `scripts/build_landing.py` desde `ui/i18n.js` |
| Campus con 4 cursos × 20 semanas | ✅ VERIFIED | `campus/cursos/*` |
| Quiz interactivo que marca el progreso | ✅ VERIFIED | `campus/app.js` y las páginas de curso |
| Lector de materiales `.md` seguro frente a XSS | ✅ VERIFIED | `campus/lector.html` |
| Progreso anónimo (token local, export/import validado) | ✅ VERIFIED | `campus/progreso.html` |
| Credencial SHA-256 verificable en el navegador | ✅ VERIFIED | `campus/credencial.html` |
| PWA sin conexión (service worker v2) | ✅ VERIFIED | `campus/sw.js` |
| Búsqueda en todo el campus (Fuse.js) | ✅ VERIFIED | `campus/buscar.html` |
| Tutor IA vía issues de GitHub | ✅ VERIFIED | `campus/agente/tutor.py` |
| Credencial en blockchain | ⏳ PLANNED (fase 2) | — |
| Cyber range con laboratorios en Docker | ⏳ PLANNED | `labs/` |
| App React + Express + Postgres | 🗄️ Archivada, no compila | `archivo/app-react/` |

## Arquitectura

```
index.html              Portada (se genera: no editar a mano)
ui/i18n.js              Diccionario PT/ES/EN (fuente de la portada)
campus/                 Sitio estático del campus (el producto)
  tokens.css            Sistema de diseño (v1 + capa visual v2)
  lector.html           Renderiza .md sin dependencias ni XSS
  cursos/<slug>/        index.html (LMS) + semana-NN.md + quiz.json + …
public/open-data/       Datos abiertos de seguridad (CVE, KEV, ATT&CK…)
factory/                eduforge: generador de cursos en Python
lib/edu-engine/         Motor de quizzes (TS) con sus tests
scripts/                build_landing.py · scan_secretos.py · utilidades
tests/                  Suite pytest (118 tests)
archivo/                Código histórico que no se publica como producto
docs/                   Documentación; docs/historico/ guarda los borradores antiguos
.github/workflows/      ci.yml (tests + secretos) · pages.yml (despliegue)
```

**Despliegue único:** GitHub Pages mediante Actions (`pages.yml`). Solo se publica una **lista
blanca** (portada, campus, open-data), nunca la raíz del repo, y hay una barrera que bloquea el
despliegue si detecta secretos. Requisito: *Settings → Pages → Source = GitHub Actions*.

## Desarrollo

```bash
python3 -m http.server 8000          # abre http://localhost:8000/
python3 scripts/build_landing.py     # regenera index.html tras editar ui/i18n.js
python3 -m pip install pytest && python3 -m pytest -q tests/   # 118 tests
python3 scripts/scan_secretos.py .   # audit de secretos (sale con 1 si encuentra algo)
```

La suite pytest cubre el esquema de los quizzes, la navegación entre semanas, la honestidad de la
credencial, la paridad de i18n, el SEO, el 404, el sitemap, la lista blanca de Pages y la ausencia
de secretos. La CI la ejecuta en cada push.

### eduforge (generador de cursos)

`factory/` contiene **eduforge**, el pipeline que genera currículo, quizzes y materiales a partir
de `factory/specs/*.yaml`. Las claves de los modelos se leen **solo** de variables de entorno
(`DEEPSEEK_API_KEY`, etc.) y nunca se escriben en el código.

## Seguridad

- Sin cuentas, sin cookies y sin analítica: el progreso vive en `localStorage`.
- Todo el HTML dinámico se escapa. El lector solo acepta rutas `.md` relativas y enlaces http(s).
- El service worker solo guarda en caché respuestas `200` del mismo origen.
- Informes de vulnerabilidades: [`SECURITY.md`](SECURITY.md) · `public/.well-known/security.txt`.

### Remediación 2026-09-30

Una auditoría encontró una API key de DeepSeek en `fix_weeks.py`. Se retiró del código (ahora se
lee de `DEEPSEEK_API_KEY`), **pero sigue en el historial de git**: hay que revocarla en el
proveedor y reescribir el historial. Se eliminaron volcados de terminal, notas pegadas y artefactos
de build, y se unificaron siete configuraciones de despliegue contradictorias en una sola.

## Licencia

Consulta [`LICENSE`](LICENSE) y las atribuciones de terceros en [`NOTICE-ATRIBUCIONES.md`](NOTICE-ATRIBUCIONES.md).
