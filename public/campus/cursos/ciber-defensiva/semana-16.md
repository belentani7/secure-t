# Semana 16: Postura de seguridad en cloud (CSPM/CWPP)

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 16 de 20

## Objetivo de la semana
Comprender los pilares de la postura de seguridad en entornos cloud mediante las disciplinas CSPM (Cloud Security Posture Management) y CWPP (Cloud Workload Protection Platform). El estudiante aprenderá a identificar malas configuraciones, evaluar riesgos en workloads y aplicar marcos como CIS Benchmarks, NIST CSF y MITRE ATT&CK for Cloud para detectar y remediar exposiciones reales.

## LECTURA

La adopción de infraestructura cloud ha transformado el modelo de responsabilidad compartida: el proveedor (AWS, Azure, GCP) asegura "la seguridad **de** la nube", mientras el cliente asegura "la seguridad **en** la nube". Este último ámbito es donde operan CSPM y CWPP, dos categorías complementarias definidas originalmente por Gartner.

**CSPM (Cloud Security Posture Management)** se enfoca en la configuración y cumplimiento continuo de los recursos cloud: buckets S3 públicos, security groups con 0.0.0.0/0, IAM con privilegios excesivos, logging deshabilitado, cifrado ausente. Evalúa el *estado* del entorno contra baselines como **CIS Benchmarks** (CIS AWS Foundations, CIS Azure Foundations), **NIST SP 800-53**, **ISO/IEC 27017** (controles de seguridad cloud) e **ISO/IEC 27018** (protección de PII en cloud). Herramientas representativas: AWS Security Hub, Microsoft Defender for Cloud, Prisma Cloud, Wiz, Prowler, ScoutSuite.

**CWPP (Cloud Workload Protection Platform)** protege las cargas de trabajo en ejecución: contenedores, VMs, funciones serverless y Kubernetes. Cubre runtime, vulnerabilidades de imágenes, integridad de archivos, segmentación y detección de comportamiento anómalo. Se alinea con **MITRE ATT&CK for Containers** y **MITRE ATT&CK for Cloud**, donde destacan tácticas como *Initial Access* (T1078 Valid Accounts, T1190 Exploit Public-Facing Application), *Privilege Escalation* (T1548 Abuse Elevation Control), *Credential Access* (T1552 Unsecured Credentials) y *Impact* (T1485 Data Destruction, T1486 Data Encrypted for Impact).

El **NIST Cybersecurity Framework** (Identify-Protect-Detect-Respond-Recover) y el **NIST SP 800-190** (Application Container Security Guide) estructuran la implementación. El **OWASP Cloud-Native Application Security Top 10** y el **OWASP Kubernetes Top 10** cubren riesgos como misconfiguraciones, secretos expuestos, RBAC débil y supply chain. Los **CIS Controls v8** (especialmente Control 3 - Data Protection, Control 4 - Secure Configuration, Control 12 - Network Infrastructure Management) son la base operativa.

La convergencia actual se denomina **CNAPP (Cloud-Native Application Protection Platform)**, que unifica CSPM, CWPP, CIEM (Cloud Infrastructure Entitlement Management) y protección de la cadena de suministro en un solo plano. El SOC moderno integra estos hallazgos en SIEM/SOAR: los eventos de CSPM alimentan casos de cumplimiento, mientras CWPP genera telemetría runtime (Falco, Sysdig, eBPF) para detección de amenazas. La clave operativa es el **shift-left**: integrar escaneo IaC (Terraform, CloudFormation) en CI/CD con herramientas como Checkov, tfsec o KICS, antes del despliegue. Sin esta disciplina, los equipos de seguridad se convierten en cuellos de botella reactivos en lugar de habilitadores proactivos.

## EJERCICIO

**Objetivo:** Detectar y remediar malas configuraciones en un entorno AWS de laboratorio usando CSPM open source y validar protección de workload con CWPP.

**Requisitos:** Cuenta AWS Free Tier (o LocalStack), AWS CLI configurado, Python 3.10+, Docker, kubectl y minikube.

**Pasos:**

1. **Despliegue del entorno vulnerable:** Crea un bucket S3 sin cifrado ni block public access, un security group con SSH abierto a 0.0.0.0/0 y un usuario IAM con `AdministratorAccess`. Documenta cada recurso con `aws s3api get-bucket-acl`, `aws ec2 describe-security-groups` y `aws iam list-attached-user-policies`.

