# Secure T — Full Campus Release Report

**Fecha:** 2026-10-27
**Estado:** release del vertical slice + campus completo, verificado de punta a punta.
**Repo:** `C:\Proyectos\_audit\repos\secure-t`

## Qué se entrega

La SPA deja de ser una landing con un portal de demostración y pasa a ser la
puerta de entrada al campus completo:

| Superficie | Ruta | Contenido |
|---|---|---|
| Hub del campus | `/campus` | 4 programas reales, 80 semanas, objetivos, evaluación, laboratorio, 32 fuentes abiertas y 6 herramientas |
| Progreso | `/progress` | 88 ítems, persistencia local, exportar/importar JSON, examen bloqueado hasta completar semanas + quiz + laboratorio |
| Mentor Astra | `/mentor` | Chat con `/api/tutor`, 4 contextos, prompts sugeridos, límite y fallback honesto cuando el modelo no está configurado |
| Campus completo | `/campus/full/` | Artefacto estático real: 175 archivos, 4 cursos, quizzes, labs, rúbricas, glosarios, academia de 5 años, observatorio, workstation y mission control |
| Conceptos | `/conceptos/` | Material interactivo existente, servido desde el mismo artefacto |

### Cómo se integra

- `scripts/generate-campus-data.mjs` lee `campus/cursos/*` y genera
  `client/src/data/campus.generated.ts` (4 programas, 80 semanas, 32 recursos).
- `scripts/sync-campus.mjs` copia el campus estático a `client/public/campus/full`
  para dev y build; `.gitignore` evita duplicar 2 MB en Git.
- `pnpm dev` y `pnpm build` sincronizan el campus antes de Vite.
- El campus estático vive bajo `/campus/full/` para no chocar con la ruta React
  `/campus`; sus enlaces internos son relativos y siguen funcionando.
- El servidor aplica **CSP estricta** a la SPA y una **CSP legacy acotada** solo a
  `/campus/full/`, `/conceptos/` y `404.html` (Tailwind/lucide por CDN).
- El progreso usa la misma clave (`stt-progreso`) y los mismos IDs que
  `campus/progreso.html`: lo marcado en un lado aparece en el otro.

## Evidencia ejecutada

| Comprobación | Comando | Resultado |
|---|---|---|
| Instalación | `pnpm install --frozen-lockfile` | exit 0, lockfile intacto |
| TypeScript | `tsc --noEmit` | `TSC_EXIT=0` |
| Tests SPA/lógica | `vitest run` | **11 archivos, 54/54 PASS** |
| API + CSP | `node --test tests/api-security.test.mjs` | **4/4 PASS**, exit 0 |
| Campus Python | `uv run --no-project --python 3.12 --with pytest python -m pytest -q tests/` | **152 passed** |
| Build estático | `uv run --python 3.12 python scripts/build_site.py --destination _site` | **199 archivos, 2.378.997 bytes** |
| Build SPA | `pnpm build` | exit 0 |
| Dependencias | `pnpm audit --prod` | `No known vulnerabilities found` |
| Detector Impeccable | `impeccable detect --json` sobre Home/Campus/Progress/Mentor | `[]` (sin hallazgos) |
| Navegador real (Chrome) | 6 rutas + interacciones | 0 console errors, 0 page errors, 0 CSP violations |
| Progreso | marcar + recargar | persiste; examen bloqueado |
| Mentor | enviar consulta en producción sin secreto | 503 manejado con mensaje honesto |

### Bundle

| Artefacto | Tamaño | gzip |
|---|---|---|
| JS inicial (`index`) | 320,03 kB | 99,12 kB |
| Runtime de iconos compartido | 11,80 kB | 4,63 kB |
| Portal (lazy) | 10,15 kB | 3,47 kB |
| Notifications (lazy) | 35,87 kB | 12,63 kB |
| Campus (lazy) | 16,56 kB | 4,72 kB |
| Progress (lazy) | 7,05 kB | 2,79 kB |
| Mentor (lazy) | 9,49 kB | 3,67 kB |

El payload inicial (~104 kB gzip con el runtime de iconos) no crece respecto al
release anterior; las superficies nuevas se cargan bajo demanda. El campus
estático (2 MB) se sirve solo cuando el visitante entra en `/campus/full/`.

## Seguridad

- SPA: `script-src 'self'`, sin `unsafe-eval`, `object-src 'none'`,
  `frame-ancestors 'none'`, `connect-src 'self'`, fuentes solo Google Fonts.
- Campus legacy: política separada y documentada; permite los dos CDN que el
  artefacto histórico necesita, sin abrir el resto del origen.
- Assets inmutables 1 año; HTML con `no-cache`.
- Sin secretos nuevos; `pnpm audit` limpio.

## Honestidad

No hay base de datos productiva, OIDC/Keycloak, Redis, S3, cyber range aislado,
voz autoalojada ni credenciales verificables. El progreso es local y el mentor
online está desactivado por defecto en producción. No se afirma acreditación
oficial ni validez de título.

## Entorno

- Python no existía en el equipo: se instaló **uv 0.13.5** en `C:\Tools\uv` y
  Python 3.12.15 gestionado por uv. Con eso se ejecutaron pytest y build_site.
- OpenCode carga ahora Superpowers + Impeccable, 3 MCP (`context7`,
  `playwright`, `shadcn`), 3 subagentes (`designer`, `reviewer`, `verifier`) y
  comandos `/design`, `/verify`, `/complete`.
- Queda pendiente reiniciar OpenCode para que esta sesión use la configuración
  nueva (la actual ya fue validada con `opencode debug config` y
  `opencode mcp list`).

## Consolidación de ramas (auditoría 2026-10-27)

`main` y las ramas remotas no comparten merge base. En lugar de un merge
peligroso, se portaron solo los artefactos nuevos de la rama más reciente
(PR #53): **SOC Decision Lab** y **Threat Modeling Studio**, con sus tests,
enlaces en el campus, precarga en el service worker y presencia en la página
React `/campus`. Se conservaron Workstation, Mission Control y Observatorio.

- `node --test tests/soc-tabletop.test.mjs tests/threat-studio.test.mjs`: 7/7.
- `node tests/browser-security-labs.cjs` (Chrome, 390 px): PASS en ambos labs.
- `build_site`: 203 archivos.
- Informe completo: `docs/superpowers/reports/2026-10-27-branch-commit-audit.md`.

## Siguiente proyecto propuesto

**BPMTOMS** (conversor BPM ↔ ms/Hz/samples para producción musical). Se puede
entregar como herramienta web rica y, después, envolver en plugin VST3/AU.
