# Semana 16: Despliegue seguro: on-prem y cloud

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 16 de 20

## Objetivo de la semana
Comprender los principios, controles y arquitecturas de seguridad aplicables al despliegue de modelos de IA y sistemas ML tanto en infraestructura on-premise como en entornos cloud. El estudiante será capaz de diseñar pipelines de despliegue endurecidos, aplicar controles del NIST SP 800-53 y CIS Benchmarks, y evaluar riesgos específicos del ciclo de vida de modelos en producción.

## LECTURA

El despliegue seguro de sistemas de machine learning difiere sustancialmente del despliegue de software tradicional, porque introduce una superficie de ataque ampliada: artefactos del modelo (pesos, checkpoints), pipelines de datos, endpoints de inferencia, feature stores y APIs de MLOps. En entornos on-premise, el equipo asume control total sobre la pila (hardware, hipervisor, SO, orquestador), lo que exige aplicar controles del **CIS Benchmarks** para sistemas operativos y contenedores, además de segmentación de red según **NIST SP 800-125** (Guide to Security for Full Virtualization Technologies). En cloud, el modelo de responsabilidad compartida traslada parte del control al proveedor, pero el cliente sigue siendo responsable de la configuración de IAM, cifrado, logging y del cumplimiento del **NIST SP 800-53 Rev. 5** en los controles heredados y propios.

Un framework útil para mapear amenazas específicas de ML es **MITRE ATLAS** (Adversarial Threat Landscape for AI Systems), que documenta tácticas como *ML Model Access*, *Poisoning*, *Evasion* y *Exfiltration via ML Inference API*. Estas tácticas se alinean con el **OWASP Machine Learning Security Top 10** (ML01: Input Manipulation, ML06: AI Supply Chain Attacks) y con el **OWASP Top 10 for LLM Applications**, especialmente LLM05 (Supply Chain) y LLM06 (Sensitive Information Disclosure). Para gobernanza, **ISO/IEC 27001:2022** Anexo A 8.9 (configuration management) y 8.28 (secure coding) son directamente aplicables, mientras que **ISO/IEC 42001** (AI Management System) aporta controles específicos para el ciclo de vida del modelo.

Buenas prácticas clave incluyen: firma y verificación de artefactos con **Sigstore/Cosign** y **SLSA** niveles 3-4; aislamiento de workloads con gVisor, Kata Containers o namespaces reforzados; gestión de secretos mediante **HashiCorp Vault** o **AWS KMS/Secrets Manager**; inferencia con *rate limiting*, *WAF* y validación estricta de esquemas (pydantic, JSON Schema); y observabilidad con detección de *drift* y anomalías en inputs (evasión). En cloud, aplicar **CIS Benchmarks for AWS/Azure/GCP**, **AWS Well-Architected Security Pillar** y **Zero Trust Architecture (NIST SP 800-207)**. En on-prem, *air-gapped* deployments requieren gestión offline de actualizaciones, HSM para claves y auditoría con **MITRE ATT&CK** para detección de movimiento lateral hacia nodos de entrenamiento.

Finalmente, el despliegue debe integrarse con **CI/CD seguro** (SLSA, in-toto), escaneo de imágenes (Trivy, Grype), SBOM (CycloneDX, SPDX) y *policy as code* (OPA/Gatekeeper, Kyverno). La trazabilidad del modelo —linaje, versionado, hashes— es requisito para responder a incidentes y cumplir auditorías bajo ISO 27001 y SOC 2.

## EJERCICIO

**Objetivo:** Desplegar un modelo de clasificación en un clúster Kubernetes local con controles de seguridad alineados a CIS Benchmarks y NIST SP 800-190 (Container Security Guide).

**Pasos:**
1. Instala **kind** o **k3s** y aplica el **CIS Kubernetes Benchmark** usando `kube-bench`. Documenta hallazgos con severidad HIGH.
2. Empaqueta un modelo scikit-learn en una imagen OCI con usuario no-root, filesystem read-only y sin capacidades (`drop: ALL`). Escanea con **Trivy** y genera SBOM en formato CycloneDX.
3. Firma la imagen con **Cosign** y configura **Kyverno** para rechazar imágenes sin firma válida.
4. Despliega el endpoint de inferencia detrás de un **Ingress con TLS** y aplica *NetworkPolicy* default-deny. Añade *rate limiting* con **NGINX Ingress**.
5. Instrumenta métricas con **Prometheus** y alertas ante picos de latencia o inputs anómalos (evasión).
6. Simula un ataque de *model extraction* enviando consultas masivas; verifica que el rate limiting y las alertas funcionan.
7. Entrega: SBOM, reporte `kube-bench`, manifiestos YAML firmados y captura de la alerta disparada.

**Criterio de éxito:** Todos los controles HIGH del CIS aplicados o justificados, imagen firmada verificada en admisión, y detección efectiva del ataque simulado.

## CASO

**Incidente: fuga de modelo propietario vía endpoint de inferencia mal configurado (2023).**

Una startup de visión por computadora desplegó su modelo de detección de fraude en **AWS SageMaker** con un endpoint público sin autenticación robusta (API key estática embebida en el frontend). Investigadores de seguridad, siguiendo tácticas de **MITRE ATLAS (AML.T0040 – ML Model Access)** y **AML.T0024 – Exfiltration via ML Inference API**, extrajeron el comportamiento del modelo mediante *model stealing*: miles de consultas automatizadas permitieron entrenar un clon con ~92% de fidelidad, evadiendo el sistema de producción de la víctima.

El análisis posterior reveló fallas alineadas con **OWASP ML Top 10 (ML06 Supply Chain / ML08 Model Skewing)** y con controles ausentes del **NIST SP 800-53** (AC-3, AU-6, SC-8): sin autenticación fuerte (mTLS/OAuth2), sin rate limiting por identidad, sin logging correlacionado, y sin cifrado de extremo a extremo. La empresa no contaba con SBOM ni firma de artefactos, por lo que tampoco pudo descartar manipulación del checkpoint.

**Lecciones:** (1) tratar el endpoint de inferencia como activo crítico con Zero Trust; (2) implementar *query budgets* y detección de patrones de extracción; (3) firmar y versionar artefactos (SLSA/Cosign); (4) alinear logging con **MITRE ATT&CK/ATLAS** para detección temprana; (5) cumplir ISO 27001 A.8.20 (network security) y A.5.14 (information transfer).

## Recursos abiertos
- MITRE ATLAS – Matriz de tácticas adversariales contra sistemas de IA: https://atlas.mitre.org/
- OWASP Machine Learning Security Top 10: https://owasp.org/www-project-machine-learning-security-top-10/
- NIST SP 800-190, Guide to Container Security: https://csrc.nist.gov/pubs/sp/800/190/final
- CIS Benchmarks (Kubernetes, AWS, Azure): https://www.cisecurity.org/cis-benchmarks
- SLSA – Supply-chain Levels for Software Artifacts: https://slsa.dev/
- Sigstore / Cosign: https://docs.sigstore.dev/cosign/overview/

--- [Volver al syllabus](../syllabus.md)
