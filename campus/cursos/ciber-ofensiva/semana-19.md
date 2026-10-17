# Semana 19: Informes y seguimiento de remediacion

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 19 de 20

## Objetivo de la semana
El estudiante aprenderá a transformar hallazgos técnicos de un pentest en informes profesionales orientados a audiencias técnicas y ejecutivas, aplicando estándares de severidad (CVSS, DREAD) y marcos como PTES y OWASP WSTG. Asimismo, desarrollará habilidades para diseñar planes de remediación, métricas de seguimiento (SLA, MTTR) y mecanismos de verificación de cierre de vulnerabilidades alineados con NIST SP 800-115, ISO/IEC 27001:2022 e ISO/IEC 29147.

## LECTURA
Un informe de pentesting no es un volcado de herramientas: es un producto de consultoría cuyo valor reside en la claridad, la priorización y la trazabilidad. El estándar **PTES (Penetration Testing Execution Standard)** dedica su fase 7 ("Reporting") a definir que el documento debe contener resumen ejecutivo, alcance, metodología, hallazgos con evidencia, riesgo, impacto y recomendaciones. Paralelamente, **OWASP WSTG** recomienda mapear cada hallazgo a categorías como WSTG-CONF, WSTG-ATHN o WSTG-INPV, y a referencias del **OWASP Top 10** para contextualizar impacto.

La severidad debe calcularse con **CVSS v3.1/v4.0** (métricas base, temporales y ambientales). Un error común es reportar solo el score base; el analista debe ajustar métricas ambientales según el activo (p. ej., un RCE en un host aislado no equivale al mismo RCE en el DC). Complementariamente, **MITRE ATT&CK** permite mapear TTPs observadas (T1190 Exploit Public-Facing Application, T1078 Valid Accounts) para que el equipo defensivo priorice detecciones. El **NIST SP 800-115** ("Technical Guide to Information Security Testing and Assessment") y el **NIST SP 800-40 Rev.4** ("Guide to Enterprise Patch Management") estructuran el ciclo de remediación: identificar → priorizar → remediar → verificar → cerrar.

La remediación se gestiona como un proyecto con SLA definidos por criticidad (ej. Crítico: 7 días; Alto: 30; Medio: 90; Bajo: 180), alineados con **CIS Controls v8** (Control 7: Continuous Vulnerability Management; Control 4: Secure Configuration). El seguimiento requiere métricas: **MTTR** (Mean Time To Remediate), tasa de reincidencia, porcentaje de cierres verificados y *aging* de hallazgos. La verificación de cierre (retest) debe ser documentada: sin evidencia de retest, un hallazgo no se cierra. **ISO/IEC 27001:2022** (A.8.8 Gestión de vulnerabilidades técnicas, A.5.7 Inteligencia de amenazas) y **ISO/IEC 29147** (divulgación de vulnerabilidades) aportan el marco de gobernanza. Finalmente, el informe debe incluir una **matriz de riesgo** (probabilidad × impacto), un **roadmap** de remediación por fases y un **anexo de evidencia** (capturas, payloads, logs, hashes) que garantice reproducibilidad y no repudio.

## EJERCICIO
**Objetivo:** Redactar un informe profesional de pentest y un plan de remediación con seguimiento.

1. **Preparación:** Toma los hallazgos de un laboratorio previo (o usa el dataset de ejemplo de OWASP Juice Shop / DVWA). Herramientas: `nmap`, `Burp Suite Community`, `Nessus Essentials` o `OpenVAS`, y `Excel`/`Notion` para el tracker.
2. **Clasificación:** Para cada hallazgo, asigna CVSS v3.1 base y ambiental usando la calculadora oficial (https://www.first.org/cvss/calculator/3.1). Mapea a OWASP Top 10 2021 y a una técnica MITRE ATT&CK.
3. **Redacción del informe:** Estructura con: Portada, Resumen ejecutivo (1 página, sin jerga), Alcance y metodología (PTES), Hallazgos (título, severidad, descripción, evidencia, impacto, recomendación), Anexos. Usa plantilla de https://github.com/juliocesarfort/public-pentesting-reports.
4. **Plan de remediación:** Crea una tabla con columnas: ID, Hallazgo, Severidad, Responsable, SLA, Fecha límite, Estado, Evidencia de retest.
5. **Simulación de seguimiento:** Define un script en Python que lea un CSV de hallazgos y calcule MTTR, aging y % de cierres. Ejemplo de salida esperada: `MTTR crítico: 5.2 días | Reincidencia: 12%`.
6. **Retest:** Selecciona 2 hallazgos, aplica el fix en el laboratorio y documenta el retest con captura antes/después y comando de verificación (`curl`, `nmap`, `sqlmap`).
7. **Entrega:** PDF del informe + CSV del tracker + script de métricas en un repositorio Git.

## CASO
**Caso real: filtración de datos en una fintech (2023, escenario basado en incidentes tipo).** Durante un pentest externo se detectó una API GraphQL sin autenticación que exponía datos de 1.2M de usuarios (equivalente a OWASP API1:2023 Broken Object Level Authorization). El informe inicial solo listaba el hallazgo como "Alto" sin CVSS ni evidencia de explotación. El equipo de desarrollo lo dejó en backlog por 6 meses; un atacante lo explotó y exfiltró la base. En el análisis post-mortem se identificó que:
- El hallazgo no estaba mapeado a MITRE ATT&CK (T1190/T1530) ni a un SLA exigible.
- No existía verificación de cierre ni retest documentado.
- El tracker no medía MTTR ni aging, por lo que no había escalamiento.

**Lecciones aplicadas:** tras el incidente, la empresa adoptó un tracker con SLA por severidad (Crítico 7d, Alto 30d), integró CVSS ambiental, implementó retest obligatorio antes de cerrar y reportó MTTR mensual al comité de riesgos bajo ISO/IEC 27001 A.8.8 y CIS Control 7. El nuevo informe incluyó un resumen ejecutivo de una página para el CISO y un anexo técnico reproducible. Este caso ilustra que un informe sin seguimiento estructurado es un documento muerto, y que la remediación es un proceso continuo, no un evento puntual.

## Recursos abiertos
- https://www.first.org/cvss/ (especificación y calculadora CVSS v3.1/v4.0)
- https://github.com/juliocesarfort/public-pentesting-reports (plantillas y ejemplos reales de informes de pentest)
- https://csrc.nist.gov/pubs/sp/800/115/final (NIST SP 800-115: Technical Guide to Information Security Testing and Assessment)

--- [Volver al syllabus](../syllabus.md)
