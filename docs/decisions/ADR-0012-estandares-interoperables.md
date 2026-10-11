# ADR-0012 · Estándares abiertos: paquetes, credenciales, datos de actividad y SBOM

- **Estado:** aceptado (2026-10-11)
- **Contexto:** el encargo pide «el producto final completo» y estudiar los documentos de desarrollo oficiales de
  las plataformas del sector. Una universidad digital que sólo existe como web propia no es interoperable: sus
  cursos no se pueden importar en un LMS, sus credenciales no se pueden verificar con las herramientas del
  mercado y sus datos de actividad no se pueden llevar a otro sistema.
- **Decisión:** implementar —y publicar— los formatos que el sector usa de verdad, generados desde la fuente
  única de contenido, cada uno con su test de contrato:
  | Estándar | Implementación | Test |
  |---|---|---|
  | EPUB 3.3 + Accessibility 1.1 | `tools/build-packages.ts` (OCF, OPF, navegación, metadatos de accesibilidad) | `tests/packages-contract.test.ts` |
  | SCORM 2004 4th Edition | `imsmanifest.xml` con secuenciación y SCO XHTML contra la API `cmi.*` | idem |
  | IMS Common Cartridge 1.3 | `imsmanifest.xml` + `webcontent` + evaluación incrustada | idem |
  | IMS QTI 1.2 | `questestinterop` con `resprocessing` y `itemfeedback` | idem |
  | xAPI 1.0.3 | `packages/shared/src/xapi.ts` + registro local en el navegador | `packages/shared/tests/xapi.test.ts` |
  | Open Badges 2.0 (JWS RS256, verificación sin servidor) | `packages/shared/src/badges.ts` + `badge-store.ts` | `packages/shared/tests/badges.test.ts` |
  | Open Badges 3.0 / VC | `toOpenBadges3()` (vista de datos, sin duplicar lógica) | idem |
  | schema.org (Course, Syllabus, BreadcrumbList, Organization) | `packages/shared/src/seo.ts` | `packages/shared/tests/seo.test.ts` |
  | RFC 9457 (Problem Details) | `apps/web/src/lib/problem.ts` en la API del agente | `tests/agent-api.test.ts` |
  | RFC 9116 (`security.txt`) | `apps/web/public/.well-known/security.txt` | `tests/contracts.test.ts` |
  | CycloneDX 1.5 (SBOM) | `tools/build-sbom.mjs` → `/sbom.cdx.json` | `tests/contracts.test.ts` |
- **Por qué:** los estándares no son decoración: son la forma de que el trabajo del estudiante y el material del
  campus **no queden encerrados** en este repositorio. También son una defensa contra la inflación de promesas:
  un formato que no se puede validar con una prueba no se declara.
- **Decisiones de honestidad asociadas:**
  - Sin registro público de emisiones **ni revocación** de credenciales: verificables sí, revocables no (PLANNED).
  - **Sin LTI 1.3**: el campus exporta paquetes para un LMS, pero no se conecta como herramienta externa.
  - Sin `aggregateRating` ni `review` en JSON-LD: no hay valoraciones reales.
  - El xAPI se guarda **en el dispositivo** y se exporta cuando el estudiante quiere; nunca se envía a un LRS.
  - El SBOM marca `NOASSERTION` cuando el paquete instalado no declara licencia, en lugar de inventarla.
- **Alternativas descartadas:** generar los paquetes con librerías externas (`epub-gen`, `jszip`) —más peso,
  menos control del formato y una dependencia nueva que justificar—; usar `crypto.randomUUID()` en los paquetes
  —no determinista, el mismo material daría ficheros distintos—; publicar credenciales en un servicio central
  —contradice la promesa de anonimato y necesitaría un servidor con datos personales—.
- **Consecuencias:** `pnpm packages` y `pnpm sbom` forman parte de `pnpm content:all`; CI verifica que los
  ficheros generados están al día (`git diff --exit-code`). `docs/ESTANDARES.md` es la tabla pública de
  conformidad y `tests/contracts.test.ts` comprueba que **cada evidencia citada existe**.
