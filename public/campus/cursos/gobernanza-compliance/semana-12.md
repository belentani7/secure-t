# Semana 12: Panorama regulatorio sectorial

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 12 de 20

## Objetivo de la semana
Comprender cómo los marcos regulatorios sectoriales (financiero, salud, energía, telecomunicaciones, sector público) condicionan la gobernanza digital y el compliance, y aprender a mapear obligaciones legales específicas con controles técnicos de seguridad (ISO/IEC 27001, NIST CSF, CIS Controls) y con el RGPD. El estudiante será capaz de identificar el régimen aplicable a una organización, traducir requisitos legales en controles auditables y detectar brechas de cumplimiento.

## LECTURA
El panorama regulatorio sectorial es la capa normativa que se superpone al RGPD y a las leyes nacionales de protección de datos cuando una organización opera en dominios críticos. Mientras el RGPD establece un marco horizontal (bases jurídicas, derechos, DPIA, notificación de brechas en 72 h, designación de DPO), los regímenes sectoriales añaden obligaciones verticales más prescriptivas: plazos de notificación más cortos, auditorías obligatorias, residencia de datos, resiliencia operativa y notificación de incidentes a supervisores específicos.

En el **sector financiero** destacan DORA (Reglamento UE 2022/2554) para resiliencia operativa digital, que exige gestión de riesgo TIC, pruebas de resiliencia (TLPT), registro de información y notificación de incidentes graves; la Directiva NIS2 (UE 2022/2555) amplía el ámbito a entidades esenciales e importantes con deberes de gobernanza, gestión de riesgos y responsabilidad de la alta dirección; y en EE. UU., la SEC exige divulgación de incidentes materiales (Form 8-K Item 1.05) y la NYDFS Part 500 impone un CISO, cifrado y plan de respuesta. PCI DSS v4.0 regula el tratamiento de datos de tarjetas.

En **salud**, HIPAA (EE. UU.) define la Privacy Rule y la Security Rule, con la Breach Notification Rule (60 días); en la UE, el Espacio Europeo de Datos Sanitarios (EHDS) refuerza el intercambio secundario. En **energía e infraestructuras críticas** aplican la Directiva CER (UE 2022/2557) y normativas como NERC CIP. En **telecomunicaciones**, el Código Europeo de Comunicaciones Electrónicas y las directrices ENISA/ENISA TB. El **sector público** se rige por esquemas nacionales de seguridad (ENS en España, Real Decreto 311/2022) y por el NIS2.

La traducción operativa se apoya en frameworks reconocidos: **ISO/IEC 27001:2022** (SGSI y controles del Anexo A), **NIST CSF 2.0** (Govern, Identify, Protect, Detect, Respond, Recover), **NIST SP 800-53 Rev.5** y **NIST SP 800-61** para respuesta a incidentes, **CIS Controls v8.1** (18 controles priorizados, con Implementation Groups IG1-IG3), **MITRE ATT&CK** para modelar tácticas, técnicas y procedimientos (TTPs) de adversarios y priorizar detecciones, y **OWASP** (Top 10, ASVS, SAMM) para aplicaciones. La auditoría sectorial exige evidencias: registros de formación, análisis de impacto, planes de continuidad, pruebas de penetración, matrices de trazabilidad entre requisitos legales y controles (por ejemplo, DORA art. 6 ↔ ISO 27001 A.5.29 ↔ CIS Control 17).

Un enfoque maduro es construir una **matriz de obligaciones regulatorias** con identificador, fuente legal, requisito, control técnico asociado, evidencia, responsable y periodicidad. El compliance digital sectorial no es solo jurídico: es ingeniería de controles medibles, con métricas (MTTD, MTTR, cobertura de activos, tiempo de notificación) alineadas con NIST CSF y auditables bajo ISO 19011.

## EJERCICIO
**Objetivo:** Elaborar una matriz de trazabilidad regulatoria para una organización ficticia del sector salud que opera en la UE y trata datos personales de pacientes.

**Pasos:**
1. Define el perfil: hospital privado con 500 empleados, historias clínicas electrónicas, proveedor cloud en la UE.
2. Identifica el régimen aplicable: RGPD, NIS2 (entidad importante en salud), EHDS, normativa nacional de sanidad y ENS si aplica.
3. Selecciona 10 requisitos legales concretos (ej.: notificación de brecha en 72 h RGPD art. 33; gestión de riesgo TIC NIS2 art. 21; designación de DPO art. 37).
4. Mapea cada requisito a controles de ISO/IEC 27001:2022 Anexo A, NIST CSF 2.0 y CIS Controls v8.1.
5. Para cada control, define evidencia auditable (política, log, acta, informe de pentest) y frecuencia.
6. Usa MITRE ATT&CK para identificar 3 TTPs relevantes (ej.: T1566 phishing, T1486 ransomware, T1078 cuentas válidas) y vincúlalas a controles de detección.
7. Documenta todo en una hoja de cálculo (Google Sheets o Excel) con columnas: ID, Fuente legal, Requisito, Control ISO, Función NIST, CIS, TTP ATT&CK, Evidencia, Responsable, Periodicidad.
8. Redacta un resumen ejecutivo de 300 palabras con las 3 brechas más críticas detectadas.

**Entregable:** Matriz en CSV/hoja de cálculo + resumen ejecutivo en PDF.

## CASO
**Caso: incidente en un operador sanitario europeo (2023-2024, patrón real agregado).** Un hospital regional sufre un ataque de ransomware que cifra servidores de historias clínicas. El adversario entra por VPN sin MFA (T1133) y usa credenciales válidas (T1078). El equipo tarda 96 horas en detectar el cifrado y 10 días en notificar a la autoridad de control, incumpliendo el plazo de 72 h del RGPD art. 33 y las obligaciones de notificación temprana de NIS2. La auditoría posterior revela: ausencia de un registro de actividades de tratamiento actualizado, DPIA no realizada, ausencia de pruebas de resiliencia, y un SGSI ISO 27001 desactualizado desde 2021. Consecuencias: sanción de la autoridad de protección de datos, requerimientos del CSIRT nacional, pérdida de confianza pública y coste de recuperación superior a 4 M€. El análisis con MITRE ATT&CK muestra que los controles CIS 4 (configuración segura), 6 (gestión de accesos) y 17 (respuesta a incidentes) habrían reducido drásticamente el impacto. Lecciones: la gobernanza sectorial exige integrar RGPD + NIS2 + ISO 27001 + NIST CSF en un único programa, con métricas y simulacros periódicos.

## Recursos abiertos
- https://www.nist.gov/cyberframework
- https://www.iso.org/standard/27001
- https://www.cisecurity.org/controls
- https://attack.mitre.org/
- https://owasp.org/www-project-top-ten/
- https://www.enisa.europa.eu/topics/cybersecurity-policy/nis-directive-new
- https://www.digital-operational-resilience-act.com/

--- [Volver al syllabus](../syllabus.md)
