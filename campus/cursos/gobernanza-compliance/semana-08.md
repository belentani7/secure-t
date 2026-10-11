# Semana 8: Ingenieria de privacidad (RGPD, LGPD)

Curso: [Gobernanza y Compliance: Dirigir con Evidencia](../syllabus.md) · Semana 8 de 20

## Objetivos de aprendizaje

- Aplicar minimizacion y limitacion de finalidad como decisiones de arquitectura
- Distinguir bases legales y saber cuando hace falta una evaluacion de impacto
- Disenar un sistema que no pueda filtrar lo que nunca guardo

## Privacidad se disena, no se promete

Los dos principios que mas reducen el riesgo legal y real son aburridos y poderosos: **minimizacion** (recoger solo lo necesario para una finalidad declarada) y **limitacion de finalidad** (no reutilizar los datos para otra cosa sin base nueva). Un sistema que no guarda el dato no puede filtrarlo, no puede venderlo y no tiene que protegerlo.

**Bases legales** (art. 6 RGPD; art. 7 LGPD): consentimiento, contrato, obligacion legal, interes vital, interes publico, interes legitimo. Elegir bien la base evita el error tipico de pedir consentimiento para algo que en realidad se sostiene con contrato, con el ruido de gestion que eso genera.

**Evaluacion de impacto (DPIA / RIPD)** es obligatoria cuando hay alto riesgo: perfilado, datos sensibles a gran escala, vigilancia sistematica. Se escribe **antes** de construir, no despues de la multa. Y dos derechos que definen la arquitectura: **acceso** (devolver al titular que datos tienes sobre el) y **supresion** (borrarlos de verdad, incluidos backups y derivados).

**Referencias:**
- RGPD (UE) 2016/679 — arts. 5, 6, 25, 35
- LGPD (Brasil) Lei 13.709/2018 — arts. 6, 7, 46, 48
- AEPD — Guia de analisis de riesgos y evaluacion de impacto

## Caso real: la multa por transferencia internacional (2023)

En 2023, la autoridad irlandesa sanciono a una gran plataforma con 1.200 millones de euros por transferir datos personales a otro pais sin garantias suficientes, ademas de ordenar regularizar el tratamiento en meses. El detalle didactico: no fue un incidente de seguridad, fue una decision de arquitectura de datos mantenida durante anos. Leccion: donde vive y por donde viajan los datos es una decision de cumplimiento, y elegir mal tiene precio de millones y plazo obligatorio de correccion.

## Ejercicio guiado: ingenieria de privacidad de un formulario

1. Elige un formulario o servicio propio (por ejemplo, registro a un curso)
2. Lista cada campo y contesta: es necesario? para que finalidad? cual es la base legal?
3. Elimina o transforma lo que se pueda (seudonimizar, agregar, dejar solo un hash)
4. Escribe el aviso de privacidad en una pagina, en lenguaje claro
5. Comprueba los derechos de acceso y supresion: recorrelos de punta a punta y anota donde fallan
6. Fija plazos de conservacion y el proceso de borrado real (incluidos backups)
7. Decide si hace falta DPIA y, si hace falta, escribe su seccion 1-3

## Recursos abiertos

- [RGPD (EUR-Lex)](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [LGPD (Planalto)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [AEPD](https://www.aepd.es/)
- [ANPD (Brasil)](https://www.gov.br/anpd/pt-br)

---
[Volver al syllabus](../syllabus.md)
