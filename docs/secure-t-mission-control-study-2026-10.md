# Secure T — estudio técnico y educativo aplicado a Mission Control

**Fecha de revisión:** 2026-10-24. **Repositorio canónico:** `belentani7/secure-t`. **Destinatarios:** estudiantes y docentes de formación introductoria en SOC, IA segura, cloud y privacidad. **Nivel de madurez:** funcionalidad implementada y pruebas de lógica simuladas; despliegue público y recorrido Chromium todavía no certificados.

## 1. Punto de partida y hallazgos

- El repositorio ya contiene un campus estático, un itinerario de cuatro programas de veinte semanas y un `campus/workstation/` funcional con terminal controlada, seis registros sintéticos, cuaderno y caché offline.
- El constructor real `scripts/build_site.py` trabaja sobre el campus estático. No debe confundirse con la SPA Vite del repositorio: desplegar el proyecto equivocado puede dejar invisible el laboratorio.
- Los eventos educativos usan direcciones reservadas para documentación y dominios de ejemplo. No necesitan tráfico real, permisos externos, cuentas ni credenciales.
- La navegación principal admitía mejoras: la estación SOC inicial necesitaba un entrenamiento secuencial explícito con razonamiento, retroalimentación y transferencia al cuaderno.
- Los cuestionarios estáticos por sí solos no constituyen evidencia suficiente de competencias profesionales: no hay verificación de identidad, control de acceso ni corrección docente.
- El almacenamiento local es apropiado para **prácticas sin datos sensibles**, pero no puede servir como autenticación ni como expediente oficial.

## 2. Solución construida (v3)

| Área | Implementación comprobable | Archivo |
| --- | --- | --- |
| Investigación | Seis escenarios autocontenidos, cada uno con tres señales, objetivo y nivel de prioridad | `campus/workstation/mission-data.js` |
| Decisiones | Cuatro preguntas de tres alternativas por escenario; fallo explicado y reintento; avance solo tras respuesta acertada | `mission.js`, `mission.html` |
| Transferencia | Cuaderno por caso con hechos, incertidumbres y verificación; confirmación de alcance responsable | `mission.js`, `mission.html` |
| Memoria | 48 tarjetas de recuerdo activo (8 por tema); clasificación 1–4; agenda por día UTC, hasta 365 días | `mission-data.js`, `mission.js` |
| Integridad | Estado versionado, listas permitidas, controles de longitud, validación de importación, exportación JSON | `mission.js` |
| Seguridad | CSP `default-src 'none'`, `connect-src 'none'`, `form-action 'none'`; sin peticiones de fondo, código remoto ni shell | `mission.html`, `mission.js` |
| Accesibilidad | Idioma, etiquetas de formulario, estados anunciados, foco visible, componentes con teclado, reduced motion | `mission.html`, `mission.css` |
| Integración | Enlaces desde PC, inicio del campus y academia; sitemap y cache offline v4 | `campus/`, `campus/sw.js`, `public/sitemap.xml` |
| Pruebas | Contratos de datos, máquina de estados simulada, caso completo, cuaderno y repetición; recorrido Playwright preparado | `tests/mission-control.test.cjs`, `tests/browser-mission.cjs` |

**Totales exactos de este módulo:** 6 escenarios, 24 puntos de decisión, 48 tarjetas, 6 cuadernos potenciales. Los datos pertenecen al entorno ficticio `SecureTWorkstationCases` y no son incidentes reales.

## 3. Decisiones pedagógicas y referencias

### Respuesta a incidentes — NIST

Se enseña a separar observaciones, incertidumbre, riesgo y respuesta proporcional. El NIST SP 800-61 Rev. 3, publicado en abril de 2025, integra la respuesta a incidentes en la gestión del riesgo y el marco CSF 2.0. Un registro anómalo no debe traducirse automáticamente a compromiso probado.

Referencia: https://csrc.nist.gov/pubs/sp/800/61/r3/final

### IA segura — OWASP

El bloque de IA distingue datos recuperados no confiables de instrucciones privilegiadas, y enseña que los permisos de herramientas se aplican fuera del modelo. Es un ensayo de inyección indirecta, **no** una plataforma de ataque.

Referencia: https://genai.owasp.org/llmrisk/llm01-prompt-injection/

### Protección de datos — RGPD

La misión sobre conservación excesiva introduce finalidad, minimización y limitación de retención sin inducir borrados no autorizados. Ningún supuesto del escenario equivale a una determinación jurídica.

Referencia: https://eur-lex.europa.eu/eli/reg/2016/679/oj

### Recuerdo activo y práctica espaciada

