# Semana 5: Gestion de riesgos (ISO 31000, NIST 800-39)

Curso: [Gobernanza y Compliance: Dirigir con Evidencia](../syllabus.md) · Semana 5 de 20

## 🎯 Objetivo de la semana

Traducir activos y amenazas a riesgo comparable, con decisiones firmadas y seguimiento.

- Traducir activos y amenazas a riesgo con criterio explicito y comparable
- Aplicar el ciclo de NIST 800-39: enmarcar, evaluar, responder, monitorizar
- Escribir un registro de riesgos que un comite pueda decidir, no solo leer

## 📖 Lectura principal

### Riesgo no es miedo: es una cuenta

Riesgo = **probabilidad × impacto**, con el alcance y el apetito escritos al lado. Sin esas dos anclas, cualquier cifra vale y ninguna decide. ISO 31000 aporta el proceso y el vocabulario; NIST 800-39 aporta los cuatro niveles (organizacion, mision, sistema, informacion) y la idea de que el riesgo **se acepta o se trata a un nivel concreto**, no en abstracto.

| Elemento | Pregunta | Salida |
|---|---|---|
| Activo | Que protege y cuanto vale | Inventario priorizado |
| Amenaza | Quien o que puede danarlo | Escenarios plausibles |
| Vulnerabilidad | Por donde entra | Control que falta o falla |
| Probabilidad | Cada cuanto, con que evidencia | Escala con criterio |
| Impacto | Cuanto duele, en negocio | Dinero, plazo, reputacion, legal |
| Respuesta | Evitar, reducir, transferir, aceptar | Decision con dueño y fecha |

**El error mas caro** es la matriz de colores sin criterio: si «probabilidad alta» no esta definida con datos, el resultado depende de quien pinta la casilla. Se define antes de evaluar.

**Referencias:**
- ISO 31000:2018 — Risk management
- NIST SP 800-39 — Managing Information Security Risk
- ISO/IEC 27005 — Information security risk management

### Caso real: el riesgo que se acepto sin saberlo

Multitud de brechas empiezan con un sistema antiguo, sin parches, en una red plana que «ya nadie usa». Nadie decidio formalmente aceptar ese riesgo: simplemente no estaba en el registro, y lo que no esta en el registro no se decide. Cuando el incidente ocurre, la pregunta del comite no es «que fallo» sino «quien acepto esto y cuando»; sin registro no hay respuesta, y sin respuesta se paga dos veces (tecnica y reputacional).

## 🛠️ Práctica guiada: registro de riesgos con decisiones

1. Elige un sistema real o de laboratorio y lista 10 activos de informacion
2. Escribe 8 escenarios de amenaza plausibles y asignales vulnerabilidad
3. Define escalas de probabilidad e impacto con **criterios numericos** antes de puntuar
4. Puntua y ordena; marca los 3 primeros como prioritarios
5. Para cada prioritario, escribe la respuesta (evitar, reducir, transferir, aceptar) con dueño y fecha
6. Anade un plan de monitorizacion: que indicador avisa de que el riesgo crece
7. Presenta el registro en una pagina: alguien de negocio debe poder decidir con el

## Recursos abiertos

- [ISO 31000](https://www.iso.org/iso-31000-risk-management.html)
- [NIST SP 800-39](https://csrc.nist.gov/pubs/sp/800/39/final)
- [FAIR Institute](https://www.fairinstitute.org/)

---
[Volver al syllabus](../syllabus.md)
