/**
 * Contrato de la API del agente (RFC 9457 + comportamiento del motor).
 *
 * Se importa la ruta y se la llama con `Request` estándar: el mismo código que
 * corre en el servidor de Next, sin arrancar Next. Así el contrato de errores
 * no depende de que alguien se acuerde de probarlo en producción.
 */

import { describe, expect, it } from "vitest";
import { GET, POST } from "../apps/web/src/app/api/agent/route";
import { problemBody, problemType } from "../apps/web/src/lib/problem";

const peticion = (cuerpo: string | object | undefined, init: RequestInit = {}) =>
  new Request("https://campus.example/api/agent", {
    method: "POST",
    ...init,
    ...(cuerpo === undefined ? {} : { body: typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo) })
  });

describe("API del agente", () => {
  it("responde con el motor local cuando no hay proveedor configurado", async () => {
    const respuesta = await POST(peticion({ question: "¿Qué es el phishing?", locale: "es" }));
    expect(respuesta.status).toBe(200);
    expect(respuesta.headers.get("content-type")).toContain("application/json");
    expect(respuesta.headers.get("cache-control")).toBe("no-store");
    const cuerpo = (await respuesta.json()) as { answer?: string; engine?: string };
    expect(cuerpo.engine).toBe("local");
    expect(typeof cuerpo.answer).toBe("string");
    expect((cuerpo.answer ?? "").length).toBeGreaterThan(0);
  });

  it("nunca devuelve cookies ni cabeceras de sesión", async () => {
    const respuesta = await POST(peticion({ question: "hola", locale: "pt" }));
    expect(respuesta.headers.get("set-cookie")).toBeNull();
    for (const [clave] of respuesta.headers) expect(clave.toLowerCase()).not.toContain("cookie");
  });

  it("devuelve problem+json con la forma del RFC cuando el cuerpo no es JSON", async () => {
    const respuesta = await POST(peticion("{no-json"));
    expect(respuesta.status).toBe(400);
    expect(respuesta.headers.get("content-type")).toContain("application/problem+json");
    const cuerpo = (await respuesta.json()) as Record<string, unknown>;
    expect(cuerpo.type).toBe(problemType("invalid_json"));
    expect(cuerpo.status).toBe(400);
    expect(typeof cuerpo.title).toBe("string");
    expect(cuerpo.instance).toBe("/api/agent");
  });

  it("rechaza preguntas fuera de tamaño con 413 en vez de recortarlas en silencio", async () => {
    const respuesta = await POST(peticion({ question: "x".repeat(4001), locale: "es" }));
    expect(respuesta.status).toBe(413);
    const cuerpo = (await respuesta.json()) as { status: number; detail: string; type: string };
    expect(cuerpo.status).toBe(413);
    expect(cuerpo.detail).toContain("4001");
    expect(cuerpo.type).toContain("question_too_long");
  });

  it("acepta exactamente 4000 caracteres y un idioma desconocido no rompe la respuesta", async () => {
    const respuesta = await POST(peticion({ question: "a".repeat(4000), locale: "xx" }));
    expect(respuesta.status).toBe(200);
    const cuerpo = (await respuesta.json()) as { answer: string; transport: string };
    expect(typeof cuerpo.answer).toBe("string");
    expect(cuerpo.transport).toBe("server");
  });

  it("la respuesta completa trae auditoría, fuentes y avisos (contrato del agente)", async () => {
    const respuesta = await POST(peticion({ question: "¿Qué es un SOC?", locale: "ca" }));
    const cuerpo = (await respuesta.json()) as {
      agent: string;
      audit: { authorization: string; result: string; action: string; at: string };
      sources: unknown[];
      notices: string[];
    };
    expect(cuerpo.agent).toBeTruthy();
    expect(["allowed", "denied", "human_review"]).toContain(cuerpo.audit.authorization);
    expect(["success", "failure", "blocked"]).toContain(cuerpo.audit.result);
    expect(Number.isNaN(Date.parse(cuerpo.audit.at))).toBe(false);
    expect(Array.isArray(cuerpo.sources)).toBe(true);
    expect(Array.isArray(cuerpo.notices)).toBe(true);
  });

  it("GET no se permite y lo dice con la cabecera Allow", async () => {
    const respuesta = GET();
    expect(respuesta.status).toBe(405);
    expect(respuesta.headers.get("allow")).toBe("POST");
    expect((await respuesta.json()) as { type: string }).toMatchObject({ status: 405 });
  });

  it("el catálogo de problemas cubre todos los códigos con estado coherente", () => {
    for (const [codigo, estado] of [
      ["invalid_json", 400],
      ["question_too_long", 413],
      ["method_not_allowed", 405],
      ["not_found", 404],
      ["internal_error", 500]
    ] as const) {
      const cuerpo = problemBody(codigo);
      expect(cuerpo.status).toBe(estado);
      expect(cuerpo.type).toBe(problemType(codigo));
      expect(cuerpo.title.length).toBeGreaterThan(10);
    }
  });
});
