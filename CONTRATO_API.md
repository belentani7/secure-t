# CONTRATO_API.md — contratos públicos de secure T

Todo lo que otros programas pueden consumir: el agente, los paquetes de contenido, los módulos del monorepo y el
expediente anónimo. **Regla de oro:** nada de lo aquí descrito se rompe sin una entrada en `CHANGELOG.md`, un ADR
en `docs/decisions/` y un incremento de versión mayor. Lo que el campus clásico promete está además protegido por
`tests/test_campus.py` (117 tests) y **es intocable**.

---

## 1. Agente — `POST /api/agent`

Disponible sólo en el despliegue con servidor Node (el export estático no incluye rutas de servidor; allí el agente
corre entero en el navegador con el mismo motor).

### Petición

```http
POST /api/agent
content-type: application/json
```

```jsonc
{
  "question": "¿Qué es la tríada CIA?",   // obligatorio, 1..800 caracteres tras recorte
  "locale": "es",                          // "pt" | "es" | "en" | "ca" (por defecto "pt")
  "agent": "tutor",                        // opcional; si falta se enruta la pregunta
  "course": "ciber-defensiva",             // opcional; acota la recuperación
  "week": 3,                               // opcional
  "maxSources": 4,                         // opcional, máximo 4
  "examMode": false                        // opcional; bloquea evaluación y laboratorios
}
```

### Respuesta `200`

```jsonc
{
  "answer": "…",
  "agent": "tutor",
  "transport": "server",
  "engine": "local",              // "local" | "ollama" | "openai-compatible" | "guardrail"
  "sources": [
    {
      "id": "ciber-defensiva/week-01",
      "title": "Semana 1 — Fundamentos: tríada CIA y controles",
      "url": "/programas/ciber-defensiva/semana/1",
      "course": "ciber-defensiva",
      "week": 1,
      "kind": "week",
      "quote": "…fragmento literal del material, nunca reescrito…",
      "score": 3.42
    }
  ],
  "followUps": ["…"],
  "notices": ["provider:fallback:timeout"],
  // Herramientas deterministas que el tutor ejecutó (opcional). Sólo lectura:
  // ninguna escribe, publica ni gasta, y ninguna sale del dispositivo.
  "tools": [
    {
      "tool": "resumen_semana",
      "effect": "lectura",
      "summary": "semana 12 de ia-aplicada-segura",
      "items": [
        {
          "label": "Semana 12 · Seguridad de RAG",
          "detail": "fuente: campus/cursos/ia-aplicada-segura/semana-12.md",
          "url": "/pt/programas/ia-aplicada-segura/semana/12",
          "week": 12,
          "course": "ia-aplicada-segura"
        }
      ]
    }
  ],
  "audit": { "authorization": "allowed", "result": "success", "action": "agent.answer", "at": "2026-10-11T20:00:00.000Z" }
}
```

### Herramientas del tutor (`tools`)

Cinco herramientas de **sólo lectura** (`packages/shared/src/tutor-tools.ts`), disparadas por la propia pregunta sin
que el modelo decida nada:

| `tool` | Qué devuelve | Disparadores (extracto) |
|---|---|---|
| `listar_programas` | los cuatro programas del campus con enlace | «qué programas hay», «catálogo» |
| `resumen_semana` | el fragmento de la semana citada, del corpus publicado | «semana 12», «repásame la semana 3» |
| `recomendar_biblioteca` | recursos abiertos ordenados por encaje, con enlace al autor | «recomiéndame un canal», «qué leo» |
| `ruta_itinerario` | itinerario con sus cursos en orden y semanas reales | «por dónde empiezo», «itinerario» |
| `plan_estudio` | las diez franjas del plan de cinco años con su estado real | «plan de cinco años», «qué es el año 3» |

Reglas del contrato: el campo es **opcional** (ausente si ninguna herramienta se dispara); `effect` es siempre
`"lectura"`; `week` se acota a 1–200 y `items` a doce elementos como máximo; y toda herramienta cita material que
existe (nunca inventa identificadores de curso, semana o recurso).

### Códigos y cabeceras

Los errores siguen **RFC 9457** (`application/problem+json`), así que cualquier cliente puede interpretarlos sin
conocer este repositorio:

```json
{
  "type": "https://belentani7.github.io/secure-t/docs/errores/question_too_long",
  "title": "La pregunta supera el tamaño admitido",
  "status": 413,
  "detail": "La pregunta tiene 5120 caracteres y el máximo son 4000.",
  "instance": "/api/agent",
  "hint": "divide la consulta o resume el caso"
}
```

