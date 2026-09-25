# Semana 17: Seguridad de aplicaciones y DevSecOps

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 17 de 20

## Objetivo de la semana
Comprender los principios de la seguridad de aplicaciones modernas y la integración de prácticas de seguridad dentro del ciclo de vida de desarrollo de software (SDLC) mediante DevSecOps. El estudiante aprenderá a identificar vulnerabilidades comunes según OWASP Top 10 y CWE Top 25, aplicar controles de seguridad en pipelines CI/CD, y utilizar herramientas de análisis estático y dinámico para mitigar riesgos en aplicaciones en producción.

## LECTURA
La seguridad de aplicaciones ha evolucionado desde un enfoque reactivo (parchear después del incidente) hacia un modelo proactivo conocido como DevSecOps, donde la seguridad se integra desde las fases de diseño hasta el despliegue y operación. El estándar de facto para clasificar riesgos en aplicaciones web es el **OWASP Top 10**, cuya edición 2021 incluye categorías como A01:2021 – Broken Access Control, A03:2021 – Injection y A06:2021 – Vulnerable and Outdated Components. Complementariamente, el **CWE Top 25** de MITRE identifica debilidades de software más peligrosas, como CWE-79 (Cross-site Scripting) y CWE-89 (SQL Injection).

DevSecOps se apoya en marcos como **NIST SP 800-218 (Secure Software Development Framework, SSDF)** que define prácticas para productores de software (PO.1 a PO.5, PS.1 a PS.3, PW.1 a PW.9, RV.1 a RV.3). Asimismo, el **NIST SP 800-115** guía pruebas de seguridad técnica, y **ISO/IEC 27001:2022** en su Anexo A control 8.25-8.31 aborda seguridad en desarrollo y pruebas. Los **CIS Controls v8** incluyen el Control 16 (Application Software Security) con salvaguardas como 16.1 (proceso de desarrollo seguro), 16.11 (uso de análisis dinámico) y 16.12 (análisis estático).

Un pipeline DevSecOps típico incorpora: SAST (Static Application Security Testing) con herramientas como Semgrep o SonarQube; DAST (Dynamic Application Security Testing) con OWASP ZAP; SCA (Software Composition Analysis) con OWASP Dependency-Check o Trivy; y gestión de secretos con HashiCorp Vault o GitLeaks. La seguridad en la cadena de suministro se rige por **SLSA (Supply-chain Levels for Software Artifacts)** y el **NIST SP 800-204D**. El modelado de amenazas (STRIDE, PASTA) y el mapeo a **MITRE ATT&CK** para tácticas de explotación web (T1190 – Exploit Public-Facing Application) permiten priorizar defensas. La cultura "shift-left" implica que los desarrolladores ejecuten pruebas de seguridad en pre-commit hooks y pull requests, reduciendo el costo de remediación. Finalmente, el monitoreo en runtime con RASP (Runtime Application Self-Protection) y WAF (Web Application Firewall) complementa la defensa en profundidad, alineándose con el marco **MITRE D3FEND** para contramedidas como D3-IA (Input Analysis) y D3-EFA (Executable File Analysis).

## EJERCICIO
**Título:** Integración de seguridad en un pipeline CI/CD con GitHub Actions y análisis de vulnerabilidades.

**Pasos:**
1. Clona un repositorio vulnerable de ejemplo: `git clone https://github.com/OWASP/NodeGoat.git` (aplicación Node.js con vulnerabilidades intencionales).
2. Crea un archivo `.github/workflows/devsecops.yml` en la raíz del repositorio con los siguientes jobs:
   - **SAST:** Ejecuta `semgrep ci --config=auto` usando la acción `returntocorp/semgrep-action@v1`.
   - **SCA:** Ejecuta `owasp/dependency-check-action@main` con `--format SARIF` y sube resultados a GitHub Security tab.
   - **Secret Scanning:** Usa `gitleaks/gitleaks-action@v2` para detectar credenciales hardcodeadas.
   - **DAST (opcional):** Levanta la app con `docker-compose up -d` y ejecuta `zaproxy/action-baseline@v0.10.0` apuntando a `http://localhost:4000`.
3. Configura el workflow para que se dispare en `push` a `main` y en `pull_request`.
4. Ejecuta el pipeline manualmente desde la pestaña Actions y documenta:
   - Número de hallazgos por severidad (Critical, High, Medium, Low).
   - Al menos 3 vulnerabilidades específicas con su CWE asociado (ej: CWE-89, CWE-79).
   - Mapea cada hallazgo a una táctica de MITRE ATT&CK (ej: T1190).
5. Corrige una vulnerabilidad crítica (por ejemplo, inyección NoSQL en `app/data/user-dao.js`) y vuelve a ejecutar el pipeline para verificar la remediación.
6. Entrega un informe en Markdown con capturas de pantalla de los resultados antes y después, y una tabla que relacione hallazgo → CWE → control CIS v8 → mitigación.

**Objetivo:** Demostrar que el estudiante puede automatizar controles de seguridad en un pipeline real y priorizar remediaciones basadas en estándares.

## CASO
**Caso: Brecha en SolarWinds (2020) – Ataque a la cadena de suministro de software.**

En diciembre de 2020 se descubrió que actores APT29 (Cozy Bear, atribuido a Rusia) comprometieron la cadena de suministro de SolarWinds Orion, una plataforma de monitoreo usada por más de 18,000 clientes, incluyendo agencias del gobierno de EE.UU. como el Departamento de Tesoro y CISA. Los atacantes insertaron código malicioso (SUNBURST) en las actualizaciones legítimas del software, que se distribuían firmadas digitalmente. Esto permitió a los atacantes establecer persistencia y movimiento lateral en redes objetivo durante meses sin ser detectados.

**Análisis DevSecOps:**
- **Fallo en SCA y verificación de integridad:** Aunque SolarWinds firmaba sus binarios, no había verificación de procedencia (provenance) ni SLSA level 3+. Un pipeline DevSecOps maduro habría incluido atestaciones de build reproducibles y firmas con Sigstore/Cosign.
- **Ausencia de SAST/DAST en el build:** El código malicioso se inyectó en la fase de compilación, evadiendo análisis estático tradicional. Se requería monitoreo de integridad del build server (CIS Control 16.9 – verificación de integridad de artefactos).
- **Mapeo MITRE ATT&CK:** T1195.002 (Compromise Software Supply Chain), T1553.002 (Code Signing), T1071 (Application Layer Protocol) para C2.
- **Lecciones:** Implementar SBOM (Software Bill of Materials) según NIST SP 800-218 RV.1, usar análisis de comportamiento en runtime (RASP) para detectar C2 inusual, y aplicar el principio de menor privilegio en cuentas de servicio. El caso impulsó la Orden Ejecutiva 14028 de EE.UU., que exige SBOM a proveedores federales.

## Recursos abiertos
- OWASP Top 10 – https://owasp.org/www-project-top-ten/
- NIST SP 800-218 Secure Software Development Framework – https://csrc.nist.gov/publications/detail/sp/800-218/final
- MITRE CWE Top 25 – https://cwe.mitre.org/top25/archive/2023/2023_top25_list.html

--- [Volver al syllabus](../syllabus.md)
