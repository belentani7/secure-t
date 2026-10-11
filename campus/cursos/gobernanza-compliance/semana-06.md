# Semana 6: Analisis de impacto en el negocio y BCP

Curso: [Gobernanza y Compliance: Dirigir con Evidencia](../syllabus.md) · Semana 6 de 20

## Objetivos de aprendizaje

- Distinguir BIA, plan de continuidad (BCP) y plan de recuperacion (DRP)
- Fijar RTO y RPO con negocio, no con la infraestructura
- Probar el plan: un plan sin simulacro es una hipotesis

## Tres documentos, tres preguntas

| Documento | Pregunta | Decide |
|---|---|---|
| BIA | Que se cae si esto para, y cuanto duele por hora | Criticidad y prioridades |
| BCP | Como seguimos operando mientras falta | Modos alternativos |
| DRP | Como volvemos a la normalidad | Recuperacion tecnica |

**RTO** (cuanto tiempo se puede estar caido) y **RPO** (cuanto dato se puede perder) los fija el **negocio**, no el equipo tecnico: son decisiones de dinero y de tolerancia. Un RTO de 15 minutos con un sistema sin redundancia es una promesa que la proxima caida rompera.

La prueba es lo que separa el plan del papel: simulacros con hora fijada, criterio de exito escrito y acta. Sin simulacro, los numeros del plan son opinion.

**Referencias:**
- ISO 22301 — Business continuity management systems
- NIST SP 800-34 Rev.1 — Contingency Planning Guide

## Caso real: el rescate que tardo mas que el cifrado

En los incidentes de ransomware de los ultimos anos, las organizaciones con copias **no probadas** descubrieron dos cosas: que sus copias estaban dentro del mismo dominio de ataque (cifradas junto con lo demas) y que restaurar tardaba dias por dependencias olvidadas. Las que sobrevivieron mejor tenian copias inmutables y fuera de linea, y habian cronometrado la restauracion completa al menos una vez. Leccion: la copia que no has restaurado no es una copia; es una esperanza.

## Ejercicio guiado: BIA y simulacro para un servicio real

1. Elige un servicio (por ejemplo, una tienda en linea o el correo corporativo)
2. Escribe el BIA: proceso, dependencias, y coste por hora de indisponibilidad
3. Fija RTO y RPO con dos personas de negocio y justifica el numero
4. Disena el BCP: modo alternativo minimo para las primeras 72 horas
5. Disena el DRP: pasos de restauracion y verificacion
6. Haz un simulacro de una hora midiendo tiempos reales
7. Compara medido con prometido, y corrige el plan donde no cuadre

## Recursos abiertos

- [ISO 22301](https://www.iso.org/standard/75106.html)
- [NIST SP 800-34 Rev.1](https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final)
- [Ready.gov — Business Continuity](https://www.ready.gov/business-continuity-plan)

---
[Volver al syllabus](../syllabus.md)
