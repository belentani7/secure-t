# Semana 14: Notificacion de incidentes y reporte regulatorio

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 14 de 20

## Objetivo de la semana
Comprender el ciclo completo de notificación de incidentes de seguridad desde la detección hasta el reporte regulatorio, identificando los plazos legales, los canales oficiales y los marcos normativos aplicables (RGPD, NIS2, DORA). El estudiante aprenderá a redactar notificaciones efectivas, gestionar la comunicación con autoridades de control y cumplir con las obligaciones de rendición de cuentas ante brechas de datos personales.

## LECTURA

La notificación de incidentes constituye una de las obligaciones más críticas y con plazos más estrictos dentro del compliance digital. El Reglamento General de Protección de Datos (RGPD), en sus artículos 33 y 34, establece que las brechas de seguridad que afecten a datos personales deben notificarse a la autoridad de control competente en un plazo máximo de **72 horas** desde que el responsable tenga conocimiento del incidente, salvo que sea improbable que suponga un riesgo para los derechos y libertades de las personas físicas. Si el riesgo es alto, además debe informarse a los afectados sin dilación indebida (art. 34).

Esta obligación se articula con otros marcos regulatorios. La Directiva **NIS2** (UE 2022/2555) amplía el alcance sectorial y exige a entidades esenciales e importantes notificar incidentes significativos a su CSIRT nacional en 24 horas (alerta temprana), 72 horas (evaluación) y un mes (informe final). El Reglamento **DORA** (UE 2022/2554) para el sector financiero impone plazos similares y exige notificación inicial en 4 horas desde la clasificación del incidente. En EE.UU., el **Circular 23-01 de la SEC** obliga a entidades financieras a reportar incidentes cibernéticos materiales en 4 días hábiles mediante el formulario 8-K.

El **NIST SP 800-61 Rev. 2** (Computer Security Incident Handling Guide) define las fases de respuesta: preparación, detección y análisis, contención, erradicación, recuperación y actividades post-incidente. La notificación se enmarca en la fase de "post-incidente" y requiere coordinación con equipos legales, DPO y comunicación corporativa. El framework **MITRE ATT&CK** ayuda a clasificar el tipo de amenaza y su impacto, información clave para determinar la severidad y el reporte regulatorio. **ISO/IEC 27035** proporciona directrices específicas para la gestión de incidentes, incluyendo la comunicación con partes interesadas externas.

Los **CIS Controls v8** (control 17: Incident Response Management) recomiendan establecer procesos documentados, canales de reporte y roles definidos. **OWASP** complementa con guías para la divulgación responsable de vulnerabilidades y la gestión de brechas en aplicaciones web. Es fundamental distinguir entre "incidente de seguridad" y "brecha de datos personales": no todo incidente es notificable, pero toda brecha con riesgo debe evaluarse documentadamente. La rendición de cuentas (accountability) exige mantener un registro interno de todos los incidentes, incluso los no notificables (art. 33.5 RGPD), y documentar la decisión de no notificar.

La notificación debe contener: naturaleza de la brecha, categorías y número aproximado de afectados, datos del DPO, consecuencias probables y medidas adoptadas. Las notificaciones tardías o incompletas pueden derivar en sanciones administrativas que en el RGPD alcanzan hasta 10 millones de euros o el 2% del volumen de negocio global.

## EJERCICIO

**Objetivo:** Simular la notificación de una brecha de datos personales conforme al RGPD y NIS2.

**Pasos:**

1. **Escenario:** Una empresa SaaS sufre exfiltración de una base de datos con 15.000 registros (nombres, emails, contraseñas hasheadas con bcrypt, direcciones IP). El ataque se detectó vía SIEM el lunes a las 08:00; el análisis forense confirma acceso no autorizado desde el sábado 22:00.

2. **Clasificación del incidente:** Usando MITRE ATT&CK, identifica las tácticas y técnicas probables (ej. T1078 Valid Accounts, T1530 Data from Cloud Storage). Determina severidad según NIST SP 800-61.

3. **Evaluación de notificabilidad:** Aplica el criterio del art. 33 RGPD. ¿Existe riesgo para los derechos y libertades? Justifica por escrito.

4. **Redacta la notificación a la AEPD** usando el formulario oficial (sede electrónica AEPD) incluyendo:
   - Descripción de la naturaleza de la brecha
   - Categorías y número de interesados afectados
   - Datos de contacto del DPO
   - Consecuencias probables
   - Medidas adoptadas y propuestas
   - Fecha y hora del conocimiento del incidente

5. **Redacta la comunicación a los afectados** (art. 34) con lenguaje claro, recomendaciones (cambio de contraseña, vigilancia de phishing) y canales de contacto.

6. **Documenta el registro interno** (art. 33.5) con la decisión de notificar y su justificación.

7. **Herramientas:** Plantilla de notificación AEPD, PIA/DPIA, matriz de severidad, repositorio Git para versionar evidencias.

**Entregable:** Un documento markdown con todos los pasos anteriores, simulando la cadena de custodia y el expediente regulatorio.

## CASO

**Caso real: Brecha de British Airways (2018)**

Entre junio y septiembre de 2018, atacantes comprometieron el sitio web y la app de British Airways mediante un script de skimming (Magecart) inyectado en el código JavaScript. Se exfiltraron datos de aproximadamente **429.612 clientes**, incluyendo nombres, direcciones, emails y datos completos de tarjetas de crédito (número, CVV, fecha de expiración).

**Cronología y fallos:**
- La detección inicial fue tardía; la brecha se prolongó 15 días.
- La notificación a la **ICO** (Information Commissioner's Office, Reino Unido) se realizó en el plazo de 72 horas tras confirmar el incidente, pero la investigación forense reveló deficiencias previas en controles de seguridad.
- La ICO sancionó inicialmente con **£183 millones** (reducido posteriormente a **£20 millones** en 2020 tras alegaciones por COVID-19 y cooperación).

**Lecciones clave:**
1. La notificación dentro de plazo **no exime** de responsabilidad si las medidas de seguridad previas eran inadecuadas (art. 32 RGPD).
2. La coordinación con el equipo legal y el DPO fue determinante para estructurar la comunicación.
3. El caso evidencia la importancia de los controles **CIS 3 (Data Protection)** y **CIS 4 (Secure Configuration)** frente a ataques web.
4. La trazabilidad mediante MITRE ATT&CK permitió clasificar el ataque como **T1059 (Command and Scripting Interpreter)** y **T1185 (Browser Session Hijacking)**.

Este caso demuestra que la notificación regulatoria es solo una pieza del compliance: la rendición de cuentas exige prevención, detección temprana y respuesta documentada.

## Recursos abiertos
- Guía oficial de notificación de brechas de la AEPD: https://www.aepd.es/es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/notificacion-de-brechas
- NIST SP 800-61 Rev. 2 – Computer Security Incident Handling Guide: https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final
- ISO/IEC 27035 – Information security incident management: https://www.iso.org/standard/78973.html
- MITRE ATT&CK Framework: https://attack.mitre.org/
- Directiva NIS2 (UE 2022/2555): https://eur-lex.europa.eu/eli/dir/2022/2555/oj

--- [Volver al syllabus](../syllabus.md)
