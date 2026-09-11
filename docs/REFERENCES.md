# Referencias y estándares

Estructura académica de secure T construida sobre marcos públicos. Solo se
reutilizan **estructuras y taxonomías** (hechos y nombres de áreas); no se
copian contenidos con derechos de autor.

## Marcos de conocimiento (currículo)

| Fuente | Uso | Áreas |
|---|---|---|
| [CyBOK](https://www.cybok.org/) — Cybersecurity Body of Knowledge | Áreas de conocimiento de ciberseguridad | 23 |
| [NIST NICE SP 800-181r1](https://www.nist.gov/itl/applied-cybersecurity/nice) | Categorías de rol y competencias | 7 |
| [OWASP Top 10 (2021)](https://owasp.org/Top10/) | Riesgos de aplicaciones web | 10 |
| [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) | Riesgos de sistemas LLM | 10 |
| [NIST AI RMF 1.0](https://www.nist.gov/itl/ai-risk-management-framework) | Gobernanza y riesgo de IA | 4 |
| [MIT OpenCourseWare](https://ocw.mit.edu/) (6.858, 6.857, 6.1600, 6.875) | Referencia de cursos de seguridad | 4 |

Generado por `scripts/build-unified-curriculum.py` → `education/unified-curriculum.json`.

## Referencias de diseño de plataforma

| Fuente | Inspiración estructural |
|---|---|
| Coursera — *Course anatomy* (About / Syllabus / Modules / Skills / Certificate) | Metadatos de curso, credenciales |
| edX — *About this course*, niveles y esfuerzo semanal | `weeks`, `hoursPerWeek`, `level` |
| Harvard CS50 | Progresión práctica, laboratorios, capstone |
| MIT OCW | Estructura de módulos y materiales abiertos |
| [Open edX](https://openedx.org/) / [Open Learning](https://github.com/edx) | Modelo de datos de cursos y evaluación |
| [Schema.org Course / CourseInstance](https://schema.org/Course) | Interoperabilidad del catálogo |

## Bases de datos y especificaciones

- **PostgreSQL + Drizzle ORM** — esquema en `drizzle/schema.ts` (users, programs,
  courses, modules, module_lessons, enrollments, evaluations, credentials…).
- **LTI 1.3** — interoperabilidad con LMS (pendiente).
- **xAPI** — registro de evidencias de aprendizaje (pendiente).
- **Open Badges 3.0 / W3C Verifiable Credentials** — credenciales verificables
  (pendiente).
- **Schema.org Course** — export del catálogo (`education/catalog.json`).

## Privacidad y seguridad

- **GDPR / RGPD** — minimización de datos, token anónimo sin PII.
- **NIST CSF** — gestión de riesgo.
- **OWASP ASVS** — verificación de seguridad de aplicaciones.
