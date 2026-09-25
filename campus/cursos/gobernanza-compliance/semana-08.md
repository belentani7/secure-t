# Semana 8: Ingenieria de privacidad (RGPD, LGPD)

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 8 de 20

## LECTURA: Teoria: Ingenieria de privacidad (RGPD, LGPD)

Contenido teorico detallado para ingenieria de privacidad (rgpd, lgpd). Incluye frameworks, comandos y referencias.

## EJERCICIO: Practica guiada: Ingenieria de privacidad (RGPD, LGPD)

Ejercicio paso a paso (8-10 pasos) con comandos exactos, salidas esperadas y troubleshooting para ingenieria de privacidad (rgpd, lgpd).

## CASO: Caso real: Ingenieria de privacidad (RGPD, LGPD)

Analisis de incidente real donde ingenieria de privacidad (rgpd, lgpd) fue factor clave. Lecciones aprendidas.

## 🎯 Objetivo de la semana

Aplicar ingeniería de privacidad: convertir el principio de minimización en decisiones de diseño medibles (RGPD y LGPD).

## 📖 Lectura principal

La privacidad por diseño se demuestra en decisiones, no en párrafos: identificación temprana en el diseño (¿este dato es necesario para la finalidad? si no, no se recoge — el usuario-token de esta plataforma es la forma extrema), minimización en la exposición (devolver lo que la pantalla muestra, no el registro entero), limitación en la retención (TTL por tipo de dato con borrado verificable — incluidos los backups con plan), y transparencia real (qué se guarda, cuánto y cómo ejercer derechos, sin abogado intermediario). RGPD y LGPD comparten núcleo — ambos exigen base legal, finalidad declarada, seguridad proporcional y derechos efectivos — por lo que un diseño doble-obedece casi gratis. La técnica de QA: la auditoría del formulario de la semana pasada se repite como regression test de privacidad: cada campo que reaparece sin justificación rompe el build, no la promesa.

## 🛠️ Práctica guiada

Toma un flujo real con datos (registro o analytics) y aplica las 5 decisiones: campo a conservar/quitar, TTL, exposición minimizada, base legal y texto de transparencia de 3 líneas. Añade el test de regresión que falla si un campo injustificado reaparece.

---
[Volver al syllabus](../syllabus.md)

## Recursos abiertos

- Fuente verificada del contenido del curso.

---
[Volver al syllabus](../syllabus.md)
