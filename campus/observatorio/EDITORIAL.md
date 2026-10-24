# Observatorio Secure T — sistema editorial y educativo

Edición **2026-10-24**. Repositorio canónico: `belentani7/secure-t`.

## Identidad del nicho

Secure T enseña **ciberseguridad defensiva y responsable, IA segura, privacidad, GRC, continuidad, Trust & Safety y empleabilidad técnica**. El enfoque no consiste en acumular enlaces: cada especialidad debe asociar conceptos, ejercicios sintéticos, instrumentos profesionales, documentos de referencia, entregables y revisión humana.

**Audiencia:** estudiantes autodidactas, trabajadores en transición, analistas junior, equipos de pequeñas organizaciones y profesorado que quiera diseñar ejercicios autorizados. No asumir acreditaciones formales, entidad universitaria ni condición de centro oficial.

## Estructura implantada

- **Campus y academia:** cuatro programas preexistentes y materiales curriculares.
- **Workstation:** terminal simulada segura, casos sintéticos y cuaderno de evidencias.
- **Mission Control:** seis simulaciones de decisiones, 48 tarjetas de memoria activa y cuaderno por incidente.
- **Observatorio:** 14 itinerarios, 56 fichas de módulos con objetivo y entregable, 40 herramientas, 33 referencias, seis noticias verificadas y ocho destinos de vigilancia editorial manual.
- **Noticias:** publicación original enlazada, fecha explícita y separación entre revisión editorial y monitorización en tiempo real.
- **Experiencia de usuario:** búsqueda y filtros por dominios, favoritos, seguimiento local, exportación/importación JSON validado, CSS responsive, etiquetas y foco visible, acceso offline precargado.

**Importante:** una ficha de módulo o una URL a herramienta no significa que exista un curso completo o software instalado. No convertir números de catálogo en afirmaciones falsas de calidad o finalización.

## Alcance y seguridad

- No recopilar contraseñas, tokens, datos de alumnos, evidencias operativas confidenciales ni datos personales reales.
- Las herramientas de pentesting y captura solo se usan en laboratorios propios o con permiso escrito.
- `localStorage` no es expediente académico: lo modifica cualquier persona con acceso al navegador, es accesible a scripts del origen y no cifra datos.
- Las URLs externas se abren por acción voluntaria y con `noopener noreferrer`. No hay rastreadores, feeds ni telemetría.
- Los módulos proponen entregables, pero su calidad exige una rúbrica y revisión de una persona competente. Marcado local = **estudio autodeclarado**.
- Las noticias se contextualizan por **fecha del hecho**, **fecha de publicación** y **edición editorial**, evitando titular como «última hora» una noticia histórica.

## Fuentes prioritarias

1. **NIST:** CSF 2.0, SP 800-61r3, NICE Framework, NVD.
2. **ENISA:** Threat Landscape, productos, guías NIS2 y CRA.
3. **CISA:** KEV y avisos de equipos CSIRT.
4. **INCIBE y CCN-CERT:** recursos y avisos para España.
5. **OWASP y MITRE:** seguridad de aplicaciones, IA, controles de detección y comportamiento.
6. **EUR-Lex / AEPD / EDPB:** RGPD, NIS2, DORA, AI Act y marco de plataformas.
7. **OpenSSF / OSV / SigmaHQ / FIRST:** cadena de suministro, reglas y uso de indicadores.

## Actualidad confirmada para el catálogo

- **22 octubre 2026, ENISA:** Technical Advisory for Software Bill of Materials.
  https://www.enisa.europa.eu/publications/enisa-technical-advisory-for-software-bill-of-materials
- **21 octubre 2026, ENISA:** declaración sobre vulnerabilidades críticas PHP.
  https://www.enisa.europa.eu/news/joint-statement-on-critical-php-vulnerabilities
- **15 octubre 2026, ENISA:** FAQ actualizada de la plataforma CRA.
  https://www.enisa.europa.eu/topics/product-security/vulnerability-services/eu-incident-response-and-cyber-crisis-management/single-reporting-platform-srp/frequently-asked-questions
- **22 septiembre 2026, ENISA:** Threat Landscape 2026.
  https://www.enisa.europa.eu/publications/enisa-threat-landscape-2026
- **11 septiembre 2026, ENISA:** lanzamiento del mecanismo de reporte CRA.
  https://www.enisa.europa.eu/news/the-cra-single-reporting-platform-is-launched
- **28 abril 2026, NIST:** componentes NICE 2.2.0.
  https://www.nist.gov/news-events/news/2026/04/nice-releases-nice-framework-components-v220

Estas fichas NO se actualizan sin una nueva edición del catálogo. Una herramienta de software no convierte enlaces en alertas operativas.

## Próximos estándares de edición

- Cada tema nuevo necesita: objetivo de aprendizaje, prerrequisitos, explicación escrita, una demostración inocua, ejercicio autónomo, respuesta comentada, bibliografía y tiempo estimado.
- Cada noticia necesita enlace primario, fecha, responsable, ámbito geográfico, actualización, impacto y recomendación no alarmista.
- Cada herramienta necesita: licencia y costes revisados, instalación oficial, finalidad, riesgos, requisitos y ejercicio de ejemplo sin permisos externos.
- Cada evaluación formativa necesita separar acierto de comprensión y registrar incertidumbre; idealmente pasa revisión académica externa.
- Actualizar permanentemente fuentes con cadencias humanas. Para feeds en directo, diseñar un proceso separado con caché, licencia, seguridad y moderación antes de presentarlo como servicio.

## Calidad / gates

```bash
node --test tests/observatorio-engine.test.cjs
python scripts/build_site.py
# Con navegador y servidor local sirviendo site-dist:
PLAYWRIGHT_MODULE=... node tests/browser-observatorio.cjs
```

Además de las pruebas automatizadas, revisar contrastes, tamaños a 320, 390, 768 y 1366 píxeles; control exclusivamente por teclado; lector de pantalla; modo offline; importación corrupta; casos sin coincidencia; y destinos externos. El diseño queda **pendiente de validación completa** mientras no se ejecute esa batería en Chromium real.

## Evidencia de trabajo

El motor del Observatorio ha superado ejecuciones **simuladas** de DOM JavaScript: inicio con 14 rutas, navegación por las cinco secciones, presentación de cuatro módulos por ruta, registro del progreso, búsqueda «NIS2» y recuentos de 40 herramientas, 33 fuentes y seis noticias. Las pruebas Playwright están escritas pero aún no ejecutadas en navegador Chromium conectado al sitio compilado.
