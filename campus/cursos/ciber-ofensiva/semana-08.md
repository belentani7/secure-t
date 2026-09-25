# Semana 8: Ataques a aplicaciones web (OWASP Top 10)

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 8 de 20

## LECTURA: Teoria: Ataques a aplicaciones web (OWASP Top 10)

Contenido teorico detallado para ataques a aplicaciones web (owasp top 10). Incluye frameworks, comandos y referencias.

## EJERCICIO: Practica guiada: Ataques a aplicaciones web (OWASP Top 10)

Ejercicio paso a paso (8-10 pasos) con comandos exactos, salidas esperadas y troubleshooting para ataques a aplicaciones web (owasp top 10).

## CASO: Caso real: Ataques a aplicaciones web (OWASP Top 10)

Analisis de incidente real donde ataques a aplicaciones web (owasp top 10) fue factor clave. Lecciones aprendidas.

## 🎯 Objetivo de la semana

Ejecutar los riesgos web del OWASP Top 10 en laboratorio legal y documentarlos en formato de informe profesional.

## 📖 Lectura principal

El Top 10 se domina tocándolo: inyección SQL (entrada que se convierte en consulta — prueba con delimitadores y observa errores, luego UNION y ciegas con retardos), control de acceso roto (cambiar id=17 por id=18 en un perfil ajeno: el servidor confió en el cliente), XSS reflejado y almacenado (tu script viaja al navegador de otra persona), SSRF (el servidor pide la URL que tú le das: alcanza su red interna), y componentes obsoletos (la biblioteca de 2016 con CVE conocido que nadie actualizó). En Juice Shop cada reto mapea una categoría con pista y solución oficial: úsalo como gimnasio, pero el entregable profesional es el informe: título, severidad CVSS con vector, reproducción paso a paso, captura con contexto y remediación concreta (no 'actualizar', sino 'pasar a versión X y aplicar prepared statements en login').

## 🛠️ Práctica guiada

En Juice Shop local: resuelve un reto de inyección, uno de control de acceso y uno de XSS. Escribe los 3 hallazgos en formato de informe (CVSS + vector, pasos, evidencia, remediación). Un compañero debe poder reproducirlos siguiendo tus pasos sin preguntarte nada.

---
[Volver al syllabus](../syllabus.md)

## Recursos abiertos

- Fuente verificada del contenido del curso.

---
[Volver al syllabus](../syllabus.md)
