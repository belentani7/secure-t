# Semana 15: Preparacion para certificaciones (ISO 27001, SOC2)

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 15 de 20

## Objetivo de la semana
Comprender el alcance, la estructura y los requisitos de las certificaciones ISO/IEC 27001 y SOC 2, así como las metodologías de auditoría asociadas. El estudiante aprenderá a mapear controles técnicos y organizativos frente a estos marcos, preparar evidencia auditable y diseñar un plan de preparación (readiness) previo a una auditoría formal.

## LECTURA

Las certificaciones ISO/IEC 27001 y SOC 2 son dos de los marcos de aseguramiento más demandados por clientes empresariales, inversores y reguladores. Aunque comparten objetivos de control, difieren en naturaleza, alcance y audiencia. ISO/IEC 27001 es una norma internacional publicada por ISO y la IEC, certificable por organismos acreditados, que establece los requisitos para implantar, operar, mantener y mejorar un Sistema de Gestión de Seguridad de la Información (SGSI). Su edición vigente es ISO/IEC 27001:2022, que reemplazó el anexo de controles de 2013 por el Anexo A alineado con ISO/IEC 27002:2022, organizado en cuatro temas: organizacionales (37 controles), personas (8), físicos (14) y tecnológicos (34), totalizando 93 controles. El SGSI se rige por el ciclo PDCA (Plan-Do-Check-Act) y exige liderazgo visible, análisis de contexto (cláusula 4), evaluación de riesgos (cláusula 6), competencia y concienciación (cláusula 7), operación y evaluación del desempeño (cláusulas 8 y 9) y mejora continua (cláusula 10). La certificación se obtiene en dos etapas: auditoría de certificación de etapa 1 (revisión documental) y etapa 2 (verificación de implementación), con auditorías de vigilancia anuales y recertificación cada tres años.

SOC 2 (System and Organization Controls 2) es un marco de aseguramiento emitido por el AICPA (American Institute of Certified Public Accountants) bajo las normas AT-C 205 y 105. A diferencia de ISO 27001, SOC 2 no certifica una organización, sino que emite un informe de atestación sobre los controles relevantes para la seguridad, disponibilidad, integridad de procesamiento, confidencialidad y privacidad (los cinco Trust Services Criteria, TSC). Existen dos tipos: SOC 2 Tipo I, que evalúa el diseño de controles en una fecha concreta, y SOC 2 Tipo II, que evalúa la eficacia operativa durante un periodo (habitualmente 3 a 12 meses). El informe es emitido por una firma de auditoría independiente y se comparte bajo NDA con clientes, no se publica. La selección de controles se basa en los TSC y en los puntos de enfoque (Points of Focus) derivados de los principios COSO 2013 para el criterio de seguridad, que es obligatorio; los otros cuatro son opcionales según el alcance.

La preparación para ambas certificaciones converge en prácticas como la gestión de riesgos, la definición de políticas, la gestión de activos, el control de accesos, la criptografía, la gestión de vulnerabilidades, la monitorización, la respuesta a incidentes y la continuidad de negocio. Los marcos técnicos de referencia complementarios son el NIST Cybersecurity Framework (CSF) 2.0, los CIS Critical Security Controls v8, el NIST SP 800-53 Rev. 5 y MITRE ATT&CK para modelado de amenazas. OWASP resulta esencial para el control de desarrollo seguro (OWASP ASVS, OWASP Top 10, OWASP SAMM). La evidencia auditable suele incluir registros de formación, actas de comité de seguridad, inventarios de activos, matrices de riesgo, informes de pentest, tickets de gestión de cambios, logs de acceso, planes de continuidad y resultados de pruebas de restauración. Un error frecuente es tratar la certificación como un proyecto puntual en lugar de un sistema de gestión vivo: los auditores buscan evidencia de mejora continua, no documentos estáticos. La trazabilidad entre riesgo, control, evidencia y métrica (KPI/KRI) es el eje de una auditoría exitosa.

## EJERCICIO

**Título:** Diseño de un plan de readiness para ISO 27001:2022 y SOC 2 Tipo II en una empresa SaaS ficticia.

**Contexto:** "CloudDocs S.L." es una startup SaaS B2B con 80 empleados que aloja documentación confidencial de clientes en AWS. Un cliente enterprise exige certificación ISO 27001 y un informe SOC 2 Tipo II en 9 meses.

**Pasos:**

