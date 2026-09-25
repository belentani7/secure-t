# Deployment

## Campus web

El frontend de secure T está preparado para Vercel mediante `vercel.json`. Cada push a `main` se valida con GitHub Actions. La publicación del frontend requiere conectar el repositorio a un proyecto de Vercel o disponer de un token de Vercel.

## Backend y datos

El servidor Express y los contratos de API existen en el repositorio, pero el backend persistente todavía no está conectado a una base PostgreSQL de producción. PostgreSQL, Keycloak, Redis, MinIO, workers de tareas, cyber range y TTS GPU no deben esconderse dentro del runtime serverless del frontend.

Vercel puede alojar APIs ligeras. Para labs, colas, GPU y procesos stateful se requiere infraestructura separada con red privada, backups, monitorización y secretos fuera de Git.

## Variables

Se usa `.env.example` como contrato. Nunca se commitea `.env`. Las claves de proveedores se inyectan en el entorno de despliegue y no llegan al navegador.

## Readiness

Antes de abrir matrícula se requiere dominio, HTTPS, backups probados, logs, alertas, rate limiting, revisión de privacidad, proceso de incidentes, pruebas de restauración y revisión de acreditación.
