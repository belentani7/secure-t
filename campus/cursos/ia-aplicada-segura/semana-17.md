# Semana 17: Monitoreo y deteccion de deriva

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 17 de 20

## Objetivo de la semana
Esta semana el estudiante aprenderá a diseñar e implementar sistemas de monitoreo continuo para modelos de inteligencia artificial en producción, con énfasis en la detección temprana de *data drift*, *concept drift* y *model drift*. Se abordarán métricas estadísticas, umbrales de alerta, pipelines de observabilidad y su integración con marcos de seguridad como MITRE ATLAS, NIST AI RMF y CIS Controls para garantizar la fiabilidad y resiliencia del sistema a lo largo del tiempo.

## LECTURA

El monitoreo y la detección de deriva (*drift detection*) constituyen la capa de defensa operativa que permite a un sistema de IA mantener su integridad funcional y de seguridad después del despliegue. Un modelo entrenado en un momento *t* refleja la distribución de datos de ese instante; cuando esa distribución cambia en producción, la precisión y la calibración se degradan, y en contextos adversarios esa degradación puede ser explotada activamente. La literatura distingue tres tipos principales: **data drift** (o covariate shift), donde P(X) cambia pero P(Y|X) permanece estable; **concept drift**, donde cambia la relación P(Y|X) —por ejemplo, cambios en el fraude real que el modelo debe detectar—; y **label drift**, donde cambia la distribución de las etiquetas P(Y). A estos se suma el **model drift** o *model decay*, la pérdida progresiva de rendimiento medible por métricas como F1, AUC-ROC o calibración (ECE).

Para detectar estos fenómenos existen pruebas estadísticas robustas: la **prueba de Kolmogorov-Smirnov (KS)** y **Cramér-von Mises** para variables continuas, la **Population Stability Index (PSI)** ampliamente usada en el sector financiero (con umbrales típicos: PSI < 0.1 estable, 0.1–0.25 cambio moderado, > 0.25 cambio significativo), la **Jensen-Shannon Divergence**, el **Kullback-Leibler Divergence** y pruebas multivariadas como **Maximum Mean Discrepancy (MMD)** o el **Classifier Two-Sample Test**. Para *concept drift* se emplean detectores incrementales como **ADWIN**, **DDM (Drift Detection Method)**, **EDDM** y **Page-Hinkley**, implementados en librerías como River, Evidently AI, NannyML y Alibi-Detect.

Desde la perspectiva de seguridad, la deriva no es solo un problema de calidad: es una **superficie de ataque**. Un adversario puede inducir *data poisoning* gradual o *evasion* sostenida para empujar al modelo hacia un estado degradado sin disparar alarmas puntuales. **MITRE ATLAS** documenta tácticas relevantes: *AML.T0020 (Poison Training Data)*, *AML.T0015 (Evade ML Model)* y *AML.T0043 (Craft Adversarial Data)*. El **NIST AI Risk Management Framework (AI RMF 1.0)** en sus funciones MAP, MEASURE y MANAGE exige monitoreo continuo y trazabilidad; el **NIST SP 800-53 Rev.5** controles SI-4 (System Monitoring) y CA-7 (Continuous Monitoring) aplican directamente. **ISO/IEC 27001:2022** control A.8.16 (Monitoring activities) e **ISO/IEC 42001:2023** (AI Management Systems) refuerzan la necesidad de telemetría y auditoría. Los **CIS Controls v8** control 8 (Audit Log Management) y control 13 (Network Monitoring and Defense) aportan la base de logging estructurado. **OWASP Top 10 for LLM Applications** en su entrada LLM10 (*Model Theft*) y LLM04 (*Model Denial of Service*) subraya la importancia de vigilar el comportamiento anómalo de inferencia.

Un pipeline moderno de observabilidad combina: (1) **logging estructurado** de features, predicciones y confianza; (2) **métricas estadísticas** calculadas en ventanas deslizantes; (3) **ground truth diferido** para calcular rendimiento real; (4) **alertas con umbrales** calibrados por impacto de negocio; y (5) **retraining automatizado o champion-challenger**. Herramientas como **Evidently**, **WhyLabs**, **Arize**, **Fiddler**, **NannyML**, **Prometheus + Grafana** y **MLflow** permiten implementar esta capa. La clave es que las alertas de drift se traten como eventos de seguridad: con severidad, playbooks de respuesta y evidencia forense (features, predicciones, versiones del modelo, hashes).

## EJERCICIO

