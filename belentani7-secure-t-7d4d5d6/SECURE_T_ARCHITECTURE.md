# secure T — arquitectura y plan de producto

## Dirección

secure T será una universidad digital de ciberseguridad e inteligencia artificial orientada a resultados profesionales. La interfaz actual representa el primer vertical slice del campus: orientación académica, progreso, currículo, Cyber Labs, comunidad, workspace de faculty y mentoría IA.

La plataforma no debe presentarse como una universidad acreditada hasta contar con una entidad legal, faculty verificable, políticas académicas, evaluación independiente y el proceso de acreditación correspondiente. El producto sí puede operar desde el inicio como instituto digital, academia profesional o proveedor de formación continua.

## Fundamentos académicos

El currículo base sigue cuatro años y 120 créditos. La secuencia prioriza fundamentos de informática, redes, sistemas operativos, programación, criptografía, seguridad de aplicaciones, respuesta a incidentes, operaciones SOC, cloud security, gobierno y un capstone. Las rutas de especialización son Blue Team & SOC, Offensive Security, Cloud & DevSecOps, Governance & Compliance, Digital Forensics y Application Security.

La evaluación debe premiar artefactos verificables: informes de incidentes, pull requests seguros, threat models, playbooks, capturas de laboratorio, presentaciones técnicas y revisiones de pares. Los badges son una representación posterior del logro, no el logro en sí.

## Arquitectura recomendada

| Capa | Primera implementación | Evolución de producción |
| --- | --- | --- |
| Web | React + Vite + Tailwind, responsive y accesible | CDN global y observabilidad en Vercel |
| API | Express tipado con endpoints de catálogo, progreso y tutor | API serverless o servicio Node separado con rate limiting |
| Datos | Contratos iniciales y seed de currículo | PostgreSQL gestionado con Drizzle, migraciones y backups |
| Identidad | Preparar roles learner, faculty, admin | OAuth, MFA, RBAC, sesiones seguras y control de consentimiento |
| IA | Astra con fallback seguro y Ollama local opcional | Gateway de modelos con evaluación, trazabilidad, guardrails y revisión humana |
| Labs | Catálogo y estados de laboratorio | Entornos aislados efímeros, no acceso a redes productivas, logs y reset |
| Credenciales | Modelo conceptual de evidence-first | Open Badges 3.0 / Verifiable Credentials con firma, revocación y portabilidad |
| Interoperabilidad | Contratos de dominio | LTI 1.3, Assignment and Grade Services, NRPS, Deep Linking y xAPI/cmi5 |

## Voz de Astra

Para una primera integración abierta, evaluar **Kokoro** para síntesis rápida y eficiente y **Chatterbox-Turbo** para mayor expresividad y baja latencia. La elección final dependerá de idioma, licencia comercial, GPU disponible, latencia y consentimiento para cualquier clonación de voz. La voz no debe activarse sin informar al alumno de que es sintética, permitir detenerla y conservar una alternativa escrita.

El navegador ya ofrece un fallback de síntesis para probar la UX. La integración de producción debe separar STT, razonamiento y TTS, almacenar el mínimo audio necesario, aplicar retención limitada y no usar muestras de voz de estudiantes para entrenamiento sin consentimiento explícito.

## Seguridad y gobierno

El sistema debe aplicar mínimo privilegio, separación de roles, cifrado en tránsito y reposo, auditoría de decisiones sensibles, validación de entradas, rate limiting, protección contra prompt injection, revisión humana de evaluaciones de alto impacto y procedimientos de borrado/exportación de datos. La compatibilidad futura con LTI 1.3 debe usar OAuth 2.0 y JSON Web Tokens. Las credenciales portables deben alinearse con Open Badges 3.0 y Verifiable Credentials.

## Entrega actual

La aplicación implementa un campus de estudiante navegable, un currículo de 4 años, tarjetas de cursos, progreso, laboratorios, comunidad/faculty, tutor escrito y controles de voz. El backend expone `/api/health`, `/api/catalog`, `/api/progress` y `/api/tutor`. Los datos del endpoint de catálogo son un seed de producto, no un expediente académico real.

## Siguientes hitos

1. Incorporar Drizzle + PostgreSQL y reemplazar el seed por entidades persistentes: users, roles, programs, courses, modules, enrollments, submissions, rubrics, events, badges y consent records.
2. Añadir autenticación real, onboarding, control de acceso y políticas de privacidad localizadas.
3. Construir el authoring de faculty y la evaluación basada en rúbricas.
4. Implementar labs aislados con límites explícitos y datos sintéticos.
5. Añadir pipeline de voz y tutoría con evaluación offline, red teaming, citación de fuentes y handoff a faculty.
6. Añadir integración LTI 1.3, Open Badges 3.0, xAPI/cmi5 y exportación de expediente.
7. Añadir pruebas de accesibilidad WCAG 2.2 AA, pruebas de carga, SAST/DAST, threat model y plan de respuesta a incidentes.
8. Configurar Vercel, variables de entorno, dominio, logs, alertas, backups y revisión legal antes de abrir matrículas.

## Referencias

[1]: https://www.1edtech.org/standards/lti "1EdTech Learning Tools Interoperability"
[2]: https://www.imsglobal.org/spec/ob/v3p0 "1EdTech Open Badges Specification 3.0"
[3]: https://www.bentoml.com/blog/exploring-the-world-of-open-source-text-to-speech-models "BentoML open-source text-to-speech model overview"
[4]: https://www.w3.org/TR/WCAG22/ "Web Content Accessibility Guidelines 2.2"
