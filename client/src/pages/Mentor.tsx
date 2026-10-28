import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bot, Send, ShieldCheck, Sparkles, User } from "lucide-react";
import { Link } from "wouter";

import SiteHeader from "../components/SiteHeader";

type Engine = "ollama-local" | "safe-fallback" | string;

type ChatMessage = {
  id: number;
  role: "user" | "mentor";
  text: string;
  engine?: Engine;
};

const CONTEXTS = [
  { value: "cybersecurity", label: "Fundamentos y ofensiva" },
  { value: "defensive-security", label: "Defensa y SOC" },
  { value: "responsible-ai", label: "IA responsable" },
  { value: "governance", label: "Gobernanza y compliance" },
] as const;

const SUGGESTIONS = [
  "Explícame la diferencia entre amenaza, vulnerabilidad y riesgo con un ejemplo.",
  "¿Cómo empiezo un threat model de una API sin inventar ataques?",
  "Dame un plan de 20 minutos para triagear una alerta de PowerShell.",
  "¿Qué evidencia necesito para defender un control ante un auditor?",
];

let nextId = 1;

export default function Mentor() {
  const [context, setContext] = useState<(typeof CONTEXTS)[number]["value"]>(
    "cybersecurity",
  );
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || busy) return;
    setError("");
    setBusy(true);
    setInput("");
    setMessages(prev => [
      ...prev,
      { id: nextId++, role: "user", text: message },
    ]);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, context }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        reply?: string;
        engine?: Engine;
        error?: string;
      };

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error(
            "El mentor online está desactivado en este despliegue. El campus sigue disponible offline.",
          );
        }
        if (response.status === 429) {
          throw new Error(
            "Has alcanzado el límite temporal de consultas. Espera un minuto y vuelve a intentarlo.",
          );
        }
        throw new Error(data.error || `El mentor respondió ${response.status}.`);
      }

      setMessages(prev => [
        ...prev,
        {
          id: nextId++,
          role: "mentor",
          text:
            data.reply ||
            "No recibí una respuesta utilizable. Reformula la pregunta y vuelve a intentarlo.",
          engine: data.engine,
        },
      ]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Error de red.");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#071016] text-[#f3f7f3]">
      <a
        href="#mentor-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#b8f36b] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#071016]"
      >
        Skip to content
      </a>
      <SiteHeader />

      <main
        id="mentor-main"
        className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[.75fr_1.25fr] lg:px-8 lg:py-20"
      >
        <div>
          <h1 className="max-w-xl font-display text-4xl font-bold leading-[.98] tracking-[-.045em] sm:text-5xl">
            Astra, your
            <br />
            <span className="text-[#b8f36b]">Socratic mentor.</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/55">
            A study companion that asks before it answers. It never invents
            grades, accreditation or citations. If the online model is not
            configured, you get an honest fallback and a pointer back to the
            material.
          </p>

          <div className="mt-8">
            <label
              htmlFor="mentor-context"
              className="text-sm font-semibold text-white/70"
            >
              Study context
            </label>
            <select
              id="mentor-context"
              value={context}
              onChange={event =>
                setContext(event.target.value as typeof context)
              }
              className="mt-2 w-full rounded-xl border border-white/15 bg-[#0b171d] px-3 py-2.5 text-sm text-white outline-none focus:border-[#b8f36b]"
            >
              {CONTEXTS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-white/70">
              <Sparkles className="size-4 text-[#49dce8]" /> Try asking
            </p>
            <ul className="mt-3 space-y-2">
              {SUGGESTIONS.map(suggestion => (
                <li key={suggestion}>
                  <button
                    type="button"
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="text-left text-sm text-white/50 underline-offset-4 hover:text-white hover:underline"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 flex items-start gap-2 border-t border-white/10 pt-5 text-xs leading-relaxed text-white/35">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#b8f36b]" />
            El chat no se guarda en el servidor ni en localStorage. El límite es
            de 10 consultas por minuto. Para casos legales, de salud o datos
            personales, consulta a una persona.
          </p>
        </div>

        <div className="flex min-h-[36rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b171d]">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-[#b8f36b]/15 text-[#b8f36b]">
                <Bot className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Astra</p>
                <p className="text-xs text-white/40">
                  {busy ? "Pensando…" : "Mentor de estudio · demo"}
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMessages([]);
                  setError("");
                }}
                className="text-xs font-semibold text-white/40 hover:text-white"
              >
                Clear chat
              </button>
            )}
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {messages.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-white/45">
                <p className="font-semibold text-white/70">
                  Empieza con una pregunta concreta.
                </p>
                <p className="mt-2">
                  Por ejemplo: “Estoy en la semana 3 de Defensiva. ¿Qué evidencia
                  demuestra que entiendo el ciclo NIST 800-61?”.
                </p>
              </div>
            )}

            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : ""
                }`}
              >
                {message.role === "mentor" && (
                  <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-[#b8f36b]/10 text-[#b8f36b]">
                    <Bot className="size-4" />
                  </span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-[#b8f36b] text-[#071016]"
                      : "bg-white/[.05] text-white/75"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  {message.role === "mentor" && message.engine && (
                    <p className="mt-2 text-[10px] uppercase tracking-[.14em] text-white/30">
                      {message.engine === "ollama-local"
                        ? "Modelo local"
                        : message.engine === "safe-fallback"
                          ? "Fallback de seguridad"
                          : message.engine}
                    </p>
                  )}
                </div>
                {message.role === "user" && (
                  <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-white/60">
                    <User className="size-4" />
                  </span>
                )}
              </div>
            ))}

            {busy && (
              <p role="status" className="text-sm text-white/40">
                Astra está pensando…
              </p>
            )}
            {error && (
              <p role="alert" className="rounded-xl border border-[#ff8377]/30 bg-[#ff8377]/10 px-4 py-3 text-sm text-[#ff8377]">
                {error}{" "}
                <Link href="/campus" className="font-semibold underline">
                  Ir al campus
                </Link>
                .
              </p>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="border-t border-white/10 p-4"
            onSubmit={event => {
              event.preventDefault();
              void send(input);
            }}
          >
            <label htmlFor="mentor-message" className="sr-only">
              Mensaje para Astra
            </label>
            <textarea
              id="mentor-message"
              ref={inputRef}
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(input);
                }
              }}
              rows={3}
              maxLength={2000}
              placeholder="Pregunta sobre una semana, un laboratorio o una decisión de seguridad…"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#b8f36b]"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-white/30">
                {input.length}/2000 · Enter envía, Shift+Enter crea línea
              </p>
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#b8f36b] px-4 py-2.5 text-sm font-bold text-[#071016] transition hover:bg-[#d0ff9a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="size-4" /> Send
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-xs text-white/35 lg:px-8">
          <p>Secure T · mentor de estudio con salvaguardas</p>
          <div className="flex gap-5">
            <Link href="/campus" className="hover:text-white">
              Campus
            </Link>
            <Link href="/progress" className="hover:text-white">
              Progress
            </Link>
            <a
              href="campus/full/cursos/ciber-defensiva/index.html"
              className="inline-flex items-center gap-1 hover:text-white"
            >
              Curso de defensiva <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
