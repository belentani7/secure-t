# Despliegue de la operación empresarial

## Servicios locales

```bash
docker compose -f infrastructure/docker-compose.yml up -d postgres redis minio
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
```

La conexión PostgreSQL se configura mediante `DATABASE_URL`. En local, el compose crea la base `secure_t` en el puerto `5432`. MinIO queda disponible para evidencias y archivos en `9000`; Redis está reservado para colas y rate limiting futuro.

## Migración empresarial

Ejecutar una vez contra la base de datos objetivo:

```bash
psql "$DATABASE_URL" -f drizzle/migrations/0003_business_operations.sql
```

La migración es idempotente para tipos y tablas. No renombra ni modifica las tablas académicas.

## Seguridad actual

Las operaciones de escritura bajo `/api/business` exigen el permiso `content:write`. El middleware actual reconoce el rol mediante `x-role` como mecanismo transitorio de desarrollo. Los roles con permiso son `ADMIN`, `CONTENT`, `FACULTY` y `SYSTEM`.

Antes de producción debe sustituirse `x-role` por identidad verificada y sesión firmada, y debe añadirse aislamiento por organización (`tenant_id`) en todas las tablas empresariales.

## Endpoints de operación

- `GET /api/business/health`
- `GET /api/business/snapshot`
- `GET /api/business/kpis`
- `GET /api/business/config`
- `POST /api/business/accounts`
- `POST /api/business/opportunities`
- `POST /api/business/projects`
- `POST /api/business/evidence`
- `POST /api/business/pipelines/:type/run`
- `PATCH /api/business/pipelines/:id`

Para probar una escritura local:

```bash
curl -X POST http://localhost:3000/api/business/accounts \
  -H 'content-type: application/json' \
  -H 'x-role: ADMIN' \
  -d '{"name":"Cliente piloto","area":"TRUST_SAFETY","owner":"Pedro"}'
```

## Producción antes de abrir al público

1. Configurar autenticación institucional/OAuth.
2. Reemplazar `x-role` y añadir autorización por organización.
3. Configurar copias de seguridad PostgreSQL y almacenamiento de evidencias.
4. Añadir secretos de producción sin subir `.env` al repositorio.
5. Activar logs estructurados y alertas de errores de persistencia.
6. Revisar contratos, privacidad y permisos de publicación de casos de estudio.
7. No activar facturación hasta validar la primera oferta y el flujo de aceptación.
