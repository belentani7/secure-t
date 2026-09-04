# PLAN MAESTRO — secure T · Universidad Digital de Ciberseguridad e IA

> Fecha: 2026-09-04 · Repo: `belentani7/secure-t` (AGPL-3.0)
> Nivel: OMEGA-MAX — plan vivo, se actualiza con cada fase completada.

---

## 0. FALSO PREMISA / REALIDAD

> **"Lo de que esté completa es una ilusión"** — en parte cierto, en parte no.

| Aspecto | Realidad verificada (2026-09-04) |
| :--- | :--- |
| Frontend campus (React/Vite) | ✅ **Funcional de verdad** — 76 archivos .tsx/.ts, dashboard real, 6 secciones de Portal |
| Backend API (Express) | ✅ **Funcional de verdad** — 20+ endpoints vivos |
| Currículum 4 años | ✅ Catálogo real (6 cursos, 2 años, trilingüe, competencias) |
| IA (gobernanza + orquestador) | ✅ 8 agentes definidos, routeAgent, guardrails, deny-list |
| Voz (Kokoro/HF) | ✅ generateSpeech + fallback browser |
| Tests (Vitest) | ✅ 4 suites implementadas |
| **PostgreSQL / persistencia** | ❌ **NO conectado** — todo en memoria (mocks) |
| **Auth/RBAC real (OIDC)** | ❌ No conectado (matriz de grants definida, sin infra) |
| **Ciber Range (Docker)** | ❌ Sin orquestación (solo docker-compose de juice-shop/dvwa) |
| **Voz autoalojada** | ❌ Depende de Hugging Face API |
| **Credenciales verificables** | ⚠️ Issuance/verify en memoria, persistence pendiente |

**Conclusión:** la app es real y funcional, pero es un **monolito en memoria** ("contract-ready", no "production-ready"). La "ilusión" está en la infraestructura, no en la app.

---

## 1. MAPA DE AGENTES / MÓDULOS (organización)

| Módulo / Agente | Estado código | Persistencia | Foco Fase |
| :--- | :--- | :--- | :--- |
| `server/` (API Express) | ✅ 20+ endpoints | ⚠️ DB-ready (fallback mem) | 1 |
| `server/services/db.ts` | ✅ **NUEVO** dbService | ✅ Drizzle + fallback | 1 |
| `server/db/index.ts` | ✅ **NUEVO** conexión Pool | ✅ Drizzle | 1 |
| `drizzle/schema.ts` | ✅ arreglado (errores corregidos) | — | 1 |
| `drizzle/elite.ts` | ✅ 23 tablas élite append-only | — | 1 |
| `client/` (campus React) | ✅ funcional | — | — |
| `academic/` (motor académico) | ✅ repositorios + curriculum | ✅ vía dbService | 1 |
| `ai/` (gobernanza 8 agentes) | ✅ funcional | ⚠️ audit a DB | 2 |
| `voice/` (Kokoro/OpenVoice) | ✅ adapter | ⚠️ HF API | 5 |
| `labs/` (ciber range) | ⚠️ solo compose | ❌ | 4 |
| `rag/` | ⚠️ stub (emptyRetriever) | ❌ | 3 |
| `audit/` | ⚠️ contrato sin persistencia | ❌ | 3 |
| `auth/` (RBAC) | ✅ matriz grants, sin infra | ❌ | 1 |
| `notifications/` | ✅ contrato/events | ⚠️ | 4 |
| `factory/` (Python) | ✅ pipeline completo | — | — |
| `tests/` | ✅ 4 suites | — | — |

---

## 2. FASE 1 — PERSISTENCIA REAL (EN CURSO) ✅✓

**Objetivo:** dejar de servir datos en memoria cuando haya un PostgreSQL disponible.

