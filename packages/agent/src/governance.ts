/**
 * Gobernanza de agentes — **fuente única de verdad**.
 *
 * Este módulo nació en `ai/governance.ts` y se traslada aquí para que la web,
 * el servidor opcional y los tests compartan exactamente las mismas reglas.
 * `ai/governance.ts` sigue existiendo y reexporta esto, de modo que ningún
 * consumidor anterior se rompe (contrato P8 / caso crítico C10).
 */

export type AgentId =
  | "tutor"
  | "socratic"
  | "academic"
  | "assessment"
  | "lab"
  | "research"
  | "security"
  | "voice"
  | "orchestrator";

export type Permission =
  | "read_course"
  | "read_own_progress"
  | "create_recommendation"
  | "create_hint"
  | "read_lab"
  | "start_lab"
  | "read_lab_output"
  | "submit_lab"
  | "read_submission"
  | "propose_assessment"
  | "read_approved_sources"
  | "cite_source"
  | "synthesize_consented_text"
  | "route_request";

/** Acciones que ningún agente puede ejecutar, ni con permiso explícito. */
export const denyAll = [
  "modify_identity",
  "delete_student",
  "change_final_grade",
  "issue_credential",
  "access_private_student_data",
  "modify_system_security"
] as const;

export type DeniedAction = (typeof denyAll)[number];

export const agentPermissions: Record<AgentId, Permission[]> = {
  tutor: ["read_course", "read_own_progress", "create_recommendation"],
  socratic: ["read_course", "create_hint"],
  academic: ["read_course", "read_own_progress", "create_recommendation"],
  assessment: ["read_submission", "propose_assessment"],
  lab: ["read_lab", "start_lab", "read_lab_output", "submit_lab"],
  research: ["read_approved_sources", "cite_source"],
  security: ["read_lab", "read_lab_output"],
  voice: ["synthesize_consented_text"],
  orchestrator: ["route_request"]
};

export interface AuthorizationDecision {
  allowed: boolean;
  reason: "globally_denied" | "exam_mode_restricted" | "explicit_permission" | "not_granted" | "out_of_scope";
}

export function authorize(agent: AgentId, permission: string, examMode = false): AuthorizationDecision {
  if ((denyAll as readonly string[]).includes(permission)) return { allowed: false, reason: "globally_denied" };
  if (examMode && ["propose_assessment", "start_lab"].includes(permission)) return { allowed: false, reason: "exam_mode_restricted" };
  const granted = agentPermissions[agent]?.includes(permission as Permission) ?? false;
  return { allowed: granted, reason: granted ? "explicit_permission" : "not_granted" };
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Enrutado por intención en los cuatro idiomas del producto.
 * El comportamiento en español es idéntico al original (los tests lo fijan).
 */
export function routeAgent(message: string): AgentId {
  const text = normalize(message);
  if (/(laborator|lab\b|range|maquina vulnerabl|ctf\b)/.test(text)) return "lab";
  if (/(no me des la respuesta|no me des la solucion|socrat|nao me des a resposta|dont give me the answer|no em donis la resposta)/.test(text)) return "socratic";
  if (/(incidente|alerta|incident|alert|soc\b|siem\b)/.test(text)) return "security";
  if (/(fuente|investiga|font\b|source|research|cita)/.test(text)) return "research";
  if (/(que debo estudiar|ruta|que devo estudar|what should i study|pla d.estudi|curricul|planific)/.test(text)) return "academic";
  if (/(voz|audio|pronunciar|voice|speak|parla)/.test(text)) return "voice";
  return "tutor";
}

/** ¿La petición pide algo que la deny-list prohíbe? Se usa para responder con honestidad. */
export function detectDeniedIntent(message: string): DeniedAction | null {
  const text = normalize(message);
  const patterns: Record<DeniedAction, RegExp> = {
    issue_credential: /(emite|emitas|genera|firma|crea)[a-z ]*(credencial|credential)|issue.*credential/,
    change_final_grade: /(cambia|cambies|sube|modifica)[a-z ]*(nota|calificacion|grade)/,
    delete_student: /(borra|elimina)[a-z ]*(alumno|estudiante|student|cuenta)/,
    modify_identity: /(cambia|modifica|suplanta)[a-z ]*(identidad|identity|usuario)/,
    access_private_student_data: /(datos privados|expediente de otro|other student.s data)/,
    modify_system_security: /(desactiva|quita)[a-z ]*(firewall|antivirus|control de seguridad|security control)/
  };
  for (const [action, pattern] of Object.entries(patterns) as [DeniedAction, RegExp][]) {
    if (pattern.test(text)) return action;
  }
  return null;
}

export const GOVERNANCE_SUMMARY = {
  agents: Object.keys(agentPermissions) as AgentId[],
  denied: denyAll,
  note: "Ningún agente emite credenciales, cambia notas finales ni accede a datos privados de terceros."
} as const;
