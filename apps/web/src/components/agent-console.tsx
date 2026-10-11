"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  askAgent,
  PERSONAS,
  voiceAssetPath,
  voiceFallbackText,
  type AgentId,
  type AgentResponse,
  type AgentSource
} from "@secure-t/agent";
import {
  SPEECH_LOCALES,
  buildIndex,
  knowledgeToSearchDocs,
  translator,
  type KnowledgePack,
  type Locale,
  type SearchDoc,
  type SearchIndex
} from "@secure-t/shared";
import { SITE, asset } from "@/lib/site";

interface Turn {
  role: "user" | "agent";
  text: string;
  response?: AgentResponse;
}

const TRANSPORT = (process.env.NEXT_PUBLIC_AGENT_MODE ?? "local") as "local" | "server";

/** Icono por agente: vive en la interfaz, no en el contrato de datos. */
const AGENT_ICONS: Record<AgentId, string> = {
  tutor: "◈",
  socratic: "?",
  academic: "▤",
  assessment: "✓",
  lab: "⚗",
  research: "⌕",
  security: "⛨",
  voice: "♪",
  orchestrator: "⤳"
};

/**
 * Consola del agente del campus.
 *
 * En modo local todo ocurre en el navegador: el índice y la composición de la
 * respuesta viajan con la página, así que funciona sin conexión y sin que la
 * pregunta salga del dispositivo (promesa P6). En modo servidor se delega en el
 * endpoint `/api/agent`, que aplica exactamente el mismo motor y auditoría.
 */
