# secure T — Arquitectura

## Principio

secure T se construye como un **modular monolith**: una aplicación desplegable con fronteras explícitas entre campus, academia, IA, labs, voz, auditoría y notificaciones. Se evita crear microservicios antes de que exista una necesidad operativa demostrable.

## Flujo principal

`Browser → API → Auth/RBAC → Domain module → Database/Object storage → Audit event`.

La IA sigue otro flujo: `User → AI Gateway → Policy Engine → Context/RAG → Agent Router → Tool authorization → Validation → Response → Audit`.

## Módulos

| Módulo | Responsabilidad | Prohibiciones |
|---|---|---|
| Academic | programas, cursos, lecciones, competencias, evaluaciones | no emite credenciales por sí solo |
| Labs | ciclo de vida de entornos efímeros | no ejecuta código en el proceso principal |
| AI | agentes, modelos, contexto y políticas | no tiene acceso ilimitado |
| Voice | proveedores TTS/STT intercambiables | no almacena audio sin consentimiento |
| Audit | acciones relevantes y decisiones | no guarda secretos innecesarios |
| Notifications | eventos y preferencias | no bloquea la UI esperando tareas |

## Evolución

La primera fase conserva React, Vite, TypeScript, Tailwind, Express y pnpm. La persistencia productiva se incorporará con PostgreSQL + Drizzle; Keycloak se usará como identidad OIDC/RBAC/MFA cuando se habilite autenticación institucional. Redis, pgvector y almacenamiento S3/MinIO se añaden sólo con un caso de uso medido.

## Límites de despliegue

Vercel puede servir la interfaz y endpoints ligeros. Los workers de laboratorios, colas, GPU y servicios stateful deben ejecutarse fuera del runtime serverless, en infraestructura separada y con red privada.

## Estado

**En construcción.** El campus actual es un vertical slice navegable. Persistencia académica, autenticación real y cyber range todavía requieren implementación.

## Referencias

[1]: https://12factor.net/ "The Twelve-Factor App"
[2]: https://www.1edtech.org/standards/lti "1EdTech Learning Tools Interoperability"
[3]: https://owasp.org/www-project-application-security-verification-standard/ "OWASP Application Security Verification Standard"
