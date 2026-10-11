# Semana 5: Pipeline MLOps seguro

Curso: [IA Aplicada Segura: Construir con Responsabilidad](../syllabus.md) · Semana 5 de 20

## 🎯 Objetivo de la semana

Diseñar un pipeline MLOps donde la seguridad es un requisito del ciclo de vida, no un parche final.

- Versionar datos, código y modelo de punta a punta
- Definir gates de promoción que un modelo debe atravesar, con criterio numérico
- Registrar qué sirvió cada predicción, para poder auditar y revertir

## 📖 Lectura principal

### La tríada versionada

Un pipeline de ML seguro versiona tres cosas que los pipelines ingenuos pierden: **datos** (con linaje: de dónde vino cada dataset y quién lo tocó — DVC lo hace accesible), **código** y **modelo** (con firma: un `.pbin` sin hash es un binario cualquiera que podría haber sido sustituido).

Los checkpoints se validan **antes** de promover:

- **Tests de datos**: esquema, rangos, nulos y proporciones entre entrenamiento y producción.
- **Tests de modelo**: rendimiento mínimo **por segmento**, no solo global — un modelo que acierta el 95 % fallando siempre en un colectivo no promociona.
- **Tests de seguridad**: cargar solo de fuentes allowlisteadas, sin deserialización arbitraria.

Y el despliegue registra **qué** modelo, con **qué** datos y **qué** configuración sirvió cada predicción: sin eso no hay auditoría posible ni rollback responsable. La regla de oro heredada de DevSecOps aplica igual: si puede reconstruirse desde el repositorio con un comando, puede auditarse; si depende de un portátil de alguien, es deuda.

**Referencias:**
- DVC (Data Version Control) — dvc.org
- MLflow — mlflow.org
- OWASP Machine Learning Security Top 10
- NIST AI 100-1: AI Risk Management Framework

### Caso real: el modelo que nadie sabía explicar

Sistemas de crédito y de triaje automatizados han suspendido auditorías no por baja precisión, sino por **imposibilidad de reconstruir** cómo se tomó una decisión: datos de entrenamiento sin versión, experimentos sin semilla, modelo servido sin registro. Sin linaje, la pregunta «¿por qué este modelo decidió esto?» no tiene respuesta — y la respuesta es obligatoria en buena parte de las regulaciones (LGPD art. 20; RGPD art. 22 cuando hay decisión automatizada con efectos significativos).

## 🛠️ Práctica guiada: esboza tu pipeline

1. Esquematiza tu pipeline (papel o draw.io) para un clasificador de spam
2. Marca dónde vive el versionado de datos (linaje) y de código
3. Define **3 gates** de promoción con criterio numérico explícito
4. Empieza por el gate que hoy nadie cumple y propón cómo medirlo
5. Marca en rojo los 2 puntos donde un atacante interno podría colar un modelo adulterado
6. Para cada punto rojo, escribe el control que lo cierra y cómo lo testarías
7. Escribe el registro de serving: 5 campos mínimos por predicción
8. Comprueba la regla de oro: ¿se reconstruye el pipeline desde el repositorio con un comando?

## Recursos abiertos

- [DVC](https://dvc.org/)
- [MLflow](https://mlflow.org/)
- [OWASP ML Security Top 10](https://owasp.org/www-project-machine-learning-security-top-10/)
- [NIST AI 100-1 (AI RMF)](https://www.nist.gov/itl/ai-risk-management-framework)

---
[Volver al syllabus](../syllabus.md)
