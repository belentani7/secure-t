# Semana 6: Robustez adversaria y testing

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 6 de 20

## LECTURA: Teoria: Robustez adversaria y testing

Contenido teorico detallado para robustez adversaria y testing. Incluye frameworks, comandos y referencias.

## EJERCICIO: Practica guiada: Robustez adversaria y testing

Ejercicio paso a paso (8-10 pasos) con comandos exactos, salidas esperadas y troubleshooting para robustez adversaria y testing.

## CASO: Caso real: Robustez adversaria y testing

Analisis de incidente real donde robustez adversaria y testing fue factor clave. Lecciones aprendidas.

## 🎯 Objetivo de la semana

Someter un modelo a pruebas de robustez adversaria y cuantificar su degradación antes de que lo haga un atacante.

## 📖 Lectura principal

La robustez se testea como se testea la criptografía: asumiendo el peor caso. Para imágenes, perturbaciones imperceptibles (ataques L∞ tipo FGSM/PGD) voltean la predicción: la pegatina hace que la señal de STOP desaparezca para el modelo. Para tablas y texto, la pregunta es qué pasa con entradas fuera de distribución — el modelo contesta con confianza de siempre. El testeo práctico usa herramientas abiertas (Adversarial Robustness Toolbox de IBM, Foolbox) sobre TUS datos y mide: tasa de éxito del ataque, distancia de la perturbación y degradación de métrica global. Defender cuesta: entrenamiento adversarial y detección de out-of-distribution añaden coste y a veces accuracy — la decisión informada es cuánta robustez compra el caso de uso (un filtro de spam tolera más que un sistema de conducción). Documentar el nivel aceptado es la entrega, no 'hemos probado que es robusto'.

## 🛠️ Práctica guiada

Con ART y un modelo pequeño entrenado en clase (o un MNIST público): ejecuta FGSM y PGD, y reporta accuracy limpio vs atacado y ejemplo de perturbación mínima que engaña. Escribe el párrafo de decisión: nivel de robustez aceptado para un caso de uso real y por qué.

---
## Recursos abiertos

- IBM Adversarial Robustness Toolbox — adversarial-robustness-toolbox
- Foolbox — foolbox.jonasrauber.de
- NIST AI 100-1 — AI Risk Management Framework
- OWASP Machine Learning Security Top 10
- CleverHans — cleverhans.readthedocs.io

---
[Volver al syllabus](../syllabus.md)