### Hecho
- [x] `drizzle/schema.ts` — corregidos errores de sintaxis (`.notNull.` → `.notNull()`) en evaluaciones/studentEvaluations/history
- [x] `drizzle/schema.ts` — resuelto `lessons` duplicado (la variante con `modules` → `module_lessons`)
- [x] `server/db/index.ts` — **NUEVO**: conexión Drizzle + Pool pg, `isDbConnected()`, `pingDb()`, `query()`
- [x] `server/services/db.ts` — **NUEVO**: `dbService` (contrato completo que repositorios pedían) con fallback a memoria
- [x] `server/index.ts` — health/ready reportan estado real de DB; enrollment/progress usan repositorios cuando hay DB
- [x] `academic/repositories/index.ts` — el `import "../services/db"` roto ahora resuelve

### En curso — despliegue a producción online (objetivo real del proyecto)

**Decisión de arquitectura (calidad):** monolito Express + Supabase gestionado en **Railway**. Docker local queda solo como herramienta de desarrollo; la plataforma online NO depende de la máquina local.

- **Frontend + API:** un solo contenedor Express en Railway (sirve `dist/public` + `/api/*`) → 24/7, HTTPS, deploy automático desde GitHub.
- **Base de datos:** Supabase (Postgres gestionado + Auth OIDC/JWT) → 24/7 gestionado por proveedor.
- **Nada corre en la PC del desarrollador.**

### Archivos de deploy creados
- [x] `Dockerfile` — build multicapa (pnpm build → runtime mínimo con dist + node_modules --prod)
- [x] `railway.json` — builder DOCKERFILE, healthcheck `/api/health`, restart
- [x] `.dockerignore`
- [ ] Conectar Postgres real (Supabase) → poner `DATABASE_URL` en Railway
- [ ] `pnpm db:push` al Postgres de Supabase
- [ ] Seed: poblar users/courses/lessons/enrollments desde `server/data/*`
- [ ] Auth real (Supabase Auth email/password + JWT) → `auth/rbac`
- [ ] Migrar el resto de endpoints data-mock a repositorios DB

### Cómo activar persistencia en producción
```bash
# 1. Crear proyecto Supabase → copiar connection string como DATABASE_URL en Railway
# 2. Local (una vez, para push del schema):
cp .env.example .env   # DATABASE_URL → Supabase
pnpm install
pnpm db:push
# 3. Deploy a Railway (automatico desde GitHub) → /api/db/status muestra { connected: true, mode: "postgres" }
```

---

## 3. ROADMAP COMPLETO (7 fases, alineado a ROADMAP.md)

| Fase | Contenido | Estado |
| :--- | :--- | :--- |
| 0 | Auditoría | ✅ completa (este doc) |
| 1 | Foundation: PostgreSQL + auth + RBAC | 🔵 EN CURSO (sin DB local) |
| 2 | Academic engine (curriculum, evaluación, evidencias) | ⏳ |
| 3 | IA Gateway + audit persistente + RAG | ⏳ |
| 4 | Ciber Range (orquestación Docker aislada) | ⏳ |
| 5 | Voz autoalojada (Kokoro/Chatterbox local) | ⏳ |
| 6 | Credenciales verificables (persistentes) | ⏳ |
| 7 | Producción (dominio, HTTPS, backups, alertas) | ⏳ |

---

## 4. NOTAS CRÍTICAS PARA EL CONTEXTO

- **Licencia:** AGPL-3.0-only (decisión UNIFICACION-ELITE 2026-09-03).
- **Stack confirmado:** Vite + Express + Drizzle (NO Next.js, NO Prisma).
- **IA:** 10 agentes reales mandan (orchestrator + governance); spec de 6 se mapea a los reales.
- **Factory:** Python genera a `out/`, smoke/medium en CI, giga self-hosted.
- **Test:** `pnpm check` (typecheck) y `pnpm test` (vitest) son la puerta de validación.
- **Bloqueo local:** Docker/PostgreSQL NO instalados en esta máquina → verificación de persistencia pendiente a entorno con DB.

---

*Vivo. Se actualiza con cada fase completada.*