Las tarjetas invitan a formular una respuesta mental antes de mostrarla. La combinación de recuperación y práctica distribuida tiene apoyo en la investigación educativa, pero este algoritmo de cuatro niveles es una implementación formativa sencilla, **no** un método validado clínicamente ni un estimador de conocimiento real.

Referencia: https://doi.org/10.1038/s44159-022-00089-1

### Accesibilidad y cliente web

La interfaz se alinea con criterios aplicables de WCAG 2.2 sobre teclado, foco, etiquetas y errores en lenguaje comprensible. La presencia de estas técnicas **no equivale** a una auditoría WCAG completa.

Referencias: https://www.w3.org/TR/WCAG22/ ; https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html

## 4. Modelo de amenaza

**Datos:** únicamente contenido sintético del banco y las reflexiones que escriba el alumnado. Se indica explícitamente que no se introduzcan nombres, contraseñas, IP reales ni secretos.

**Entradas adversas:** el JSON de importación se trata como no confiable. Se limita tamaño, se exige esquema, se reconstruyen seis entradas autorizadas y 48 identificadores de tarjeta, se restringen rangos y se descartan campos adicionales. Las anotaciones se representan con `textContent`, no como HTML.

**Almacenamiento:** `localStorage` no está cifrado, es legible por scripts del mismo origen y modificable por usuarios con acceso al navegador. Su uso se limita a prácticas sin datos sensibles. No aporta autoridad, seguridad de credenciales ni protección frente a acceso físico al dispositivo.

**Red:** el módulo no realiza `fetch`, peticiones AJAX ni web sockets; solo carga sus cuatro ficheros locales, además de hipervínculos explícitos a fuentes externas cuando el alumnado los pulsa. No hay servicios en segundo plano del módulo.

**Alcance:** ninguna operación desde el navegador accede a recursos externos de estudiantes o instituciones.

## 5. Evidencia de comprobación

1. **Lógica ejecutada en entorno JS simulado:** carga de los seis casos, generación de decisiones, una secuencia completa de 4/4, escritura de tres secciones del cuaderno y registro de 1/6 misiones, repaso de una tarjeta y cambio del siguiente vencimiento.
2. **Sintaxis JS:** analizada mediante `new Function` sobre los dos scripts publicados de datos y motor.
3. **Prueba Node añadida al repositorio:** ejecuta contratos de datos, estados, reintentos, contenido y planificador (requiere runner con Node).
4. **Prueba Playwright añadida:** valida navegador real, descarga, persistencia, modo offline, ancho móvil y errores JS.
5. **CI de GitHub:** los workflows de este repositorio aparecen fallidos en aproximadamente dos segundos **sin pasos de job ejecutados**; no existe evidencia para afirmar que falló el código del módulo.
6. **Vercel:** el intento de publicar una vista previa en el proyecto existente devolvió **HTTP 402, cuota diaria `api-deployments-free-per-day` agotada**. Por tanto, no existe una URL nueva desplegada certificada.

## 6. Brechas reales y siguientes gates de calidad

- Ejecutar `python -m pytest -q tests/`, `node --test tests/mission-control.test.cjs` y `python scripts/build_site.py` en checkout real; todos deben terminar en código cero.
- Ejecutar `node tests/browser-mission.cjs` con Playwright: una prueba Chromium real de teclado, offline, formulario, importación y móvil; revisar capturas y trazas ante fallos.
- Corregir disponibilidad del runner GitHub Actions sin suponer que el código causa fallos anteriores al arranque.
- Validar destino de Vercel: el proyecto histórico usa Vite pero el campus de producción se construye por Python. No modificar la producción a ciegas.
- Probar manualmente contrastes, lector de pantalla y tamaños 320–1920 px, y aplicar una auditoría de accesibilidad automatizada y manual.
- Introducir revisión por docentes, ejercicios abiertos con rúbricas y consenso editorial antes de reclamar nivel profesional certificado.
- Si en el futuro se admiten cuentas o datos personales, migrar el cuaderno a infraestructura con consentimiento, cifrado, retención y control de acceso: nunca almacenar credenciales en `localStorage`.

## 7. Comandos para reproducir

```sh
node --test tests/mission-control.test.cjs
python -m pytest -q tests/
python scripts/build_site.py
# El servidor local de pruebas CI debe servir site-dist en :8765
PLAYWRIGHT_MODULE=... node tests/browser-mission.cjs
```

**Criterio de entrega:** no considerar publicado hasta ver una URL servida, ejecutar los recorridos reales y comprobar los enlaces, el caché, el cuaderno y el repaso en producción.
