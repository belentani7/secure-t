# Semana 19: Etica, sesgo y pruebas de equidad

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 19 de 20

## Objetivo de la semana
Comprenderás cómo los sistemas de inteligencia artificial pueden amplificar sesgos sociales y producir resultados injustos, y aprenderás a evaluar la equidad algorítmica mediante métricas formales, auditorías y marcos de gobernanza reconocidos. Al finalizar, serás capaz de diseñar pruebas de equidad, documentar riesgos éticos y aplicar controles alineados con estándares como NIST AI RMF, ISO/IEC 42001 y OWASP.

## LECTURA
La ética en IA no es un ejercicio filosófico abstracto: es un requisito de ingeniería y seguridad. Los modelos de machine learning aprenden de datos históricos que contienen desigualdades estructurales, por lo que pueden reproducir o amplificar discriminación por género, raza, edad, discapacidad o nivel socioeconómico. El sesgo puede introducirse en múltiples fases: recolección de datos (sesgo de selección), etiquetado (sesgo del anotador), diseño de features (variables proxy), entrenamiento (desbalance de clases) y despliegue (feedback loops). 

Existen tres grandes familias de sesgo: **sesgo de datos**, **sesgo algorítmico** y **sesgo de implementación/uso**. Las métricas de equidad más usadas incluyen *demographic parity*, *equalized odds*, *equal opportunity*, *predictive parity* y *disparate impact ratio* (regla del 80 %). Un principio clave, formulado por Kleinberg et al., es que varias definiciones de equidad son matemáticamente incompatibles entre sí salvo en casos triviales, por lo que la organización debe elegir métricas según el contexto legal y de negocio.

Los marcos de referencia son esenciales. El **NIST AI Risk Management Framework (AI RMF 1.0)** define funciones *Govern, Map, Measure y Manage* para tratar riesgos de IA, incluidos los de sesgo y equidad. La **ISO/IEC 42001:2023** establece requisitos para sistemas de gestión de IA, y la **ISO/IEC 23894** orienta la gestión de riesgos. La **ISO/IEC TR 24027** aborda específicamente sesgo en sistemas de IA. El **OWASP Top 10 for LLM Applications** incluye riesgos relacionados con contenido dañino y desinformación, mientras que **MITRE ATLAS** documenta tácticas adversariales contra sistemas de ML, muchas de las cuales explotan sesgos o manipulan datos de entrenamiento. Los **CIS Controls v8** aportan controles de inventario, gestión de datos y monitoreo aplicables al ciclo de vida de modelos.

La auditoría de equidad combina análisis cuantitativo (fairness metrics, test de disparidad, análisis de subgrupos) y cualitativo (revisión de daños, participación de stakeholders afectados, documentación tipo *Model Cards* y *Datasheets for Datasets*). Herramientas como **IBM AI Fairness 360**, **Google What-If Tool**, **Microsoft Fairlearn** y **Aequitas** permiten medir y mitigar sesgos. La mitigación puede ser *pre-processing* (rebalanceo de datos), *in-processing* (regularización con restricciones de equidad) o *post-processing* (ajuste de umbrales por grupo). Ninguna técnica elimina el sesgo por completo: la equidad es un proceso continuo de medición, documentación y gobernanza.

## EJERCICIO
**Objetivo:** Auditar un modelo de clasificación binaria y medir su equidad entre subgrupos.

**Herramientas:** Python 3.10+, `pandas`, `scikit-learn`, `fairlearn`, `aif360` (opcional), Jupyter Notebook.

**Pasos:**
1. Descarga el dataset *Adult Income* (UCI) o *COMPAS* desde sus repositorios oficiales.
2. Entrena un clasificador (p. ej. `LogisticRegression` o `RandomForest`) para predecir la variable objetivo.
3. Define el atributo protegido (sexo, raza) y calcula métricas base: accuracy, TPR, FPR por grupo.
4. Usa `fairlearn.metrics` para calcular:
   - `demographic_parity_difference`
   - `equalized_odds_difference`
   - `selection_rate` por grupo
5. Genera un `MetricFrame` para visualizar disparidades por subgrupo.
6. Aplica una mitigación con `ThresholdOptimizer` (post-processing) y compara métricas antes/después.
7. Documenta resultados en una **Model Card** siguiendo la plantilla de Mitchell et al. (2019), incluyendo: uso previsto, datos, métricas de equidad, limitaciones y recomendaciones.
8. Entrega: notebook + Model Card en Markdown + tabla comparativa de métricas.

**Criterios de éxito:** Identificar al menos una disparidad significativa (>10 %) y proponer una mitigación justificada.

## CASO
**Caso COMPAS (Correctional Offender Management Profiling for Alternative Sanctions).** En 2016, la organización ProPublica publicó un análisis del sistema COMPAS, usado en EE. UU. para estimar riesgo de reincidencia. El estudio encontró que, aunque la precisión global era similar entre grupos, la **tasa de falsos positivos** era casi el doble para acusados afroamericanos (≈45 %) frente a blancos (≈23 %), y la **tasa de falsos negativos** era mayor para blancos. La empresa Northpointe argumentó que el sistema cumplía *predictive parity* (misma precisión predictiva por grupo), lo que ilustra la incompatibilidad entre definiciones de equidad descrita por Kleinberg et al.

El caso derivó en demandas (*State v. Loomis*, Wisconsin, 2016), en el cuestionamiento del uso de evaluaciones actuariales en decisiones judiciales y en la necesidad de **transparencia algorítmica** y **debido proceso**. Desde la perspectiva de seguridad y gobernanza, el caso muestra cómo un modelo técnicamente "preciso" puede violar principios de equidad y derechos fundamentales. Las lecciones aplicables incluyen: auditar métricas múltiples, documentar limitaciones, evitar cajas negras en decisiones de alto impacto y alinear el sistema con marcos como NIST AI RMF (función *Measure*) e ISO/IEC TR 24027. El caso también resuena con el **Reglamento Europeo de IA (AI Act)**, que clasifica los sistemas de evaluación de riesgo en justicia como de **alto riesgo**, exigiendo evaluación de conformidad, gestión de riesgos y supervisión humana.

## Recursos abiertos
- https://airc.nist.gov/AI_RMF_Knowledge_Base/AI_RMF (NIST AI Risk Management Framework)
- https://fairlearn.org/ (Fairlearn – toolkit de equidad de Microsoft)
- https://github.com/Trusted-AI/AIF360 (IBM AI Fairness 360)
- https://www.iso.org/standard/81230.html (ISO/IEC 42001:2023 – Sistemas de gestión de IA)
- https://atlas.mitre.org/ (MITRE ATLAS – tácticas adversariales contra ML)
- https://owasp.org/www-project-top-10-for-large-language-model-applications/ (OWASP Top 10 for LLM Applications)

--- [Volver al syllabus](../syllabus.md)
