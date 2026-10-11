/**
 * xAPI (Experience API) 1.0.3 — ADL, normalizado como IEEE 9274.1.1-2023.
 *
 * El campus **no envía nada a ningún LRS**: eso rompería la promesa de que el
 * progreso vive en el dispositivo y nadie más lo lee. Lo que sí hace es hablar
 * el idioma del estándar: construye declaraciones conformes, las guarda en el
 * dispositivo y las exporta para que un centro pueda importarlas en su LRS.
 *
 * Conformidad aplicada:
 *   · `id` es un UUID (RFC 9562).
 *   · `actor` es un `Agent` con `account` (nunca correo: anonimato por diseño).
 *   · `verb.id` es un IRI del vocabulario de ADL.
 *   · `object.id` es un IRI del propio campus con `objectType: Activity`.
 *   · `result.duration` y `timestamp` en ISO 8601; `version: "1.0.3"`.
 *   · `authority` opcional con la cuenta del instituto.
 */

export const XAPI_VERSION = "1.0.3" as const;

export const XAPI_VERBS = {
  initialized: "http://adlnet.gov/expapi/verbs/initialized",
  progressed: "http://adlnet.gov/expapi/verbs/progressed",
  completed: "http://adlnet.gov/expapi/verbs/completed",
  passed: "http://adlnet.gov/expapi/verbs/passed",
  failed: "http://adlnet.gov/expapi/verbs/failed",
  attempted: "http://adlnet.gov/expapi/verbs/attempted",
  answered: "http://adlnet.gov/expapi/verbs/answered",
  earned: "http://adlnet.gov/expapi/verbs/earned",
  experienced: "http://adlnet.gov/expapi/verbs/experienced"
} as const;

export type XapiVerb = keyof typeof XAPI_VERBS;

export const XAPI_ACTIVITY_TYPES = {
  course: "http://adlnet.gov/expapi/activities/course",
  lesson: "http://adlnet.gov/expapi/activities/lesson",
  assessment: "http://adlnet.gov/expapi/activities/assessment",
  question: "http://adlnet.gov/expapi/activities/cmi.interaction",
  badge: "http://activitystrea.ms/schema/1.0/badge"
} as const;

export interface XapiStatement {
  id: string;
  actor: {
    objectType: "Agent";
    account: { homePage: string; name: string };
    name?: string;
  };
  verb: { id: string; display: Record<string, string> };
  object: {
    id: string;
    objectType: "Activity";
    definition?: {
      type?: string;
      name?: Record<string, string>;
      description?: Record<string, string>;
      moreInfo?: string;
      extensions?: Record<string, unknown>;
    };
  };
  result?: {
    completion?: boolean;
    success?: boolean;
    progress?: number;
    score?: { scaled?: number; raw?: number; min?: number; max?: number };
    duration?: string;
    response?: string;
  };
  context?: {
    registration?: string;
    contextActivities?: {
      parent?: { id: string }[];
      grouping?: { id: string }[];
      category?: { id: string }[];
    };
    language?: string;
    extensions?: Record<string, unknown>;
  };
  timestamp: string;
  version: typeof XAPI_VERSION;
  authority?: { objectType: "Agent"; account: { homePage: string; name: string } };
}

/** Duración ISO 8601 (RFC 3339 §5.6) a partir de milisegundos. */
export function iso8601Duration(milliseconds: number): string {
  const total = Math.max(0, Math.round(milliseconds / 1000));
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const segundos = total % 60;
  let salida = "PT";
  if (horas) salida += `${horas}H`;
  if (minutos) salida += `${minutos}M`;
  if (segundos || (!horas && !minutos)) salida += `${segundos}S`;
  return salida;
}

