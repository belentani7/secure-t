# SECURE T · biblioteca HTML curricular

Esta ampliación conserva las 80 semanas que ya existían en `campus/cursos/`. Son **240 páginas HTML accesibles por URL** (80 lecturas, 80 prácticas y 80 cuadernos de evidencias), no 240 nuevas lecciones originales independientes.

## Arquitectura

- Landing: `client/public/estudiar/index.html` — 1.776 líneas en HTML con búsqueda.
- Diseño: `client/public/estudiar/styles.css`.
- Lector: `client/public/estudiar/reader.js`.
- Archivos: `client/public/estudiar/<curso>/semana-XX-<tipo>.html`.
- Fuente: `campus/cursos/<curso>/semana-XX.md` sin modificar.
- Vite publica `client/public/` en el root estático, y `scripts/sync-campus.mjs` lleva el origen a `/campus/full/`.

La vista de lectura muestra el Markdown completo convertido en HTML escapado. La práctica extrae una sección de ejercicios solo si realmente existe. Si falta, no inventa una actividad. Evidencias usa los objetivos del documento y ofrece exportación local de notas.

## Operación

Se prevé uso online y alojamiento en Vercel; **no se exige modo offline**. Sin JavaScript, cada HTML mantiene el título y un enlace a la fuente Markdown. Esto es una degradación honesta y no equivalente a renderizado completo sin JS.

Probar `node --test tests/campus-html-240.test.mjs`, `npm run build` y navegación real; no afirmar validación antes de ejecutarla.

No se proporcionan acreditaciones profesionales, diplomas ni acceso a terceros. Los laboratorios exigen autorización explícita.
