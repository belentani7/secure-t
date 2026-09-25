# Semana 2: Datos personales y minimización extrema

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 2 de 20

## Objetivos de aprendizaje

- Aplicar los principios del RGPD: base legal, finalidad, minimización
- Diseñar un sistema sin PII (usuario como token anónimo)
- Evaluar cuándo es necesaria una DPIA (evaluación de impacto)
- Conocer derechos ARCO-POL y el rol del DPO

## RGPD: los 7 principios y su aplicación práctica

El Reglamento General de Protección de Datos (UE 2016/679) no es solo una obligación legal — es un marco de diseño. Si tu sistema no necesita un dato, no lo recojas.

**Los 7 principios (art. 5):**
1. **Licitud, lealtad, transparencia:** base legal clara (consentimiento, contrato, interés legítimo...) + informar al usuario
2. **Limitación de finalidad:** solo para lo declarado al recoger
3. **Minimización:** solo los datos necesarios. El máximo de minimización es NO tener el dato
4. **Exactitud:** datos actualizados y corregibles
5. **Limitación de conservación:** plazo definido, borrar al cumplir
6. **Integridad y confidencialidad:** seguridad adecuada al riesgo
7. **Responsabilidad proactiva:** demostrar cumplimiento (no solo cumplir)

**Bases legales (art. 6) — las 6 opciones:**
- Consentimiento (libre, informado, específico, revocable)
- Ejecución de contrato
- Obligación legal
- Intereses vitales
- Interés público
- Interés legítimo (requiere test de ponderación)

**Patrón del ecosistema Secure T — usuario como token anónimo:**
```
DATO TÍPICO          SECURE T           POR QUÉ
────────────────────────────────────────────────
Email                NO                 No necesario
Nombre               NO                 No necesario
Contraseña           NO                 Sin cuenta
Progreso             UUID local (LS)    Funciona sin servidor
Credencial           Hash SHA-256       Verificable sin PII
Cookies tracking     NO                 Sin analytics invasivo
```
Si el servicio funciona sin el dato, el dato no debe existir.

**Referencias:**
- RGPD — Reglamento UE 2016/679
- AEPD Guía práctica — aepd.es
- LGPD Brasil — Lei 13.709/2018

## DPIA, derechos del interesado y DPO

**DPIA (Data Protection Impact Assessment) — art. 35 RGPD:**
Obligatoria cuando el tratamiento implica 'alto riesgo': perfilado automático, datos sensibles a gran escala, monitorización sistemática de zonas públicas.
```
PROCESO DPIA:
1. Descripción del tratamiento (qué datos, para qué, cómo)
2. Evaluación de necesidad y proporcionalidad
3. Evaluación de riesgos para los derechos de las personas
4. Medidas para mitigar esos riesgos
5. Documentación + consulta al DPO
→ Si el riesgo residual es alto: consulta previa a la autoridad (AEPD)
```

**Derechos ARCO-POL (arts. 15-22 RGPD):**
- **A**cceso: saber qué datos tienes de mí
- **R**ectificación: corregir datos inexactos
- **C**ancelación (supresión/olvido): borrar mis datos
- **O**posición: dejar de tratar mis datos
- **P**ortabilidad: dame mis datos en formato interoperable
- **O**posición a decisiones automatizadas
- **L**imitación del tratamiento

Plazo de respuesta: 1 mes (prorrogable 2 más si es complejo).

**DPO (Data Protection Officer):**
Obligatorio para: AAPP, tratamiento a gran escala de datos sensibles, monitorización sistemática. Funciones: informar, supervisar, cooperar con la autoridad, asesorar en DPIAs. Es independiente (no recibe instrucciones sobre su función) y no puede ser sancionado por ejercerla.

**En Secure T:** como no hay PII, no hay DPIA obligatoria, no hay derechos ARCO que ejercer (no existen datos personales), y no se necesita DPO. Esa es la ventaja de la minimización extrema.

**Referencias:**
- RGPD arts. 15-22, 35-36, 37-39
- AEPD — Guía de evaluaciones de impacto
- WP29 Guidelines on DPIA

## Caso real: AEPD vs CaixaBank 2021: €6M por perfilado sin base legal

La AEPD multó a CaixaBank con €6M por tratar datos de clientes para perfilado comercial sin base legal adecuada (usaban 'interés legítimo' cuando el test de ponderación no lo justificaba) y sin informar suficientemente a los interesados. Lección: el 'interés legítimo' no es un comodín; requiere un test documentado que pondere los derechos del interesado. Y la transparencia no es solo un aviso legal ininteligible — debe ser clara y accesible.

## Ejercicio guiado: Rediseña un formulario eliminando toda PII innecesaria

1. Toma un formulario real de registro a un curso online típico
2. Lista todos los campos: nombre, email, teléfono, dirección, DNI, etc.
3. Para CADA campo pregunta: ¿el servicio funciona sin este dato?
4. Elimina todo lo que no sea estrictamente necesario para la finalidad
5. Diseña la alternativa: ¿cómo identificas al usuario sin email/nombre?
6. Documenta: qué quedó, qué se perdió, cómo se sigue dando el servicio
7. Compara con el patrón Secure T: ¿podrías llegar a cero PII?

## Recursos abiertos

- [RGPD texto completo](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [AEPD Guías](https://www.aepd.es/guias)
- [LGPD Brasil](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)

---
[Volver al syllabus](../syllabus.md)
