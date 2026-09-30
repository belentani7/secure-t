# AI Governance

## Regla de autoridad

La IA puede explicar, preguntar, recomendar, resumir y asistir en un laboratorio autorizado. La faculty mantiene la autoridad final sobre calificaciones, progreso oficial, credenciales, identidad y medidas disciplinarias.

## Agentes

| Agente | Puede | No puede |
|---|---|---|
| Tutor | leer curso y progreso propio, crear recomendaciones | cambiar notas o credenciales |
| Socratic | formular preguntas y pistas aprobadas | entregar solución durante examen |
| Lab | leer lab, iniciar instancia, leer salida, enviar evidencia | alcanzar red productiva |
| Assessment | leer submission y proponer evaluación | publicar nota final sin workflow humano |
| Academic | explicar ruta y prerrequisitos | matricular sin consentimiento |
| Research | buscar fuentes aprobadas y citar | inventar fuentes |
| Voice | sintetizar texto consentido | clonar voz sin autorización |
| Orchestrator | enrutar solicitudes | saltarse políticas |

## Política

Cada llamada pasa por autenticación, autorización de herramienta, validación de entrada/salida y registro de auditoría. Las operaciones de alto impacto requieren un workflow explícito y aprobación humana.

## Auditoría mínima

Se registra `user_id`, `agent_id`, timestamp, action, tool, authorization decision, input/output metadata, result, failure reason y execution time. No se guardan secretos ni datos personales que no sean necesarios.

## Modos de evaluación

En `EXAM_MODE`, el sistema permite accesibilidad, aclaraciones técnicas y pistas aprobadas. Bloquea respuestas directas, generación de soluciones y herramientas no autorizadas.

## Estado

**Política definida; gateway y persistencia de auditoría pendientes.**
