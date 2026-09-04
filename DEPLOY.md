# Despliegue de secure-t a producción (Railway + Supabase)

Guía para poner secure-t online. No depende de Docker local: todo corre en la nube.

## Arquitectura
```
Internet → Railway (monolito Express: API + campus web, 24/7) → Supabase (Postgres gestionado + Auth)
```

## Requisitos
- Cuenta en [supabase.com](https://supabase.com) (gratis para empezar)
- Cuenta en [railway.app](https://railway.app) (gratis con límites)
- Repo de GitHub: `belentani7/secure-t`

---

## Paso 1 — PostgreSQL (Supabase)
1. Abrir https://supabase.com → **New project**
2. Crear organización + proyecto (dá un nombre, ej. `secure-t`)
3. Elegir región cercana y **guardar la contraseña de la base de datos**
4. Una vez creado:
   - **Connection string (pooler)**: Dashboard → *Settings* → *Database* → *Connection string* → copiar la URL de `Transaction` (empieza con `postgresql://postgres.xxxx.supabase.co:6543/...`)
   - Guardar esa URL (la usarás en Railway como `DATABASE_URL`)

## Paso 2 — Cargar el esquema y seed (Supabase)
1. En Supabase Dashboard → **SQL Editor** → *New query*
2. Pegar el contenido de **`sql/seed.sql`** (de este repo)
3. **Run** → debe devolver "Success". Crea todas las tablas, programa BSCY, 6 cursos, módulos, lecciones, competencias, agentes IA y usuario demo.

## Paso 3 — Servidor online (Railway)
1. Abrir https://railway.app → **Start new project**
2. **Deploy from GitHub repo** → conectar la cuenta de GitHub → elegir `belentani7/secure-t`
3. Railway detecta `Dockerfile` + `railway.json` automáticamente (builder DOCKERFILE, healthcheck `/api/health`)
4. En el servicio, pestaña **Variables**:
   - `DATABASE_URL` = la URL del Paso 1
   - `PORT` = `3000`
5. **Deploy**. Esperar a que `Build` y `Deploy` terminen (unos minutos).
6. Railway genera una URL tipo `secure-t-production.up.railway.app`

## Paso 4 — Verificar
Navegar a:
```
https://TU-URL.up.railway.app/api/health
https://TU-URL.up.railway.app/api/db/status   → debe darte { "connected": true, "mode": "postgres" }
https://TU-URL.up.railway.app/api/catalog     → 6 cursos
https://TU-URL.up.railway.app                 → campus web
```

Si `connected: true` → la persistencia real está activa (adiós al fallback en memoria).

---

## Solución de problemas
| Problema | Causa | Fix |
| :--- | :--- | :--- |
| `/api/db/status` muestra `connected: false` | `DATABASE_URL` mal copiada o falta | Revisar variable en Railway (y/o cadena de conexión con puerto 6543 + `sslmode=require`) |
| Build falla | Depende de esbuild (en Linux Railway funciona) | Revisar logs de build en Railway |
| Credenciales | Usuario demo que no se puede loguear aún | Auth (Supabase Auth) se conecta en una fase posterior |

## Archivos involucrados
- `Dockerfile` — build multicapa (pnpm build → runtime mínimo)
- `railway.json` — config de deploy en Railway
- `sql/seed.sql` — DDL completo + seed del catálogo
- `server/db/index.ts` — conexión Drizzle
- `server/services/db.ts` — capa de acceso con fallback a memoria
