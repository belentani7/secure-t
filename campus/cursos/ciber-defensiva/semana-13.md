# Semana 13: Gestion del ciclo de vida de vulnerabilidades

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 13 de 20

## Objetivo de la semana
Comprender el ciclo de vida completo de la gestión de vulnerabilidades, desde el descubrimiento y priorización hasta la remediación y verificación, aplicando marcos reconocidos como NIST SP 800-40, CVSS, EPSS, CISA KEV y CIS Controls. El estudiante aprenderá a integrar procesos de escaneo, threat intelligence y respuesta coordinada dentro de un SOC moderno, alineando la gestión de vulnerabilidades con MITRE ATT&CK e ISO/IEC 27001.

## LECTURA
La **gestión del ciclo de vida de vulnerabilidades (Vulnerability Management Lifecycle, VML)** es un proceso continuo e iterativo que permite a las organizaciones identificar, clasificar, priorizar, remediar y verificar debilidades en activos de TI, OT e IoT. A diferencia del simple escaneo periódico, el VML integra gobierno, riesgo, threat intelligence y respuesta a incidentes. El estándar **NIST SP 800-40 Rev. 4** define las fases: *descubrimiento, priorización, evaluación, remediación y verificación*, e introduce el concepto de *Enterprise Patch Management* como parte del ciclo.

El descubrimiento se apoya en escáneres como **Tenable Nessus, Qualys VMDR, Rapid7 InsightVM, OpenVAS/Greenbone** y agentes EDR. Los resultados se normalizan bajo estándares como **CVE (Common Vulnerabilities and Exposures)**, **CWE (Common Weakness Enumeration)** y **CVSS v3.1/v4.0**. Sin embargo, el CVSS base por sí solo no refleja explotabilidad real: por ello se complementa con **EPSS (Exploit Prediction Scoring System)** de FIRST.org y con el catálogo **CISA KEV (Known Exploited Vulnerabilities)**, que lista vulnerabilidades con explotación activa confirmada. La **priorización basada en riesgo** combina estos indicadores con criticidad del activo (CIS Controls v8, Control 7: Continuous Vulnerability Management) y contexto de negocio.

La remediación puede ser mediante parches, mitigaciones compensatorias, segmentación, virtual patching (WAF/IPS) o aislamiento. La verificación cierra el ciclo con re-escaneos, validación de configuraciones (CIS Benchmarks) y métricas como *MTTP (Mean Time To Patch)* y *cobertura de remediación*. **ISO/IEC 27001:2022** en su Anexo A.8.8 exige la gestión técnica de vulnerabilidades, mientras que **MITRE ATT&CK** ayuda a mapear cómo un CVE explotado habilita tácticas como *Initial Access (T1190 – Exploit Public-Facing Application)* o *Privilege Escalation*. El SOC debe integrar el VML con SIEM/SOAR para convertir hallazgos en casos accionables, evitando la "fatiga de parches" y priorizando lo explotable, no solo lo crítico en CVSS.

## EJERCICIO
**Objetivo:** Construir un flujo de priorización de vulnerabilidades basado en riesgo usando datos reales de CVSS, EPSS y CISA KEV.

**Pasos:**
1. Descarga el catálogo **CISA KEV** en formato JSON: `https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json`
2. Descarga la lista de **EPSS scores** desde FIRST: `https://epss.cyentia.com/epss_scores-current.csv.gz`
3. Descarga un dataset de CVEs desde **NVD**: `https://nvd.nist.gov/feeds/json/cve/2.0/nvdcve-2.0-2024.json.gz`
4. Con Python (pandas + requests), cruza los tres datasets por `cveID` y genera una tabla con columnas: CVE, CVSS base, EPSS score, ¿en KEV?, descripción.
5. Aplica una fórmula de priorización:
   - **P1 (crítico):** en KEV + EPSS > 0.5
   - **P2 (alto):** EPSS > 0.1 o CVSS ≥ 9.0
   - **P3 (medio):** CVSS 7.0–8.9 sin explotación conocida
   - **P4 (bajo):** resto
6. Exporta el resultado a `priorizacion_vulns.csv` y visualiza con matplotlib un gráfico de barras por prioridad.
7. Redacta un breve informe (1 página) explicando por qué priorizar por EPSS+KEV reduce la ventana de exposición frente a priorizar solo por CVSS.

**Entregables:** script Python, CSV priorizado, gráfico e informe.

## CASO
**Caso: WannaCry (2017) y la lección del ciclo de vida incompleto.**
En mayo de 2017, el ransomware **WannaCry** afectó a más de 200.000 sistemas en 150 países, incluyendo el NHS británico, Telefónica y FedEx. La vulnerabilidad explotada fue **CVE-2017-0144 (MS17-010, EternalBlue)** en SMBv1, cuya parche fue publicado por Microsoft dos meses antes (marzo de 2017). El fallo organizacional no fue la falta de parche disponible, sino la **ausencia de un ciclo de vida de vulnerabilidades efectivo**: no había inventario completo de activos, no se priorizó por exposición (SMB expuesto a Internet), no se aplicó segmentación y muchas organizaciones seguían ejecutando Windows XP/7 sin soporte.

Desde la perspectiva del SOC, el caso ilustra varias fases del VML fallidas:
- **Descubrimiento:** activos no inventariados (CIS Control 1 y 2).
- **Priorización:** CVSS 9.8 ignorado por falta de contexto de explotabilidad.
- **Remediación:** parches no aplicados en sistemas críticos.
- **Verificación:** sin re-escaneo post-parche.

Hoy, CVE-2017-0144 figura en **CISA KEV**, y su explotación mapea a **MITRE ATT&CK T1210 (Exploitation of Remote Services)** y **T1486 (Data Encrypted for Impact)**. El aprendizaje: el VML debe ser continuo, medible y alineado con threat intelligence en tiempo real; un parche disponible sin proceso es tan inútil como un antivirus desactualizado.

## Recursos abiertos
- https://www.cisa.gov/known-exploited-vulnerabilities-catalog
- https://www.first.org/epss/
- https://csrc.nist.gov/pubs/sp/800/40/r4/final
- https://attack.mitre.org/techniques/T1190/
- https://www.cisecurity.org/controls/v8

--- [Volver al syllabus](../syllabus.md)
