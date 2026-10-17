# Semana 7: Envenenamiento de datos y supply chain

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 7 de 20

## LECTURA: Teoria: Envenenamiento de datos y supply chain

Contenido teorico detallado para envenenamiento de datos y supply chain. Incluye frameworks, comandos y referencias.

## EJERCICIO: Practica guiada: Envenenamiento de datos y supply chain

Ejercicio paso a paso (8-10 pasos) con comandos exactos, salidas esperadas y troubleshooting para envenenamiento de datos y supply chain.

## CASO: Caso real: Envenenamiento de datos y supply chain

Analisis de incidente real donde envenenamiento de datos y supply chain fue factor clave. Lecciones aprendidas.

## 🎯 Objetivo de la semana

Blindar el suministro de datos y modelos contra envenenamiento y sustitución, aplicando las lecciones de la supply chain clásica.

## 📖 Lectura principal

El envenenamiento corrompe el aprendizaje: datos falsos insertados en el corpus (etiquetas cambiadas, backdoors activables con un trigger) o dependencias ML adulteradas — la lección de event-stream/PyPI aplica a datasets y pesos descargados: ¿quién firmó ese .safetensors? Las defensas son aburridas y efectivas: fuentes allowlisteadas con hash fijado, análisis de datos antes de entrenar (distribución, duplicados sospechosos, outlier forense), separación de quien aporta datos de quien aprueba entrenar (four-eyes), y canaries en datasets — registros sintéticos únicos que, si aparecen en la salida de un modelo ajeno, delatan robo o memorización. Para modelos preentrenados de terceros: preferir fuentes con atestación, re-entrenar la última capa en dominio propio reduce superficie, y monitorear comportamiento en producción contra una batería dorada de casos conocidos.

## 🛠️ Práctica guiada

Diseña el manifiesto de suministro de tu proyecto ML: qué datasets/pesos/bibliotecas entran, con qué hash y de qué fuente, quién aprueba cambios. Añade 3 canaries sintéticos a tu dataset y describe la alarma que dispararían. Doc: media página.

---
[Volver al syllabus](../syllabus.md)

## Recursos abiertos

- Fuente verificada del contenido del curso.

---
[Volver al syllabus](../syllabus.md)
