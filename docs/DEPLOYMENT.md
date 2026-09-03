# Deployment

## Desarrollo local

La aplicación web puede arrancar con `pnpm install`, `pnpm check`, `pnpm build` y `pnpm start`. Los servicios de datos, identidad, colas, almacenamiento y GPU no deben esconderse dentro de Vercel.

## Producción

Vercel puede alojar el frontend y APIs ligeras. PostgreSQL, Keycloak, Redis, MinIO, workers de tareas, cyber range y TTS GPU deben estar en servicios administrados o self-hosted con red privada, backups, monitorización y secretos fuera de Git.

## Variables

Se usará `.env.example` como contrato. Nunca se commitea `.env`. Las claves de proveedores se inyectan en el entorno de despliegue y no llegan al navegador.

## Readiness

Antes de abrir matrícula se requiere dominio, HTTPS, backups probados, logs, alertas, rate limiting, revisión de privacidad, proceso de incidentes, pruebas de restauración y revisión de acreditación.
