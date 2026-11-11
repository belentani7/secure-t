# Repository Standard — Formato por Familia de Repo

> Documento de referencia para replicar el estándar "secure-t" a otros repos.

---

## 1. Tipos de Repositorio y Stack Estándar

| Familia | Stack | Archivos Clave |
|---------|-------|----------------|
| **React/Vite/TS** | Vite 8 + React 19 + TS 5.6 + Tailwind 4 + wouter + vitest | `package.json`, `tsconfig.json`, `vite.config.ts`, `client/src/locales/`, `client/src/lib/i18n.tsx`, `index.html` |
| **Next.js** | Next 14 + TS + Tailwind | `next.config.js`, `tsconfig.json`, `app/`, `messages/`, `middleware.ts` |
| **Python/Static** | Python 3.12 + Jinja2 + HTML | `requirements.txt`, `build_site.py`, `templates/`, `locale/`, `scripts/` |
| **Docker/Fullstack** | Docker + Python + React | `Dockerfile`, `docker-compose.yml`, `pyproject.toml`, `client/` |

---

## 2. Configuración Obligatoria (Quality Gates)

### TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "incremental": false,        // ← OBLIGATORIO: false (cache corrupto en Next.js)
    "noEmit": true,              // Para typecheck rápido
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### package.json Scripts
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "vite build",
    "lint": "eslint .",
    "dev": "vite"
  }
}
```

### Python (pytest)
```txt
# requirements-dev.txt
pytest==9.2.0
pytest-asyncio==1.4.1.post1    # ← OBLIGATORIO: no 0.23.3
```

### CI Workflow (`.github/workflows/deploy-ci.yml`)
Jobs obligatorios:
- `lint-typecheck-test` — Node: typecheck, test, build, security
- `python-quality` — Python: pytest, build_site, i18n_audit, i18n_hardcoded, contrast_audit, gitleaks

---

## 3. i18n Estándar (9 Idiomas)

### Estructura
```
client/src/locales/
├── en.json      # Fuente (289+ claves)
├── es.json
├── ca.json
├── fr.json
├── it.json
├── pt.json
├── de.json
├── nl.json
└── ja.json
```

### Reglas
- **Paridad obligatoria**: Todos los locales tienen exactamente las mismas claves que `en.json`
- **Ninguna clave vacía**
- **Provider global único** (`client/src/lib/i18n.tsx`) con:
  - `useTranslation()` hook
  - Sincronización `document.documentElement.lang`
  - Persistencia en `localStorage`
  - Fallback a `en` si falta clave
- **No i18n paralelos** (no `copy` locales en componentes)

### Claves obligatorias base (289+)
- `app.*`, `header.*`, `home.*`, `footer.*`
- `campus.*`, `progress.*`, `mentor.*`, `portal.*`
- `notifications.*`, `loading`, `skip.content`, `language`

---

## 4. Auditorías Automatizadas (`tools/`)

| Script | Propósito | Exit Code |
|--------|-----------|-----------|
| `i18n_audit.py` | Paridad, claves vacías, valores = en, claves inexistentes | 0=OK, 1=Fail |
| `i18n_hardcoded.py` | Detecta copy sin `t()` en pages/components | 0=OK, 1=Fail |
| `contrast_audit.py` | WCAG 2.1 AA (4.5:1) en clases Tailwind | 0=OK, 1=Fail |
| `apply_fixes.py` | Aplica fixes estándar a cualquier repo | 0=OK, 1=Fail |

---

## 5. Convenciones de Código

### i18n
```tsx
// ✅ CORRECTO
import { useTranslation } from "@/lib/i18n";
const { t } = useTranslation();
<h1>{t("home.hero.title")}</h1>

// ❌ INCORRECTO
const copy = { es: "...", en: "..." };
<h1>{copy[lang]}</h1>
```

### Skip Links (Accesibilidad)
```tsx
// Global (App.tsx) — salta a #main
<a href="#main" className="sr-only focus:not-sr-only ...">{t("skip.content")}</a>

