# UNIFICACIÓN ÉLITE ↔ REPO REAL (decisión jefe 2026-09-03)

Spec élite propone: Next.js 15 + Prisma + MIT + tokens #007BFF/#0A102E.
Repo real es: Vite + Express + Drizzle + AGPLv3 + tokens Belentani.
**Se adapta el spec al repo. No se reescribe el repo.** (ARCHITECTURE.md: modular monolith, nada de microservicios prematuros.)

## Decisiones
1. **Stack: se queda.** Vite+Express+Drizzle. Rutas spec `apps/web/app/api/v1/*` → `server/index.ts` Express (`/api/...`). Sin `apps/web`, sin turbo, sin Prisma. Prisma→Drizzle: modelos nuevos en `drizzle/elite.ts` (append-only, sin tocar `schema.ts` que ya existe).
2. **Licencia: AGPLv3.** Spec decía MIT → rechazado. Todo open ya decidido. `LICENSE` + `NOTICE-ATRIBUCIONES.md` mandan.
3. **Marca: tokens Belentani v1.1 CHROMA.** Spec `#007BFF #00E5FF #00FF88 #0A102E` → mapa: bg `#0b1322`, cyan `#38e1ff`, lime `#b6ff2e`, mint `#4ef0b0`, coral `#ff6b5e`, saffron `#ffb52e`, violet `#a78bfa`. Fonts Sora/Inter/JetBrains Mono. Fuente verdad: galería CHROMA + `open-school/shared/BELENTANI-DESIGN-SYSTEM.md`. Canónicos: `shared/belentani-theme.css`, `shared/tailwind.preset.js`, `shared/glass.css`. Secure-T ya aplica CHROMA dark en `client/src/index.css`.
4. **IA: 10 agentes existentes mandan.** `ai/governance.ts` (tutor/socratic/academic/assessment/lab/research/security/voice/orchestrator/competency) + `routeAgent` + `authorize` + deny-list. Spec 6 agentes se mapean: tutor→tutor, evaluator→assessment (solo propone, nunca cambia nota final — deny-list), content→academic+research (solo borradores REVIEW), moderator→security, risk→academic+competency, coach→academic. Orquestador nuevo en `server/ai/orchestrator.ts` reutiliza `routeAgent`/`authorize` y `ollamaProvider`.
5. **Voz/notifs:** spec `useSpeech`/`notify` → ya existen `VOICE_ARCHITECTURE.md` + `NOTIFICATIONS.md` + tabla `notifications`. Solo se cablea, no se duplica.
6. **Pagos/becas/foro/mentoría/labs:** tablas nuevas en `drizzle/elite.ts`; endpoints por fases (ver ROADMAP). Stripe solo test-mode cuando toque F3.
7. **Factory:** vive en `factory/` (Python, 100% open: Ollama/Qwen, edge-tts/Piper, ffmpeg, numpy, Pillow, fpdf2). Genera a `out/` + `manifest.json` → seed. `giga` corre local/self-hosted, nunca en GitHub Actions (14GB límite). Nightly solo `smoke/medium`.
8. **i18n ES/PT/EN:** diccionarios tipados en `shared/` cuando toque (spec `packages/i18n` → `shared/i18n/`).

## Mapa API spec → real
| Spec (Next.js) | Real (Express) |
|---|---|
| /api/auth/* | Keycloak OIDC cuando haya auth institucional (hoy: demo) |
| /api/v1/courses, progress, quiz-attempts | `GET /api/catalog`, `GET /api/progress` → extender |
| /api/v1/certificates/[code] | `credentials` (schema.ts) + verificación pública pendiente F3 |
| /api/v1/forum/*, assignments, mentor, payments, tutor, notifications, admin, agent/cron | `drizzle/elite.ts` + endpoints por fase |
| /api/ai/route | existe safe-fallback → ahora usa `server/ai/orchestrator.ts` |
