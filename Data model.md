# Data model

La persistencia productiva evolucionará a PostgreSQL + Drizzle. El modelo se divide en identidad (`users`, `profiles`, `roles`, `permissions`), academia (`programs`, `courses`, `modules`, `lessons`, `objectives`), aprendizaje (`enrollments`, `attempts`, `submissions`, `assessments`, `grades`), competencias (`frameworks`, `competencies`, `student_competencies`, `evidence`), labs (`templates`, `instances`, `sessions`, `events`), IA (`sessions`, `messages`, `agents`, `tools`, `permissions`, `actions`, `evaluations`, `memory`), tareas/notificaciones y credenciales.

Cada tabla debe tener identificador estable, timestamps, propietario o scope institucional, índices de acceso y política de retención. Los eventos de auditoría son append-only. Los datos de conversación y voz tienen retención independiente del expediente.

`pgvector` se reservará para embeddings de fuentes aprobadas. Una respuesta IA debe poder devolver los identificadores de las fuentes recuperadas.
