import type { Locale } from "@secure-t/shared";
import { AGENT_LIMITS, type AgentSource } from "./contract";
import type { AgentId } from "./governance";
import { PERSONAS } from "./personas";

/**
 * Transporte opcional a un modelo de lenguaje.
 *
 * Reglas de seguridad, en orden de importancia:
 *  1. **Allowlist de destino**: sólo `localhost`/`127.0.0.1`/`::1` o un host
 *     declarado explícitamente por el operador. Nada de SSRF por URL libre.
 *  2. **Minimización**: se envía únicamente la pregunta recortada y los
 *     fragmentos citados. Nunca el token anónimo, el progreso ni la identidad.
 *  3. **Sin claves en el cliente**: si hace falta `apiKey`, vive en el servidor.
 *  4. **Tiempo límite y respaldo**: si el proveedor falla, se responde con el
 *     modo local; el estudiante nunca se queda sin respuesta.
 */

export type ProviderKind = "ollama" | "openai-compatible";

export interface ProviderConfig {
  kind: ProviderKind;
  baseUrl: string;
  model: string;
  apiKey?: string;
  timeoutMs?: number;
  temperature?: number;
  /** Hosts extra autorizados (el operador los declara de forma explícita). */
  allowHosts?: string[];
}

export interface ProviderMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ProviderResult {
  text: string;
  engine: string;
  usage?: { promptChars: number; answerChars: number };
}

const LOOPBACK = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export function isHostAllowed(url: string, extra: string[] = []): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (LOOPBACK.has(host)) return true;
    return extra.map((entry) => entry.toLowerCase()).includes(host);
  } catch {
    return false;
  }
}

/** System prompt con guardarraíles explícitos y límites de comportamiento. */
export function buildSystemPrompt(agent: AgentId, locale: Locale, sources: AgentSource[]): string {
  const persona = PERSONAS[agent];
  const languageName: Record<Locale, string> = {
    pt: "português",
    es: "español",
    en: "English",
    ca: "català"
  };
  const citationBlock = sources
    .map((source, index) => `[${index + 1}] ${source.title} (${source.kind}${source.week ? `, sem. ${source.week}` : ""}) — ${source.quote}`)
    .join("\n");

  return [
    `Eres ${persona.label[locale]}, un agente del campus educativo secure T.`,
    persona.role[locale] + ".",
    `Responde en ${languageName[locale]}.`,
    "Reglas que no puedes romper:",
    "- Cita sólo los fragmentos aportados entre corchetes [n]. Si el material no responde a la pregunta, dilo claramente y no improvises.",
    "- Nunca emites credenciales, nunca cambias notas finales, nunca accedes a datos privados de terceros: esas acciones son humanas.",
    "- Nunca inventas fuentes, CVE, cifras ni citas legales. Si dudas, señala la duda.",
    "- Mantén la seguridad y la legalidad en primer plano (ámbito autorizado, permiso escrito).",
    "- Sé breve: máximo doce frases. Termina con un paso práctico verificable.",
    "Contexto recuperado del campus (literal):",
    citationBlock || "(sin fragmentos disponibles)"
  ].join("\n");
}

export async function askProvider(
  config: ProviderConfig,
  messages: ProviderMessage[],
  fetchImpl: typeof fetch = fetch
): Promise<ProviderResult> {
  if (!isHostAllowed(config.baseUrl, config.allowHosts ?? [])) {
    throw new Error("provider_host_not_allowed");
  }
  const timeoutMs = config.timeoutMs ?? AGENT_LIMITS.providerTimeoutMs;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const base = config.baseUrl.replace(/\/$/, "");

  try {
    const url = config.kind === "ollama" ? `${base}/api/chat` : `${base}/chat/completions`;
    const payload =
      config.kind === "ollama"
        ? { model: config.model, stream: false, messages, options: { temperature: config.temperature ?? 0.2 } }
        : { model: config.model, stream: false, temperature: config.temperature ?? 0.2, messages };

    const response = await fetchImpl(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {})
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) throw new Error(`provider_http_${response.status}`);
    const data = (await response.json()) as {
      message?: { content?: string };
      choices?: { message?: { content?: string } }[];
    };
    const text = data.message?.content ?? data.choices?.[0]?.message?.content ?? "";
    if (!text.trim()) throw new Error("provider_empty");
    return {
      text: text.trim().slice(0, AGENT_LIMITS.maxAnswerChars),
      engine: config.kind,
      usage: { promptChars: messages.reduce((sum, message) => sum + message.content.length, 0), answerChars: text.length }
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Configuración del proveedor a partir de variables de entorno del servidor. */
export function providerFromEnv(env: Record<string, string | undefined>): ProviderConfig | null {
  const baseUrl = env.SECURE_T_LLM_URL;
  const model = env.SECURE_T_LLM_MODEL;
  if (!baseUrl || !model) return null;
  const kind: ProviderKind = env.SECURE_T_LLM_KIND === "openai-compatible" ? "openai-compatible" : "ollama";
  const allowHosts = (env.SECURE_T_LLM_ALLOW_HOSTS ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  return {
    kind,
    baseUrl,
    model,
    ...(env.SECURE_T_LLM_KEY ? { apiKey: env.SECURE_T_LLM_KEY } : {}),
    ...(allowHosts.length ? { allowHosts } : {})
  };
}
