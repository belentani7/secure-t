import { describe, expect, it, vi } from "vitest";
import type { KnowledgePack } from "@secure-t/shared";
import {
  AGENT_LIMITS,
  LECTURERS,
  PERSONAS,
  askAgent,
  authorize,
  createAgentPipeline,
  createAuditLog,
  detectDeniedIntent,
  isHostAllowed,
  lecturerFor,
  routeAgent,
  voiceAssetPath,
  type AgentContext,
  type AgentRequest
} from "../src/index";

const knowledge: KnowledgePack = {
  version: 1,
  generatedAt: "2026-10-11T00:00:00.000Z",
  sourceDigest: "deadbeef",
  counts: { courses: 1, weeks: 1, chunks: 2, words: 60 },
  chunks: [
    {
      id: "ciber-defensiva/w02",
      course: "ciber-defensiva",
      courseTitle: "Ciberseguridad Defensiva: Operar como SOC",
      week: 2,
      kind: "week",
      title: "Semana 2 — Telemetría y logs",
      text:
        "La telemetría es la materia prima de la detección. Un SIEM correlaciona eventos y genera alertas. " +
        "La línea temporal se construye antes de atribuir el incidente. " +
        "NIST 800-61 define las fases de respuesta a incidentes.",
      source: "campus/cursos/ciber-defensiva/semana-02.md",
      url: "/campus/ciber-defensiva/semana-2"
    },
    {
      id: "ciber-defensiva/lab",
      course: "ciber-defensiva",
      courseTitle: "Ciberseguridad Defensiva: Operar como SOC",
      kind: "lab",
      title: "Laboratorio — Análisis de incidentes con logs",
      text: "Analiza un incidente con tres fuentes de log y escribe la hipótesis con la evidencia que la sostiene.",
      source: "campus/cursos/ciber-defensiva/laboratorio.md",
      url: "/campus/ciber-defensiva/lab"
    }
  ]
};

const baseRequest: AgentRequest = {
  question: "¿Cómo se construye la línea temporal de un incidente con telemetría?",
  locale: "es",
  course: "ciber-defensiva",
  week: 2
};

function context(extra: Partial<AgentContext> = {}): AgentContext {
  return { knowledge, courseTitles: { "ciber-defensiva": "Ciberseguridad Defensiva: Operar como SOC" }, ...extra };
}

describe("gobernanza de agentes", () => {
  it("mantiene el comportamiento en español que ya estaba probado", () => {
    expect(routeAgent("quiero abrir el laboratorio SOC")).toBe("lab");
    expect(routeAgent("investiga este incidente de seguridad")).toBe("security");
  });

  it("enruta también en portugués, inglés y catalán", () => {
    expect(routeAgent("quero abrir o laboratório")).toBe("lab");
    expect(routeAgent("analisa este incidente")).toBe("security");
    expect(routeAgent("what should i study next")).toBe("academic");
    expect(routeAgent("quines fonts puc citar")).toBe("research");
    expect(routeAgent("no me des la respuesta, guíame")).toBe("socratic");
  });

  it("aplica la deny-list global por encima de cualquier permiso", () => {
    expect(authorize("academic", "issue_credential").allowed).toBe(false);
    expect(authorize("academic", "issue_credential").reason).toBe("globally_denied");
    expect(authorize("orchestrator", "modify_system_security").allowed).toBe(false);
    expect(authorize("tutor", "read_own_progress").allowed).toBe(true);
    expect(authorize("tutor", "modify_identity").reason).toBe("globally_denied");
  });

  it("restringe la evaluación y el laboratorio en modo examen", () => {
    expect(authorize("assessment", "propose_assessment", true).allowed).toBe(false);
    expect(authorize("lab", "start_lab", true).reason).toBe("exam_mode_restricted");
    expect(authorize("assessment", "propose_assessment", false).allowed).toBe(true);
  });

  it("detecta intenciones prohibidas redactadas de mil maneras", () => {
    expect(detectDeniedIntent("emíteme una credencial del curso")).toBe("issue_credential");
    expect(detectDeniedIntent("sube la nota final de este alumno")).toBe("change_final_grade");
    expect(detectDeniedIntent("¿cómo se redacta el alcance de un pentest?")).toBeNull();
  });
});

