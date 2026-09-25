# Semana 20: Capstone: Construir programa GRC desde cero

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 20 de 20

## Objetivo de la semana
Diseñar, estructurar e implementar un programa integral de Gobernanza, Riesgo y Cumplimiento (GRC) desde cero para una organización ficticia, integrando marcos normativos reales como ISO/IEC 27001, NIST CSF 2.0, CIS Controls v8 y GDPR. El estudiante aprenderá a alinear políticas, controles técnicos, gestión de riesgos y auditoría en un único sistema documentado y auditable.

## LECTURA
Un programa GRC (Governance, Risk & Compliance) no es un conjunto de documentos aislados, sino un **sistema socio-técnico** que conecta la estrategia del negocio con los controles operativos y las obligaciones regulatorias. Construirlo desde cero exige partir de tres ejes: **gobierno** (quién decide, cómo y con qué autoridad), **riesgo** (identificación, análisis, tratamiento y monitoreo continuo) y **cumplimiento** (evidencia demostrable frente a auditores y reguladores).

La arquitectura de referencia más sólida hoy combina el **NIST Cybersecurity Framework 2.0** (con sus seis funciones: Govern, Identify, Protect, Detect, Respond, Recover) como capa estratégica, el **Anexo A de ISO/IEC 27001:2022** (93 controles en cuatro temas: organizacionales, personas, físicos y tecnológicos) como capa de control, y los **CIS Controls v8** como guía de implementación priorizada y medible. Sobre esta base se mapean obligaciones regulatorias: RGPD (arts. 5, 24, 25, 32, 33-34), NIS2, DORA si aplica al sector financiero, y leyes locales de protección de datos.

El núcleo operativo de un GRC es el **registro de riesgos**. Cada riesgo debe documentarse con activo afectado, amenaza (idealmente mapeada a **MITRE ATT&CK** para riesgos cibernéticos), vulnerabilidad, probabilidad, impacto, riesgo inherente, controles existentes, riesgo residual y plan de tratamiento (aceptar, mitigar, transferir, evitar). La metodología puede seguir **ISO 31000** o **NIST SP 800-30 Rev.1**. Las vulnerabilidades técnicas se priorizan con **CVSS v4.0** y se contextualizan con **EPSS** y el catálogo **CISA KEV**.

La capa de cumplimiento se materializa en una **matriz de declaración de aplicabilidad (SoA)** que justifica inclusión/exclusión de cada control, un **plan de auditoría interna** alineado a ISO 19011, y un **cuadro de mando** con KPIs (cobertura de controles, tiempo medio de remediación, % riesgos residuales aceptados) y KRIs (intentos de exfiltración, cuentas privilegiadas sin MFA, parches pendientes críticos).

Un error frecuente es tratar GRC como proyecto con fecha de cierre. En realidad es un **ciclo PDCA permanente** (Plan-Do-Check-Act) con revisiones por la dirección al menos anuales, gestión documental versionada (ISO 27001 cláusula 7.5) y evidencia trazable. La automatización vía plataformas GRC (ServiceNow, Archer, OpenGRC, Eramba) reduce carga, pero no sustituye el juicio del responsable de riesgo. Finalmente, todo programa debe integrar **OWASP Top 10** y **OWASP ASVS** para el dominio de aplicaciones, y **OWASP SAMM** para madurez de seguridad en el SDLC.

## EJERCICIO
**Objetivo:** Construir el esqueleto documental y operativo de un programa GRC para "FinTech Nova S.L.", empresa ficticia de pagos con 120 empleados, que procesa datos personales y financieros en la UE.

**Pasos concretos:**

1. **Definir el alcance y contexto (ISO 27001 cláusulas 4.1-4.3).** Redacta en 1 página: misión del negocio, activos críticos (motor de pagos, base de datos de clientes, API pública), partes interesadas y requisitos legales aplicables (RGPD, PSD2, NIS2).

2. **Elaborar el registro de riesgos.** Identifica mínimo 10 riesgos. Para cada uno usa una plantilla con: ID, activo, amenaza (mapea al menos 3 a tácticas MITRE ATT&CK como T1566 Phishing, T1190 Exploit Public-Facing Application, T1078 Valid Accounts), vulnerabilidad, probabilidad (1-5), impacto (1-5), riesgo inherente, controles ISO 27001 Anexo A aplicables, riesgo residual y tratamiento.