// Página específica (Mentor.tsx) — salta a #mentor-main
<a href="#mentor-main" className="sr-only ...">{t("mentor.skip_content")}</a>
```

### Tema
```tsx
<ThemeProvider defaultTheme="dark">  // ← OBLIGATORIO: dark
```

### HTML Lang
```html
<!-- index.html -->
<html lang="es">  <!-- ← Coincide con DEFAULT_LANG en i18n.tsx -->
```

---

## 6. Seguridad

### `.gitleaks.toml` (en raíz)
```toml
[allowlist]
description = "Allowlisted patterns"
paths = ["**/*.md", "**/*.txt"]
regexes = [
  '''example\.com''',
  '''test''',
  '''dummy''',
]
```

### Guard Script
```bash
python tools/guard.py --path .
# Exit 0 = limpio, 1 = secretos detectados
```

---

## 7. Checklist de Verificación (Definition of Done)

### Nivel A (Gates Reproducibles)
- [ ] `npx tsc --noEmit` → exit 0
- [ ] `npx vitest run` → 56/56 pass
- [ ] `npx vite build` → exit 0
- [ ] `pytest -q tests/` → 166+ passed, 0 failed (excl. pre-existing)
- [ ] `python tools/i18n_audit.py` → Paridad OK, 0 claves inexistentes
- [ ] `python tools/i18n_hardcoded.py` → 0 hallazgos
- [ ] `python tools/contrast_audit.py` → 0 fallos < 4.5:1
- [ ] `python scripts/build_site.py` → exit 0
- [ ] `node scripts/verify-platform-security.mjs` → PASS
- [ ] `guard.py --path .` → árbol limpio

### Nivel B (Calidad de Producto)
- [ ] 289 claves × 7 idiomas traducidas y revisadas
- [ ] Capturas antes/después de 6 superficies
- [ ] `contrast_audit.py` sin fallos en todas las páginas

---

## 8. Aplicación a Nuevo Repo

```bash
# 1. Detectar tipo
python tools/apply_fixes.py --dry-run

# 2. Aplicar fixes estándar
python tools/apply_fixes.py

# 3. Configurar i18n (copiar estructura de locales/)
cp -r secure-t/client/src/locales/* nuevo-repo/client/src/locales/

# 4. Configurar provider i18n
cp secure-t/client/src/lib/i18n.tsx nuevo-repo/client/src/lib/i18n.tsx

# 4. Ejecutar gates
npx tsc --noEmit && npx vitest run && npx vite build
python tools/i18n_audit.py && python tools/i18n_hardcoded.py
```

---

## 9. Familias de Repos en Ecosistema Belentani

| Familia | Repos | Stack | Estado i18n |
|---------|-------|-------|-------------|
| **Educación** | secure-t, open-school, ManosAbiertas, ctg-psicologia-next | React/Vite/TS, Next.js | secure-t ✅, otros 🔄 |
| **Arte/Música** | ace-step-ui, red-starfield-frontend, heyduck, ivy-la-vie | React/Vite/TS | 🔄 |
| **Negocio** | raco-patricia-premium, ArteQueVeste, belentani-factory | React/Vite/TS, Next.js | 🔄 |
| **Infra/Docs** | ai-command-center-level10, belentani-docs, control-linux | Varios | 🔄 |
| **Varios** | boutique-catalogo, bpmtoms, eau-noire, eso-ai | React/Vite/TS | 🔄 |

---

## 10. Referencias

- `secure-t` — Implementación de referencia completa
- `docs/superpowers/plans/2026-11-07-SESION-RESUMEN.md` — Historial de fixes
- `tools/apply_fixes.py` — Herramienta de replicación
- `tools/i18n_audit.py`, `i18n_hardcoded.py`, `contrast_audit.py` — Auditorías
