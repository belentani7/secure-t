# Semana 14: Gobernanza: EU AI Act y NIST AI RMF

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 14 de 20

## Objetivo de la semana
Comprender los marcos regulatorios y de gestión de riesgos que gobiernan los sistemas de IA, con foco en el Reglamento Europeo de Inteligencia Artificial (EU AI Act) y el NIST AI Risk Management Framework (AI RMF 1.0). El estudiante aprenderá a mapear controles de seguridad de IA frente a estándares como ISO/IEC 42001, ISO 27001 y CIS Controls, y a traducir requisitos legales en prácticas técnicas de gobernanza, evaluación de riesgos y cumplimiento auditable.

## LECTURA
La gobernanza de IA ha dejado de ser un ejercicio voluntario para convertirse en un requisito regulatorio vinculante. El **EU AI Act** (Reglamento UE 2024/1689, en vigor desde agosto de 2024) establece un enfoque basado en riesgos que clasifica los sistemas de IA en cuatro niveles: **riesgo inaceptable** (prohibidos, como scoring social o manipulación subliminal), **alto riesgo** (Anexo III: biometría, infraestructura crítica, educación, empleo, servicios esenciales, migración, justicia), **riesgo limitado** (obligaciones de transparencia, p. ej. chatbots) y **riesgo mínimo**. Los sistemas de alto riesgo deben cumplir con un sistema de gestión de riesgos continuo (Art. 9), gobernanza de datos (Art. 10), documentación técnica (Anexo IV), registro en bases de datos de la UE (Art. 49), transparencia, supervisión humana (Art. 14), robustez, precisión y ciberseguridad (Art. 15). Las sanciones alcanzan 35 millones de euros o el 7 % del volumen de negocio global.

En paralelo, el **NIST AI Risk Management Framework (AI RMF 1.0)**, publicado en enero de 2023 en cumplimiento de la Orden Ejecutiva 13960 y la Ley de Iniciativa Nacional de IA, ofrece un marco voluntario pero ampliamente adoptado. Se estructura en cuatro funciones nucleares: **GOVERN** (cultura de riesgo, roles, políticas), **MAP** (contexto, categorización, impactos), **MEASURE** (métricas, evaluación, seguimiento) y **MANAGE** (priorización, respuesta, recuperación). El AI RMF se complementa con el **NIST AI 600-1 (Generative AI Profile)** y el **AI 100-2 (Adversarial Machine Learning Taxonomy)**, que cataloga ataques como envenenamiento de datos, evasión, inferencia de membresía y abuso de modelos.

La conexión con estándares de seguridad tradicionales es directa: **ISO/IEC 27001:2022** aporta el Sistema de Gestión de Seguridad de la Información (SGSI) que puede albergar los controles de IA; **ISO/IEC 42001:2023** es el primer estándar internacional de Sistemas de Gestión de IA (AIMS); **ISO/IEC 23894** guía la gestión de riesgos de IA; y los **CIS Controls v8** (especialmente el Control 3 – Protección de Datos, Control 4 – Configuración Segura y Control 17 – Gestión de Respuesta a Incidentes) sirven como controles técnicos habilitadores. Para el modelado de amenazas, **MITRE ATLAS** (Adversarial Threat Landscape for AI Systems) extiende MITRE ATT&CK con tácticas y técnicas específicas de IA, mientras que **OWASP Top 10 for LLM Applications** (2025) y **OWASP Machine Learning Security Top 10** enumeran riesgos como prompt injection, fuga de datos sensibles y denegación de servicio de modelos. La gobernanza efectiva exige integrar estos marcos en un ciclo PDCA: política → evaluación de riesgos → controles técnicos → auditoría → mejora continua.

## EJERCICIO
**Objetivo:** Clasificar un sistema de IA real bajo el EU AI Act y mapear sus riesgos frente al NIST AI RMF y MITRE ATLAS.

**Pasos:**
1. Elige un sistema de IA (p. ej. un chatbot de RR. HH. que filtra CVs, o un sistema de scoring crediticio).
2. Descarga el texto oficial del EU AI Act desde EUR-Lex y localiza los Anexos II y III. Determina la categoría de riesgo y lista los artículos aplicables (9, 10, 13, 14, 15).
3. Accede al NIST AI RMF Playbook (https://www.nist.gov/itl/ai-risk-management-framework) y completa una tabla con subcategorías de las cuatro funciones (GOVERN, MAP, MEASURE, MANAGE) relevantes para tu caso.
4. Consulta MITRE ATLAS (https://atlas.mitre.org) y selecciona al menos 5 técnicas de ataque aplicables (p. ej. AML.T0020 – Poison Training Data, AML.T0051 – LLM Prompt Injection).
5. Usa OWASP Top 10 for LLM Applications (https://genai.owasp.org) para identificar 3 riesgos específicos si tu sistema usa un LLM.
6. Redacta un informe de 2 páginas con: clasificación regulatoria, matriz de riesgos (probabilidad × impacto), controles propuestos alineados a ISO/IEC 27001 Anexo A y CIS Controls v8, y plan de supervisión humana.

**Herramientas:** plantillas del NIST AI RMF, hoja de cálculo, editor markdown, acceso a EUR-Lex y MITRE ATLAS.

## CASO
**Caso: el sistema de selección de personal de Amazon (2014–2018).** Amazon desarrolló una herramienta de IA basada en machine learning para automatizar la revisión de currículos. El modelo fue entrenado con currículos históricos de la empresa durante una década, que reflejaban una fuerte dominancia masculina en puestos técnicos. El sistema aprendió a penalizar currículos que incluían la palabra "women's" (p. ej. "women's chess club") y favorecía verbos asociados a candidatos masculinos. Aunque Amazon intentó neutralizar estos sesgos, el proyecto se abandonó en 2018 tras confirmarse que el modelo reproducía discriminación de género.

Bajo el **EU AI Act**, este sistema sería clasificado como **alto riesgo** (Anexo III, punto 4: empleo y gestión de trabajadores), exigiendo gobernanza de datos (Art. 10) para detectar sesgos, supervisión humana efectiva (Art. 14) y evaluación de conformidad previa a la comercialización. Bajo el **NIST AI RMF**, el fallo se ubica en las funciones MAP (no se identificó el sesgo histórico del dataset) y MEASURE (no se aplicaron métricas de equidad como disparate impact o equal opportunity). Desde **MITRE ATLAS**, el escenario corresponde a AML.T0020 (Poison Training Data) por contaminación histórica del dataset, y a AML.T0043 (Craft Adversarial Data) si un atacante manipulara currículos. La lección de gobernanza es clara: ningún control técnico sustituye la necesidad de un AIMS documentado, auditorías algorítmicas periódicas y trazabilidad de decisiones, tal como exige ISO/IEC 42001 y los CIS Controls 3 y 17.

## Recursos abiertos
- Reglamento EU AI Act (texto oficial): https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- NIST AI Risk Management Framework 1.0 y Playbook: https://www.nist.gov/itl/ai-risk-management-framework
- MITRE ATLAS – Adversarial Threat Landscape for AI Systems: https://atlas.mitre.org
- OWASP Top 10 for LLM Applications: https://genai.owasp.org/llm-top-10/
- ISO/IEC 42001:2023 – Information technology — Artificial intelligence — Management system: https://www.iso.org/standard/81230.html

--- [Volver al syllabus](../syllabus.md)