/** UUID derivado de una semilla: declaraciones**reproducibles** y sin aleatoriedad. */
export function deterministicUuid(seed: string): string {
  // FNV-1a de 128 bits repartido en 16 bytes + bits de versión 5.
  const bytes = new Uint8Array(16);
  let hash = 0x811c9dc5;
  for (let index = 0; index < 64; index += 1) {
    const code = seed.charCodeAt(index % seed.length) + index * 131;
    hash ^= code & 0xff;
    hash = Math.imul(hash, 0x01000193) >>> 0;
    bytes[index % 16] = (bytes[index % 16]! ^ (hash & 0xff)) & 0xff;
  }
  bytes[6] = (bytes[6]! & 0x0f) | 0x50;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export interface StatementInput {
  baseUrl: string;
  token: string;
  locale: string;
  courseSlug: string;
  courseTitle: string;
  verb: XapiVerb;
  activity: { id: string; type?: string; name?: string; description?: string };
  result?: XapiStatement["result"];
  timestamp: string;
  /** Agrupador: el programa y el campus. */
  grouping: { id: string; label: string }[];
  progress?: number;
}

export function buildStatement(input: StatementInput): XapiStatement {
  const base = input.baseUrl.replace(/\/$/, "");
  return {
    id: deterministicUuid(`${input.token}:${input.courseSlug}:${input.verb}:${input.timestamp}:${input.activity.id}`),
    actor: {
      objectType: "Agent",
      account: { homePage: `${base}/`, name: `secure-t:${input.token}` },
      name: "Estudiante anónimo"
    },
    verb: { id: XAPI_VERBS[input.verb], display: { [input.locale]: LABELS[input.locale]?.[input.verb] ?? input.verb } },
    object: {
      id: `${base}${input.activity.id.startsWith("/") ? "" : "/"}${input.activity.id}`,
      objectType: "Activity",
      definition: {
        ...(input.activity.type ? { type: XAPI_ACTIVITY_TYPES[input.activity.type as keyof typeof XAPI_ACTIVITY_TYPES] ?? input.activity.type } : {}),
        ...(input.activity.name ? { name: { [input.locale]: input.activity.name } } : {}),
        ...(input.activity.description ? { description: { [input.locale]: input.activity.description } } : {}),
        moreInfo: `${base}${input.activity.id.startsWith("/") ? "" : "/"}${input.activity.id}`
      }
    },
    ...(input.result ? { result: input.result } : {}),
    context: {
      registration: deterministicUuid(`${input.token}:${input.courseSlug}`),
      contextActivities: {
        grouping: input.grouping.map((grupo) => ({ id: grupo.id })),
        category: [{ id: "https://w3id.org/xapi/cmi5/context/categories/cmi5" }]
      },
      language: input.locale,
      ...(input.progress !== undefined ? { extensions: { "https://secure-t.dev/xapi/progress": input.progress } } : {})
    },
    timestamp: input.timestamp,
    version: XAPI_VERSION,
    authority: { objectType: "Agent", account: { homePage: `${base}/`, name: "secure-t:campus" } }
  };
}

const LABELS: Record<string, Partial<Record<XapiVerb, string>>> = {
  pt: { initialized: "iniciou", progressed: "avançou", completed: "concluiu", passed: "superou", failed: "não superou", attempted: "tentou", answered: "respondeu", earned: "obteve", experienced: "experimentou" },
  es: { initialized: "inició", progressed: "avanzó", completed: "completó", passed: "superó", failed: "no superó", attempted: "intentó", answered: "respondió", earned: "obtuvo", experienced: "experimentó" },
  en: { initialized: "initialized", progressed: "progressed", completed: "completed", passed: "passed", failed: "failed", attempted: "attempted", answered: "answered", earned: "earned", experienced: "experienced" },
  ca: { initialized: "inicià", progressed: "avançà", completed: "completà", passed: "superà", failed: "no superà", attempted: "intentà", answered: "respongué", earned: "obtingué", experienced: "experimentà" }
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DURACION = /^P(?!$)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+(\.\d+)?S)?)?$/;

/** Comprueba la conformidad estructural de una declaración (lo que exige el estándar). */
export function validateStatement(statement: Partial<XapiStatement>): string[] {
  const problemas: string[] = [];
  if (!statement.id || !UUID.test(statement.id)) problemas.push("id: debe ser un UUID");
  if (statement.actor?.objectType !== "Agent") problemas.push("actor.objectType debe ser Agent");
  if (!statement.actor?.account?.homePage || !statement.actor?.account?.name) problemas.push("actor.account necesita homePage y name");
  if (!statement.actor?.account?.name?.startsWith("secure-t:")) problemas.push("actor.account.name debe ser anónimo (secure-t:<token>)");
  if (!statement.verb?.id?.startsWith("http")) problemas.push("verb.id debe ser un IRI");
  if (!statement.object?.id || !statement.object?.id.startsWith("http")) problemas.push("object.id debe ser un IRI");
  if (statement.object?.objectType !== "Activity") problemas.push("object.objectType debe ser Activity");
  if (!statement.timestamp || Number.isNaN(Date.parse(statement.timestamp))) problemas.push("timestamp debe ser ISO 8601");
  if (statement.version !== XAPI_VERSION) problemas.push(`version debe ser ${XAPI_VERSION}`);
  if (statement.result?.duration && !DURACION.test(statement.result.duration)) problemas.push("result.duration debe ser una duración ISO 8601");
  if (statement.result?.progress !== undefined && (statement.result.progress < 0 || statement.result.progress > 1)) {
    problemas.push("result.progress debe estar entre 0 y 1");
  }
  return problemas;
}

/** Serializa declaraciones en JSON-LD listo para importar en un LRS. */
export function statementsToJsonLd(statements: XapiStatement[]): string {
  return `${JSON.stringify({ "@context": "https://w3id.org/xapi/recipes/context/cmi5.jsonld", statements }, null, 2)}\n`;
}