| Código | Cuándo | `type` |
|---|---|---|
| `200` | respuesta normal (incluye rechazos por deny-list, que son 200 con `engine: "guardrail"`) | — |
| `400` | el cuerpo no es JSON | `invalid_json` |
| `405` | `GET /api/agent` (con cabecera `Allow: POST`) | `method_not_allowed` |
| `413` | `question` mayor de 4000 caracteres en bruto | `question_too_long` |

Cabeceras de toda respuesta: `cache-control: no-store`, `x-secure-t-engine: <engine>`; nunca cookies ni sesión.
Implementación: `apps/web/src/lib/problem.ts`, con `problemBody()`/`problemType()` para reutilizar el catálogo.

### Garantías del motor (verificadas por tests)

1. Orden fijo: **validar → deny-list → autorizar → recuperar → redactar → auditar**.
2. La deny-list gana a cualquier permiso; el modo examen bloquea `start_lab` y `propose_assessment`.
3. Sin fuentes por encima del umbral (0.4) el agente declara que no encuentra material, en el idioma del estudiante.
4. Los fragmentos citados son **literales** del campus; el `url` apunta a la ruta web real.
5. Nunca se emiten credenciales, ni se cambian notas, ni se inventan fuentes.
6. La auditoría no contiene datos personales: actor, acción, herramienta, autorización, resultado y fecha.

### Transporte local (sin servidor)

```ts
import { askAgent, createAgentPipeline } from "@secure-t/agent";

const pipeline = createAgentPipeline({ knowledge: pack });   // índice memoizado
const respuesta = await pipeline.ask({ question: "…", locale: "es", course: "ciber-defensiva" });
```

Es el modo por defecto de `apps/web`: el paquete de conocimiento viaja con la página y nada sale del dispositivo.

---

## 2. Paquetes de contenido (generados, no escritos a mano)

`pnpm content` lee `campus/` y `conceptos/conceptos.json` y emite tres ficheros en `apps/web/public/content/`:

### `catalog.json`

```jsonc
{
  "version": 1,
  "generatedAt": "2026-10-11T...",
  "sourceDigest": "bb57edf597587508…",   // SHA-256 del material de origen
  "locale": "es",
  "courses": [ { "slug": "…", "title": "…", "summary": "…", "hours": 120,
                 "weeks": [ { "index": 1, "title": "…", "sections": ["…"], "words": 550, "hash": "…" } ],
                 "quizCount": 6, "artifacts": [ { "kind": "lab", "title": "Laboratorio", "words": 191 } ] } ],
  "totals": { "courses": 4, "weeks": 80, "words": 60111, "quizItems": 24 }
}
```

### `knowledge.json`

```jsonc
{
  "version": 1,
  "counts": { "courses": 4, "weeks": 80, "chunks": 151, "words": 28904 },
  "chunks": [ { "id": "ciber-defensiva/week-01", "course": "…", "courseTitle": "…", "week": 1,
                "kind": "week", "title": "…", "text": "…", "source": "campus/cursos/…", "url": "/programas/…" } ]
}
```

### `digest.txt`

`sourceDigest` en crudo. Cambia el material → cambia el digest → el workflow avisa. Es la garantía de **fuente
única**: la web no puede desincronizarse del campus porque se regenera de él.

---

## 3. Paquete `@secure-t/shared`

| Export | Contrato |
|---|---|
| `LOCALES`, `translate`, `translator`, `translationKeys`, `auditDictionaries` | 4 idiomas; los tests exigen paridad exacta de claves |
| `CALENDARS`, `findCalendar`, `holidaysBetween` | 15 calendarios con `source`, `note`, `scope`, `since` |
| `buildStudyPlan`, `buildProgramPlan`, `studyPlanToIcs`, `programPlanToIcs` | plan determinista + `.ics` RFC 5545 |
| `renderMarkdown`, `splitSections`, `toPlainText`, `safeUrl` | HTML seguro por construcción: se escapa y luego se emiten sólo etiquetas permitidas |
| `buildIndex`, `search`, `highlight`, `excerptFor` | BM25 propio, sin dependencias |
| `sealProgress`, `verifyProgress`, `parseProgress`, `completionOf`, `credentialText` | expediente anónimo con sello SHA-256 |
| `knowledgeToSearchDocs`, `truncate`, `sha256Hex`, `verifyPack` | puente contenido ↔ búsqueda |

Ejemplo de plan (salida estable, ordenada):

