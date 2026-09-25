# Semana 16: Compliance en cloud y responsabilidad compartida

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 16 de 20

## Objetivo de la semana
Comprender el modelo de responsabilidad compartida en entornos cloud y su impacto en la gobernanza, el cumplimiento normativo y la auditoría. El estudiante aprenderá a delimitar responsabilidades entre proveedor y cliente según el modelo de servicio (IaaS, PaaS, SaaS), aplicar marcos como ISO/IEC 27017, ISO/IEC 27018, NIST SP 800-145 y el Cloud Controls Matrix del CIS, y evaluar evidencias de compliance en despliegues multinube.

## LECTURA
El modelo de responsabilidad compartida es el principio rector de la seguridad y el compliance en la nube. Formulado inicialmente por AWS y adoptado por Azure, Google Cloud y Oracle, establece que el proveedor es responsable de "la seguridad **de** la nube" (instalaciones físicas, hipervisor, red troncal, virtualización) mientras que el cliente lo es de "la seguridad **en** la nube" (datos, identidades, configuraciones, parches del sistema operativo invitado, código). Esta frontera se desplaza según el modelo de servicio: en IaaS el cliente gestiona SO, middleware y runtime; en PaaS el proveedor cubre el runtime y el cliente los datos y accesos; en SaaS casi todo recae en el proveedor, salvo la gestión de identidades, la configuración de compartición y la clasificación de la información.

Para gobernar este reparto, el sector dispone de estándares específicos. ISO/IEC 27017 amplía ISO/IEC 27001 con 37 controles adicionales orientados a relaciones cliente-proveedor cloud (por ejemplo, CLD.9.5.1 sobre segregación de entornos virtuales o CLD.12.4.5 sobre monitorización del proveedor). ISO/IEC 27018 se centra en la protección de datos personales en nubes públicas actuando como PII Processor, alineada con el RGPD (arts. 28, 32 y 44-49 sobre transferencias internacionales). El NIST SP 800-145 define los modelos IaaS/PaaS/SaaS y las cinco características esenciales del cloud, mientras que NIST SP 800-144 y SP 800-146 detallan controles y arquitecturas de referencia. El CIS Controls v8 incluye el Control 15 (gestión de proveedores de servicios) y el Cloud Controls Matrix (CCM v4) mapea 197 objetivos de control frente a ISO 27001, SOC 2, PCI DSS, HIPAA y RGPD, siendo la herramienta preferida por auditores para evaluar CSPs.

Desde la perspectiva de amenazas, MITRE ATT&CK for Cloud (IaaS, SaaS, Office 365, Azure AD, Google Workspace) documenta tácticas como *Initial Access* mediante credenciales filtradas, *Privilege Escalation* explotando roles IAM mal configurados, *Persistence* con claves de acceso adicionales y *Exfiltration* hacia buckets públicos. La OWASP Cloud-Native Application Security Top 10 y el OWASP Top 10 for LLM Applications cubren riesgos específicos de arquitecturas cloud-native. El RGPD exige al responsable del tratamiento (cliente) realizar un *due diligence* del encargado (CSP), firmar un Data Processing Agreement conforme al art. 28, evaluar transferencias con SCCs o decisiones de adecuación, y documentar el Registro de Actividades de Tratamiento (art. 30). La auditoría se apoya en certificaciones (ISO 27001, SOC 1/2/3, CSA STAR Level 2), informes de penetración, matrices de responsabilidad RACI y evidencias técnicas como logs de CloudTrail, Azure Activity Log o Google Cloud Audit Logs.

## EJERCICIO
**Objetivo:** Elaborar una matriz RACI de responsabilidad compartida y un checklist de auditoría para un despliegue híbrido.

**Pasos:**
1. Elige un escenario realista: una empresa que despliega una aplicación web en AWS (EC2 + RDS PostgreSQL + S3) y usa Microsoft 365 para correo corporativo.
2. Descarga la plantilla de **CIS Cloud Controls Matrix v4** desde https://cloudsecurityalliance.org/artifacts/cloud-controls-matrix-v4 y filtra los dominios aplicables (IAM, Data Security, Logging & Monitoring, Supply Chain).
3. Construye una tabla RACI con al menos 15 controles (ej. cifrado en reposo de RDS, MFA en root, parcheo del SO en EC2, gestión de claves KMS, retención de logs, gestión de identidades en Entra ID) indicando R (Responsible), A (Accountable), C (Consulted) e I (Informed) para cliente y proveedor.
4. Para cada control, identifica la evidencia auditable (informe SOC 2 Type II, ISO 27017, config de AWS Config, log de CloudTrail).
5. Redacta un **Data Processing Agreement** mínimo (1 página) con cláusulas del art. 28 RGPD: objeto, duración, naturaleza y finalidad, tipo de datos, obligaciones del encargado, subencargados, medidas de seguridad, auditoría y supresión.
6. Realiza un análisis de brecha con **Prowler** (https://github.com/prowler-cloud/prowler) o **ScoutSuite** contra una cuenta sandbox y documenta 5 hallazgos con su control CIS/ISO asociado.
7. Entrega: matriz RACI + DPA + informe de brecha con recomendaciones priorizadas por riesgo.

## CASO
**Accenture y el bucket S3 expuesto (2017):** Un investigador de UpGuard descubrió cuatro repositorios S3 de Accenture configurados como públicos, incluyendo claves de API, contraseñas de bases de datos y datos de clientes. Aunque AWS opera bajo el principio de responsabilidad compartida y ofrece cifrado y políticas de bucket por defecto, la configuración de acceso público recae íntegramente en el cliente. El incidente ilustra cómo un fallo de gobernanza en la capa del cliente (falta de controles CIS 3.3 sobre cifrado y CIS 3.6 sobre acceso público, ausencia de monitorización continua y de auditoría de configuraciones) puede exponer activos críticos aunque el proveedor esté certificado en ISO 27001 y SOC 2. El caso derivó en refuerzos de auditoría interna en múltiples organizaciones y en la adopción masiva de herramientas CSPM (Cloud Security Posture Management) como AWS Config, Prisma Cloud o Wiz. Refuerza la lección de que la certificación del CSP no exime al cliente de su parte del modelo de responsabilidad compartida ni de sus obligaciones como responsable del tratamiento bajo el RGPD.

## Recursos abiertos
- CIS Cloud Controls Matrix v4: https://cloudsecurityalliance.org/artifacts/cloud-controls-matrix-v4
- NIST SP 800-145 (definición de cloud computing): https://csrc.nist.gov/pubs/sp/800/145/final
- MITRE ATT&CK for Cloud: https://attack.mitre.org/matrices/enterprise/cloud/
- Prowler (herramienta open source de auditoría cloud): https://github.com/prowler-cloud/prowler
- ISO/IEC 27017:2015 (controles de seguridad cloud): https://www.iso.org/standard/43757.html

--- [Volver al syllabus](../syllabus.md)