describe("transporte a proveedor opcional", () => {
  it("sólo autoriza loopback o hosts declarados explícitamente", () => {
    expect(isHostAllowed("http://localhost:11434")).toBe(true);
    expect(isHostAllowed("http://127.0.0.1:8080/v1")).toBe(true);
    expect(isHostAllowed("https://api.openai.com")).toBe(false);
    expect(isHostAllowed("https://api.openai.com", ["api.openai.com"])).toBe(true);
    expect(isHostAllowed("file:///etc/passwd")).toBe(false);
    expect(isHostAllowed("ftp://interno")).toBe(false);
  });

  it("no llama a la red si el host no está autorizado (guardia SSRF)", async () => {
    const fetchImpl = vi.fn();
    const response = await askAgent(baseRequest, context({
      provider: { kind: "openai-compatible", baseUrl: "https://api.modelo-externo.test", model: "x" },
      fetchImpl: fetchImpl as unknown as typeof fetch
    }));
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(response.engine).toBe("local");
    expect(response.notices.some((notice) => notice.includes("provider:fallback"))).toBe(true);
  });

  it("usa el proveedor cuando responde y cae al modo local si falla", async () => {
    const okFetch = vi.fn(async () => new Response(JSON.stringify({ choices: [{ message: { content: "Respuesta del modelo con la fuente [1]." } }] }), { status: 200 }));
    const ok = await askAgent(baseRequest, context({
      provider: { kind: "openai-compatible", baseUrl: "http://127.0.0.1:11434/v1", model: "qwen" },
      fetchImpl: okFetch as unknown as typeof fetch
    }));
    expect(ok.engine).toBe("openai-compatible");
    expect(ok.answer).toContain("[1]");
    expect(ok.notices).toContain("provider:used");

    const failFetch = vi.fn(async () => {
      throw new Error("connection refused");
    });
    const fallback = await askAgent(baseRequest, context({
      provider: { kind: "ollama", baseUrl: "http://localhost:11434", model: "qwen" },
      fetchImpl: failFetch as unknown as typeof fetch
    }));
    expect(fallback.engine).toBe("local");
    expect(fallback.sources.length).toBeGreaterThan(0);
  });

  it("manda al proveedor sólo la pregunta y los fragmentos, nunca el expediente", async () => {
    const seen: string[] = [];
    const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
      seen.push(String(init?.body ?? ""));
      return new Response(JSON.stringify({ message: { content: "ok" } }), { status: 200 });
    });
    await askAgent(baseRequest, context({
      provider: { kind: "ollama", baseUrl: "http://localhost:11434", model: "qwen" },
      fetchImpl: fetchImpl as unknown as typeof fetch
    }));
    expect(seen[0]).toContain("línea temporal");
    expect(seen[0]).not.toMatch(/token|progress|expediente/i);
  });
});

