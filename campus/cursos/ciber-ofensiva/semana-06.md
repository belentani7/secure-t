# Semana 6: Modelado de amenazas y árboles de ataque

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 6 de 20

## Objetivos de aprendizaje

- Dibujar el sistema (flujo de datos y fronteras de confianza) antes de atacarlo
- Aplicar STRIDE a cada frontera y obtener amenazas concretas, no eslóganes
- Construir un árbol de ataque y podarlo con el impacto de negocio
- Convertir las amenazas en pruebas concretas del alcance firmado

## El mapa antes del ataque

Un pentest sin modelo de amenazas es una lista de escaneos. El modelo empieza con un **diagrama de flujo de datos**: procesos, almacenes, actores externos y flujos entre ellos. Y con la línea más útil del dibujo: las **fronteras de confianza** — donde un dato pasa de un contexto controlado a otro que no lo está (navegador → API, API → base de datos, tu red → el proveedor).

**STRIDE** es la forma más rápida de recorrer esas fronteras con criterio:

| Letra | Amenaza | Pregunta en la frontera |
|---|---|---|
| S | Suplantación | ¿Puede alguien hacerse pasar por otro aquí? |
| T | Manipulación | ¿Puede alterar el dato en tránsito o en reposo? |
| R | Repudio | ¿Puede negar haber hecho algo, sin registro? |
| I | Divulgación | ¿Qué se filtra si esta frontera falla? |
| D | Denegación | ¿Qué se cae con un pico o un abuso barato? |
| E | Elevación | ¿Qué gana quien cruza esta frontera hacia dentro? |

Un **árbol de ataque** ordena esas amenazas por caminos: la raíz es el objetivo del atacante («leer datos de clientes»), las ramas son las formas de conseguirlo y las hojas, las acciones concretas. Se poda con dos preguntas: **¿es posible con el alcance firmado?** y **¿cuánto duele al negocio?**. Lo que no duele sale del informe, aunque sea técnicamente bonito.

**Referencias:**
- Microsoft — Threat Modeling (STRIDE)
- OWASP Threat Dragon — owasp.org/www-project-threat-dragon/
- NIST SP 800-154 — Guide to Data-Centric System Threat Modeling

## Del modelo a la prueba

El modelo se convierte en pruebas cuando cada amenaza tiene un **experimento** asociado: qué se observa, cómo se sabe que la amenaza existe y qué evidencia lo demuestra. Ejemplo trabajado:

- Frontera: navegador → API de pedidos
- Amenaza (S): suplantar a otro usuario cambiando el identificador
- Prueba: autenticarse como A y pedir el pedido de B (`GET /orders/1042`)
- Evidencia: respuesta 200 con datos de B y su número de pedido
- Mapeo: CWE-639 (IDOR), ATT&CK T1190

Documentar así tiene una ventaja práctica: si el modelo no incluye una frontera, la prueba no existe, y si el cliente la ve en el informe, la discusión deja de ser «qué herramientas usaste» y pasa a ser «qué protege el sistema».

**Referencias:**
- CWE-639 — Authorization Bypass Through User-Controlled Key
- ATT&CK — T1190 Exploit Public-Facing Application

## Caso real: Target 2013, la frontera que nadie dibujó

El equipo de seguridad de Target desplegó detección sobre su propia red… pero el refrigerista tenía acceso VPN al mismo segmento. Los atacantes entraron por las credenciales de un proveedor externo de climatización (T1199, Trusted Relationship), se movieron lateralmente a los servidores de punto de venta y exfiltraron 40 millones de tarjetas (T1078, T1021). El fallo de fondo no fue técnico: no existía un mapa que dijera que aquel proveedor cruzaba una frontera de confianza hacia la red de pago. Lección de esta semana: la frontera más peligrosa es la que no está dibujada.

## Ejercicio guiado: modela una aplicación de reservas

1. Inventa una aplicación: reservas con usuarios, panel de administración y pagos
2. Dibuja el flujo de datos: actores, procesos, almacenes y 6 flujos como mínimo
3. Marca las fronteras de confianza y escribe qué control protege cada una hoy
4. Recorre cada frontera con STRIDE y anota 2 amenazas por letra
5. Construye un árbol de ataque para «leer datos de pago» y «tumbar el servicio»
6. Poda: deja solo las ramas posibles dentro del alcance de un test autorizado
7. Escribe las 5 pruebas concretas con su evidencia esperada y su mapeo CWE/ATT&CK
8. Repásalo con alguien no técnico: si no lo entiende en 5 minutos, el dibujo sobra

## Recursos abiertos

- [OWASP Threat Dragon](https://owasp.org/www-project-threat-dragon/)
- [Microsoft STRIDE](https://learn.microsoft.com/es-es/azure/architecture/guide/security/threat-modeling)
- [attack-tree (Schneier)](https://www.schneier.com/academic/archives/1999/12/attack_trees.html)
- [CWE-639](https://cwe.mitre.org/data/definitions/639.html)

---
[Volver al syllabus](../syllabus.md)
