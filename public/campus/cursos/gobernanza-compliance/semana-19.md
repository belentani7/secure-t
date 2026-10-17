# Semana 19: Regulaciones emergentes: AI Act, CRA, DSA

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 19 de 20

## Objetivo de la semana
Comprender el alcance, la estructura y las obligaciones de las tres regulaciones europeas emergentes que están redefiniendo la gobernanza digital: el Reglamento de Inteligencia Artificial (AI Act), el Cyber Resilience Act (CRA) y la Ley de Servicios Digitales (DSA). El estudiante aprenderá a mapear sus requisitos técnicos y organizativos con marcos de seguridad consolidados (NIST, ISO 27001, CIS Controls) y a diseñar programas de cumplimiento que integren evaluación de riesgos, transparencia algorítmica, seguridad por diseño y gestión de incidentes en toda la cadena de valor digital.

## LECTURA
El marco regulatorio digital europeo ha entrado en una fase de convergencia normativa sin precedentes. Tres reglamentos configuran el nuevo perímetro de compliance: el **AI Act (Reglamento UE 2024/1689)**, el **Cyber Resilience Act (Reglamento UE 2024/2847)** y la **Digital Services Act (Reglamento UE 2022/2065)**. Cada uno responde a un riesgo distinto, pero comparten principios de *security by design*, rendición de cuentas y trazabilidad.

El **AI Act** adopta un enfoque basado en riesgo en cuatro niveles: inaceptable (prohibido), alto, limitado y mínimo. Los sistemas de alto riesgo —biometría, infraestructuras críticas, educación, empleo, migración— deben cumplir con un sistema de gestión de riesgos alineado con **ISO/IEC 23894** (gestión de riesgos de IA) y **ISO/IEC 42001** (sistema de gestión de IA), además de registrar eventos conforme al marco **MITRE ATLAS**, que documenta tácticas y técnicas adversariales contra sistemas de machine learning (evasión, envenenamiento de datos, extracción de modelo). Los proveedores deben elaborar documentación técnica, garantizar supervisión humana y notificar incidentes graves a las autoridades nacionales.

El **CRA** introduce obligaciones de ciberseguridad para productos con elementos digitales (hardware y software) comercializados en la UE. Exige gestión de vulnerabilidades durante todo el ciclo de vida, generación de SBOM (Software Bill of Materials) conforme a **SPDX** o **CycloneDX**, y notificación de vulnerabilidades explotadas en 24 horas. Es directamente compatible con **NIST SSDF (SP 800-218)** y con los controles de la familia **CIS Controls v8** (especialmente 7: gestión continua de vulnerabilidades y 16: seguridad del software). El CRA convierte prácticas que antes eran voluntarias en obligaciones legales exigibles desde 2027.

La **DSA** regula plataformas intermediarias y motores de recomendación, imponiendo obligaciones escaladas según tamaño: transparencia algorítmica, auditorías independientes, evaluación anual de riesgos sistémicos y mecanismos de respuesta ante crisis. Para VLOPs (Very Large Online Platforms) exige auditorías alineadas con **ISO/IEC 27001** y reporte de incidentes que afecten a la integridad de servicios. La DSA dialoga con **OWASP Top 10** en lo relativo a abuso de plataformas, manipulación de contenido y fraude publicitario.

La estrategia de compliance moderna no trata estos reglamentos como silos: un mismo control —por ejemplo, un programa de gestión de vulnerabilidades— satisface simultáneamente el CRA, alimenta el sistema de gestión de riesgos del AI Act y sostiene las auditorías de la DSA. El reto es construir un **mapa de controles unificado** que traduzca requisitos legales en controles técnicos verificables (NIST CSF 2.0: GV, ID, PR, DE, RS, RC) y evidencias auditables.

## EJERCICIO
**Objetivo:** Construir una matriz de cumplimiento cruzada entre el AI Act, el CRA y la DSA, mapeando cada obligación a controles de NIST CSF 2.0, ISO 27001:2022 y CIS Controls v8.

**Pasos concretos:**

