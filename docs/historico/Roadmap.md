# Roadmap

## Fase 0 — Auditoría

Inventario del scaffold, dependencias, riesgos y funcionalidades existentes. **Completada en esta iteración.**

## Fase 1 — Foundation

PostgreSQL, migraciones Drizzle, autenticación OIDC/Keycloak, RBAC, auditoría y configuración por entorno.

## Fase 2 — Academic engine

Programas, cursos, lecciones, competencias, evidencias, rúbricas, evaluaciones y expediente.

## Fase 3 — AI Gateway

Registro de agentes, policy engine, router, provider abstraction, RAG y audit events.

## Fase 4 — Cyber Range

Lab templates, instancias efímeras, worker separado, telemetría, validación, evidencia y cleanup.

## Fase 5 — Voice

VoiceProvider, Kokoro/Chatterbox en entorno controlado, consentimiento, colas, caché y notificaciones.

## Fase 6 — Credentials

Achievements, certificados, credenciales verificables, revocación y verificación pública limitada.

## Fase 7 — Production readiness

Accesibilidad WCAG 2.2 AA, pruebas E2E, seguridad, observabilidad, backups, despliegue y revisión legal/académica.

Cada fase termina con `pnpm check`, `pnpm build`, pruebas, revisión de seguridad, documentación y commit descriptivo.