1. **Análisis de contexto y alcance (Semana 1-2).** Redacta el alcance del SGSI (servicios, ubicaciones, dependencias cloud). Identifica partes interesadas y requisitos legales (RGPD, LOPDGDD). Usa la plantilla de contexto de ISO 27001 cláusula 4.
2. **Inventario de activos y análisis de riesgos (Semana 2-4).** Construye un inventario de activos con la herramienta open source *Eramba Community* o una hoja de cálculo. Aplica la metodología MAGERIT v3 o ISO 27005 para identificar amenazas, vulnerabilidades y calcular riesgo inherente y residual. Documenta el tratamiento (mitigar, aceptar, transferir, evitar).
3. **Declaración de Aplicabilidad (SoA) (Semana 4-5).** Mapea los 93 controles del Anexo A de ISO 27001:2022, indicando aplicabilidad, justificación y estado de implementación. Cruza cada control con los TSC de SOC 2 (CC1-CC9, A1, C1, PI1, P1-P8) usando una matriz de correspondencia.
4. **Implementación de controles críticos (Semana 5-7).** Configura controles técnicos mínimos: MFA con *Keycloak* o AWS IAM Identity Center, gestión de secretos con *HashiCorp Vault*, SAST con *Semgrep*, dependencias con *OWASP Dependency-Check*, monitorización con *Wazuh* o *ELK*, y backup cifrado con pruebas de restauración documentadas.
5. **Generación de evidencia (Semana 6-8).** Crea un repositorio Git con estructura `/politicas`, `/procedimientos`, `/registros`, `/evidencias`. Automatiza la recolección de evidencia con scripts que exporten logs, capturas y tickets. Aplica control de versiones y firmas.
6. **Simulacro de auditoría interna (Semana 8-9).** Ejecuta una auditoría interna siguiendo ISO 19011. Usa una checklist basada en los 93 controles y en los TSC. Documenta no conformidades mayores/menores y acciones correctivas con plazos.
7. **Entregable final:** Un informe PDF de 15-20 páginas con alcance, SoA, matriz de riesgos, matriz de correspondencia ISO/SOC 2, plan de auditoría interna y roadmap de 9 meses con hitos.

**Herramientas:** Eramba Community, Git, Wazuh, Semgrep, OWASP Dependency-Check, Keycloak, plantillas de AICPA y ISO 27001:2022.

## CASO

**Caso: la auditoría SOC 2 fallida de una fintech tras un incidente de acceso no autorizado.**

En 2022, una fintech europea que procesaba pagos para comercios online solicitó un informe SOC 2 Tipo II para cerrar un contrato con un gran retailer. Durante el periodo de auditoría (6 meses), la firma auditora detectó que un ingeniero había utilizado credenciales compartidas de un rol de administrador de AWS para acceder a un bucket S3 con datos de tarjetas tokenizadas. El acceso no estaba registrado individualmente, no había MFA en ese rol y las políticas de rotación de credenciales no se aplicaban desde hacía 14 meses. Además, el equipo de seguridad no tenía procedimiento documentado de revisión trimestral de accesos, y el plan de respuesta a incidentes nunca se había probado.

El auditor emitió una opinión **adversa** sobre el criterio de Seguridad (CC6.1, CC6.2, CC6.3) y **calificada** sobre Disponibilidad (A1.2). Consecuencias: el contrato con el retailer se perdió (valor estimado 2,3 M€), la ronda de financiación Serie B se retrasó 5 meses, y la empresa tuvo que notificar el incidente a la autoridad de control bajo el RGPD (art. 33) al tratarse de una brecha con riesgo para los derechos de los interesados. El coste total entre auditoría repetida, remediación, asesoría legal y lucro cesante superó los 900.000 €.

**Lecciones clave:**
- La ausencia de trazabilidad individual (principio de responsabilidad, CIS Control 5 y 6) es una no conformidad mayor en SOC 2 y en ISO 27001 (A.5.15, A.5.16, A.8.2).
- El uso de credenciales compartidas viola el principio de mínimo privilegio y rompe la cadena de evidencia.
- Sin pruebas periódicas del plan de respuesta (ISO 27001 A.5.24-A.5.28, NIST CSF 2.0 función "Respond"), los controles son teóricos.
- La certificación no es un sello decorativo: los auditores examinan evidencia operativa durante todo el periodo, no solo el diseño.
- La alineación con MITRE ATT&CK (técnica T1078 - Valid Accounts) permite modelar el escenario y justificar controles defensivos.

## Recursos abiertos
- ISO/IEC 27001:2022 – Información oficial y catálogo de controles: https://www.iso.org/standard/27001
- AICPA – Trust Services Criteria (SOC 2) y guías oficiales: https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2
- NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework
- CIS Critical Security Controls v8: https://www.cisecurity.org/controls
- OWASP Application Security Verification Standard (ASVS): https://owasp.org/www-project-application-security-verification-standard/
- MITRE ATT&CK – Técnica T1078 Valid Accounts: https://attack.mitre.org/techniques/T1078/

--- [Volver al syllabus](../syllabus.md)
