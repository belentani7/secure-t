# Semana 5: Fundamentos de SOC y triaje de alertas

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 5 de 20

## LECTURA: Teoria: Fundamentos de SOC y triaje de alertas

Contenido teorico detallado para fundamentos de soc y triaje de alertas. Incluye frameworks, comandos y referencias.

## EJERCICIO: Practica guiada: Fundamentos de SOC y triaje de alertas

Ejercicio paso a paso (8-10 pasos) con comandos exactos, salidas esperadas y troubleshooting para fundamentos de soc y triaje de alertas.

## CASO: Caso real: Fundamentos de SOC y triaje de alertas

Analisis de incidente real donde fundamentos de soc y triaje de alertas fue factor clave. Lecciones aprendidas.

## 🎯 Objetivo de la semana

Operar el triaje de un SOC: convertir una avalancha de alertas en una cola priorizada de incidentes reales.

## 📖 Lectura principal

El analista N1 vive del triaje: cada alerta se clasifica en segundos con un método fijo — ¿es de un activo que importa? ¿el comportamiento encaja en la línea base? ¿hay correlato en otros sistemas? ¿la severidad del artefacto coincide con el contexto? Las colas maduras separan verdaderos positivos, falsos positivos documentados (que alimentan el tuning) y ruido recurrente (candidato a supresión con justificación). La métrica sana no es 'alertas cerradas' sino tiempo medio de triaje y tasa de escalado con sentido: escalar todo es no escalar nada. El runbook por tipo de alerta (login fallido masivo, imposible travel, EICAR, creación de admin) convierte la intuición del veterano en procedimiento auditable que el nuevo puede ejecutar el primer día.

## 🛠️ Práctica guiada

Simula 10 alertas mezclando verdaderos y falsos positivos (usa las generadas en el lab de Wazuh). Triaje cada una en la plantilla: activo/criticidad, línea base, decisión (cerrar/escalar/suprimir) y justificación de una línea. Calcula tu tiempo medio por alerta.

---
[Volver al syllabus](../syllabus.md)

## Recursos abiertos

- Fuente verificada del contenido del curso.

---
[Volver al syllabus](../syllabus.md)