2. **Ejecuta Prowler (CSPM):** Instala con `pip install prowler` y ejecuta:
   ```
   prowler aws -c cis_1.5_aws -M json-ocsf -o ./reporte
   ```
   Analiza hallazgos clasificados por severidad. Mapea cada FAIL a su control CIS AWS Foundations Benchmark correspondiente (ej: 2.1.4 S3 Block Public Access).

3. **Escaneo IaC shift-left:** Crea un archivo `main.tf` con un security group abierto y ejecuta `checkov -f main.tf`. Corrige el código y vuelve a ejecutar hasta obtener PASS.

4. **Despliegue workload en Kubernetes:** En minikube, aplica un pod con `securityContext.privileged: true` y un secret en variable de entorno. Instala **Falco** vía Helm:
   ```
   helm repo add falcosecurity https://falcosecurity.github.io/charts
   helm install falco falcosecurity/falco
   ```
   Ejecuta `kubectl exec` dentro del pod y observa las alertas runtime de Falco (reglas MITRE ATT&CK for Containers: T1611 Escape to Host, T1552 Unsecured Credentials).

5. **Remediación:** Corrige los recursos cloud (habilita cifrado, restringe SG, aplica least privilege al usuario IAM). Re-ejecuta Prowler y verifica reducción de hallazgos críticos. Documenta el antes/después con capturas y el mapeo a NIST CSF (función Protect: PR.AC, PR.DS).

**Entregable:** Informe markdown con hallazgos, mapeo a CIS/NIST/MITRE, evidencia de remediación y lecciones aprendidas.

## CASO

**Caso: Capital One (2019) — SSRF + IAM mal configurado en AWS**

En julio de 2019, Capital One sufrió una brecha que expuso datos de más de 100 millones de clientes (EE.UU. y Canadá). El vector fue una **Server-Side Request Forgery (SSRF)** contra un WAF mal configurado en una instancia EC2. El atacante (una ex-empleada de AWS) explotó la vulnerabilidad para consultar el **metadata service** (`169.254.169.254`) y obtener credenciales temporales del rol IAM asociado a la instancia.

El rol tenía permisos excesivos: podía listar y leer buckets S3. Con esas credenciales, el atacante enumeró buckets, identificó uno con datos sensibles y exfiltró ~100 GB. Además, la organización no tenía cifrado ni monitoreo efectivo de accesos anómalos a S3.

**Mapeo MITRE ATT&CK for Cloud:**
- T1190 — Exploit Public-Facing Application (SSRF en WAF)
- T1552.005 — Unsecured Credentials: Cloud Instance Metadata API
- T1078.004 — Valid Accounts: Cloud Accounts
- T1530 — Data from Cloud Storage

**Fallos de postura (CSPM):**
- IAM con privilegios excesivos (violación CIS AWS 1.x).
- Ausencia de IMDSv2 obligatorio (mitigación clave contra SSRF).
- Falta de cifrado y de logging granular en S3.
- Sin alertas sobre accesos inusuales (CloudTrail + GuardDuty ausentes o mal afinados).

**Lecciones CWPP/CSPM:** La brecha ilustra por qué CSPM debe validar continuamente IAM, IMDS y cifrado; y por qué CWPP debe detectar comportamiento anómalo en workloads. Capital One fue multada con 80 M USD por el OCC y 190 M USD en acuerdo civil, convirtiéndose en caso de estudio obligatorio para cualquier programa cloud. La remediación moderna incluye: IMDSv2 forzado, permisos IAM con least privilege (validado con IAM Access Analyzer), S3 Block Public Access, cifrado KMS por defecto y detección con GuardDuty + Security Hub.

## Recursos abiertos
- https://github.com/prowler-cloud/prowler — Herramienta CSPM open source para AWS, Azure, GCP y Kubernetes.
- https://attack.mitre.org/matrices/enterprise/cloud/ — Matriz MITRE ATT&CK for Cloud con tácticas y técnicas específicas.
- https://www.cisecurity.org/benchmark/amazon_web_services — CIS Amazon Web Services Foundations Benchmark oficial.
- https://kubernetes.io/docs/concepts/security/ — Guía oficial de seguridad de Kubernetes (base para CWPP).
- https://csrc.nist.gov/pubs/sp/800/190/final — NIST SP 800-190, Application Container Security Guide.

--- [Volver al syllabus](../syllabus.md)
