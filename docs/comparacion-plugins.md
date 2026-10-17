# Comparación real de plugins de búsqueda — septiembre 2026

Candidatos descargados de sus distribuciones oficiales (jsDelivr) y medidos
en disco el 2026-09-12, para la búsqueda client-side del campus
(`campus/buscar.html`, índice local de 119+ entradas):

| Plugin | Versión | Tamaño real | Licencia | Fuzzy | Decisión |
|---|---|---|---|---|---|
| **fuse.js** | 7.1.0 | **26 415 B** | Apache-2.0 | sí (referencia) | ✅ **elegido** |
| lunr | 2.3.9 | 29 510 B | MIT | no (por defecto) | descartado |
| minisearch | 7.1.2 | 18 499 B | MIT | sí | descartado |

**Por qué fuse.js**: mismo orden de tamaño que lunr (y solo +8 KB sobre
minisearch), tolerancia a erratas de referencia (la mejora real para un
estudiante que teclea "owaspp"), API directa sobre arrays de objetos, y
mantenimiento activo. En una PWA offline-first el coste se paga una vez
(service worker cachea el vendor). minisearch es excelente y 8 KB más
pequeño; si el presupuesto bajara a <20 KB, es el sustituto natural.

**Vendoring**: `campus/vendor/fuse.min.js` + `campus/vendor/FUSE-LICENSE`
(Apache-2.0 completa). Sin CDN: el campus sigue funcionando 100 % offline.

**Integración con fallback**: si `vendor/fuse.min.js` no carga,
`buscar.html` degrada automáticamente a la búsqueda por subcadena con
normalización de acentos (la que ya existía). Sin punto de fallo único.
