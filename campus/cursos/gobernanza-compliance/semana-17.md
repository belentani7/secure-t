# Semana 17: Metricas y reporte al consejo

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 17 de 20

## Objetivo de la semana
El estudiante aprenderá a diseñar, seleccionar y comunicar métricas de gobernanza, riesgo y cumplimiento (GRC) y de seguridad de la información a nivel ejecutivo. Comprenderá cómo traducir indicadores técnicos (KPIs/KRIs) en información estratégica para el consejo de administración, alineando el reporting con marcos como NIST CSF, ISO/IEC 27001:2022, CIS Controls v8 y COBIT 2019, y evitará el error común de reportar "vanidad técnica" en lugar de riesgo de negocio.

## LECTURA
El reporte al consejo de administración es uno de los entregables más críticos —y peor ejecutados— de la función de seguridad y compliance. La mayoría de los CISO fallan no por falta de datos, sino por presentar métricas operativas (número de parches, alertas del SIEM, tickets cerrados) que no responden a la pregunta que realmente importa al board: *¿cuál es nuestra exposición al riesgo y cómo evoluciona?*

Un marco de referencia sólido es el **NIST Cybersecurity Framework (CSF) 2.0**, que estructura la función en seis áreas: Govern, Identify, Protect, Detect, Respond y Recover. Para el consejo, la categoría **Govern (GV)** es la puerta de entrada: exige métricas sobre apetito de riesgo, roles y responsabilidades, y política de ciberseguridad. Complementariamente, **ISO/IEC 27001:2022** en su cláusula 9 (Evaluación del desempeño) obliga a definir qué se mide, cómo, cuándo y quién analiza los resultados, mientras que la cláusula 5.1 (Liderazgo) responsabiliza a la alta dirección de la eficacia del SGSI. El **CIS Controls v8** aporta el nivel de implementación por control (IG1, IG2, IG3), ideal para mostrar madurez de forma comparable. **COBIT 2019** ofrece el modelo de cascada de metas: metas empresariales → metas de alineamiento → metas de gobierno/gestión → métricas, evitando reportar en el vacío.

La distinción clave es entre **KPIs** (Key Performance Indicators, miden eficiencia de procesos: % de activos inventariados, tiempo medio de remediación), **KRIs** (Key Risk Indicators, miden exposición prospectiva: número de sistemas críticos sin MFA, % de proveedores sin evaluación de seguridad) y **KCIs** (Key Control Indicators, miden efectividad de controles). El consejo necesita mayoritariamente **KRIs** y una narrativa de tendencia, no una foto puntual. Un buen reporting incorpora además el **MITRE ATT&CK** para traducir hallazgos técnicos en tácticas de adversario (p. ej., "detectamos intentos de T1566 Phishing en 3 de 5 vectores monitorizados") y el **OWASP Top 10** cuando se reporta riesgo de aplicaciones.

Buenas prácticas de formato: una página, semáforo de riesgo, tendencia trimestral, comparación contra apetito de riesgo declarado, y una petición concreta de decisión (presupuesto, aceptación de riesgo residual o escalado). El error fatal es el "greenwashing" de dashboards: todo verde hasta que ocurre el incidente. La transparencia calibrada construye credibilidad ante el consejo.

## EJERCICIO
**Objetivo:** Construir un dashboard ejecutivo de ciberseguridad y compliance de una página para un consejo de administración ficticio.

**Pasos concretos:**

1. **Definir el contexto (30 min):** Elige una empresa ficticia (ej. "FinTech Andes S.A.", 800 empleados, sector financiero regulado por DORA y GDPR). Documenta su apetito de riesgo declarado en 3 dimensiones: disponibilidad, confidencialidad e integridad.

2. **Seleccionar 8-10 métricas (45 min):** Mezcla obligatoria:
   - 3 KRIs (ej. % de sistemas críticos sin MFA, nº de terceros críticos sin dueño de riesgo).
   - 3 KPIs (ej. MTTR de incidentes Sev-1, % de parches críticos aplicados en SLA).
   - 2-3 KCIs alineados a CIS Controls v8 (ej. % cobertura IG2 en Control 5 y 6).
   Mapea cada métrica a una función del NIST CSF 2.0.

3. **Construir el dashboard (60 min):** Usa Google Sheets, Excel o Metabase. Estructura:
   - Encabezado con fecha, periodo y clasificación.
   - Tabla semáforo (verde/ámbar/rojo) con valor actual, objetivo y tendencia (↑↓→).
   - Gráfico de líneas de 4 trimestres para los 3 KRIs principales.
   - Bloque "Top 3 riesgos y decisión requerida".

4. **Redactar el memo ejecutivo (45 min):** Máximo 400 palabras. Debe incluir: mensaje clave (1 frase), evolución vs. trimestre anterior, 2 decisiones solicitadas al consejo y riesgo residual aceptado explícitamente.

5. **Validación cruzada (30 min):** Revisa que cada métrica tenga fuente de datos verificable (SIEM, CMDB, GRC tool), dueño asignado y frecuencia de actualización. Elimina cualquier métrica que no pueda defenderse ante una pregunta del consejo.

**Entregable:** PDF de 2 páginas (dashboard + memo) más una hoja de cálculo con el diccionario de métricas (nombre, fórmula, fuente, dueño, frecuencia, umbral).

## CASO
**Caso: el reporting de Equifax (2017) y la lección del "todo verde".**

En 2017, Equifax sufrió una brecha que expuso datos de ~147 millones de personas. Meses antes del incidente, los informes de seguridad presentados a la dirección mostraban indicadores mayoritariamente positivos: altos porcentajes de cumplimiento de escaneos de vulnerabilidad y procesos de parcheo "en curso". Sin embargo, un KRI crítico —el tiempo de remediación de vulnerabilidades críticas en activos con exposición a Internet— no estaba siendo reportado al board con la granularidad ni la severidad adecuadas. La vulnerabilidad CVE-2017-5638 (Apache Struts) permaneció sin parchear durante meses en el portal de disputas.

El caso ilustra tres fallos de gobernanza y reporting:
1. **Métricas de vanidad:** se reportaba el *número de escaneos ejecutados*, no el *riesgo residual tras el escaneo*.
2. **Ausencia de KRIs prospectivos:** no se medía "días de exposición de CVE críticas en activos Tier-1".
3. **Falta de trazabilidad al apetito de riesgo:** el consejo no había declarado un umbral tolerable de exposición, por lo que ningún valor disparaba escalado.

Posteriormente, la SEC sancionó a un ex-CISO por no escalar la información adecuadamente. La lección para el reporting al consejo es directa: los dashboards deben vincularse a umbrales de apetito de riesgo aprobados formalmente, y los KRIs deben ser prospectivos, no retrospectivos. Un tablero que solo mide lo hecho, no lo expuesto, es un tablero que falla exactamente cuando más se necesita. Este caso se conecta con los controles **CIS Control 7 (Gestión continua de vulnerabilidades)** y **CIS Control 17 (Gestión de respuesta a incidentes)**, y con la función **ID.RA (Risk Assessment)** del NIST CSF.

## Recursos abiertos
- NIST Cybersecurity Framework 2.0 (oficial): https://www.nist.gov/cyberframework
- CIS Critical Security Controls v8: https://www.cisecurity.org/controls
- ISO/IEC 27001:2022 – página oficial: https://www.iso.org/standard/27001
- MITRE ATT&CK (marco de tácticas y técnicas adversarias): https://attack.mitre.org/
- OWASP Top 10: https://owasp.org/www-project-top-ten/

--- [Volver al syllabus](../syllabus.md)
