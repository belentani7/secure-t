# ADR-0011 · Cabeceras de seguridad y CSP en un sitio también estático

- **Estado:** aceptado (2026-10-11)
- **Contexto:** el campus se publica de dos maneras —servidor Node (Next) y exportación estática a GitHub Pages— y
  la promesa de seguridad exige una política de contenido real, no un adorno. El problema: **GitHub Pages no
  permite enviar cabeceras HTTP propias**, y la exportación estática no tiene un servidor que las ponga.
- **Decisión:**
  1. La política se escribe **una sola vez** en `apps/web/src/lib/security-headers.ts` (`CSP_DIRECTIVES`, `CSP`,
     `SECURITY_HEADERS`, `META_HEADERS`).
  2. Se consume en tres sitios: `next.config.ts` (cabeceras del servidor), `apps/web/public/_headers` (Netlify y
     Cloudflare Pages, que sí las admiten) y `<meta http-equiv>` en el chrome del sitio para la exportación
     estática.
  3. `tests/contracts.test.ts` compara las tres representaciones: si alguien cambia la política en un sitio y no
     en los otros dos, el test falla.
  4. `security.txt` (RFC 9116) publica el canal de reporte y **el test prohíbe declarar `Encryption:` si la clave
     PGP no está publicada**.
- **Por qué:** una política única y verificada es más fuerte que tres políticas parecidas. Denegar por defecto
  (`default-src 'self'`, `object-src 'none'`, `frame-src 'none'`, `base-uri 'self'`, `form-action 'none'`) es
  posible aquí porque el campus **no** usa CDN, analítica, fuentes externas ni iframes.
- **Limitación declarada (no ocultada):** en GitHub Pages la CSP va como metadato y `frame-ancestors` no puede
  expresarse —los metadatos no admiten esa directiva—, de modo que allí la protección frente a *framing* queda
  en manos del navegador y de `X-Frame-Options`… que tampoco llega. Se documenta como limitación real del
  alojamiento y por eso el despliegue recomendado con cabeceras es el de servidor.
- **Alternativas descartadas:** un proxy (Cloudflare Worker) delante de Pages —posible, pero añade una pieza
  externa y una dependencia de infraestructura que el proyecto no necesita—; renunciar a la exportación estática
  —rompería la promesa de sitio descargable y sin servidor—.
- **Consecuencias:** el despliegue estático pierde `frame-ancestors` y HSTS; el de servidor los tiene todos. Los
  tests fijan la equivalencia de las tres copias y la honestidad de `security.txt`.
