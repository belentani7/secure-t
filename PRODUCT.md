# PRODUCT.md — secureT

## Product
**secureT** — academia de ciberseguridad aplicada, idiomas y desarrollo full-stack. Modelo de aprendizaje basado en evidencia: entender el sistema, practicar la decisión, explicar la evidencia. No es contenido pasivo; es capacidad verificable.

## Mode
**Persuade** (landing/Home) + **Operate** (Campus, Progress, Mentor, Portal). El visitante decide y actúa en Home; completa tareas en el resto de superficies.

## Audience
Estudiantes y profesionales que quieren seguridad aplicada con evidencias reales, no teoría vacía. Multilingüe desde el día 1 (español, inglés, catalán, francés, italiano, portugués, alemán, holandés, japonés).

## Stack
Vite + React 19 + TypeScript + Tailwind 4 + wouter (routing) + lucide-react (iconos) + sonner (toasts). Tests: vitest. Build: vite build. Typecheck: tsc --noEmit.

## Current state
- Typecheck: ✅ exit 0
- Tests: ✅ 54/54 passing
- Build: ✅ built en 3.65s
- Seguridad: ✅ sin leaks (gitleaks + guard.py)
- i18n: ❌ ausente (todo el copy en inglés)
- PRODUCT.md / DESIGN.md: ❌ ausentes
- UI: avanzada (glass cards, gradientes, animaciones) pero sin sistema de diseño documentado

## Gaps to close (this plan)
1. i18n completo (9 idiomas) en todas las páginas y componentes
2. PRODUCT.md + DESIGN.md (sistema de diseño documentado)
3. Pulido de diseño según craft-floor (sin eyebrow/kicker, sin sección numérica, tracking ≤ -0.04em, card radius 12-16px)
4. Más contenido funcional más allá del README (casos de uso reales, labs, mentoría, portal del estudiante)
5. Verificación final: typecheck + tests + build + seguridad en verde
