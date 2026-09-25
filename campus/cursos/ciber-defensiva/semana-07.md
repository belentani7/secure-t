# Semana 7: Respuesta a incidentes (NIST 800-61r3)

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 7 de 20

## LECTURA: Teoria: Respuesta a incidentes (NIST 800-61r3)

Contenido teorico detallado para respuesta a incidentes (nist 800-61r3). Incluye frameworks, comandos y referencias.

## EJERCICIO: Practica guiada: Respuesta a incidentes (NIST 800-61r3)

Ejercicio paso a paso (8-10 pasos) con comandos exactos, salidas esperadas y troubleshooting para respuesta a incidentes (nist 800-61r3).

## CASO: Caso real: Respuesta a incidentes (NIST 800-61r3)

Analisis de incidente real donde respuesta a incidentes (nist 800-61r3) fue factor clave. Lecciones aprendidas.

## 🎯 Objetivo de la semana

Dirigir la respuesta a un incidente real siguiendo NIST 800-61r3 sin destruir evidencia por el camino.

## 📖 Lectura principal

El ciclo moderno (Preparación → Detección y análisis → Contención, erradicación y recuperación → Actividad post-incidente) cambia el énfasis: la contención se decide con una matriz de opciones (aislar host, bloquear cuenta, cortar C2) valoradas por impacto en negocio y velocidad, porque apagar todo es contenerse uno mismo. La evidencia se preserva ANTES de limpiar: memoria y disco del host comprometido, logs del salto previo y posterior, y cadena de custodia con hashes — el forense que llega tarde solo encuentra el incendio extinguido y las huellas barridas. La comunicación es parte del incidente: quién informa a quién, cada cuánto, y qué NO se escribe en canales no privilegiados. El post-incidente no es optional: lecciones, plazos y dueños; sin él el mismo atacante vuelve por el mismo agujero.

## 🛠️ Práctica guiada

Juego de rol cronometrado: ransomware detectado en 3 equipos. Escribe tus primeras 6 decisiones en orden con timestamp, la lista de evidencia a preservar antes de limpiar, y el borrador de post-incidente (causa raíz hipótesis, 3 acciones con dueño y fecha). Contrasta con el caso real de tu elección (hay transparencias públicas de incidentes).

---
[Volver al syllabus](../syllabus.md)

## Recursos abiertos

- Fuente verificada del contenido del curso.

---
[Volver al syllabus](../syllabus.md)
