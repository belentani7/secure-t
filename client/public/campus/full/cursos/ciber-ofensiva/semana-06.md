# Semana 6: Modelado de amenazas y arboles de ataque

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 6 de 20

## LECTURA: Teoria: Modelado de amenazas y arboles de ataque

Contenido teorico detallado para modelado de amenazas y arboles de ataque. Incluye frameworks, comandos y referencias.

## EJERCICIO: Practica guiada: Modelado de amenazas y arboles de ataque

Ejercicio paso a paso (8-10 pasos) con comandos exactos, salidas esperadas y troubleshooting para modelado de amenazas y arboles de ataque.

## CASO: Caso real: Modelado de amenazas y arboles de ataque

Analisis de incidente real donde modelado de amenazas y arboles de ataque fue factor clave. Lecciones aprendidas.

## 🎯 Objetivo de la semana

Modelar al adversario con árboles de ataque y decidir qué rutas proteger primero con el presupuesto disponible.

## 📖 Lectura principal

Un árbol de ataque (Schneier) pone el objetivo del atacante en la raíz —por ejemplo 'exfiltrar la base de clientes'— y descompone los caminos en ramas con condiciones AND/OR: obtener credenciales de VPN O explotar el portal expuesto Y esquivar el WAF. Cada hoja recibe coste para el atacante y probabilidad estimada; el defensista poda primero las ramas de menor coste y mayor probabilidad. MITRE ATT&CK complementa el modelo con tácticas y técnicas reales observadas (reconocimiento, acceso inicial, persistencia, movimiento lateral, exfiltración), dando vocabulario común al rojo y al azul. La diferencia entre una lista de vulnerabilidades y un modelo de amenaza es que el segundo responde '¿y esto qué le permite al atacante?' — la pregunta que un comité directivo financia.

## 🛠️ Práctica guiada

Construye el árbol de 'acceso no autorizado al panel de administración' de una web ficticia con al menos 8 hojas. Marca las 2 ramas más baratas para el atacante y propón un control por rama. Contrasta tus técnicas con 3 entradas reales de ATT&CK (cita los identificadores).

---
## Recursos abiertos

- MITRE ATT&CK — attack.mitre.org
- Schneier on Security — schneier.com
- OWASP Testing Guide — owasp.org/www-project-web-security-testing-guide
- NIST SP 800-115 — Technical Guide to Information Security Testing
- CISA ATT&CK Evaluations — cisa.gov/known-exploited-vulnerabilities-catalog

---
[Volver al syllabus](../syllabus.md)
