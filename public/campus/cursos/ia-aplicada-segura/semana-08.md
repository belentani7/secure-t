# Semana 8: Extraccion de modelo y proteccion de PI

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 8 de 20

## LECTURA: Teoria: Extraccion de modelo y proteccion de PI

Contenido teorico detallado para extraccion de modelo y proteccion de pi. Incluye frameworks, comandos y referencias.

## EJERCICIO: Practica guiada: Extraccion de modelo y proteccion de PI

Ejercicio paso a paso (8-10 pasos) con comandos exactos, salidas esperadas y troubleshooting para extraccion de modelo y proteccion de pi.

## CASO: Caso real: Extraccion de modelo y proteccion de PI

Analisis de incidente real donde extraccion de modelo y proteccion de pi fue factor clave. Lecciones aprendidas.

## 🎯 Objetivo de la semana

Proteger la propiedad intelectual del modelo frente a extracción y distilación no autorizada, midiendo el riesgo real.

## 📖 Lectura principal

Un modelo desplegado es un oráculo: consultando bastante (y con presupuesto) se puede reconstruir su comportamiento — extracción de membresía ('este dato estaba en el entrenamiento' — riesgo RGPD directo), robo de funcionalidad por distilación (un modelo estudiante imita al tuyo), o inversión de datos de entrenamiento (reconstruir ejemplos memorizados). Mitigaciones con coste: limitación de tasa y presupuestos por identidad (la nube ofrece cuotas), ruido en salidas o predicciones top-k recortadas (menos información por consulta), regularización contra memorización, y monitoreo del patrón de consultas — quien pide esquinas sistemáticas del espacio de entrada no es un usuario. La pregunta de negocio decide: ¿qué pierdo si me copian el modelo? Si la respuesta es 'nada crítico', el control correcto es mínimo; si es 'la ventaja competitiva', el blindaje justifica su coste.

## 🛠️ Práctica guiada

Para tu caso de uso: tabla de activos (pesos, datos, prompts propietarios) × riesgo (extracción/distilación/membresía) × impacto. Propón 3 controles con su coste y qué patrón de consultas usarías como alarma. Media página con decisión explícita.

---
[Volver al syllabus](../syllabus.md)

## Recursos abiertos

- Fuente verificada del contenido del curso.

---
[Volver al syllabus](../syllabus.md)
