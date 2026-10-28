# Secure T — Branch and Commit Audit

**Fecha:** 2026-10-27
**Repo:** `C:\Proyectos\_audit\repos\secure-t`
**Alcance:** revisar ramas remotas, commits y decidir qué se integra sin romper `main`.

## Hallazgo principal: historias no relacionadas

`main` y todas las ramas remotas revisadas **no comparten merge base**:

```text
git merge-base main origin/fix/security-labs-review-selection-20261024
→ (vacío)
```

Por eso `main..rama` reporta 136–228 commits "ahead" aunque el árbol de la rama
sea en gran parte más antiguo. Un `git merge` normal fallaría; forzarlo con
`--allow-unrelated-histories` borraría trabajo de `main` (por ejemplo
`campus/observatorio/*` y `campus/workstation/*`, que las ramas antiguas no
tienen).

**Decisión:** no se hace merge de historias. Se consolidan solo los artefactos
nuevos, preservando el árbol de `main`.

## Rama más reciente y útil: PR #53

`fix/security-labs-review-selection-20261024` (6 commits, 2026-10-24), PR #53,
base `feat/soc-tabletop-offline-20261022`. Aporta:

- `campus/academia/triage.html` + `triage-core.mjs` — SOC Decision Lab (6 casos).
- `campus/academia/threat-studio.html` + `threat-core.mjs` — Threat Modeling Studio (5 casos).
- `tests/soc-tabletop.test.mjs`, `tests/threat-studio.test.mjs`.
- `tests/browser-security-labs.cjs`.

### Lo que NO se copió

Los archivos modificados por la rama se descartaron porque **regresaban** `main`:

- `campus/academia/index.html` eliminaba los enlaces a Workstation, Mission
  Control y Observatorio.
- `campus/index.html` y `campus/amenazas.html` eliminaban el aviso de antigüedad
  y el escapado seguro del feed de amenazas.
- `.github/workflows/campus-publication.yml` reemplazaba las suites de
  workstation/mission/observatorio en vez de añadir las nuevas.

### Lo que sí se integró (adaptado a `main`)

- Copiados los 4 artefactos de los labs y sus 2 tests de nodo.
- Añadidos los enlaces nuevos **junto** a Workstation/Mission/Observatorio en
  `campus/academia/index.html` y `campus/index.html`.
- Añadidos SOC Decision Lab y Threat Modeling Studio a la página React
  `/campus` (tools).
- Precarga en `campus/sw.js` (`v10 → v11`) de `triage.html`, `triage-core.mjs`,
  `threat-studio.html`, `threat-core.mjs`.
- CI: se añaden `tests/soc-tabletop.test.mjs`, `tests/threat-studio.test.mjs` y
  `tests/browser-security-labs.cjs` sin quitar las suites existentes.
- Corregido un fallo real del test de navegador: Threat Modeling Studio tiene
  **5** casos, no 6; el test ahora usa el número de cada lab y valida `/ 5`.

## Evidencia

| Comprobación | Resultado |
|---|---|
| `node --test tests/soc-tabletop.test.mjs tests/threat-studio.test.mjs` | **7/7 PASS** |
| `node tests/browser-security-labs.cjs` (Chrome real, 390 px) | **PASS** SOC + Threat Studio |
| `pytest` campus | **152/152 PASS** |
| `build_site.py` | **203 archivos**, 2.424.926 bytes |
| `vite build` | exit 0 |
| Enlaces nuevos en campus y SPA | presentes |

## Otras ramas (no integradas)

| Rama | Fecha | Lectura | Acción recomendada |
|---|---|---|---|
| `security/api-no-store-host-hsts-20261024` | 2026-10-24 | Cabeceras/seguridad; `main` ya tiene no-store + headers | Revisar diff y cerrar si está cubierto |
| `dependabot/npm_and_yarn/multi-766765435e` | 2026-10-25 | Bump express; `main` usa 4.22.3 | Revisar CVE/versión y actualizar por separado |
| `feat/soc-tabletop-offline-20261022` | 2026-10-22 | Base del PR #53 | Ya portado lo nuevo |
| `feat/campus-review-reliable-assessment-20261022` | 2026-10-22 | Evaluación/revisión | Comparar árbol; no merge directo |
| `consolidation/academy-sem4-formative-20261022` | 2026-10-22 | Notas offline PT/ES/EN | Comparar si `main` ya las tiene |
| `release/unified-securet-2026-10-21` | 2026-10-21 | Release antiguo | Archivar como referencia |
| `cursor/secure-t-biblia-voz-passa-adiante` | 2026-10-08 | Voz | Archivar |
| `arena/*`, `snapshot/*`, `docs/*` | 2026-09/10 | Experimentos/instantáneas | Archivar |

## Recomendación de higiene

1. Etiquetar `main` actual como baseline (`v0.3.0-premium`).
2. Cerrar PR #53 indicando que el contenido se portó; o retargetear una rama
   limpia desde `main` con solo los 4 artefactos + tests.
3. No volver a mergear historias no relacionadas: una sola línea desde `main`.
4. Revisar las ramas de seguridad y dependabot una por una con `git diff main rama`
   (dos argumentos, sin `...`, porque no hay merge base).