**Objetivo:** Implementar un pipeline de detección de *data drift* y *concept drift* sobre un modelo de clasificación, con alertas automatizadas y análisis de causa raíz.

**Herramientas:** Python 3.11, `evidently`, `scikit-learn`, `river`, `pandas`, `prometheus_client`, `docker`, `Grafana`.

**Pasos:**

1. **Preparación del dataset.** Descarga el dataset *Give Me Some Credit* (Kaggle) o *Credit Card Fraud Detection* (ULB). Divídelo temporalmente: 70% entrenamiento, 15% referencia, 15% simulación de producción.
2. **Entrenamiento base.** Entrena un `RandomForestClassifier` y guarda el modelo con `joblib` junto con un hash SHA-256 y metadatos (fecha, versión, features).
3. **Simulación de drift.** Genera tres escenarios: (a) *covariate shift* multiplicando una feature numérica por 1.5; (b) *concept drift* invirtiendo etiquetas en un 10% de la clase positiva; (c) *label shift* submuestreando la clase mayoritaria.
4. **Pipeline Evidently.** Usa `DataDriftPreset`, `TargetDriftPreset` y `ClassificationPreset` para comparar producción vs. referencia. Exporta reportes HTML y JSON.
5. **Detector incremental.** Implementa `ADWIN` de `river` sobre el error de predicción en streaming para detectar *concept drift* en tiempo real.
6. **Exposición de métricas.** Publica PSI, KS-statistic, F1 y tasa de drift en un endpoint `/metrics` con `prometheus_client`.
7. **Alertas.** Configura reglas en Prometheus: alerta crítica si PSI > 0.25 durante 3 ventanas consecutivas, o si F1 cae > 15% respecto a la línea base. Envía notificaciones a un webhook (Slack/Discord).
8. **Dashboard.** Despliega Grafana conectado a Prometheus con paneles para PSI por feature, F1 en el tiempo y tasa de alertas.
9. **Informe.** Documenta hallazgos, umbrales elegidos y justificación alineada con NIST AI RMF (función MEASURE) y CIS Control 8.

**Entregable:** Repositorio con código, reportes Evidently, capturas del dashboard y un `README.md` con el análisis de causa raíz de cada escenario de drift.

## CASO

**Caso: degradación silenciosa en un sistema de scoring crediticio (2021–2022).**

Un banco europeo operaba un modelo de *credit scoring* basado en gradient boosting para aprobar microcréditos. Durante la pandemia y la posterior inflación, la distribución de ingresos declarados, ratios de endeudamiento y comportamiento de pago cambió drásticamente. El modelo no contaba con monitoreo de *drift*: solo se evaluaba trimestralmente con métricas agregadas. En seis meses, la tasa de falsos negativos (clientes solventes rechazados) aumentó 22% y la de falsos positivos (impagos aprobados) 14%, generando pérdidas estimadas en 4,3 millones de euros y quejas regulatorias ante el supervisor (EBA).

El análisis post-mortem reveló: (1) *covariate shift* severo en la feature "ingreso mensual" (PSI = 0.41); (2) *concept drift* porque la relación ingreso-impago se invirtió en segmentos jóvenes; (3) ausencia de *ground truth* diferido conectado al pipeline. La auditoría, alineada con **ISO/IEC 42001** y el **NIST AI RMF (MANAGE 2.2)**, concluyó que debía implementarse monitoreo continuo con umbrales PSI, alertas automáticas y reentrenamiento trimestral con validación champion-challenger. Adicionalmente, **MITRE ATLAS** se usó para evaluar si un actor malicioso podría haber inducido el drift mediante *data poisoning* en el formulario de solicitud; aunque no se probó, se endurecieron los controles de validación de entrada siguiendo **OWASP Top 10 for LLM (LLM04)** y **CIS Control 3 (Data Protection)**.

**Lecciones clave:** la deriva es un riesgo operativo y de seguridad; el monitoreo debe ser proactivo, no reactivo; y las alertas deben integrarse en un playbook de respuesta con responsables, plazos y evidencia forense.

## Recursos abiertos
- Evidently AI – Documentación oficial de detección de drift: https://docs.evidentlyai.com/
- NIST AI Risk Management Framework 1.0: https://www.nist.gov/itl/ai-risk-management-framework
- MITRE ATLAS – Adversarial Threat Landscape for AI Systems: https://atlas.mitre.org/
- River – Online Machine Learning (ADWIN, DDM, EDDM): https://riverml.xyz/
- OWASP Top 10 for Large Language Model Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications/

--- [Volver al syllabus](../syllabus.md)
