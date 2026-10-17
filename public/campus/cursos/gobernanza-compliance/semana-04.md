# Semana 4: El expediente de compliance

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 4 de 20

## Objetivos de aprendizaje

- Producir un expediente de compliance con evidencia verificable por artefacto
- Construir la cadena afirmación → artefacto → verificación
- Preparar una auditoría interna con checklist y hallazgos documentados
- Presentar y defender el expediente como evaluación final del curso

## El expediente de compliance: sin evidencia no hay cumplimiento

Un expediente de compliance NO es un PDF bonito. Es una cadena de afirmaciones donde cada una está respaldada por un artefacto verificable.

**Estructura del expediente:**
```
1. ALCANCE
   - Qué sistemas, datos y procesos cubre
   - Qué marcos aplican (ISO, NIST, ENS, RGPD)

2. INVENTARIO DE ACTIVOS
   - Lista completa: servidores, apps, datos, personas
   - Clasificación CIA por activo
   → Artefacto: hoja de inventario firmada y fechada

3. MATRIZ DE RIESGO
   - Riesgos evaluados con tratamiento y dueño
   → Artefacto: registro de riesgos (semana 3)

4. POLÍTICAS VIGENTES
   - Política de seguridad, uso aceptable, gestión de incidentes
   → Artefacto: documentos con versión, fecha y aprobación

5. CONTROLES IMPLEMENTADOS
   - Por cada control: descripción, evidencia de implementación
   → Artefacto: configs, capturas, logs de cambio

6. REGISTRO DE FORMACIÓN
   - Quién recibió qué formación y cuándo
   → Artefacto: lista de asistencia, evaluaciones

7. REGISTRO DE INCIDENTES
   - Historial con cronología y lecciones aprendidas
   → Artefacto: informes post-incidente

8. REVISIONES Y AUDITORÍAS
   - Auditoría interna anual, revisión por dirección
   → Artefacto: acta de revisión con decisiones
```

**La cadena de evidencia:**
```
AFIRMACIÓN:    'Tenemos MFA en todas las cuentas admin'
ARTEFACTO:     Config de IdP mostrando MFA obligatorio (captura)
VERIFICACIÓN:  Intento de login sin MFA → rechazado (captura)
FECHA:         2026-09-12
REVISOR:       [nombre]
```
Si la cadena se rompe en cualquier punto, la afirmación no tiene valor.

**Referencias:**
- ISO 27001 — Clause 9 (Performance Evaluation)
- ISO 27001 — Clause 10 (Improvement)
- NIST CSF — GV.OV (Oversight)

## Auditoría interna y defensa del expediente

**Auditoría interna — proceso:**
1. **Planificación:** alcance, criterios (qué marco), calendario
2. **Ejecución:** revisar documentación + verificar implementación
3. **Hallazgos:** conformidad / no conformidad mayor / menor / observación
4. **Informe:** hallazgos + evidencia + recomendaciones
5. **Seguimiento:** plan de acciones correctivas con dueño y fecha

**Formato de hallazgo de auditoría:**
```
ID:              NC-001
TIPO:            No conformidad menor
REQUISITO:       ISO 27001 A.5.15 — Control de acceso
HALLAZGO:        2 cuentas admin sin MFA habilitado
EVIDENCIA:       Captura del panel de IdP mostrando MFA=off
RIESGO:          Acceso no autorizado con credenciales robadas
ACCIÓN:          Habilitar MFA + verificar todas las cuentas
RESPONSABLE:     [nombre]
PLAZO:           2026-09-30
ESTADO:          Abierto
```

**Evaluación final — defensa del expediente (30 min):**
1. Presenta el expediente completo (10 min)
2. El evaluador elige 3 afirmaciones al azar y pide la evidencia
3. Por cada una: muestra el artefacto y la verificación
4. Si falta evidencia, la afirmación no cuenta
5. Se evalúa: completitud, coherencia, honestidad (¿declara lo que falta?)

**Evaluación 30/30/40:**
- 30% participación (labs semanales con evidencia)
- 30% quizzes (≥70%)
- 40% expediente de compliance defendido

**Referencias:**
- ISO 19011 — Guidelines for Auditing Management Systems
- ISO 27001 — Clause 9.2 (Internal Audit)
- ISACA COBIT — Audit Guidelines

## Caso real: British Airways 2018: multa RGPD de £20M por evidencia insuficiente

British Airways sufrió una brecha de 500.000 tarjetas vía JavaScript inyectado en la web de pagos (Magecart). La ICO (autoridad UK) impuso £20M (reducida de £183M) por fallos en: monitorización de logs (no detectaron la inyección en 2 meses), segmentación de red, cifrado de datos de pago, y auditoría de terceros. Lección: el expediente de BA no pudo demostrar que los controles existían y funcionaban — cada afirmación sin artefacto fue un agravante en la sanción.

## Ejercicio guiado: Construye el expediente de compliance del caso práctico

1. Define el alcance: plataforma educativa Secure T University
2. Completa el inventario de activos con clasificación CIA (semana 1)
3. Incluye la matriz de riesgos con tratamiento y dueño (semana 3)
4. Redacta 2 políticas: seguridad de la información + gestión de incidentes
5. Documenta 3 controles con la cadena afirmación → artefacto → verificación
6. Incluye el registro de formación (las 4 semanas del curso)
7. Simula 1 hallazgo de auditoría interna con formato completo
8. Defiende: para cada afirmación, ¿dónde está la evidencia?

## Recursos abiertos

- [ISO 19011](https://www.iso.org/standard/70017.html)
- [ICO — BA enforcement](https://ico.org.uk/action-weve-taken/enforcement/british-airways/)
- [ISACA COBIT](https://www.isaca.org/resources/cobit)

---
[Volver al syllabus](../syllabus.md)
