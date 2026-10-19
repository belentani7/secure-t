# Secure T — verificación basada en evidencias

**Fecha de revisión:** 19 de octubre de 2026  
**Repositorio:** `belentani7/secure-t` (privado)  
**Fuente:** código de `main` y cambios propuestos en PR #36.

La calificación histórica de 8,7/10 y el diagnóstico anterior de «todo
funcionando» **no son verificaciones actuales de producción**. No deben
presentarse como auditoría certificada ni como prueba de que exista un
servicio online disponible.


## Avance curricular verificado en la rama del PR #36

El campus incluye **72 de 240 unidades** con lectura propia y práctica específica en portugués, español e inglés, repartidas entre semestres 1, 2 y 3. Las restantes 168 son itinerarios planificados; el programa de cinco años sigue incompleto y no equivale a una titulación académica acreditada. El tutor y el repaso son orientaciones educativas locales, no calificaciones de profesorado.

**Prueba aislada ejecutada:** JavaScript del contenido y de repaso cargado sobre entorno simulado, 72 claves válidas, sin lecturas o actividades ausentes, transición de repaso y traducción al español sin errores. **Pendiente:** tests completos de Python, Node y Playwright, validación accesibilidad manual, seguridad de despliegue, firma de credenciales y revisión académica externa.

La fuente `drivedopobre.com.br` indicada como candidata no se pudo inspeccionar en línea. No se han descargado ni republicado contenidos sin comprobar autoría o licencias.

## Componentes comprobables en el repositorio

| Componente | Evidencia | Estado |
| --- | --- | --- |
| Currículo | `campus/cursos/` | 4 cursos con 20 semanas y quizzes por curso |
| Campus offline | `campus/`, `campus/sw.js` | Código implementado; recorrido completo requiere Chromium/CI |
| Sitio estático | `scripts/build_site.py` | Ensamblador con lista blanca y validación de enlaces y secretos reconocibles |
| Progreso | `campus/progreso.html` | Local-only, importación/exportación; endurecimiento propuesto en PR #36 |
| Constancias SHA-256 | `campus/credencial.html` | Huella verificable, **sin firma de emisor ni acreditación** |
| UI React | `client/` | SPA de demostración, no equivalente al campus estático |
| API Express | `index.ts` | Catálogo/progreso demo y tutor opcional cerrado por defecto en producción |
| RBAC | `auth/rbac.ts` | Contrato de permisos; no integra autenticación real de estudiantes |
| PostgreSQL, Redis, MinIO | `docker-compose.yml` | Servicios de **desarrollo local**, no conectados al campus estático |
| Contenedor | `Dockerfile` | Node 22, no-root propuesto en PR #36; build Docker completo pendiente |
| Seguridad CI | `.github/workflows/` | Gitleaks, Semgrep CE para privado y CodeQL para público; ejecuciones pendientes |
| Publicación | `.github/workflows/pages.yml`, `netlify.toml` | Configuración presente; **URL pública no verificada** |

## Validaciones realizadas durante la reparación del PR #36

- JS del componente de constancias: sintaxis válida; genera bloque v2 sin
  publicar el token local original, acepta la huella correcta y rechaza
  evidencia alterada (prueba aislada).
- JS del progreso: sintaxis válida; un almacenamiento JSON inválido no
  bloquea la página; rechazo de claves no permitidas en importación y
  aceptación de datos legítimos (prueba aislada).
- JS del panel de amenazas y del recorrido Playwright: sintaxis examinada.
- Pruebas nuevas subidas en `tests/` para permisos de expedientes,
  auditoría, API, límites de tutor, importación de progreso y constancias.
  **Estas pruebas todavía necesitan la ejecución completa de CI.**

### Pruebas necesarias para considerar un cambio fusionable

```bash
python3 -m pytest -q tests/
node --test tests/service-worker.test.mjs lib/edu-engine/tests/quiz.test.mjs
pnpm install --frozen-lockfile --ignore-scripts
pnpm typecheck
pnpm test
pnpm build
node --test tests/api-security.test.mjs
python3 scripts/build_site.py
```

Además deben aprobarse el recorrido Playwright, el escaneo SAST privado,
Gitleaks y las comprobaciones de construcción y despliegue correspondientes.

## Riesgos sin resolver

1. [Issue #6](https://github.com/belentani7/secure-t/issues/6): las claves
   históricamente expuestas de DeepSeek/Google deben ser **revocadas en
   sus proveedores** y revisadas antes de cerrar la incidencia.
2. GitHub Pages sobre un repositorio personal privado en GitHub Free no
   está disponible sin cambio de plan o visibilidad. **No cambiar a
   público para forzar una publicación sin revisar secretos e historial.**
3. La SPA muestra información y servicios de demostración. El servidor
   no autentica estudiantes ni emite títulos institucionales.
4. Las ejecución de GitHub Actions asociadas a la reparación se han
   observado en cola. No hay constancia de gates completos en verde.

## Definición de «listo»

Solo marcar una entrega como **VERIFIED** cuando la compilación, las
pruebas funcionales y de seguridad, la URL y sus encabezados reales
sean comprobables, y cuando las alertas de credenciales estén atendidas.

**REALITY > CLAIMS.** No se promete acreditación universitaria.
