import {
  buildIndex,
  knowledgeToSearchDocs,
  runTutorTools,
  type KnowledgePack,
  type SearchDoc,
  type SearchIndex,
  type ToolResult
} from "@secure-t/shared";
import { createAuditEvent, type SanitizedAuditEvent } from "./audit";
import { AGENT_MESSAGES, composeLocalAnswer, denialAnswer } from "./compose";
import {
  AGENT_LIMITS,
  type AgentRequest,
  type AgentResponse,
  type AgentSource,
  type AgentTransport
} from "./contract";
import { authorize, detectDeniedIntent, routeAgent, type AgentId, type Permission } from "./governance";
import { PERSONAS } from "./personas";
import { askProvider, type ProviderConfig, type ProviderMessage } from "./provider";
import { buildKnowledgeIndex, retrieve } from "./retrieval";

export * from "./audit";
export * from "./compose";
export * from "./contract";
export * from "./governance";
export * from "./personas";
export * from "./provider";
export * from "./retrieval";

const PRIMARY_PERMISSION: Record<AgentId, Permission> = {
  tutor: "read_course",
  socratic: "create_hint",
  academic: "read_course",
  assessment: "propose_assessment",
  lab: "read_lab",
  research: "read_approved_sources",
  security: "read_lab_output",
  voice: "synthesize_consented_text",
  orchestrator: "route_request"
};

export interface AgentContext {
  knowledge: KnowledgePack;
  /** Índice ya construido (se reutiliza entre peticiones para no reindexar). */
  index?: SearchIndex<SearchDoc>;
  provider?: ProviderConfig | null;
  transport?: AgentTransport;
  fetchImpl?: typeof fetch;
  courseTitles?: Record<string, string>;
  onAudit?: (event: SanitizedAuditEvent) => void;
}

function audit(
  context: AgentContext,
  payload: Parameters<typeof createAuditEvent>[0]
): AgentResponse["audit"] {
  const event = createAuditEvent(payload);
  context.onAudit?.(event);
  return {
    authorization: event.authorization,
    result: event.result,
    action: event.action,
    at: event.occurredAt
  };
}

function response(
  partial: Omit<AgentResponse, "transport">,
  context: AgentContext
): AgentResponse {
  return { ...partial, transport: context.transport ?? "local" };
}

/**
 * Punto de entrada único del agente, válido para los dos transportes.
 *
 * Orden de decisión (no negociable):
 *  1. Validar y recortar la pregunta.
 *  2. Comprobar la intención contra la deny-list global.
 *  3. Autorizar al agente según la matriz de permisos y el modo examen.
 *  4. Recuperar material del campus (siempre, aunque haya proveedor).
 *  5. Redactar: proveedor si está configurado y responde; si no, local.
 *  6. Auditar el resultado sin datos sensibles.
 */
