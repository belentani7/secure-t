// Orquestador 6 agentes (spec élite) sobre gobernanza real existente.
// No reemplaza ai/governance.ts: lo reutiliza (routeAgent + authorize + deny-list).
// Hoy: safe-fallback + intento Ollama si OLLAMA_URL responde. Sin secretos en repo.
import { authorize, routeAgent, type AgentId } from "../../ai/governance.js";
import { ollamaProvider } from "../../ai/model-provider.js";

export type EliteAgent = "tutor" | "evaluator" | "content" | "moderator" | "risk" | "coach";

const MAP: Record<EliteAgent, AgentId> = {
  tutor: "tutor",
  evaluator: "assessment", // solo PROPONE nota; deny-list impide change_final_grade
  content: "academic", // solo borradores REVIEW, nunca publica solo
  moderator: "security",
  risk: "competency",
  coach: "academic",
};

const INTENT: Array<[RegExp, EliteAgent]> = [
  [/califica|grade|evalúa|rubric/i, "evaluator"],
  [/redacta|lesson|lección|curso|blueprint/i, "content"],
  [/report|tóxico|abuso|modera/i, "moderator"],
  [/abandono|riesgo|retención|extrañamos/i, "risk"],
  [/carrera|empleo|coach|ruta.*estudio/i, "coach"],
];

const PERM: Record<EliteAgent, string> = {
  tutor: "create_hint",
  evaluator: "propose_assessment",
  content: "create_recommendation",
  moderator: "read_lab_output",
  risk: "read_competency",
  coach: "create_recommendation",
};

export function pickAgent(message: string): EliteAgent {
  const hit = INTENT.find(([re]) => re.test(message));
  if (hit) return hit[1];
  // fallback a router real: mapea AgentId → EliteAgent cuando coincide
  const real = routeAgent(message);
  const back = (Object.entries(MAP) as Array<[EliteAgent, AgentId]>).find(([, v]) => v === real);
  return back ? back[0] : "tutor";
}

function guard(message: string): string | null {
  const t = message.toLowerCase();
  if (/contraseña|password.*(dame|dime)|datos personales.*(dame|extrae)/.test(t))
    return "No puedo entregar credenciales ni datos personales. Te ayudo a practicar de forma segura.";
  if (/malware.*(propaga|distribuye)|ransomware.*(despliega|lanza)/.test(t))
    return "Eso es daño real y está denegado. Te propongo el lab aislado equivalente con objetivos defensivos.";
  return null;
}

export async function orchestrate(message: string, opts: { examMode?: boolean; locale?: string } = {}) {
  const blocked = guard(message);
  if (blocked) return { agent: "guardrail" as const, reply: blocked, model: "guardrail" };
  const elite = pickAgent(message);
  const real = MAP[elite];
  const auth = authorize(real, PERM[elite], opts.examMode ?? false);
  if (!auth.allowed)
    return { agent: elite, reply: "Acción no autorizada por gobernanza (" + auth.reason + "). Te ofrezco una alternativa segura.", model: "governance" };
  // Intento Ollama local; si falla, safe-fallback (nunca rompe /api/ai/route)
  try {
    const p = ollamaProvider();
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), 8000);
    const out = await p.chat(
      [
        { role: "system", content: "Eres tutor Secure-T (ES/PT/EN). Socrático, seguro, verificable. Separa evidencia, hipótesis y siguiente acción." },
        { role: "user", content: message },
      ],
      ctl.signal,
    );
    clearTimeout(to);
    return { agent: elite, reply: out.text, model: out.model };
  } catch {
    return {
      agent: elite,
      reply: "Separa evidencia, hipótesis y siguiente acción. Puedo ayudarte a convertirlo en una práctica segura y verificable.",
      model: "safe-fallback",
    };
  }
}
