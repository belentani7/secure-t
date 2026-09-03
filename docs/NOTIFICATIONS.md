# Tareas y notificaciones

Las operaciones lentas deben ser asíncronas y emitir `TASK_CREATED`, `TASK_STARTED`, `TASK_PROGRESS`, `TASK_COMPLETED` o `TASK_FAILED`. La UI no espera bloqueada a la generación de audio, informe, laboratorio, evaluación o recomendación.

La implementación inicial incluye un service worker preparado para `TASK_COMPLETED`, la Notification API y el contrato de eventos en `notifications/task-events.ts`. El sonido de finalización debe usar Web Audio API respetando preferencias de usuario, permisos del navegador y quiet hours.

El worker de producción será separado del servidor web y usará una cola durable. La notificación no implica que una calificación o credencial haya sido aprobada: esas acciones siempre conservan su workflow académico.