1. **Selección del caso:** Elige una organización ficticia que sea simultáneamente proveedor de software (CRA), operador de una plataforma con motor de recomendación (DSA) y desarrolle un sistema de IA para cribado de currículos (AI Act, alto riesgo).

2. **Extracción de obligaciones:** Descarga los textos oficiales desde EUR-Lex y extrae al menos 8 obligaciones por reglamento (ej.: CRA art. 13 gestión de vulnerabilidades; AI Act art. 9 sistema de gestión de riesgos; DSA art. 34 evaluación de riesgos sistémicos).

3. **Mapeo de controles:** Usa una hoja de cálculo con columnas: *Reglamento | Artículo | Obligación | Control NIST CSF 2.0 | Control ISO 27001:2022 (Anexo A) | CIS Control v8 | Evidencia requerida*.

4. **Generación de SBOM:** Con `syft` o `cdxgen`, genera un SBOM en formato CycloneDX de un proyecto real (puede ser open source) y valida su estructura con `cyclonedx-cli validate`. Documenta cómo ese SBOM sirve como evidencia para el CRA.

5. **Simulación de notificación:** Redacta un borrador de notificación de vulnerabilidad explotada en 24 horas (CRA) y un informe de incidente grave de IA (AI Act art. 73), usando plantillas de **ENISA** como referencia.

6. **Entrega:** Matriz completa (mínimo 24 filas), SBOM validado y los dos informes en PDF/Markdown.

## CASO
**Caso: el algoritmo de cribado de Amazon (2014-2018) y su lectura bajo el AI Act.**

Entre 2014 y 2017, Amazon desarrolló un sistema de IA para automatizar la preselección de currículos. El modelo se entrenó con diez años de solicitudes históricas, mayoritariamente masculinas, y aprendió a penalizar currículos que contuvieran la palabra "women's" (por ejemplo, "women's chess club"). El sistema degradaba sistemáticamente candidaturas femeninas y fue abandonado en 2018 tras detectarse el sesgo.

Bajo el **AI Act**, este sistema sería clasificado como **alto riesgo** (Anexo III, apartado 4: empleo y gestión de trabajadores). Las consecuencias regulatorias habrían sido: (1) obligación de implementar un sistema de gestión de riesgos conforme a ISO/IEC 23894, con análisis explícito de sesgo en datos de entrenamiento; (2) documentación técnica y registro de eventos que permitiera reconstruir decisiones; (3) supervisión humana efectiva, no meramente nominal; (4) evaluación de impacto sobre derechos fundamentales; (5) notificación de incidentes graves.

El caso conecta con **MITRE ATLAS** (técnica AML.T0018: *Manipulate ML Model* vía envenenamiento de datos históricos) y con **OWASP Top 10 for LLM Applications** (LLM06: *Sensitive Information Disclosure*, LLM09: *Overreliance*). También ilustra el principio de la DSA sobre transparencia algorítmica: si la plataforma de empleo hubiera sido intermediaria sujeta a la DSA, habría debido publicar información sobre los parámetros principales de su sistema de recomendación y someterse a auditoría externa. La lección central es que la ausencia de gobernanza algorítmica no es solo un fallo ético: bajo el nuevo marco europeo es una infracción sancionable con multas de hasta el 7% del volumen de negocio mundial (AI Act art. 99) o el 6% (DSA art. 74).

## Recursos abiertos
- Reglamento de Inteligencia Artificial (UE) 2024/1689 — texto consolidado en EUR-Lex: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- Cyber Resilience Act (UE) 2024/2847 — texto oficial y guías de implementación: https://eur-lex.europa.eu/eli/reg/2024/2847/oj
- Digital Services Act (UE) 2022/2065 — texto consolidado y guías de la Comisión: https://eur-lex.europa.eu/eli/reg/2022/2065/oj
- MITRE ATLAS — base de conocimiento de tácticas adversariales contra IA: https://atlas.mitre.org/
- NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework
- OWASP Top 10 for LLM Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- CycloneDX SBOM specification: https://cyclonedx.org/

--- [Volver al syllabus](../syllabus.md)
