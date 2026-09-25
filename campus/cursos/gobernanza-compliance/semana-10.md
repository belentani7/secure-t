# Semana 10: Marco de politicas y jerarquia documental

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 10 de 20

## Objetivo de la semana
Comprender cómo se estructura un sistema documental de gobernanza, compliance y seguridad de la información, diferenciando entre políticas, normas, procedimientos, guías y registros. El estudiante aprenderá a diseñar una jerarquía documental coherente, trazable y auditable, alineada con marcos como ISO/IEC 27001, NIST CSF 2.0 y CIS Controls, asegurando su aplicabilidad al RGPD y a entornos regulados.

## LECTURA
Un marco de políticas y jerarquía documental es la columna vertebral de cualquier Sistema de Gestión de Seguridad de la Información (SGSI) y de un programa de compliance digital maduro. Sin una estructura documental clara, las organizaciones incurren en contradicciones normativas, controles duplicados, brechas de trazabilidad y hallazgos recurrentes en auditorías. La jerarquía documental se organiza típicamente en cinco niveles: (1) **Política marco o política de seguridad de la información**, aprobada por la alta dirección, que declara el compromiso, el alcance y los principios; (2) **Normas o estándares internos**, que establecen requisitos obligatorios ("qué" debe cumplirse), por ejemplo, norma de gestión de accesos o de cifrado; (3) **Procedimientos**, que describen el "cómo" se ejecutan las actividades, con responsables, entradas, salidas y plazos; (4) **Guías y buenas prácticas**, de carácter recomendatorio y no obligatorio; y (5) **Registros y evidencias**, que demuestran la ejecución real de los controles (logs, actas, tickets, informes).

Esta pirámide se alinea con el Anexo A de **ISO/IEC 27001:2022**, que exige información documentada para cada control, y con el principio de "documented information" de la cláusula 7.5. El **NIST Cybersecurity Framework 2.0** refuerza la función *Govern* (GV), que incluye políticas, roles, procesos y rendición de cuentas como base para las funciones Identify, Protect, Detect, Respond y Recover. Los **CIS Controls v8** exigen políticas documentadas para cada salvaguarda (por ejemplo, Control 5 sobre gestión de cuentas o Control 8 sobre gestión de logs), y **MITRE ATT&CK** aporta el contexto de amenazas que justifica técnicamente determinadas normas (por ejemplo, T1078 Valid Accounts justifica una política de autenticación multifactor). En el plano regulatorio, el **RGPD** (arts. 5, 24, 28, 30, 32 y 35) exige políticas de protección de datos, registros de actividades de tratamiento, contratos con encargados y evaluaciones de impacto; y el **Reglamento (UE) 2022/2554 (DORA)** o la **Directiva NIS2** imponen marcos documentales de gestión de riesgos TIC y notificación de incidentes.

Un marco bien diseñado cumple cinco propiedades: **coherencia** (sin contradicciones entre niveles), **trazabilidad** (cada control mapea a un requisito legal o marco), **vigencia** (ciclo de revisión definido), **accesibilidad** (control de versiones y distribución) y **evidencia** (registros auditables). Herramientas como un *Information Security Policy Framework* mapeado a ISO 27001, NIST CSF y CIS permiten a los auditores verificar cumplimiento sin ambigüedades. La gobernanza exige además roles definidos (CISO, DPO, Comité de Seguridad), aprobación formal, gestión de excepciones y métricas de cumplimiento documental.

## EJERCICIO
**Objetivo:** Diseñar la jerarquía documental de un SGSI para una empresa ficticia de servicios cloud (150 empleados, clientes en la UE).

**Pasos concretos:**
1. Define el alcance del SGSI y crea un inventario documental en una hoja de cálculo con columnas: ID, Nivel (Política/Norma/Procedimiento/Guía/Registro), Título, Propietario, Aprobador, Frecuencia de revisión, Marco de referencia (ISO 27001, NIST CSF, CIS, RGPD), Estado y Enlace.
2. Redacta la **Política de Seguridad de la Información** (nivel 1) con: propósito, alcance, principios, roles, compromiso de mejora continua y referencias a ISO/IEC 27001 cláusula 5.2.
3. Deriva al menos **cinco normas** (nivel 2): gestión de accesos (CIS Control 5/6), gestión de vulnerabilidades (CIS Control 7), protección de datos personales (RGPD art. 32), gestión de incidentes (NIST CSF RS), y uso aceptable de activos.
4. Para cada norma, redacta un **procedimiento** (nivel 3) con flujo paso a paso, RACI y evidencias generadas.
5. Crea una **matriz de trazabilidad** que mapee cada documento a controles ISO 27001 Anexo A, funciones NIST CSF 2.0, salvaguardas CIS v8 y artículos del RGPD.
6. Define el **ciclo de vida documental**: creación, revisión, aprobación, publicación, revisión anual, obsolescencia y retención.
7. Utiliza una plantilla real (por ejemplo, la de ISO 27001 en GitHub: `https://github.com/OpenISMS/ISO27001-ISMS`) como base y adáptala.

**Entregable:** Repositorio Git con estructura de carpetas `/politicas`, `/normas`, `/procedimientos`, `/guias`, `/registros`, más el inventario y la matriz de trazabilidad en Markdown.

## CASO
**Caso British Airways (2018) – ICO multa de 20 millones de libras (2020).** El ataque, atribuido al grupo FIN7 y relacionado con técnicas de MITRE ATT&CK como T1078 (Valid Accounts) y T1190 (Exploit Public-Facing Application), comprometió los datos de ~400.000 clientes. La investigación de la ICO (Information Commissioner's Office) concluyó que British Airways carecía de medidas técnicas y organizativas adecuadas conforme al entonces vigente Data Protection Act 2018 y al RGPD. Entre los hallazgos clave figuraron: ausencia de políticas documentadas de gestión de accesos privilegiados, procedimientos de gestión de vulnerabilidades no formalizados, y falta de evidencia documental del análisis de riesgos y de las medidas aplicadas a los sistemas que procesaban datos personales. El caso ilustra cómo la ausencia de un marco de políticas y de una jerarquía documental trazable no es un problema "burocrático": es un factor directo de exposición regulatoria y económica. Un marco alineado con ISO/IEC 27001 (controles A.5.15, A.8.2, A.8.8), CIS Controls v8 (5, 7, 16) y NIST CSF 2.0 (GV.RM, PR.AA) habría proporcionado políticas de acceso, procedimientos de parcheo y registros auditables que habrían mitigado el incidente y demostrado diligencia ante el regulador.

## Recursos abiertos
- ISO/IEC 27001:2022 – Sitio oficial: https://www.iso.org/standard/27001
- NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework
- CIS Critical Security Controls v8: https://www.cisecurity.org/controls
- MITRE ATT&CK – T1078 Valid Accounts: https://attack.mitre.org/techniques/T1078/
- ICO – Sanción a British Airways: https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2020/10/ico-fines-british-airways-20m-for-data-breach/
- Plantilla abierta de SGSI ISO 27001: https://github.com/OpenISMS/ISO27001-ISMS

--- [Volver al syllabus](../syllabus.md)
