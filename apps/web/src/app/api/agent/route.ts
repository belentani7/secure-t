import { readFileSync } from "node:fs";
import { join } from "node:path";
import { askAgent, providerFromEnv, type AgentContext, type AgentRequest } from "@secure-t/agent";
import type { KnowledgePack } from "@secure-t/shared";
import { jsonResponse, problem } from "@/lib/problem";

/**
 * Endpoint opcional del agente (transporte `server`).
 *
 * Existe para despliegues con Node detrás de un proxy: el mismo motor, la misma
 * auditoría y la misma deny-list que corre en el navegador. Se activa sólo si
 * `SECURE_T_LLM_URL` está configurado y con hosts en `SECURE_T_LLM_ALLOW_HOSTS`;
 * sin esa configuración responde con el motor local, que no necesita red.
 *
 * La exportación estática del sitio **no incluye** esta ruta: en ese modo el
 * agente funciona entero en el dispositivo (ver ADR de transportes).
 */
export const dynamic = "force-dynamic";

let pack: KnowledgePack | null = null;

function knowledge(): KnowledgePack {
  if (pack) return pack;
  const candidates = [
    join(process.cwd(), "public", "content", "knowledge.json"),
    join(process.cwd(), "apps", "web", "public", "content", "knowledge.json")
  ];
  for (const candidate of candidates) {
    try {
      // El índice se lee una vez por proceso; se marca la ruta para que el
      // empaquetador no arrastre todo el repositorio al desplegar.
      pack = JSON.parse(readFileSync(/* turbopackIgnore: true */ candidate, "utf8")) as KnowledgePack;
      return pack;
    } catch {
      continue;
    }
  }
  throw new Error("knowledge.json no encontrado: ejecuta «pnpm content»");
}

export async function POST(httpRequest: Request) {
  let body: Partial<AgentRequest>;
  try {
    body = (await httpRequest.json()) as Partial<AgentRequest>;
  } catch {
    return problem("invalid_json", { instance: "/api/agent", hint: "el cuerpo debe ser JSON con {question, locale}" });
  }

  const question = typeof body.question === "string" ? body.question : "";
  if (question.length > 4000) {
    return problem("question_too_long", {
      instance: "/api/agent",
      detail: `La pregunta tiene ${question.length} caracteres y el máximo son 4000.`,
      hint: "divide la consulta o resume el caso"
    });
  }
  const locale = body.locale === "es" || body.locale === "en" || body.locale === "ca" ? body.locale : "pt";

  const context: AgentContext = {
    knowledge: knowledge(),
    provider: providerFromEnv(process.env),
    transport: "server"
  };

  const agentRequest: AgentRequest = {
    question,
    locale,
    ...(body.agent ? { agent: body.agent } : {}),
    ...(body.course ? { course: body.course } : {}),
    ...(typeof body.week === "number" ? { week: body.week } : {}),
    ...(body.examMode ? { examMode: true } : {})
  };

  const response = await askAgent(agentRequest, context);
  return jsonResponse(response, {
    headers: {
      // Sin cookies ni datos personales: nada que compartir entre peticiones.
      "x-secure-t-engine": response.engine
    }
  });
}

export function GET() {
  return problem("method_not_allowed", {
    instance: "/api/agent",
    hint: "usa POST con {question, locale}",
    headers: { allow: "POST" }
  });
}
