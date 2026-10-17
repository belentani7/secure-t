# Secure T — estado de implementación

## Vertical slice operativa

La rama `main` contiene una vertical slice funcional para estudiante: catálogo académico, lecciones, finalización, entrega de evidencias, progreso, notificaciones, expediente, credenciales, research desk y workspaces de faculty/admin/settings. La UI dispone de selector español, português brasileiro e inglés en los workspaces institucionales.

## Implementado y probado

| Área | Estado | Evidencia |
|---|---|---|
| Currículo y lecciones | Implementado | `academic/curriculum.ts`, `GET /api/curriculum`, `GET /api/lessons/:id` |
| Evidencias | Implementado en el flujo local | `POST /api/lessons/:id/evidence`, validación de longitud y auditoría |
| Progreso | Implementado en el flujo local | `POST /api/lessons/:id/complete`, `GET /api/progress` |
| Notificaciones | Implementado | API, centro y Service Worker |
| RBAC y gobernanza IA | Contratos implementados | `auth/`, `ai/`, tests |
| OpenVoice | Adaptador implementado | `voice/openvoice.ts`; requiere servicio OpenVoice configurado |
| Expediente y credenciales | UI y contratos implementados | `/record`, `/credentials`, tablas Drizzle |
| Research | UI y fuentes aprobadas iniciales | `/research`, `GET /api/research/sources` |
| Faculty/Admin | UI de workspace y límites | `/faculty`, `/admin`; acciones protegidas hasta conectar identidad |
| CI | Implementado | GitHub Actions: check, tests y build |

## Bloqueos que no se deben ocultar

La autenticación OIDC/Keycloak, PostgreSQL productivo, Redis, almacenamiento S3/MinIO, cyber range aislado, Web Push con claves VAPID, TTS OpenVoice autoalojado y emisión de credenciales verificables requieren infraestructura y secretos de despliegue. El sandbox actual no tiene Docker instalado y Vercel no sustituye esos servicios. El fallback en memoria sirve para desarrollo y demostración funcional de la vertical slice, pero no se considera persistencia productiva.

No se afirma acreditación universitaria, validez de título ni seguridad de laboratorio real hasta completar esas integraciones, sus pruebas de integración y una revisión operativa.
