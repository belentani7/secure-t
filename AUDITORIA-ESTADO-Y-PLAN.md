# Auditoría, situación y plan de elevación — `secure-t`

Generado 2026-11-03 por el pase de reglas del ecosistema (catálogo `_meta/reglas-oficiales.md`).
Todo lo afirmado aquí sale de datos reales: base de consolidación, gate oficial y git.

- **Categoría:** educacion · **Ruta:** `C:\Users\USER\belentani-ecosystem\educacion\secure-t`
- **Remoto:** https://github.com/belentani7/secure-t.git · **Rama:** main · **HEAD:** bec9ebf (docs(auditoria): estado real del repo, comandos para arreglar/elevar y potencial)
- **Lenguajes:** .md:462,.html:221,.tsx:72,.json:61,.js:42,.ts:41 · **Commits (git real):** 17 · **Tamaño worktree:** 13.4 MB
- **Visibilidad GitHub:** public · **Homepage:** https://secure-t.vercel.app · **HTTP:** HTTP_200
- **GitHub Pages:** ACTIVO → http://www.belentani.es/secure-t/

## 1. Situación actual

- **Consolidación:** familia `proyecto-securet` · acción survivor (estable).
- **Git:** 2 ficheros sin commitear · 5 commits sin push · 4 commits del pase de reglas (desde 2026-11-02).
- **Reglas web (gate oficial):** 221 HTML · **13 hallazgos** · 3 títulos duplicados.
- **Gobernanza GitHub (protocolo MS):** 10/11 reglas aplicadas · pendientes: GH-09
- **Secretos (triaje):** placeholder-test: 2 → 0 credenciales reales confirmadas en el triaje global (ver `_meta/consolidacion/SECRETOS-TRIAGE.md`).

## 2. Comandos para arreglar y elevar (ejecutar en este orden)

1. **Cumplir reglas web restantes:**
   ```powershell
   python C:\Users\USER\belentani-ecosystem\_meta\fix_web_rules.py --apply --repo secure-t
   python C:\Users\USER\belentani-ecosystem\_meta\repair_balance.py --apply --repo secure-t
   python C:\Users\USER\belentani-ecosystem\_meta\check_web_rules.py secure-t   # esperar issues=0
   ```
2. **Gobernanza GitHub pendiente (GH-09):** crear/verificar README, LICENSE, CODE_OF_CONDUCT, CONTRIBUTING, ISSUE_TEMPLATE, PR_TEMPLATE, CI verde, .gitignore, descripción+topics, sin secretos:
   ```powershell
   gh api -X PATCH repos/belentani7/secure-t -f description="<descripcion real>" -f homepage="<url viva>"
   gh repo edit belentani7/secure-t --add-topic <topic1>,<topic2>,<topic3>   # topics reales del proyecto
   ```
3. **Limpiar 2 ficheros sin commitear** (revisar antes; si son del pase de reglas, commitear):
   ```powershell
   git -C "C:\Users\USER\belentani-ecosystem\educacion\secure-t" status --short
   git -C "C:\Users\USER\belentani-ecosystem\educacion\secure-t" add -- <solo los ficheros del pase> ; git -C "C:\Users\USER\belentani-ecosystem\educacion\secure-t" commit -m "fix(web-rules): ..."
   ```
4. **Subir al remoto** (requiere tu confirmación explícita; hoy ningún repo tiene push):
   ```powershell
   git -C "C:\Users\USER\belentani-ecosystem\educacion\secure-t" push origin main
   ```

## 3. Qué puede alcanzar este repositorio

- **Repositorio público**: puede publicar gratis en GitHub Pages (`https://belentani7.github.io/secure-t/`) y mantener Vercel; hoy tiene  Pages activo
- Ya tiene despliegue Vercel vivo: siguiente nivel es dominio propio (`<producto>.belentani.es`) añadiendo CNAME en el registrador.
- Con 221 páginas HTML y el catálogo de reglas cumplido, es candidato a **superviviente/documentado** del ecosistema: README con arranque real, índice navegable y CI que ejecute `check_web_rules.py`.

---
*Evidencia: `_meta/consolidacion/consolidacion.db` · `_meta/specs/2026-11-01-*` · gate `check_web_rules.py` · git log. Regenerable con `python _meta/gen_auditoria_repos.py`.*