3. **Construir la Declaración de Aplicabilidad (SoA).** Selecciona 30 controles del Anexo A de ISO 27001:2022 relevantes para FinTech. Indica para cada uno: aplicable sí/no, justificación y estado de implementación.

4. **Mapear controles a CIS Controls v8.** Toma los 18 controles CIS y marca cuáles están cubiertos por tu SoA. Identifica los 3 gaps más críticos (probablemente CIS Control 3 - Data Protection y CIS Control 6 - Access Control Management).

5. **Diseñar el cuadro de mando GRC.** Define 5 KPIs y 3 KRIs con fórmula, fuente de datos y frecuencia de medición.

6. **Redactar la Política de Seguridad de la Información** (máximo 2 páginas) siguiendo la estructura de ISO 27001 cláusula 5.2, con aprobación de la dirección y fecha de revisión.

7. **Plan de auditoría interna.** Diseña un plan anual alineado a ISO 19011 con 4 auditorías trimestrales, alcance, criterios y responsables.

**Herramientas sugeridas:** plantilla en Markdown o Google Sheets, diagrama de flujo en draw.io, y opcionalmente instalar **Eramba Community Edition** o **OpenGRC** para digitalizar el registro.

**Entregable:** repositorio Git con todos los artefactos versionados y un README que explique la arquitectura del programa.

## CASO
**Caso: British Airways (2018) — lecciones de GRC fallido.**

En septiembre de 2018, British Airways sufrió una brecha que expuso datos de 429.612 clientes, incluyendo nombres, direcciones, correos y datos completos de tarjetas de crédito. El ataque, atribuido al grupo FIN7 (mapeable a MITRE ATT&CK T1190 y T1078), comprometió la aplicación web de pagos mediante skimming de JavaScript. La **Information Commissioner's Office (ICO)** del Reino Unido impuso inicialmente una multa de 183 millones de libras bajo el RGPD, posteriormente reducida a 20 millones tras negociación.

**Análisis GRC del fallo:**
- **Gobierno:** ausencia de un propietario claro del riesgo de la cadena de suministro web; los controles de terceros no estaban auditados.
- **Riesgo:** no había registro de riesgos que contemplara el escenario de "compromiso de script de terceros en checkout". Si se hubiera usado **NIST CSF ID.RA-01** con **MITRE ATT&CK T1190/T1059.007**, el riesgo habría sido visible.
- **Cumplimiento:** incumplimiento del art. 32 RGPD (medidas técnicas apropiadas) y art. 33 (notificación en 72h, que se retrasó). Faltaban controles **ISO 27001 A.8.28 (Secure coding)** y **A.5.19-5.22 (seguridad en proveedores)**.
- **Detección:** sin monitorización de integridad de scripts (CIS Control 3.3 y 8.5), el skimming operó durante semanas.

**Lecciones aplicables al capstone:**
1. Un GRC sin registro de riesgos actualizado es teatro documental.
2. La cadena de suministro debe estar en el alcance del SGSI (ISO 27001 A.5.19-5.23).
3. Los KPIs deben medir efectividad real (tiempo de detección de cambios en producción), no solo cumplimiento formal.
4. La notificación de brechas es un proceso ensayado, no improvisado: exige runbooks y simulacros (NIST CSF RS.CO).

Este caso demuestra que un programa GRC bien construido habría identificado el riesgo, priorizado el control y probablemente evitado o mitigado el impacto.

## Recursos abiertos
- NIST Cybersecurity Framework 2.0 (oficial): https://www.nist.gov/cyberframework
- ISO/IEC 27001:2022 — información oficial y Anexo A: https://www.iso.org/standard/27001
- CIS Critical Security Controls v8: https://www.cisecurity.org/controls
- MITRE ATT&CK Enterprise Matrix: https://attack.mitre.org/matrices/enterprise/
- OWASP Top 10 (2021): https://owasp.org/Top10/
- Eramba GRC Open Source: https://www.eramba.org/
- ICO — Sanción a British Airways (caso real): https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2020/10/ico-fines-british-airways-20m-for-data-breach/

--- [Volver al syllabus](../syllabus.md)
