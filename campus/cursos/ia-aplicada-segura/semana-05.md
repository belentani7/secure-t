# Semana 5: Pipeline MLOps seguro

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 5 de 20

## Objetivos de aprendizaje

- Diseñar un pipeline MLOps donde la seguridad es un requisito del ciclo de vida
- Versionar datos, código y modelo con firma criptográfica
- Implementar gates de promoción con validación automática
- Registrar el linaje de predicciones para auditoría responsable

## LECTURA: Teoria: Pipeline MLOps seguro

Un pipeline de ML seguro versiona tres cosas que los pipelines ingenuos pierden: datos (con linaje: de dónde vino cada dataset y quién lo tocó — DVC lo hace accesible), código y modelo (con firma: un .pbin sin hash es un binario cualquiera que podría haber sido sustituido). Los checkpoints se validan antes de promover: tests de datos (esquema, rangos, nulos), tests de modelo (rendimiento mínimo por segmento, no solo global — un modelo que acierta 95 % fallando siempre en un colectivo no promociona) y tests de seguridad (carga solo de fuentes allowlisteadas). El despliegue registra qué modelo, con qué datos y qué configuración sirvió cada predicción: sin eso no hay auditoría posible ni rollback responsable. La regla de oro heredada de DevSecOps aplica igual: si puede reconstruirse desde el repositorio con un comando, puede auditarse; si depende de un portátil de alguien, es deuda.

## EJERCICIO: Practica guiada: Pipeline MLOps seguro

Ejercicio paso a paso (8-10 pasos) con comandos exactos, salidas esperadas y troubleshooting para pipeline mlops seguro.

## CASO: Caso real: Pipeline MLOps seguro

Analisis de incidente real donde pipeline mlops seguro fue factor clave. Lecciones aprendidas.

## 🎯 Objetivo de la semana

Diseñar un pipeline MLOps donde la seguridad es un requisito del ciclo de vida, no un parche final.

## 📖 Lectura principal

Un pipeline de ML seguro versiona tres cosas que los pipelines ingenuos pierden: datos (con linaje: de dónde vino cada dataset y quién lo tocó — DVC lo hace accesible), código y modelo (con firma: un .pbin sin hash es un binario cualquiera que podría haber sido sustituido). Los checkpoints se validan antes de promover: tests de datos (esquema, rangos, nulos), tests de modelo (rendimiento mínimo por segmento, no solo global — un modelo que acierta 95 % fallando siempre en un colectivo no promociona) y tests de seguridad (carga solo de fuentes allowlisteadas). El despliegue registra qué modelo, con qué datos y qué configuración sirvió cada predicción: sin eso no hay auditoría posible ni rollback responsable. La regla de oro heredada de DevSecOps aplica igual: si puede reconstruirse desde el repositorio con un comando, puede auditarse; si depende de un portátil de alguien, es deuda.

## 🛠️ Práctica guiada

Esquematiza tu pipeline (papel o draw.io) para un clasificador de spam: versionado de datos, firma de artefactos, 3 gates de promoción y el registro de serving. Marca en rojo los 2 puntos donde hoy un atacante interno podría colar un modelo adulterado y propón el control.

## Recursos abiertos

- DVC (Data Version Control) — dvc.org
- MLflow — mlflow.org
- OWASP Machine Learning Security Top 10
- NIST AI 100-1: AI Risk Management Framework

---
[Volver al syllabus](../syllabus.md)