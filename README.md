# secure T

secure T es una plataforma educativa digital orientada a ciberseguridad e inteligencia artificial. El objetivo es evolucionar hacia universidad digital, cyber range, tutoría IA gobernada, expediente académico basado en competencias, investigación y credenciales verificables.

> La aplicación no afirma acreditación universitaria ni validez de títulos. Las capacidades no implementadas están documentadas como pendientes.

## Inicio rápido

```bash
pnpm install
pnpm check
pnpm test
pnpm build
pnpm dev
```

Para levantar servicios locales:

```bash
docker compose -f infrastructure/docker-compose.yml up -d
cp .env.example .env
pnpm db:generate
```

## Mapa

- `client/`: campus React/Vite.
- `server/`: API Express, AI Gateway y contratos de labs.
- `drizzle/`: esquema PostgreSQL y migraciones.
- `ai/`: routing, permisos y proveedores de modelos.
- `academic/`: frontera del motor académico.
- `labs/`: frontera del cyber range aislado.
- `voice/`: VoiceProvider y consentimiento.
- `rag/`: recuperación de fuentes aprobadas.
- `audit/`: eventos de auditoría sin secretos.
- `notifications/`: contrato de tareas y terminal states.
- `docs/`: decisiones, seguridad, despliegue y roadmap.

## Principios

Open source first, seguridad y privacidad por diseño, estándares abiertos, autoridad académica separada de asistencia IA, mínimo privilegio, evidencia antes de mastery y ningún código arbitrario de estudiantes en el servidor principal.

## CI

GitHub Actions ejecuta typecheck, tests y build en push, pull request y cada noche. Vercel está configurado mediante `vercel.json`; la publicación requiere conectar el repositorio al equipo Vercel correspondiente.
