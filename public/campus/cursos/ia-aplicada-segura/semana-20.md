# Semana 20: Capstone: Sistema ML seguro end-to-end

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 20 de 20

## Objetivo de la semana
Integrar todos los conocimientos del curso en un sistema ML end-to-end que sea seguro por diseño, aplicando controles de seguridad en cada fase del ciclo de vida (datos, entrenamiento, despliegue, inferencia y monitoreo). El estudiante será capaz de mapear amenazas a MITRE ATLAS y MITRE ATT&CK, aplicar controles del NIST AI RMF y OWASP ML Top 10, y entregar un capstone auditable con evidencia de mitigaciones.

## LECTURA
Un sistema ML seguro end-to-end requiere tratar la seguridad como un atributo transversal, no como un añadido. El estándar de facto para mapear amenazas en pipelines ML es **MITRE ATLAS** (Adversarial Threat Landscape for AI Systems), que extiende **MITRE ATT&CK** con tácticas específicas como *ML Model Access*, *Poisoning*, *Evasion* y *Exfiltration via ML Inference API*. Complementariamente, el **OWASP Machine Learning Security Top 10** (ML01: Input Manipulation, ML02: Data Poisoning, ML03: Model Inversion, ML04: Membership Inference, ML05: Model Theft, ML06: AI Supply Chain, ML07: Transfer Learning Attack, ML08: Model Skewing, ML09: Output Integrity, ML10: Model Poisoning) ofrece un catálogo accionable de riesgos.

El **NIST AI Risk Management Framework (AI RMF 1.0)** define cuatro funciones —Govern, Map, Measure, Manage— que deben instrumentarse en el capstone: gobernanza de roles, mapeo de contexto y amenazas, medición con métricas de robustez y privacidad, y gestión con planes de respuesta. Para controles organizacionales, se alinea con **ISO/IEC 27001:2022** (Anexo A, controles 5.7 inteligencia de amenazas, 8.16 monitoreo, 8.28 codificación segura) y **CIS Controls v8** (CSC 1 inventario, CSC 3 protección de datos, CSC 7 gestión de vulnerabilidades, CSC 16 seguridad de aplicaciones). En el plano de aplicación, **OWASP ASVS 4.0** y **OWASP API Security Top 10 (2023)** cubren la superficie de exposición del endpoint de inferencia.

Arquitectónicamente, un pipeline seguro debe incluir: (1) **data provenance** con firmas y hashes (SLSA, in-toto) para resistir envenenamiento; (2) **entrenamiento reproducible** en entornos aislados con control de acceso basado en roles (RBAC) y secretos gestionados (HashiCorp Vault, AWS KMS); (3) **serialización segura** evitando pickle/ONNX sin verificación, prefiriendo safetensors y firma de artefactos; (4) **despliegue** con API autenticada (mTLS, OAuth2), rate limiting, WAF y validación estricta de esquemas de entrada; (5) **monitorización** con detección de drift, data poisoning en producción y logging inmutable (SIEM). Finalmente, la **trazabilidad** mediante Model Cards, SBOM de modelos y registros de linaje (MLflow con firmas) permite auditoría y respuesta a incidentes conforme a NIST SP 800-61.

## EJERCICIO
**Objetivo:** Construir y auditar un sistema ML end-to-end seguro para clasificación de transacciones fraudulentas.

**Pasos:**
1. **Threat modeling:** Usa la plantilla de MITRE ATLAS Navigator (https://atlas.mitre.org/) y produce una matriz de tácticas/técnicas aplicables a tu pipeline. Documenta al menos 10 técnicas con su mitigación OWASP ML Top 10 correspondiente.
2. **Pipeline de datos seguro:** Implementa ingesta con validación de esquema (Great Expectations), hashing SHA-256 por registro y firma de datasets con `cosign` o GPG. Registra linaje en MLflow.
3. **Entrenamiento endurecido:** Entrena en contenedor sin red saliente (Docker `--network none`), usa `safetensors` para pesos y firma el artefacto. Aplica RBAC con roles `data-engineer`, `ml-engineer`, `auditor`.
4. **API de inferencia:** Despliega con FastAPI + mTLS, valida entradas con Pydantic, aplica rate limiting (slowapi) y un WAF (ModSecurity CRS). Añade detección de inputs adversariales con ART (Adversarial Robustness Toolbox).
5. **Monitoreo:** Configura Prometheus + Grafana para métricas de drift (Evidently AI) y alertas a un SIEM (Wazuh o ELK).
6. **Auditoría final:** Genera un informe que mapee cada control a NIST AI RMF (Govern/Map/Measure/Manage), ISO 27001 Anexo A y CIS Controls v8. Incluye Model Card y SBOM del modelo.

**Entregables:** repositorio con IaC (Terraform), pipeline CI/CD (GitHub Actions con SAST/DAST), informe de auditoría PDF y demo funcional.

## CASO
**Caso: envenenamiento de datos en sistemas de detección de fraude (basado en incidentes documentados por MITRE ATLAS y reportes de la industria financiera).** En 2023, investigadores demostraron cómo atacantes con acceso a fuentes de datos externas —como feeds de reputación o datasets públicos de entrenamiento— podían inyectar muestras etiquetadas maliciosamente para degradar la precisión de modelos antifraude en hasta un 30%, provocando falsos negativos sistemáticos. El vector corresponde a **MITRE ATLAS AML.T0020 (Poison Training Data)** y **OWASP ML02: Data Poisoning**. El fallo raíz fue la ausencia de verificación de procedencia y la mezcla de datos no firmados con datos internos. Las lecciones aplicadas en el capstone: firmar todos los datasets, aislar fuentes externas con cuarentena, monitorear drift abrupto (CIS CSC 8) y mantener un modelo *shadow* de referencia para detectar desviaciones. Este caso ilustra por qué el NIST AI RMF exige la función *Map* antes de *Measure*: sin conocer la cadena de suministro de datos, ninguna métrica de robustez es fiable.

## Recursos abiertos
- MITRE ATLAS – Base de conocimiento de amenazas adversariales en IA: https://atlas.mitre.org/
- OWASP Machine Learning Security Top 10: https://owasp.org/www-project-machine-learning-security-top-10/
- NIST AI Risk Management Framework 1.0: https://www.nist.gov/itl/ai-risk-management-framework
- ISO/IEC 27001:2022 – Controles de seguridad de la información: https://www.iso.org/standard/27001
- CIS Controls v8: https://www.cisecurity.org/controls/v8
- Adversarial Robustness Toolbox (IBM): https://github.com/Trusted-AI/adversarial-robustness-toolbox

--- [Volver al syllabus](../syllabus.md)