```ts
const plan = buildStudyPlan({ courseSlug: "ciber-defensiva", courseTitle: "…", weeks: 20,
  startDate: "2026-01-07", calendarCode: "ES", region: "ES-CT", locale: "es",
  sessionsPerWeek: 3, minutesPerSession: 90, sessionStartTime: "19:00" });
// → 20 semanas, fin 2026-05-24, 89 h, ninguna sesión en festivo, ICS de 61 eventos
```

---

## 4. Paquete `@secure-t/agent`

| Export | Contrato |
|---|---|
| `askAgent(request, context)` | punto de entrada único; aplica el orden completo del §1 |
| `createAgentPipeline(context)` | reutiliza el índice entre peticiones |
| `PERSONAS`, `LECTURERS`, `lecturerFor`, `voiceAssetPath`, `voiceFallbackText` | 9 agentes y 4 docentes; guiones en 4 idiomas |
| `authorize`, `routeAgent`, `detectDeniedIntent`, `AGENT_MESSAGES`, `composeLocalAnswer` | gobernanza y redacción local |
| `askProvider`, `providerFromEnv`, `isHostAllowed` | transporte opcional con allowlist (guardia anti-SSRF) |
| `createAuditEvent`, `sanitizeAuditEvent` | auditoría sin metadatos sensibles |

Variables de entorno reconocidas (todas opcionales):

```
SECURE_T_LLM_URL=https://…        # sin esto no hay red: todo local
SECURE_T_LLM_MODEL=…
SECURE_T_LLM_KIND=ollama|openai-compatible
SECURE_T_LLM_ALLOW_HOSTS=host1,host2
SECURE_T_LLM_KEY=…                # nunca se registra en logs ni en la auditoría
```

---

## 5. Expediente y credencial

```ts
const firmado = await sealProgress(record);      // { …record, seal: "<sha256 hex>" }
await verifyProgress(firmado);                   // true | false (detecta manipulación)
credentialText({ token, slug, courseTitle, weeksTotal, issuedAt, locale });
```

- El sello se calcula sobre el JSON **canónico** (claves ordenadas) para que el mismo expediente dé siempre el
  mismo hash, en cualquier navegador.
- La credencial se emite y verifica en el dispositivo. Registro público y cadena de bloques: `PLANNED`
  (documentado en `campus/credencial.html` y en la propia credencial).

---

## 6. Artefactos públicos del sitio (estáticos, verificables)

| Ruta | Contenido | Contrato |
|---|---|---|
| `/sbom.cdx.json` | SBOM **CycloneDX 1.5** de las 790 dependencias del lockfile | hash SHA-512 por componente, licencias declaradas o `NOASSERTION`, serial derivado del contenido, salida reproducible (`pnpm sbom`) |
| `/.well-known/security.txt` | canal de reporte de vulnerabilidades | **RFC 9116**: `Contact`, `Expires` (a menos de un año), `Canonical`, `Preferred-Languages`, `Policy`; sin `Encryption` si la clave no está publicada |
| `/packages/` | 21 paquetes interoperables (EPUB, SCORM 2004, Common Cartridge 1.3, QTI 1.2, xAPI) + `index.json` | tamaños y **SHA-256** por fichero; `standards` declara la versión de cada norma |
| `/plan/` | programas imprimibles (HTML A4, LaTeX) + `indice.json` | autocontenidos, deterministas y con huella del material |
| `/badges/<curso>.svg` | emblemas de los cuatro programas | SVG accesible (`role="img"`, `title`, `desc`) |
| `/privacidad`, `/estandares` | aviso RGPD y tabla de conformidad, en PT/ES/EN/CA | `tests/contracts.test.ts` comprueba que cada evidencia citada existe |

Cabeceras de seguridad (una sola política en `apps/web/src/lib/security-headers.ts`): CSP cerrada por defecto
(`default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`), `Referrer-Policy`, `X-Content-Type-Options`,
`Permissions-Policy`, `Strict-Transport-Security` y las de aislamiento (`COOP`/`CORP`). En el despliegue estático,
donde el alojamiento no permite cabeceras propias, la política viaja como `<meta http-equiv>` (ver ADR-0011).

## 7. Compatibilidad con el contrato clásico

`campus/`, `index.html`, `ui/`, `public/` y los workflows no cambian de forma incompatible: `tests/test_campus.py`
los vigila y forma parte del contrato. Las rutas nuevas viven bajo `/app/` (AURUM) y nunca pisan rutas del campus
clásico (`/campus/…`, `/ui/…`).
