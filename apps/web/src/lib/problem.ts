/**
 * Respuestas de error según **RFC 9457 (Problem Details for HTTP APIs)**.
 *
 * Motivo de aplicar la norma: una API que devuelve `{"error": "..."}` obliga a
 * cada cliente a adivinar la forma; `application/problem+json` es un estándar
 * con campos con significado fijo (`type`, `title`, `status`, `detail`,
 * `instance`), así que cualquier herramienta —incluido un futuro LTI o un
 * cliente generado— puede interpretarla sin leer nuestro código.
 *
 * Se usa `Response` estándar (Web API) en lugar de utilidades del framework: la
 * misma función vale en el servidor de Next, en un worker y en un test.
 */

export type ProblemCode =
  | "invalid_json"
  | "question_too_long"
  | "method_not_allowed"
  | "not_found"
  | "internal_error";

interface ProblemDefinition {
  status: number;
  title: string;
}

const CATALOGO: Record<ProblemCode, ProblemDefinition> = {
  invalid_json: { status: 400, title: "El cuerpo de la petición no es JSON válido" },
  question_too_long: { status: 413, title: "La pregunta supera el tamaño admitido" },
  method_not_allowed: { status: 405, title: "Método no permitido en este recurso" },
  not_found: { status: 404, title: "Recurso no encontrado" },
  internal_error: { status: 500, title: "Error interno del agente" }
};

/** URI de la documentación del código de problema (base estable del contrato). */
export function problemType(code: ProblemCode): string {
  return `https://belentani7.github.io/secure-t/docs/errores/${code}`;
}

export interface ProblemBody {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  /** Extensión: ayuda concreta, además del mensaje normalizado. */
  hint?: string;
}

export function problemBody(code: ProblemCode, options: { detail?: string; instance?: string; hint?: string } = {}): ProblemBody {
  const definicion = CATALOGO[code];
  return {
    type: problemType(code),
    title: definicion.title,
    status: definicion.status,
    ...(options.detail ? { detail: options.detail } : {}),
    ...(options.instance ? { instance: options.instance } : {}),
    ...(options.hint ? { hint: options.hint } : {})
  };
}

/** Respuesta `application/problem+json` lista para devolver desde una ruta. */
export function problem(
  code: ProblemCode,
  options: { detail?: string; instance?: string; hint?: string; headers?: Record<string, string> } = {}
): Response {
  const cuerpo = problemBody(code, options);
  return new Response(JSON.stringify(cuerpo), {
    status: cuerpo.status,
    headers: {
      "content-type": "application/problem+json; charset=utf-8",
      "cache-control": "no-store",
      ...options.headers
    }
  });
}

/** Respuesta JSON de éxito, con el mismo criterio de `no-store` y charset. */
export function jsonResponse<T>(data: T, init: { status?: number; headers?: Record<string, string> } = {}): Response {
  return new Response(JSON.stringify(data), {
    status: init.status ?? 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...init.headers
    }
  });
}
