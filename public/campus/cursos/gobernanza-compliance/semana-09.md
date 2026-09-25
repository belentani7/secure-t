# Semana 9: Programas de auditoria y assurance

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 9 de 20

## Objetivo de la semana
Comprender cómo se diseña, ejecuta y reporta un programa de auditoría y assurance en materia de gobernanza digital, privacidad y ciberseguridad. El estudiante aprenderá a integrar marcos como ISO/IEC 27001, NIST CSF, CIS Controls y COBIT para planificar auditorías basadas en riesgo, recopilar evidencia, evaluar controles y emitir conclusiones de aseguramiento defendibles ante reguladores, clientes y dirección.

## LECTURA
Un **programa de auditoría y assurance** es el conjunto estructurado de políticas, metodologías, recursos, calendarios y criterios mediante los cuales una organización obtiene evidencia independiente y objetiva sobre la eficacia de sus controles, el cumplimiento normativo y la gestión de riesgos. A diferencia de una auditoría puntual, un programa es continuo, basado en riesgos y alineado con el ciclo de mejora Plan-Do-Check-Act (PDCA) que subyace a ISO/IEC 27001:2022. La norma exige en sus cláusulas 9.1 (seguimiento y medición), 9.2 (auditoría interna) y 9.3 (revisión por la dirección) que las organizaciones planifiquen auditorías considerando la importancia de los procesos, los cambios y los resultados de auditorías previas. En el ámbito del RGPD (art. 24, 28, 32 y 39), el responsable y el delegado de protección de datos deben verificar periódicamente la conformidad del tratamiento, incluyendo auditorías a encargados del tratamiento y evaluaciones de impacto.

El diseño del programa parte de un **universo auditable**: inventario de procesos, sistemas, activos de información, proveedores y obligaciones legales. Sobre ese universo se aplica un **análisis de riesgo** (ISO 31000, NIST SP 800-30) para priorizar auditorías según impacto y probabilidad. Los marcos de control más usados como criterios de auditoría son:
- **ISO/IEC 27001 y 27002**: sistema de gestión y controles de seguridad.
- **ISO/IEC 27701**: extensión de privacidad y RGPD.
- **NIST Cybersecurity Framework 2.0**: funciones Gobernar, Identificar, Proteger, Detectar, Responder y Recuperar.
- **NIST SP 800-53 Rev.5**: catálogo de controles y evaluaciones.
- **CIS Critical Security Controls v8**: 18 controles priorizados y medibles.
- **COBIT 2019**: gobernanza de TI y aseguramiento.
- **MITRE ATT&CK**: útil como referencia para evaluar la cobertura de detección y respuesta frente a tácticas y técnicas adversarias reales.
- **OWASP ASVS y OWASP Top 10**: criterios para auditar seguridad de aplicaciones.

La ejecución combina técnicas como revisión documental, entrevistas, observación, análisis de configuraciones, pruebas de penetración autorizadas, muestreo estadístico y **pruebas de eficacia operativa**. La evidencia debe ser suficiente, fiable, relevante y útil (principio de auditoría). El resultado se documenta en hallazgos clasificados por severidad (crítica, alta, media, baja) con criterio, condición, causa, efecto y recomendación. Finalmente, el **assurance** trasciende la auditoría técnica: incluye certificaciones (ISO 27001, SOC 2), atestaciones (ISAE 3402), informes de terceros y programas de bug bounty. Un buen programa mantiene trazabilidad entre riesgos, controles, evidencias y métricas (KRI, KPI) para demostrar mejora continua.

## EJERCICIO
**Objetivo:** Diseñar un programa anual de auditoría y assurance para una empresa ficticia de comercio electrónico ("TiendaNova S.L.") que trata datos personales de clientes en la UE y usa AWS y un SaaS de CRM.

**Pasos concretos:**
1. **Inventario y universo auditable (1 h):** Crea una hoja en Google Sheets o Excel con procesos, sistemas, proveedores y activos de información. Incluye al menos 10 entradas.
2. **Análisis de riesgo (1 h):** Aplica una matriz 5x5 (probabilidad x impacto) usando criterios de ISO 31000. Prioriza los 5 procesos con mayor riesgo.
3. **Selección de criterios (30 min):** Elige dos marcos como referencia: ISO/IEC 27001:2022 Anexo A y CIS Controls v8. Mapea al menos 10 controles relevantes.
4. **Plan de auditoría (1 h):** Elabora un calendario trimestral con alcance, objetivos, criterios, recursos, responsables y tipo (interna, externa, proveedor).
5. **Programa de pruebas (1 h):** Para una auditoría concreta (p. ej., gestión de accesos), redacta procedimientos de prueba: revisión de políticas, muestreo de altas/bajas de usuarios en AWS IAM, verificación MFA, revisión de logs.
6. **Plantilla de hallazgos (30 min):** Crea una plantilla con campos: ID, criterio, condición, causa, efecto, riesgo, severidad, recomendación, responsable, fecha.
7. **Métricas de assurance (30 min):** Define 5 KPI/KRI (p. ej., % de hallazgos críticos cerrados en 30 días, cobertura de auditoría del universo, tiempo medio de remediación).
8. **Informe ejecutivo (1 h):** Redacta un resumen de 1 página con conclusiones, opinión de assurance y plan de acción.

**Herramientas sugeridas:** Google Sheets/Excel, plantillas de ISACA, checklist CIS Controls v8, plantilla de declaración de aplicabilidad ISO 27001. Entrega final: un PDF con el programa completo y la plantilla de hallazgos.

## CASO
**Caso: la brecha de Equifax (2017) y las lecciones de assurance fallido.** En 2017, Equifax sufrió una brecha que expuso datos personales de aproximadamente 147 millones de personas. La causa raíz fue una vulnerabilidad en Apache Struts (CVE-2017-5638) que llevaba meses sin parchearse, pese a que el equipo de seguridad había emitido alertas internas. Un análisis posterior reveló fallos sistémicos en el programa de auditoría y assurance: el inventario de activos era incompleto (no se identificó correctamente el servidor afectado), el escaneo de vulnerabilidades no cubría todos los sistemas, y las auditorías internas no verificaban la eficacia operativa de la gestión de parches. La empresa contaba con certificaciones y políticas, pero el **assurance real** era débil: se auditaba el diseño de controles, no su funcionamiento continuo. El caso ilustra varios principios: (1) un programa de auditoría debe basarse en un universo auditable completo y actualizado; (2) la evidencia debe incluir pruebas técnicas, no solo documentales; (3) el mapeo con MITRE ATT&CK permite evaluar si los controles detectan técnicas reales (en este caso, explotación de aplicación pública); (4) CIS Control 7 (gestión continua de vulnerabilidades) y Control 1 (inventario de activos) habrían detectado la exposición; (5) el RGPD y el CCPA posteriormente elevaron las exigencias de rendición de cuentas. La lección para el auditor moderno es que el assurance debe ser **continuo, basado en evidencia técnica y alineado con riesgos reales**, no un ejercicio anual de cumplimiento formal.

## Recursos abiertos
- ISO/IEC 27001:2022 – Información oficial: https://www.iso.org/standard/27001
- NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework
- CIS Critical Security Controls v8: https://www.cisecurity.org/controls
- MITRE ATT&CK: https://attack.mitre.org/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- AEPD – Guía de auditoría de protección de datos: https://www.aepd.es
- ISACA – Recursos de auditoría de TI: https://www.isaca.org/resources

--- [Volver al syllabus](../syllabus.md)
