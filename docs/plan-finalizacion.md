# Plan coordinado de auditoría y finalización — Secure T University

Fecha: 2026-09-12 · Regla: **REALITY > CLAIMS**. Nada se marca ✅ sin
evidencia ejecutable. Este plan es el contrato de cierre: cada criterio
tiene su verificación concreta y su comando.

## Fase 0 — Fuente de verdad verificada (recursos)

| Criterio | Verificación | Estado |
|---|---|---|
| Cero menciones al repositorio externo retirado | `audit` sección CONTENT (banned strings) + test | ✅ VERIFIED |
| Recursos externos = solo repos/APIs comprobados | `content.REPOS_VERIFICADOS`/`APIS_VERIFICADAS` (GitHub API + HTTP, 2026-09-12) | ✅ VERIFIED |
| Cada recursos.md contiene repos GitHub reales | test: ≥2 enlaces `github.com` por curso | ✅ VERIFIED |
| APIs citadas responden | Open Library 200 · Wikipedia 200 · arXiv (https) — comprobado 2026-09-12 | ✅ VERIFIED |

## Fase 1 — Producto completo (viaje del estudiante)

| Criterio | Verificación | Estado |
|---|---|---|
| Landing trilingüe PT>ES>EN sin flash | test paridad i18n (152×3) + `?lang=` | ✅ VERIFIED |
| Página LMS por curso (12 secciones) | test estructura + id por sección | ✅ VERIFIED |
| Semanas renderizadas (no .md crudo) | test: sin `href=*.md` en landing; HTML render en páginas | ✅ VERIFIED |
| Quiz interactivo por curso, embebido | test `const QUIZ` + funciona en file:// | ✅ VERIFIED |
| Quiz ≥70 % auto-marca progreso | test escritura en `stt-progreso` | ✅ VERIFIED |
| Examen con gating 🔒 | test: bloqueado hasta semanas+quiz+lab | ✅ VERIFIED |
| Credencial SHA-256 verificable sin servidor | test: recomputa hash; blockchain siempre PLANNED | ✅ VERIFIED |
| Búsqueda local funcional | indice.json (55) + buscar.html | ✅ VERIFIED |

## Fase 2 — Honestidad documental

| Criterio | Verificación | Estado |
|---|---|---|
| Sin "READY FOR PRODUCTION"/"W3C"/"Reconocidas por industria" | test grep negativo en STORY | ✅ VERIFIED |
| README = realidad (tests, motor, deploy) | test: documenta pytest/eduforge/audit/PLANNED | ✅ VERIFIED |
| Blockchain siempre cualificado | test por frase en landing/i18n/STORY | ✅ VERIFIED |
| Matriz de idiomas honesta (campus/idiomas.md) | test VERIFIED/PLANNED | ✅ VERIFIED |

## Fase 3 — Infraestructura

| Criterio | Verificación | Estado |
|---|---|---|
| Sitemap/robots: solo rutas reales | test: cada `<loc>` existe en disco | ✅ VERIFIED |
| 404 real trilingüe (no landing enmascarada) | test 404.html + netlify status 404 | ✅ VERIFIED |
| Security headers en Vercel + Netlify | test: 4 cabeceras en ambos configs | ✅ VERIFIED |
| Workflows con `permissions` mínimos | audit SECURITY | ✅ VERIFIED |
| SITE_URL placeholder → WARN documentado | audit DEPLOY (al fijar dominio: rebuild) | ⚠️ WARN (dominio pendiente) |

## Fase 4 — Batería de cierre (ejecutar SIEMPRE en este orden)

```bash
cd belentani-unified
python -m py_compile eduforge/*.py        # 1. sintaxis Python
python -m eduforge build                  # 2. regeneración determinista
python -m pytest tests/ -q                # 3. tests del motor
python -m eduforge audit ../secure-t-university   # 4. auditoría 14 secciones
cd ../secure-t-university
python -m pytest tests/ -q                # 5. tests del producto
python -m http.server 8080                # 6. verificación HTTP manual
# gitleaks corre automáticamente en cada commit (hook)
```

Criterio de cierre: **todo PASS** (se admite exclusivamente el WARN de
SITE_URL mientras no exista dominio real).

## Pendiente real (bloqueado por decisiones externas, no por código)

1. Secrets de deploy + dominio real → entonces `SITE_URL=https://… python -m eduforge build` y el WARN desaparece.
2. Traducción PT/EN del contenido docente (arquitectura lista: `cursos/<slug>/<lang>/`).
3. 12 LOW del hook (random no criptográfico en juego/demos, fuera de rutas de seguridad).
4. Revisión manual WCAG + Lighthouse (los basics automatizados pasan).