export function AgentConsole({ locale, course }: { locale: Locale; course?: string }) {
  const t = translator(locale);
  const [pack, setPack] = useState<KnowledgePack | null>(null);
  const [index, setIndex] = useState<SearchIndex<SearchDoc> | null>(null);
  const [question, setQuestion] = useState("");
  const [agent, setAgent] = useState<AgentId | "auto">("auto");
  const [examMode, setExamMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(asset("/content/knowledge.json"))
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("no-pack"))))
      .then((data: KnowledgePack) => {
        if (cancelled) return;
        setPack(data);
        setIndex(buildIndex(knowledgeToSearchDocs(data)));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  const suggestions = useMemo(
    () =>
      pack
        ? pack.chunks
            .filter((chunk) => chunk.kind === "week" && (!course || chunk.course === course))
            .slice(0, 3)
            .map((chunk) => chunk.title.replace(/^Semana \d+ — /, ""))
        : [],
    [pack, course]
  );

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    // Si existe la locución grabada del docente se usa; si no, la voz del sistema.
    const recorded = new Audio(asset(voiceAssetPath(locale, "welcome")));
    recorded.onerror = () => {
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 900) || voiceFallbackText(locale, "lecturer"));
      utterance.lang = SPEECH_LOCALES[locale];
      utterance.rate = 0.98;
      window.speechSynthesis.speak(utterance);
    };
    void recorded.play().catch(() => recorded.onerror?.(new Event("error")));
  };

  const send = async (raw?: string) => {
    const text = (raw ?? question).trim();
    if (!text || busy) return;
    setQuestion("");
    setTurns((current) => [...current, { role: "user", text }]);
    setBusy(true);

    const request = {
      question: text,
      locale,
      ...(agent === "auto" ? {} : { agent }),
      ...(course ? { course } : {}),
      ...(examMode ? { examMode: true as const } : {})
    };

    try {
      let response: AgentResponse;
      if (TRANSPORT === "server") {
        const http = await fetch(asset("/api/agent"), {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(request)
        });
        if (!http.ok) throw new Error(`agent_http_${http.status}`);
        response = (await http.json()) as AgentResponse;
      } else {
        if (!pack || !index) throw new Error("pack_missing");
        response = await askAgent(request, {
          knowledge: pack,
          index,
          fetchImpl: fetch,
          courseTitles: Object.fromEntries(pack.chunks.map((chunk) => [chunk.course, chunk.courseTitle]))
        });
      }
      setTurns((current) => [...current, { role: "agent", text: response.answer, response }]);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "unknown";
      setTurns((current) => [
        ...current,
        {
          role: "agent",
          text: `${t("agent.error")} (${detail})`,
          response: {
            answer: "",
            agent: agent === "auto" ? "tutor" : agent,
            engine: "guardrail",
            sources: [],
            followUps: [],
            notices: [`ui:${detail}`],
            transport: TRANSPORT,
            audit: { authorization: "allowed", result: "failure", action: "agent.answer", at: new Date().toISOString() }
          }
        }
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="card flex min-h-[520px] flex-col" aria-labelledby="console-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="console-title" className="card-title m-0">
            {t("agent.title")}
          </h2>
          <span className={`badge ${TRANSPORT === "local" ? "" : "badge-azure"}`}>
            {TRANSPORT === "local" ? t("agent.modeLocal") : t("agent.modeServer")}
          </span>
        </div>

        <div ref={listRef} tabIndex={0} className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1" style={{ maxHeight: "52vh" }} aria-live="polite">
          {turns.length === 0 ? (
            <div className="maintenance-note">
              <p className="m-0">{t("agent.lead")}</p>
              <ul className="mt-2 space-y-1">
                {suggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => void send(suggestion)}>
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {turns.map((turn, position) =>
            turn.role === "user" ? (
              <p key={position} className="user-bubble">
                {turn.text}
              </p>
            ) : (
              <article key={position} className="agent-bubble">
                <p className="m-0 whitespace-pre-wrap">{turn.text}</p>
                {turn.response?.sources.length ? (
                  <ol className="mt-3 space-y-2 border-t border-[var(--aurum-line)] pt-3 text-[0.88rem]">
                    {turn.response.sources.map((source: AgentSource, sourceIndex) => (
                      <li key={source.id}>
                        <a href={asset(source.url)} className="font-semibold">
                          [{sourceIndex + 1}] {source.title}
                        </a>
                        <p className="muted m-0">«{source.quote}»</p>
                        <span className="mono text-[0.68rem] text-[var(--aurum-muted)]">
                          {source.course}
                          {source.week ? ` · S${source.week}` : ""} · {source.kind}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : null}
                {turn.response ? (
                  <p className="mono mt-2 flex flex-wrap items-center gap-3 text-[0.68rem] text-[var(--aurum-muted)]">
                    <span>agente: {turn.response.agent}</span>
                    <span>motor: {turn.response.engine}</span>
                    <span>
                      auditoría: {turn.response.audit.authorization}/{turn.response.audit.result}
                    </span>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => speak(turn.text)}>
                      {t("agent.voice")}
                    </button>
                    {turn.response.followUps.slice(0, 2).map((followUp) => (
                      <button key={followUp} type="button" className="btn btn-ghost btn-sm" onClick={() => void send(followUp)}>
                        ↳ {followUp}
                      </button>
                    ))}
                  </p>
                ) : null}
              </article>
            )
          )}
          {busy ? <p className="mono animate-pulse text-[0.8rem] text-[var(--color-gold-bright)]">{t("agent.thinking")}</p> : null}
        </div>

        <form
          className="mt-4 border-t border-[var(--aurum-line)] pt-4"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <label className="sr-only" htmlFor="agent-question">
            {t("agent.placeholder")}
          </label>
          <textarea
            id="agent-question"
            className="w-full"
            rows={3}
            value={question}
            placeholder={t("agent.placeholder")}
            maxLength={1200}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send();
              }
            }}
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button className="btn" type="submit" disabled={busy || !question.trim()}>
              {t("agent.send")}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setTurns([])}>
              {t("agent.clear")}
            </button>
            <label className="mono flex items-center gap-2 text-[0.75rem] text-[var(--aurum-muted)]">
              <input type="checkbox" checked={examMode} onChange={(event) => setExamMode(event.target.checked)} />
              {t("calendar.exam")}
            </label>
            <span className="mono ml-auto text-[0.68rem] text-[var(--aurum-muted)]">
              {question.length}/1200 · {SITE.agentMode}
            </span>
          </div>
        </form>
      </section>

      <aside className="space-y-4">
        <section className="card" aria-labelledby="agents-list">
          <h2 id="agents-list" className="card-title">
            {t("agent.persona")}
          </h2>
          <ul className="space-y-1 text-sm">
            <li>
              <button
                type="button"
                className={`btn btn-ghost btn-sm w-full justify-start ${agent === "auto" ? "quiz-right" : ""}`}
                onClick={() => setAgent("auto")}
              >
                ⤳ auto
              </button>
            </li>
            {(Object.keys(PERSONAS) as AgentId[]).map((id) => (
              <li key={id}>
                <button
                  type="button"
                  className={`btn btn-ghost btn-sm w-full justify-start ${agent === id ? "quiz-right" : ""}`}
                  onClick={() => setAgent(id)}
                  title={PERSONAS[id].role[locale]}
                >
                  <span className="mr-1" aria-hidden="true">
                    {AGENT_ICONS[id]}
                  </span>
                  {PERSONAS[id].label[locale]}
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <h2 className="card-title">{t("agent.privacy")}</h2>
          <p className="muted m-0 text-[0.9rem]">{t("agent.offlineNotice")}</p>
          <p className="mono mt-2 text-[0.7rem] text-[var(--aurum-muted)]">{t("agent.guardrail")}</p>
        </section>
      </aside>
    </div>
  );
}
