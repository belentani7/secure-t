import type { Locale, ToolResult } from "@secure-t/shared";
import type { AgentId } from "./governance";

/**
 * Contrato del agente: el mismo objeto viaja por el transporte local
 * (sin red, el que funciona offline) y por el servidor opcional
 * (`POST /api/agent`). Ver `CONTRATO_API.md`.
 */

export type AgentTransport = "local" | "server";

export interface AgentRequest {
  /** Pregunta del estudiante. Se recorta en el límite `maxQuestionChars`. */
  question: string;
  /** Agente elegido; si falta, se enruta con `routeAgent`. */
  agent?: AgentId;
  /** Curso sobre el que se pregunta, para acotar la recuperación. */
  course?: string;
  /** Semana concreta, si el estudiante está dentro de una. */
  week?: number;
  locale: Locale;
  maxSources?: number;
  /** Modo examen: el agente no propone evaluación ni lanza laboratorios. */
  examMode?: boolean;
}

export interface AgentSource {
  id: string;
  title: string;
  url: string;
  course: string;
  week?: number;
  kind: string;
  /** Fragmento **literal** del material, nunca reescrito. */
  quote: string;
  score: number;
}

export interface AgentResponse {
  answer: string;
  agent: AgentId;
  transport: AgentTransport;
  /** Motor que redactó la respuesta: `local` (extractivo), `ollama`, `openai-compatible`. */
  engine: string;
  sources: AgentSource[];
  followUps: string[];
  notices: string[];
  /**
   * Herramientas deterministas que el tutor ejecutó para esta pregunta
   * (listar programas, resumir una semana, recomendar biblioteca, explicar un
   * itinerario, proponer el plan de cinco años). Todas son de sólo lectura y se
   * ejecutan en el dispositivo: ninguna envía datos fuera ni cambia nada.
   */
  tools?: ToolResult[];
  audit: {
    authorization: "allowed" | "denied" | "human_review";
    result: "success" | "failure" | "blocked";
    action: string;
    at: string;
  };
}

export interface AgentError {
  error: string;
  detail?: string;
}

export const AGENT_LIMITS = {
  maxQuestionChars: 800,
  maxSources: 4,
  maxAnswerChars: 3200,
  providerTimeoutMs: 15_000
} as const;