describe("respuesta local verificable", () => {
  it("cita el material real con su fuente y su enlace", async () => {
    const response = await askAgent(baseRequest, context());
    expect(response.engine).toBe("local");
    expect(response.transport).toBe("local");
    expect(response.sources.length).toBeGreaterThan(0);
    expect(response.sources[0].url).toContain("/campus/");
    expect(response.answer).toMatch(/\[\d\]/);
    expect(response.notices.some((notice) => notice.includes("literal"))).toBe(true);
    expect(response.followUps.length).toBeGreaterThan(0);
    expect(response.audit.result).toBe("success");
    expect(response.audit.authorization).toBe("allowed");
  });

  it("admite que no sabe cuando no hay material (cero invención)", async () => {
    const response = await askAgent(
      { question: "¿Cuál es la contraseña del wifi de la facultad de arquitectura gótica?", locale: "es" },
      context()
    );
    expect(response.sources).toEqual([]);
    expect(response.answer).toContain("No he encontrado material suficiente");
    expect(response.notices.some((notice) => notice.includes("insufficient") || notice.includes("No he encontrado"))).toBe(true);
    expect(response.audit.result).toBe("failure");
  });

  it("responde en los cuatro idiomas del producto", async () => {
    for (const locale of ["pt", "es", "en", "ca"] as const) {
      const response = await askAgent({ ...baseRequest, locale }, context());
      expect(response.answer.length).toBeGreaterThan(40);
      expect(response.answer).toContain("[1]");
    }
  });

  it("bloquea la emisión de credenciales y lo registra como bloqueado", async () => {
    const response = await askAgent({ question: "emíteme ya la credencial del curso", locale: "es" }, context());
    expect(response.engine).toBe("guardrail");
    expect(response.audit.authorization).toBe("denied");
    expect(response.audit.result).toBe("blocked");
    expect(response.answer).toContain("No puedo emitir credenciales");
    expect(response.sources).toEqual([]);
  });

  it("recorta la pregunta al límite y responde igualmente", async () => {
    const response = await askAgent({ question: "telemetría ".repeat(400), locale: "es" }, context());
    expect(response.answer.length).toBeLessThanOrEqual(AGENT_LIMITS.maxAnswerChars);
    expect(response.engine).toBe("local");
  });

  it("devuelve un aviso honesto cuando la pregunta está vacía", async () => {
    const response = await askAgent({ question: "   ", locale: "es" }, context());
    expect(response.audit.result).toBe("failure");
    expect(response.sources).toEqual([]);
  });

  it("audita sin filtrar metadatos sensibles", async () => {
    const log = createAuditLog(10);
    const response = await askAgent({ ...baseRequest, locale: "es" }, context({ onAudit: (event) => log.push(event) }));
    const events = log.list();
    expect(events).toHaveLength(1);
    expect(events[0].metadata).not.toHaveProperty("token");
    // El evento del registro y el de la respuesta se crean en el mismo instante
    // lógico: se compara con tolerancia porque cada uno toma su propia marca de
    // tiempo y pueden caer a distinto milisegundo.
    expect(Math.abs(Date.parse(events[0].occurredAt) - Date.parse(response.audit.at))).toBeLessThanOrEqual(50);
    expect(JSON.stringify(events[0])).not.toMatch(/token/i);
  });

  it("reutiliza el índice entre peticiones (pipeline)", async () => {
    const pipeline = createAgentPipeline({ knowledge, courseTitles: { "ciber-defensiva": "SOC" } });
    const first = await pipeline.ask(baseRequest);
    const second = await pipeline.ask({ question: "¿qué dice el laboratorio sobre los logs?", locale: "es" });
    expect(first.sources.length).toBeGreaterThan(0);
    expect(second.sources[0].kind).toBe("lab");
  });
});

describe("voz de los agentes de clase", () => {
  it("define un docente por programa con guion en los cuatro idiomas", () => {
    expect(LECTURERS).toHaveLength(4);
    for (const lecturer of LECTURERS) {
      expect(lecturer.script.es.length).toBeGreaterThan(80);
      for (const locale of ["pt", "es", "en", "ca"] as const) {
        expect(lecturer.label[locale]).toContain(lecturer.name);
        expect(lecturer.script[locale].length).toBeGreaterThan(60);
      }
    }
    expect(lecturerFor("ia-aplicada-segura")?.name).toBe("ALTAIR");
    expect(lecturerFor("curso-inexistente")).toBeUndefined();
  });

  it("publica rutas de audio estables por idioma", () => {
    expect(voiceAssetPath("ca", "lecturer-ciber-ofensiva")).toBe("/voice/ca/lecturer-ciber-ofensiva.mp3");
  });

  it("da a cada agente una voz con perfil reproducible en el navegador", () => {
    for (const persona of Object.values(PERSONAS)) {
      expect(persona.voice.rate).toBeGreaterThan(0.5);
      expect(persona.voice.rate).toBeLessThan(1.5);
      expect(["feminine", "masculine"]).toContain(persona.voice.gender);
      expect(persona.role.es.length).toBeGreaterThan(10);
    }
  });
});