export async function askAgent(request: AgentRequest, context: AgentContext): Promise<AgentResponse> {
  const locale = request.locale;
  const question = (request.question ?? "").trim().slice(0, AGENT_LIMITS.maxQuestionChars);
  const agent = request.agent ?? routeAgent(question);

  if (!question) {
    const messages = AGENT_MESSAGES[locale];
    return response(
      {
        answer: messages.noSources,
        agent,
        engine: "local",
        sources: [],
        followUps: [],
        notices: [messages.noSources],
        audit: audit(context, {
          actorType: "agent",
          action: "agent.answer",
          tool: agent,
          authorization: "allowed",
          result: "failure",
          error: "empty_question"
        })
      },
      context
    );
  }

  const deniedIntent = detectDeniedIntent(question);
  if (deniedIntent) {
    return response(
      {
        answer: denialAnswer(locale, agent),
        agent,
        engine: "guardrail",
        sources: [],
        followUps: [],
        notices: [`denied:${deniedIntent}`],
        audit: audit(context, {
          actorType: "agent",
          action: `agent.${deniedIntent}`,
          tool: agent,
          authorization: "denied",
          result: "blocked",
          metadata: { intent: deniedIntent }
        })
      },
      context
    );
  }

  const decision = authorize(agent, PRIMARY_PERMISSION[agent], Boolean(request.examMode));
  if (!decision.allowed) {
    return response(
      {
        answer: denialAnswer(locale, agent),
        agent,
        engine: "guardrail",
        sources: [],
        followUps: [],
        notices: [`authorization:${decision.reason}`],
        audit: audit(context, {
          actorType: "agent",
          action: "agent.authorize",
          tool: agent,
          authorization: "denied",
          result: "blocked",
          metadata: { permission: PRIMARY_PERMISSION[agent], reason: decision.reason }
        })
      },
      context
    );
  }

  const index = context.index ?? buildKnowledgeIndex(context.knowledge);
  const { sources, insufficient } = retrieve(index, context.knowledge, question, {
    ...(request.course ? { course: request.course } : {}),
    ...(request.week ? { week: request.week } : {}),
    maxSources: Math.min(request.maxSources ?? AGENT_LIMITS.maxSources, AGENT_LIMITS.maxSources)
  });

  // Herramientas del tutor: deterministas, de sólo lectura y sobre datos que ya
  // están en el dispositivo. Se ejecutan siempre, aunque haya proveedor externo:
  // así el material extra (biblioteca, plan, itinerario) nunca depende del modelo.
  const tools: ToolResult[] = runTutorTools({
    question,
    locale,
    knowledge: context.knowledge,
    ...(request.course ? { course: request.course } : {})
  });

  const courseTitle = request.course ? context.courseTitles?.[request.course] ?? request.course : undefined;
  const composeInput = {
    question,
    locale,
    agent,
    sources,
    ...(request.course ? { course: request.course } : {}),
    ...(courseTitle ? { courseTitle } : {}),
    ...(request.week ? { week: request.week } : {}),
    ...(request.examMode ? { examMode: true } : {}),
    maxChars: AGENT_LIMITS.maxAnswerChars
  };

  if (context.provider) {
    const messages: ProviderMessage[] = [
      { role: "system", content: systemPromptFor(agent, locale, sources) },
      { role: "user", content: question }
    ];
    try {
      const result = await askProvider(context.provider, messages, context.fetchImpl ?? fetch);
      const composed = composeLocalAnswer(composeInput);
      return response(
        {
          answer: result.text,
          agent,
          engine: result.engine,
          sources,
          followUps: composed.followUps,
          notices: [...composed.notices, "provider:used"],
          ...(tools.length ? { tools } : {}),
          audit: audit(context, {
            actorType: "agent",
            action: "agent.answer",
            tool: agent,
            authorization: "allowed",
            result: "success",
            metadata: { engine: result.engine, sources: sources.length, chars: result.text.length }
          })
        },
        context
      );
    } catch (error) {
      const composed = composeLocalAnswer(composeInput);
      const detail = error instanceof Error ? error.message : "provider_error";
      return response(
        {
          answer: composed.answer,
          agent,
          engine: "local",
          sources,
          followUps: composed.followUps,
          notices: [...composed.notices, `provider:fallback:${detail}`],
          ...(tools.length ? { tools } : {}),
          audit: audit(context, {
            actorType: "agent",
            action: "agent.answer",
            tool: agent,
            authorization: "allowed",
            result: "failure",
            error: detail,
            metadata: { engine: "local", sources: sources.length }
          })
        },
        context
      );
    }
  }

  const composed = composeLocalAnswer(composeInput);
  return response(
    {
      answer: composed.answer,
      agent,
      engine: "local",
      sources,
      followUps: composed.followUps,
      notices: [...composed.notices, ...(insufficient ? ["retrieval:insufficient"] : [])],
      ...(tools.length ? { tools } : {}),
      audit: audit(context, {
        actorType: "agent",
        action: "agent.answer",
        tool: agent,
        authorization: "allowed",
        result: insufficient ? "failure" : "success",
        metadata: { engine: "local", sources: sources.length, insufficient }
      })
    },
    context
  );
}

function systemPromptFor(agent: AgentId, locale: AgentRequest["locale"], sources: AgentSource[]): string {
  const persona = PERSONAS[agent];
  const languageName: Record<string, string> = { pt: "português", es: "español", en: "English", ca: "català" };
  const citations = sources.map((source, index) => `[${index + 1}] ${source.title} — ${source.quote}`).join("\n");
  return [
    `Eres ${persona.label[locale]}, agente del campus secure T.`,
    `${persona.role[locale]}. Responde en ${languageName[locale]}.`,
    "Cita únicamente los fragmentos [n] aportados; si no bastan, dilo. Nunca emites credenciales, ni cambias notas, ni inventas fuentes.",
    "Máximo doce frases y un paso práctico verificable al final.",
    "Fragmentos:",
    citations || "(sin fragmentos)"
  ].join("\n");
}

/** Crea un pipeline reutilizable (índice memoizado) para el servidor. */
export function createAgentPipeline(context: Omit<AgentContext, "index">) {
  const index = buildIndex(knowledgeToSearchDocs(context.knowledge));
  return {
    ask: (request: AgentRequest) => askAgent(request, { ...context, index }),
    knowledge: context.knowledge
  };
}
