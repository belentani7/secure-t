# Architecture Decision Records

## ADR-001 — Modular monolith primero

**Contexto:** el producto necesita muchos dominios pero todavía no tiene carga ni equipos separados. **Decisión:** conservar React/Vite/Express y separar módulos por fronteras. **Alternativas:** microservicios desde el inicio. **Consecuencia:** menor coste operativo y migración posterior posible.

## ADR-002 — Open source con evaluación de licencia

**Contexto:** el objetivo es portabilidad y control. **Decisión:** evaluar Keycloak, Open edX, CTFd, NetBox, Kokoro y Chatterbox antes de reimplementar. **Consecuencia:** menos código propio, pero revisión constante de licencias, seguridad y mantenimiento.

## ADR-003 — IA como sistema gobernado

**Contexto:** tutoría, labs y evaluación tienen riesgos distintos. **Decisión:** AI Gateway, agentes con permisos, validación y auditoría. **Consecuencia:** más trabajo inicial, pero menor riesgo de decisiones opacas o privilegios excesivos.

## ADR-004 — No afirmar acreditación

**Contexto:** un currículo digital no equivale a un título oficial. **Decisión:** etiquetar claramente lo no implementado y separar achievement, certificate, credential y verification.
