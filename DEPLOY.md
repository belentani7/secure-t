# Secure T — despliegue verificable

> Estado 2026-10-19: el producto público principal es un **campus estático**
> sin cuentas, base de datos ni certificados emitidos por una institución.
> La aplicación Express/React incluida en este repositorio es una
> **demostración técnica separada**; no debe confundirse con el campus público.

## 1. Construir el campus estático real

```bash
python3 -m pytest -q tests/
python3 scripts/build_site.py
python3 -m http.server 8000 --directory site-dist
```

El comando `build_site.py` ensambla únicamente archivos públicos autorizados
y comprueba enlaces, rutas privadas, enlaces simbólicos y secretos reconocibles.
La salida es `site-dist/`. Si una comprobación falla, no sustituye la
última salida correcta.

Para alojar el campus en un proveedor de sitios estáticos, configurar:

- **Build command:** `python3 scripts/build_site.py`
- **Output directory:** `site-dist`
- **SITE_URL:** URL HTTPS pública exacta, incluida la ruta base cuando exista.

Netlify ya utiliza esta configuración en `netlify.toml`. En Vercel es
necesario configurar el proyecto específico de campus con **Framework:
Other**, el comando anterior y el directorio `site-dist`. Si el proyecto
de Vercel usa `pnpm build` desde este repositorio, servirá la **SPA demo**,
no el campus estático: no marcarlo como campus publicado.

## 2. GitHub Pages

`.github/workflows/pages.yml` implementa la misma publicación con lista
blanca. El destino previsto es
`https://belentani7.github.io/secure-t/`, pero **no es una URL confirmada
como publicada**: en un repositorio personal privado GitHub Free no se puede
habilitar Pages sin cambiar de plan o de visibilidad. No se hará público el
código como efecto secundario de un despliegue.

## 3. Aplicación Express + React opcional

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

El `Dockerfile` usa Node 22 y ejecuta el servidor con usuario no root.
`railway.json` apunta a `index.ts` mediante `tsx`. Rutas disponibles:
`GET /api/health`, `GET /api/catalog`, `GET /api/progress` y
`POST /api/tutor`. **Catálogo y progreso son demostrativos**: sin
usuarios persistentes, autorización de estudiantes ni base de datos real.

En `NODE_ENV=production`, la ruta del tutor responde HTTP 503 sin
`SECURE_T_TUTOR_API_KEY` configurada en el **servidor**. Con esa clave
requiere cabecera `x-secure-t-key` y aplica límites de uso. **No exponer
la clave en JavaScript de clientes ni abrir esta API a usuarios finales sin
autenticación y autorización de servidor.** `OLLAMA_URL` debe apuntar a
un modelo al que el servidor pueda acceder por red autorizada.

## 4. Servicios locales de desarrollo

`docker-compose.yml` ofrece PostgreSQL, Redis y MinIO **sin conectarlos
automáticamente** al campus. Estos servicios requieren variables locales
`POSTGRES_PASSWORD`, `MINIO_ROOT_USER` y `MINIO_ROOT_PASSWORD`.
Los puertos están ligados a `127.0.0.1`. No desplegar esta composición
como entorno público sin diseño e intervención adicionales.

`.env.example` enumera variables, nunca claves reales. Los secretos
encontrados en commits anteriores requieren revocación en sus proveedores,
no solo reemplazos en el código: issue #6.

## 5. Gates antes de producción

- Tests completos Python, Node, navegador y construcción del artefacto.
- Semgrep CE (repo privado) o CodeQL (si es público y el plan lo permite).
- Escaneo Gitleaks de código actual, revisión de historial y revocación de
  credenciales expuestas.
- Revisión manual de accesibilidad, enlaces, contenidos y permisos del host.
- Verificar URL publicada y headers HTTP desde el despliegue real.

**No afirmar que un servicio es operativo, escalable o certificado por
el simple hecho de que exista un archivo de configuración.**
