# Semana 6: Ingenieria de deteccion y reglas Sigma

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 6 de 20

## LECTURA: Teoria: Ingenieria de deteccion y reglas Sigma

Contenido teorico detallado para ingenieria de deteccion y reglas sigma. Incluye frameworks, comandos y referencias.

## EJERCICIO: Practica guiada: Ingenieria de deteccion y reglas Sigma

Ejercicio paso a paso (8-10 pasos) con comandos exactos, salidas esperadas y troubleshooting para ingenieria de deteccion y reglas sigma.

## CASO: Caso real: Ingenieria de deteccion y reglas Sigma

Analisis de incidente real donde ingenieria de deteccion y reglas sigma fue factor clave. Lecciones aprendidas.

## 🎯 Objetivo de la semana

Escribir detecciones traducibles a cualquier SIEM usando Sigma y pensar como ingeniero de detección, no como consumidor de reglas.

## 📖 Lectura principal

Sigma es a la detección lo que SQL a las bases: un YAML declarativo que describe un patrón de log (evento, campos, condición) y se convierte automáticamente a la sintaxis de Splunk, Sentinel, Elastic o Wazuh. Escribir una regla propia obliga a conocer el log: selección (Image endsWith 'whoami.exe' y ParentImage contiene 'winword.exe' huele a macro ofimática ejecutando reconocimiento), filtros que restan falsos positivos legítimos, y nivel/Descripción que expliquen el porqué a quien la herede. La disciplina de detección incluye versionar reglas en git, probarlas contra logs de ataque conocidos (Atomic Red Team genera los eventos) y medir su ruido en 7 días antes de promoverlas a producción.

## 🛠️ Práctica guiada

Escribe una regla Sigma para 'creación de usuario y añadido a administradores en menos de 5 minutos'. Conviértela con sigma-cli a la sintaxis del SIEM de tu lab (o valida el YAML con el convertidor público). Genera el evento en tu VM y demuestra que dispara; genera también el uso legítimo y documenta cómo lo filtrarías.

---
[Volver al syllabus](../syllabus.md)

## Recursos abiertos

- Fuente verificada del contenido del curso.

---
[Volver al syllabus](../syllabus.md)
