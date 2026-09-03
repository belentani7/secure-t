# Open-source stack

| Componente | Proyecto | Licencia/estado | Motivo | Riesgo |
|---|---|---|---|---|
| UI/API | React, Vite, Express, TypeScript | MIT/open ecosystem | Base existente y ligera | requiere hardening |
| Identidad | Keycloak | Apache 2.0 | OIDC, OAuth2, RBAC, MFA | operación y upgrades |
| LMS de referencia | Open edX | AGPLv3 | patrones académicos maduros | integración pesada |
| Retos | CTFd | Apache 2.0 | retos y competición | no sustituye el LMS |
| Red | NetBox | Apache 2.0 | source of truth | sólo si se necesita inventario |
| Voz base | Kokoro / Chatterbox | revisar licencia de pesos | TTS local y expresivo | GPU, calidad, licencia |
| Voz multilingüe | [OpenVoice](https://github.com/myshell-ai/OpenVoice) | MIT para código; revisar pesos/modelos | transferencia de timbre y síntesis cross-lingual | consentimiento, identidad, licencia de pesos |
| Dev agent | OpenHands | revisar versión/licencia | acelerar tareas con control | nunca acceso productivo |
| Datos | PostgreSQL + pgvector | PostgreSQL license | persistencia y RAG inicial | backups y tuning |
| Storage | MinIO | AGPLv3 | S3 compatible self-hosted | operación y exposición |

La regla es evaluar actividad, seguridad, documentación, compatibilidad, coste y condiciones comerciales antes de adoptar. Open source no significa ausencia de restricciones. La capa de voz de Secure T mantiene proveedores intercambiables y debe ofrecer español, portugués brasileño e inglés sin clonar una voz sin consentimiento explícito.

[1]: https://github.com/keycloak/keycloak "Keycloak"
[2]: https://github.com/openedx/edx-platform "Open edX"
[3]: https://github.com/CTFd/CTFd "CTFd"
[4]: https://github.com/netbox-community/netbox "NetBox"
[5]: https://github.com/All-Hands-AI/OpenHands "OpenHands"
