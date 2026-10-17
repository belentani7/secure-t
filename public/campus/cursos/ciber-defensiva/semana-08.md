# Semana 8: Inteligencia de amenazas y TIP

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 8 de 20

## LECTURA: Teoria: Inteligencia de amenazas y TIP

Contenido teorico detallado para inteligencia de amenazas y tip. Incluye frameworks, comandos y referencias.

## EJERCICIO: Practica guiada: Inteligencia de amenazas y TIP

Ejercicio paso a paso (8-10 pasos) con comandos exactos, salidas esperadas y troubleshooting para inteligencia de amenazas y tip.

## CASO: Caso real: Inteligencia de amenazas y TIP

Analisis de incidente real donde inteligencia de amenazas y tip fue factor clave. Lecciones aprendidas.

## 🎯 Objetivo de la semana

Consumir inteligencia de amenazas con escepticismo operativo: enriquecer, priorizar y cerrar el ciclo de feedback.

## 📖 Lectura principal

La inteligencia útil responde preguntas de decisión, no colecciona IOCs: estratégica (qué actores atacan mi sector y con qué motivación), táctica (qué TTPs de ATT&CK debo cubrir) y operativa (estos hashes/ IPs/dominalos son malos PARA MÍ ahora). Un TIP mínimo ingesta feeds (AlienVault OTX abierta, MISP autoalojado), deduplica, aplica expiración — un IOC de 2023 bloqueado hoy genera falsos positivos y calma falsa — y sobre todo se enriquece con lo propio: el IP que te escaneó ayer vale más que mil genéricos. Pirámide del dolor: bloquear hash es trivial para el atacante de esquivar; degradar sus TTPs es caro. El ciclo termina midiendo qué IOC disparó detección real y alimentando el tuning: inteligencia sin feedback es decoración cara.

## 🛠️ Práctica guiada

Configura una cuenta OTX y suscríbate a 2 pulses relevantes para tu sector. Exporta 20 IOC, aplícales expiración razonable y clasifícalos en la pirámide del dolor. Diseña en una página tu TIP mínimo: fuentes, deduplicación, expiración, y el informe semanal que justificaría su coste.

---
[Volver al syllabus](../syllabus.md)

## Recursos abiertos

- Fuente verificada del contenido del curso.

---
[Volver al syllabus](../syllabus.md)
