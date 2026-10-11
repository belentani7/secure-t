import { describe, expect, it } from "vitest";
import {
  XAPI_VERSION,
  XAPI_VERBS,
  buildStatement,
  deterministicUuid,
  iso8601Duration,
  statementsToJsonLd,
  validateStatement,
  type XapiStatement
} from "../src/xapi";

/**
 * xAPI 1.0.3 (ADL · IEEE 9274.1.1-2023).
 *
 * El campus no manda nada a un LRS; construye declaraciones **conformes** para
 * que quien quiera pueda importarlas. Los tests comprueban exactamente los
 * puntos que el estándar marca como obligatorios y el compromiso de anonimato
 * del proyecto (nada de correos ni nombres).
 */

const BASE = "https://belentani7.github.io/secure-t/app";
/** Identificador anónimo de prueba: se genera en ejecución, no vive en el repositorio. */
const TOKEN = crypto.randomUUID();

const declaracion = (extra: Partial<Parameters<typeof buildStatement>[0]> = {}): XapiStatement =>
  buildStatement({
    baseUrl: BASE,
    token: TOKEN,
    locale: "es",
    courseSlug: "ciber-defensiva",
    courseTitle: "Ciberseguridad Defensiva",
    verb: "completed",
    activity: { id: "/programas/ciber-defensiva/semana/1", type: "lesson", name: "Semana 1" },
    result: { completion: true, success: true, duration: "PT1H30M" },
    timestamp: "2026-01-12T19:30:00.000Z",
    grouping: [{ id: `${BASE}/programas/ciber-defensiva`, label: "programa" }],
    ...extra
  });

describe("duraciones ISO 8601", () => {
  it("formatea segundos, minutos y horas como exige el estándar", () => {
    expect(iso8601Duration(0)).toBe("PT0S");
    expect(iso8601Duration(45_000)).toBe("PT45S");
    expect(iso8601Duration(3_600_000)).toBe("PT1H");
    expect(iso8601Duration(5_400_000)).toBe("PT1H30M");
    expect(iso8601Duration(5_460_000)).toBe("PT1H31M");
  });

  it("nunca produce una duración vacía ni negativa", () => {
    expect(iso8601Duration(-5000)).toBe("PT0S");
    expect(iso8601Duration(0.4)).toBe("PT0S");
  });
});

describe("identificadores", () => {
  it("genera UUID con la forma correcta (RFC 9562)", () => {
    expect(deterministicUuid("semana-1")).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("es estable: la misma semilla da el mismo UUID (declaraciones reproducibles)", () => {
    expect(deterministicUuid("semana-1")).toBe(deterministicUuid("semana-1"));
    expect(deterministicUuid("semana-1")).not.toBe(deterministicUuid("semana-2"));
  });
});

describe("declaración conforme", () => {
  it("pasa la validación estructural completa", () => {
    expect(validateStatement(declaracion())).toEqual([]);
  });

  it("usa el IRI del vocabulario de ADL para el verbo y el tipo de actividad", () => {
    const statement = declaracion({ verb: "passed" });
    expect(statement.verb.id).toBe(XAPI_VERBS.passed);
    expect(statement.verb.id).toBe("http://adlnet.gov/expapi/verbs/passed");
    expect(statement.object.definition?.type).toBe("http://adlnet.gov/expapi/activities/lesson");
  });

  it("identifica al estudiante sin revelar quién es", () => {
    const statement = declaracion();
    expect(statement.actor.objectType).toBe("Agent");
    expect(statement.actor.account.name).toBe(`secure-t:${TOKEN}`);
    expect(JSON.stringify(statement)).not.toMatch(/@\w+\.\w+/);
  });

  it("declara la versión del estándar y el agrupador del programa", () => {
    const statement = declaracion();
    expect(statement.version).toBe(XAPI_VERSION);
    expect(statement.context?.contextActivities?.grouping?.[0]?.id).toBe(`${BASE}/programas/ciber-defensiva`);
    expect(statement.context?.contextActivities?.category?.[0]?.id).toContain("cmi5");
  });

  it("la marca de tiempo y el resultado son verificables", () => {
    const statement = declaracion();
    expect(Date.parse(statement.timestamp)).toBe(Date.parse("2026-01-12T19:30:00.000Z"));
    expect(statement.result?.completion).toBe(true);
    expect(statement.result?.duration).toBe("PT1H30M");
  });

  it("el objeto apunta a una URL absoluta del campus", () => {
    const statement = declaracion();
    expect(statement.object.id).toBe(`${BASE}/programas/ciber-defensiva/semana/1`);
    expect(statement.object.definition?.moreInfo).toBe(statement.object.id);
  });
});

describe("rechazo de declaraciones mal formadas", () => {
  it("detecta un identificador que no es UUID", () => {
    expect(validateStatement({ ...declaracion(), id: "1" })).toContain("id: debe ser un UUID");
  });

  it("detecta un actor que no es anónimo o que usa correo", () => {
    const conCorreo = declaracion();
    conCorreo.actor = { objectType: "Agent", account: { homePage: BASE, name: "alguien@ejemplo.org" } };
    expect(validateStatement(conCorreo)).toContain("actor.account.name debe ser anónimo (secure-t:<token>)");
  });

  it("detecta versión, duración y progreso inválidos", () => {
    const mala = declaracion();
    mala.version = "2.0" as typeof XAPI_VERSION;
    mala.result = { duration: "90 minutos", progress: 1.4 };
    const problemas = validateStatement(mala);
    expect(problemas.some((p) => p.startsWith("version"))).toBe(true);
    expect(problemas).toContain("result.duration debe ser una duración ISO 8601");
    expect(problemas).toContain("result.progress debe estar entre 0 y 1");
  });
});

describe("exportación para un LRS propio", () => {
  it("produce JSON-LD con el contexto de cmi5 y todas las declaraciones", () => {
    const json = statementsToJsonLd([declaracion({ verb: "initialized" }), declaracion({ verb: "completed" })]);
    const datos = JSON.parse(json) as { "@context": string; statements: XapiStatement[] };
    expect(datos["@context"]).toContain("cmi5");
    expect(datos.statements).toHaveLength(2);
    expect(json.endsWith("\n")).toBe(true);
  });

  it("el idioma de la etiqueta sigue al del estudiante", () => {
    expect(declaracion({ locale: "ca" }).verb.display).toEqual({ ca: "completà" });
    expect(declaracion({ locale: "pt" }).verb.display).toEqual({ pt: "concluiu" });
  });
});
