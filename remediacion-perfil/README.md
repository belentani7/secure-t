# Kit de remediación del perfil `belentani7`

Auditoría del **2026-09-30** sobre los **161 repos públicos**: clon superficial de unos 5 GB,
escáner de secretos con 13 patrones más detección de artefactos, apertura de bases de datos y
métricas de higiene. Los repos privados no se auditaron.

> ⚠️ Los scripts **simulan por defecto**. Solo actúan con `APLICAR=1`. Ejecútalos en tu máquina
> con `gh auth login` hecho. Ningún archivo de este kit contiene secretos.

## Resumen de hallazgos

| Prioridad | Repo | Problema |
|---|---|---|
| **P0** | `duck-2000-2` | `.duck-qa/`: 7 perfiles de Microsoft Edge con **Login Data** (30 contraseñas guardadas de Google, GitHub, AWS, Openbank, Seguridad Social, Proton…), Cookies y `Local State` |
| **P0** | `judas-experience-web` | 2 API keys de DeepSeek en `PROTOCOLO-PRODUCCION-CONSOLIDADO.md:186` |
| **P0** | `secure-t` | 1 API key de DeepSeek en `fix_weeks.py`. **Ya se quitó del código en la rama `arena/01a0f2e8-secure-t`**, pero sigue en el historial |
| P1 | `DUCK-ZION-PREMIUM` | BD con 21 usuarios y teléfonos (×3 copias), ejecutable de Windows, archivos >20 MB |
| P1 | `duck-studio-os-v2`, `duck-docs` | BD con usuarios y clientes (email, teléfono) |
| P1 | `ManosAbiertas`, `aprende-brasil` | `*.db` con usuario (y hash bcrypt) |
| P1 | `CARQUIDEC` | 1,8 GB, 19 archivos >20 MB → Git LFS o Releases |
| P1 | `belentani-omega-template`, `duck-2000-2` | `node_modules` y `dist` subidos |
| P2 | 9 repos | Duplicados probables (`-backup`, `-final`, `-unificado`…) → archivar |
| P3 | 73 repos | Sin tests · 20 sin CI · 4 sin `.gitignore` · 3 sin LICENSE |

**Revisados y descartados como falsos positivos:** `ghp_1234…` de `BRAIN` (demo), las keys de los
tests de `belentani-ops` y `belentani7`, el PEM de mentira de `nexus-os` y las URLs de BD con
`localhost` o contraseñas de ejemplo. La key de Firebase de `belentani-school-unificado` es pública
por diseño, pero **revisa que las reglas de Firestore no estén abiertas**.

El detalle de cada repo, con su acción sugerida, está en [`inventario-repos.csv`](inventario-repos.csv).

## Orden de ejecución

| # | Script | Qué hace | Tiempo |
|---|---|---|---|
| 0 | `./01-emergencia.sh` | Pone en privado `duck-2000-2` y `judas-experience-web`, y muestra la lista de contraseñas a cambiar | 1 min + tu tiempo |
| 1 | `APLICAR=1 ./02-limpiar-historial.sh` | `git filter-repo`: borra `.duck-qa`, los `*.db` y los logs de **toda la historia** y sustituye las keys por `REDACTED_API_KEY` | 10 min |
| 2 | `APLICAR=1 ./03-activar-seguridad-github.sh` | Secret scanning + **Push protection** + Dependabot en todos los repos | 5 min |
| 3 | `APLICAR=1 ./04-higiene-repos.sh` | Abre un **PR por repo** con el `.gitignore` común y deja de versionar los artefactos | 10 min |
| 4 | `APLICAR=1 ./05-consolidar-portfolio.sh` | Archiva los duplicados P2 (reversible) | 2 min |
| ∞ | `./06-escanear-todo.sh` | Vuelve a auditar todo cuando quieras (conviene hacerlo cada mes) | 5 min |

Requisitos: `gh`, `git`, `python3` y `pip install git-filter-repo` (solo para el paso 1).

### Probado
- El paso 1 se ejecutó sobre una copia local de `secure-t`: la key pasó de estar presente a
  **0 apariciones** en `git log --all -p`, y los archivos eliminados desaparecen de toda la historia.
- `scripts/scan_secretos.py --todo` detecta en el perfil real todos los hallazgos de la tabla.

## Lo que ningún script puede hacer por ti
1. **Revocar las 3 keys** en https://platform.deepseek.com/api_keys.
2. **Cambiar las contraseñas y activar la verificación en dos pasos** en las cuentas del perfil de
   Edge (la lista está en `01-emergencia.sh`).
3. Revisar AWS: IAM, facturación y CloudTrail.
4. Pedir a GitHub que purgue la caché de los commits antiguos: https://support.github.com/contact
   → *Remove sensitive data*.

## Prevención (a partir de hoy)
- Con Push protection activada, GitHub **rechaza el push** si contiene una key.
- En cada proyecto: `.env` en local y `.env.example` en el repo; las keys se leen con
  `os.environ[...]` o `process.env...`.
- Los perfiles de navegador de QA (Playwright, Puppeteer, Edge) van **siempre** en `/tmp` o en una
  carpeta ignorada, nunca dentro del repo.
- Copia `.github/workflows/ci.yml` y `scripts/scan_secretos.py` de `secure-t` a tus repos
  canónicos: bloquean el merge si aparece un secreto.
