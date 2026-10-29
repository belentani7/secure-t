# Environment variables

The public static campus does not need secrets. Runtime variables apply only to
the optional Express tutor service.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | Production | Selects production fail-closed behavior. |
| `PORT` | No | HTTP port; defaults to `3000`. |
| `HOST` | No | Documented bind address for local deployments. |
| `SITE_URL` | No | HTTPS canonical URL used by the static builder. |
| `SECURE_T_TUTOR_API_KEY` | Tutor | Server-side tutor authorization key. Never expose it to the browser. |
| `OLLAMA_URL` | Tutor | Private Ollama endpoint. Defaults to localhost. |
| `OLLAMA_MODEL` | Tutor | Local model name. |
| `UPSTASH_REDIS_REST_URL` | Public tutor | Shared rate-limit backend URL. |
| `UPSTASH_REDIS_REST_TOKEN` | Public tutor | Shared rate-limit backend token. |
| `SENTRY_DSN` | No | Optional error reporting endpoint. |
| `LOG_LEVEL` | No | Application log verbosity. |
| `POSTGRES_USER` | Local only | Local database username. |
| `POSTGRES_PASSWORD` | Local only | Local database password. |
| `POSTGRES_DB` | Local only | Local database name. |
| `MINIO_ROOT_USER` | Local only | Local object-store username. |
| `MINIO_ROOT_PASSWORD` | Local only | Local object-store password. |

## Production rules

- Store secrets in Railway/Vercel/GitHub Actions secret stores, never in Git.
- A production tutor deployment without both Upstash variables is denied by
  design; it must not silently fall back to an in-memory limiter.
- Rotate the tutor key and Upstash token after suspected exposure, then revoke
  the old values at the provider.
- Do not put any of these variables in static campus files or client bundles.
