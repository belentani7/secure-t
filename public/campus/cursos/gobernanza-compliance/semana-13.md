# Semana 13: Herramientas GRC y automatizacion

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 13 de 20

## Objetivo de la semana
Comprender el ecosistema de herramientas GRC (Governance, Risk & Compliance) y su rol en la automatización del cumplimiento normativo. El estudiante aprenderá a integrar frameworks como ISO 27001, NIST CSF, CIS Controls y MITRE ATT&CK en plataformas GRC, aplicando automatización para la gestión de riesgos, evidencias y auditorías continuas.

## LECTURA
Las herramientas GRC (Governance, Risk Management and Compliance) son plataformas diseñadas para centralizar la gestión de políticas, riesgos, controles, auditorías y evidencias regulatorias. En un entorno digital complejo, donde confluyen RGPD, ISO/IEC 27001:2022, NIST SP 800-53, NIST Cybersecurity Framework 2.0, CIS Controls v8 y el marco MITRE ATT&CK, la automatización se vuelve crítica para mantener la trazabilidad y reducir el esfuerzo manual.

Un stack GRC moderno típico integra: (1) **módulo de inventario de activos y riesgos**, alineado con ISO 27005 y NIST RMF; (2) **motor de controles** que mapea requisitos de múltiples marcos (por ejemplo, un control CIS 5.1 puede satisfacer simultáneamente A.8.7 de ISO 27001 y PR.PS-01 de NIST CSF 2.0); (3) **gestión documental y de evidencias** con versionado y firma electrónica; (4) **workflows de auditoría** con trazabilidad tipo pista de auditoría inmutable; y (5) **dashboards de cumplimiento** con KPIs y KRIs.

La automatización se apoya en varias técnicas: **compliance as code** (políticas definidas en YAML/Rego y evaluadas con OPA/Conftest), **CSPM** (Cloud Security Posture Management) para evaluar continuamente AWS, Azure y GCP contra CIS Benchmarks, **SCA/SAST/DAST** integrados en CI/CD para OWASP Top 10 y OWASP ASVS, y **SOAR** para orquestar respuestas ante incidentes mapeados a MITRE ATT&CK. Herramientas como OpenSCAP permiten evaluar cumplimiento contra perfiles NIST 800-53 y CIS; Chef InSpec y Prowler automatizan validaciones; y plataformas como Eramba, OpenGRC, Wazuh o el módulo de compliance de Grafana ayudan a consolidar evidencias.

El RGPD introduce requisitos adicionales: registro de actividades de tratamiento (art. 30), evaluaciones de impacto (art. 35), gestión de brechas en 72 horas (art. 33) y notificación al interesado (art. 34). Un GRC bien automatizado debe generar alertas, plantillas de notificación y evidencias cronológicas que sirvan ante una autoridad de control como la AEPD. La integración con SIEM (por ejemplo, Wazuh + Elastic) permite correlacionar eventos técnicos con obligaciones legales, cerrando la brecha entre seguridad técnica y compliance.

Finalmente, la automatización no sustituye el juicio humano: los frameworks como COBIT 2019 y el Three Lines Model del IIA siguen siendo referencia para definir responsabilidades. La clave está en que el GRC automatizado libere al equipo para el análisis de riesgo y la mejora continua, mientras la máquina se encarga de la recolección, el mapeo y la evidencia.

## EJERCICIO
**Objetivo:** desplegar un GRC mínimo viable que automatice la evaluación de controles CIS v8 y genere evidencias trazables para ISO 27001.

**Pasos:**
1. **Preparación del entorno:** crea una VM Ubuntu 22.04 o usa un contenedor Docker. Instala Docker y Docker Compose.
2. **Despliegue de OpenGRC o Eramba Community:** clona el repositorio oficial (por ejemplo, `https://github.com/eramba/eramba` o `https://github.com/OpenGRC/opengrc`) y levántalo con `docker compose up -d`. Accede al panel web y crea una organización de prueba llamada "AcmeCorp".
3. **Importación de controles:** carga el catálogo CIS Controls v8 (disponible en `https://www.cisecurity.org/controls/v8`) y mapea al menos 10 controles a los dominios de ISO 27001:2022 Anexo A correspondientes (por ejemplo, CIS 5.1 → A.5.15; CIS 6.3 → A.8.8).
4. **Automatización de evidencias con Prowler:** instala Prowler (`pip install prowler`) y ejecuta `prowler aws --compliance cis_2.0_aws` (o `prowler azure`). Exporta el informe en JSON/CSV.
5. **Integración:** mediante un script Python (puedes usar `requests` y la API REST de tu GRC), sube automáticamente los hallazgos como evidencias asociadas a los controles. Documenta el script en un repositorio Git.
6. **Dashboard:** configura un panel que muestre % de cumplimiento por framework (CIS, ISO 27001) y alertas de controles fallidos.
7. **Entrega:** repositorio Git con `docker-compose.yml`, script de integración, capturas del dashboard y un `README.md` explicando el mapeo realizado.

**Criterios de éxito:** el GRC debe reflejar al menos 10 controles con evidencias automatizadas y un dashboard funcional.

## CASO
**Caso: la brecha de MoveIT Transfer (2023) y la lección sobre GRC automatizado.**

En mayo de 2023, el grupo Cl0p explotó la vulnerabilidad CVE-2023-34362 (SQL injection) en MOVEit Transfer, afectando a más de 2.500 organizaciones y a más de 90 millones de personas. El vector está documentado en MITRE ATT&CK como T1190 (Exploit Public-Facing Application) y T1505.003 (Web Shell). Las organizaciones afectadas —entre ellas gobiernos, bancos y aseguradoras— enfrentaron simultáneamente: notificación de brecha al RGPD en 72 horas, evaluación de impacto, comunicación a interesados y auditorías regulatorias.

El análisis post-incidente reveló que muchas víctimas **no tenían inventariado el software MOVEit** en su CMDB ni en su GRC, no disponían de un mapeo entre el activo y los controles CIS 7 (gestión de vulnerabilidades) y CIS 2 (inventario de software), y carecían de evidencias automatizadas de parcheo. Las que reaccionaron en horas lo hicieron porque tenían: (a) SBOM y CMDB integrados, (b) alertas automatizadas vía feeds CISA KEV y NVD, y (c) workflows de notificación RGPD predefinidos en su GRC.

**Preguntas para el análisis:**
1. ¿Qué controles CIS v8 y cláusulas ISO 27001:2022 (A.8.8, A.5.23, A.5.24) habrían detectado el riesgo antes del incidente?
2. Diseña un flujo automatizado (SIEM + GRC) que, al detectar un CVE crítico en CISA KEV, genere una tarea de parcheo y una alerta de posible notificación RGPD.
3. ¿Cómo se mapea este incidente en MITRE ATT&CK y qué detecciones (reglas Sigma) propondrías?
4. Reflexiona sobre el principio de responsabilidad proactiva (art. 24 RGPD): ¿es defendible ante la AEPD no tener inventario automatizado de software expuesto a Internet?

## Recursos abiertos
- CIS Controls v8 oficial: https://www.cisecurity.org/controls/v8
- NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework
- MITRE ATT&CK (T1190 Exploit Public-Facing Application): https://attack.mitre.org/techniques/T1190/
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OpenGRC (proyecto abierto): https://github.com/OpenGRC/opengrc
- Prowler (CSPM open source): https://github.com/prowler-cloud/prowler
- AEPD – Guía de notificación de brechas: https://www.aepd.es/guias

--- [Volver al syllabus](../syllabus.md)
