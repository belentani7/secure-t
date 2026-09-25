# Semana 7: Escaneo de vulnerabilidades y validacion

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 7 de 20

## LECTURA: Teoria: Escaneo de vulnerabilidades y validacion

Contenido teorico detallado para escaneo de vulnerabilidades y validacion. Incluye frameworks, comandos y referencias.

## EJERCICIO: Practica guiada: Escaneo de vulnerabilidades y validacion

Ejercicio paso a paso (8-10 pasos) con comandos exactos, salidas esperadas y troubleshooting para escaneo de vulnerabilidades y validacion.

## CASO: Caso real: Escaneo de vulnerabilidades y validacion

Analisis de incidente real donde escaneo de vulnerabilidades y validacion fue factor clave. Lecciones aprendidas.

## 🎯 Objetivo de la semana

Distinguir un escáner que acumula ruido de un escaneo que produce hallazgos validados y priorizados.

## 📖 Lectura principal

Los escáneres (OpenVAS, Nessus Essentials) venden cobertura; la profesionalidad está en la validación: un CVE sin Proof-of-Concept reproducible en TU contexto es una hipótesis, no un hallazgo. El flujo maduro: escaneo autenticado (ve más que el anónimo), deduplicación (el mismo servicio reportado por 4 vías es un activo), verificación manual del top-10 por severidad, y priorización por explotabilidad real — EPSS estima probabilidad de explotación en producción y CVSS mide impacto teórico; juntos valen más que cualquiera solo. Se descarta lo inalcanzable por red y se re-testea tras parchear: el escaneo de verificación cierra el ciclo. Documentar falso positivo es obligatorio: enseñar por qué algo parecía grave y no lo es educa al cliente y afina el próximo escaneo.

## 🛠️ Práctica guiada

Escanea tu VM de laboratorio con OpenVAS. Toma los 3 hallazgos de mayor severidad y valida cada uno: ¿reproducible? ¿alcanzable desde tu posición? ¿tiene PoC público? Asigna prioridad final combinando CVSS + reachability y explica una exclusión (falso positivo o no explotable) razonada.

---
[Volver al syllabus](../syllabus.md)

## Recursos abiertos

- Fuente verificada del contenido del curso.

---
[Volver al syllabus](../syllabus.md)
