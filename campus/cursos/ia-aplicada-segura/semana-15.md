# Semana 15: Explicabilidad y rastros de auditoria

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 15 de 20

## Objetivo de la semana
Comprender los fundamentos de la explicabilidad (XAI) en sistemas de inteligencia artificial y su relación directa con la trazabilidad y los rastros de auditoría. El estudiante aprenderá a diseñar mecanismos que permitan reconstruir decisiones automatizadas, cumplir con marcos regulatorios y detectar manipulaciones o comportamientos anómalos en modelos de ML.

## LECTURA
La explicabilidad y los rastros de auditoría son pilares de la seguridad y confianza en sistemas de IA. Mientras que la explicabilidad busca responder *por qué* un modelo tomó una decisión, los rastros de auditoría garantizan *qué ocurrió*, *cuándo*, *quién* y *con qué datos*. En el contexto de ML seguridad, ambos conceptos se entrelazan: sin trazabilidad no hay explicabilidad verificable, y sin explicabilidad los logs pueden ser insuficientes para atribuir responsabilidades.

El **NIST AI Risk Management Framework (AI RMF 1.0)** establece en su función *MEASURE* la necesidad de documentar métricas de explicabilidad y mantener registros inmutables de las inferencias. Por su parte, **ISO/IEC 27001:2022** en el control A.8.15 exige la recolección de logs de eventos, y el **CIS Control 8** (Audit Log Management) recomienda centralizar, proteger y revisar los registros con retención mínima de 90 días. En el ámbito de IA, **MITRE ATT&CK** no tiene tácticas específicas para modelos, pero el marco **MITRE ATLAS** (Adversarial Threat Landscape for AI Systems) incluye técnicas como *AML.T0020 – Erode Dataset Integrity* y *AML.T0048 – Backdoor ML Model*, que solo pueden detectarse si existen rastros de auditoría robustos (hashes de datasets, versionado de modelos, logs de entrenamiento).

La explicabilidad se clasifica en dos enfoques: **intrínseca** (modelos interpretables como regresiones lineales o árboles de decisión) y **post-hoc** (SHAP, LIME, Integrated Gradients, contrafactuales). Para auditoría, los métodos post-hoc generan artefactos que deben almacenarse junto con la predicción: valores SHAP por característica, mapas de saliencia, o reglas de decisión extraídas. Un rastro de auditoría completo para una inferencia incluye: identificador único de la solicitud, versión del modelo (hash SHA-256), versión del dataset de entrenamiento, features de entrada (o su hash), salida del modelo, puntuación de confianza, explicación generada, y firma criptográfica del log. El estándar **OWASP Top 10 for LLM Applications** (LLM06:2025 – Excessive Agency) advierte que sin trazabilidad de acciones agénticas no se puede auditar el uso indebido de herramientas.

Los rastros de auditoría deben ser **inmutables** (append-only, idealmente con blockchain o WORM storage), **íntegros** (firmas HMAC o RSA), y **confidenciales** (cifrado en reposo y en tránsito). Además, deben permitir *replay* de decisiones: reconstruir la inferencia con el mismo modelo y datos para verificar que la salida fue legítima. Herramientas como **MLflow**, **Weights & Biases**, **DVC** y **OpenTelemetry** permiten instrumentar pipelines de ML con logs estructurados. Para cumplimiento, el **EU AI Act** (artículos 12 y 13) exige que los sistemas de alto riesgo mantengan registros automáticos de eventos durante toda su vida útil, y que estos sean accesibles para autoridades nacionales.

En resumen, un sistema de IA seguro debe diseñarse con *auditoría por defecto*: cada decisión genera un artefacto verificable que vincula datos, modelo, explicación y contexto. Sin esto, la explicabilidad queda como una promesa sin evidencia.

## EJERCICIO
**Objetivo:** Implementar un pipeline de auditoría y explicabilidad para un modelo de clasificación binaria, generando rastros inmutables y explicaciones post-hoc.

**Herramientas:** Python 3.10+, scikit-learn, SHAP, `hashlib`, `hmac`, SQLite (o JSON Lines), y `pandas`.

**Pasos:**
1. Entrena un modelo `RandomForestClassifier` sobre el dataset *Breast Cancer Wisconsin* (incluido en scikit-learn). Guarda el modelo con `joblib` y calcula su hash SHA-256.
2. Crea una función `inferir_con_auditoria(X_input)` que:
   - Genere un UUID v4 para la solicitud.
   - Calcule el hash SHA-256 de las features de entrada (serializadas en JSON canónico).
   - Ejecute la predicción y obtenga la probabilidad.
   - Calcule valores SHAP para esa instancia (`shap.Explainer`).
   - Construya un diccionario con: `uuid`, `timestamp` (ISO 8601 UTC), `model_hash`, `input_hash`, `prediction`, `probability`, `shap_values` (lista), `explanation_method: "shap"`.
   - Firme el diccionario con HMAC-SHA256 usando una clave secreta.
   - Almacene el registro en un archivo `audit_log.jsonl` (una línea por inferencia).
3. Ejecuta 20 inferencias con instancias aleatorias del conjunto de test.
4. Escribe un script `verificar_auditoria.py` que:
   - Lea el archivo `audit_log.jsonl`.
   - Para cada registro, recalcule el HMAC y verifique que coincide.
   - Recalcule el hash del modelo y compárelo con `model_hash`.
   - Recalcule el hash de las features (debes guardar las features originales en el log o en un almacén aparte) y verifique integridad.
   - Reporte cuántos registros son válidos y cuántos corruptos.
5. **Entregable:** Un repositorio con `train.py`, `infer_audit.py`, `verify_audit.py`, el archivo `audit_log.jsonl` y un `README.md` que explique cómo se garantiza inmutabilidad, integridad y explicabilidad. Incluye una captura de pantalla del reporte de verificación.

**Criterios de éxito:** El 100% de los registros deben pasar la verificación HMAC y de hashes. Si modificas manualmente una línea del log, el script debe detectarlo como corrupto.

## CASO
**Caso real: Amazon Rekognition y el sesgo no auditado (2018-2019).**
En 2018, la ACLU y otros grupos demostraron que el sistema de reconocimiento facial Amazon Rekognition clasificaba erróneamente a 28 miembros del Congreso de EE.UU., con falsos positivos desproporcionados en personas de color. Amazon no proporcionó explicaciones por instancia ni rastros de auditoría que permitieran reconstruir por qué el modelo tomó esas decisiones. No había logs de versiones del modelo, ni de los datos de entrenamiento, ni de las features utilizadas. Esto impidió a los auditores determinar si el fallo se debía a sesgo en los datos, a un umbral mal calibrado o a una arquitectura inadecuada. Como consecuencia, varias ciudades prohibieron su uso y la FTC abrió investigaciones. El caso ilustra que sin explicabilidad *post-hoc* (mapas de saliencia, contrafactuales) y sin rastros de auditoría inmutables (versiones, hashes, logs de inferencia), es imposible atribuir responsabilidades, corregir el modelo o cumplir con regulaciones como el EU AI Act. La lección: la seguridad de IA no es solo evitar ataques, sino poder *demostrar* cómo se decidió, ante quién y con qué evidencia.

## Recursos abiertos
- https://www.nist.gov/itl/ai-risk-management-framework
- https://atlas.mitre.org/
- https://owasp.org/www-project-top-10-for-large-language-model-applications/
- https://github.com/slundberg/shap
- https://mlflow.org/docs/latest/tracking.html

--- [Volver al syllabus](../syllabus.md)
