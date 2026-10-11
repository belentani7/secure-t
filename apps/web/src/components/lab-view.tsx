"use client";

import { useMemo, useState } from "react";
import {
  GUARDRAIL_ITEMS,
  LAB_INSTRUMENTS,
  assessGuardrails,
  auditGrounding,
  auditPrompt,
  estimateContext,
  labReport,
  redactSensitive,
  splitSentences,
  translator,
  type GuardrailAnswer,
  type LabInstrumentId,
  type LabSession,
  type LabSeverity,
  type Locale,
  type TranslationKey
} from "@secure-t/shared";

/**
 * Laboratorio de IA: mesa de trabajo, no escaparate.
 *
 * Los cinco instrumentos son funciones puras del paquete compartido: aquí sólo
 * se les da entrada, se muestra lo que devuelven —hallazgo, evidencia,
 * referencia y mitigación— y se deja exportar el expediente. Nada viaja: la
 * página funciona con el enrutador en marcha y sin red.
 */

const SEVERIDAD_CLASE: Record<LabSeverity, string> = {
  critico: "border-[var(--color-danger)] text-[var(--color-danger)]",
  alto: "border-[var(--color-warning)] text-[var(--color-warning)]",
  medio: "border-[var(--color-gold)] text-[var(--color-gold-bright)]",
  bajo: "border-[var(--aurum-line-strong)] text-[var(--aurum-muted)]",
  info: "border-[var(--aurum-line)] text-[var(--aurum-muted)]"
};

const TEXTO_SEVERIDAD: Record<LabSeverity, TranslationKey> = {
  critico: "lab.severity.critico",
  alto: "lab.severity.alto",
  medio: "lab.severity.medio",
  bajo: "lab.severity.bajo",
  info: "lab.severity.info"
};

export function LabView({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const [instrumento, setInstrumento] = useState<LabInstrumentId>("prompt");
  const [entrada, setEntrada] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [fuentes, setFuentes] = useState("");
  const [respuestasSalvaguarda, setRespuestasSalvaguarda] = useState<GuardrailAnswer[]>([]);
  const [informe, setInforme] = useState("");
  const [copiado, setCopiado] = useState(false);

  const activo = LAB_INSTRUMENTS.find((item) => item.id === instrumento) ?? LAB_INSTRUMENTS[0]!;
  const sesion: LabSession | null = useMemo(() => {
    if (!entrada.trim() && instrumento !== "guardrails") return null;
    switch (instrumento) {
      case "prompt":
        return { prompt: auditPrompt(entrada) };
      case "pii":
        return { pii: redactSensitive(entrada) };
      case "grounding":
        return {
          grounding: auditGrounding(
            respuesta,
            fuentes
              .split(/\n{2,}/)
              .map((bloque) => bloque.trim())
              .filter(Boolean)
              .map((texto, indice) => ({ title: `${t("lab.input.sources")} ${indice + 1}`, url: "", text: texto }))
          )
        };
      case "context":
        return { context: estimateContext(entrada) };
      case "guardrails":
        return { guardrails: assessGuardrails(respuestasSalvaguarda) };
      default:
        return null;
    }
  }, [instrumento, entrada, respuesta, fuentes, respuestasSalvaguarda, t]);

  const cargarEjemplo = () => {
    if (instrumento === "grounding") {
      setRespuesta(
        "Separar instrucción de dato evita la inyección indirecta. El proveedor de la competencia consiguió un 98,7 % en su auditoría de diciembre y cuesta doce euros al mes."
      );
      setFuentes(
        "Separar instrucción de dato y validar la salida estructurada antes de usarla evita la inyección indirecta.\n\nUn texto externo es hostil hasta que se demuestre lo contrario y nunca redefine la política del sistema."
      );
      return;
    }
    if (instrumento === "guardrails") {
      setRespuestasSalvaguarda(
        GUARDRAIL_ITEMS.map((item, indice) => ({
          id: item.id,
          ok: indice % 3 !== 0,
          evidence: indice % 3 !== 0 ? `comprobado en la revisión interna (${item.id})` : ""
        }))
      );
      return;
    }
    setEntrada(t(`lab.sample.${instrumento}` as TranslationKey));
  };

  const exportar = () => {
    if (!sesion) return;
    const markdown = labReport(sesion, `${t("lab.title")} · ${t(activo.label)}`);
    setInforme(markdown);
    void navigator.clipboard?.writeText(markdown).then(
      () => setCopiado(true),
      () => setCopiado(false)
    );
  };

  return (
    <div className="wrap section">
      <p className="eyebrow">{t("nav.lab")}</p>
      <h1>{t("lab.title")}</h1>
      <p className="lead">{t("lab.lead")}</p>
      <p className="mono mt-3 text-xs text-[var(--color-gold-bright)]">{t("lab.privacy")}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
        <nav className="aurum-glass h-fit p-4" aria-label={t("lab.instrument")}>
          <h2 className="card-title m-0 text-sm uppercase tracking-[0.14em]">{t("lab.instrument")}</h2>
          <ul className="mt-3 space-y-1">
            {LAB_INSTRUMENTS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={instrumento === item.id ? "true" : undefined}
                  onClick={() => {
                    setInstrumento(item.id);
                    setInforme("");
                    setCopiado(false);
                  }}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                    instrumento === item.id
                      ? "bg-[var(--aurum-glass-strong)] text-[var(--color-gold-bright)]"
                      : "text-[var(--aurum-muted)] hover:text-[var(--color-gold)]"
                  }`}
                >
                  {t(item.label)}
                </button>
              </li>
            ))}
          </ul>
          <p className="mono mt-4 text-[0.68rem] leading-relaxed text-[var(--aurum-muted)]">
            {t("lab.source")}: {activo.source.course} · S{activo.source.week}
          </p>
        </nav>

        <section className="space-y-5" aria-labelledby="lab-instrumento">
          <header className="aurum-glass p-5">
            <h2 id="lab-instrumento" className="gold-text text-lg font-semibold">
              {t(activo.label)}
            </h2>
            <p className="mt-1 text-sm text-[var(--aurum-muted)]">{t(activo.lead)}</p>
            <p className="mono mt-3 text-[0.7rem] text-[var(--color-gold-bright)]">
              {t("lab.limit")}: {t(activo.limit)}
            </p>
          </header>

          <div className="aurum-glass p-5">
            {instrumento === "grounding" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mono mb-2 block text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]" htmlFor="lab-answer">
                    {t("lab.input.answer")}
                  </label>
                  <textarea id="lab-answer" rows={8} value={respuesta} onChange={(evento) => setRespuesta(evento.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="mono mb-2 block text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]" htmlFor="lab-sources">
                    {t("lab.input.sources")}
                  </label>
                  <textarea id="lab-sources" rows={8} value={fuentes} onChange={(evento) => setFuentes(evento.target.value)} className="w-full" />
                </div>
              </div>
            ) : instrumento === "guardrails" ? (
              <ul className="space-y-3">
                {GUARDRAIL_ITEMS.map((item) => {
                  const respuestaActual = respuestasSalvaguarda.find((r) => r.id === item.id);
                  return (
                    <li key={item.id} className="border-b border-[var(--aurum-line)] pb-3 last:border-0">
                      <label className="flex items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={Boolean(respuestaActual?.ok)}
                          onChange={(evento) =>
                            setRespuestasSalvaguarda((actuales) => [
                              ...actuales.filter((r) => r.id !== item.id),
                              { id: item.id, ok: evento.target.checked, ...(respuestaActual?.evidence ? { evidence: respuestaActual.evidence } : {}) }
                            ])
                          }
                        />
                        <span>
                          <span className="font-semibold text-[var(--color-parchment)]">{t(item.label)}</span>
                          <span className="mt-1 block text-[var(--aurum-muted)]">{t(item.why)}</span>
                          <span className="mono mt-1 block text-[0.68rem] text-[var(--aurum-muted)]">{item.reference}</span>
                        </span>
                      </label>
                      {respuestaActual?.ok ? (
                        <>
                          <label className="mono mt-2 block text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-gold)]" htmlFor={`ev-${item.id}`}>
                            {t("lab.findings")} · {item.id}
                          </label>
                          <input
                            id={`ev-${item.id}`}
                            className="mt-1 w-full rounded border border-[var(--aurum-line)] bg-transparent px-2 py-1 text-sm"
                            value={respuestaActual.evidence ?? ""}
                            onChange={(evento) =>
                              setRespuestasSalvaguarda((actuales) => [
                                ...actuales.filter((r) => r.id !== item.id),
                                { id: item.id, ok: true, evidence: evento.target.value }
                              ])
                            }
                          />
                        </>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <>
                <label className="mono mb-2 block text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]" htmlFor="lab-input">
                  {t("lab.input")}
                </label>
                <textarea id="lab-input" rows={7} value={entrada} onChange={(evento) => setEntrada(evento.target.value)} className="w-full" />
              </>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" className="btn btn-sm" onClick={exportar} disabled={!sesion}>
                {t("lab.export")}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={cargarEjemplo}>
                {t("lab.sample")}
              </button>
              {copiado ? <span className="mono text-xs text-[var(--color-success)]">{t("lab.copied")}</span> : null}
            </div>
          </div>

          {sesion ? (
            <div className="space-y-5" aria-live="polite">
              {sesion.prompt ? (
                <article className="aurum-glass p-5">
                  <p className="mono text-xs uppercase tracking-[0.14em] text-[var(--aurum-muted)]">{t("lab.verdict")}</p>
                  <p className={`mt-1 inline-block rounded border px-3 py-1 text-sm ${SEVERIDAD_CLASE[sesion.prompt.verdict === "limpio" ? "info" : sesion.prompt.verdict]}`}>
                    {sesion.prompt.verdict === "limpio" ? t("lab.verdict.limpio") : t(TEXTO_SEVERIDAD[sesion.prompt.verdict])}
                  </p>
                  <h3 className="mono mt-4 text-xs uppercase tracking-[0.14em] text-[var(--aurum-muted)]">{t("lab.findings")}</h3>
                  {sesion.prompt.findings.length === 0 ? (
                    <p className="mt-2 text-sm text-[var(--aurum-muted)]">{t("lab.none")}</p>
                  ) : (
                    <ul className="mt-2 space-y-3">
                      {sesion.prompt.findings.map((hallazgo) => (
                        <li key={hallazgo.id} className={`border-l-2 pl-3 ${SEVERIDAD_CLASE[hallazgo.severity]}`}>
                          <p className="text-sm font-semibold">{t(hallazgo.label)}</p>
                          <p className="mono mt-1 break-words text-[0.7rem] text-[var(--aurum-muted)]">«{hallazgo.evidence}»</p>
                          <p className="mono mt-1 text-[0.68rem] text-[var(--aurum-muted)]">
                            {hallazgo.owasp} · {hallazgo.atlas} · {hallazgo.cwe}
                          </p>
                          <p className="mt-1 text-sm">{t(hallazgo.mitigation)}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ) : null}

              {sesion.pii ? (
                <article className="aurum-glass p-5">
                  <p className="mono text-xs uppercase tracking-[0.14em] text-[var(--aurum-muted)]">{t("lab.findings")}</p>
                  {sesion.pii.hits.length === 0 ? (
                    <p className="mt-2 text-sm text-[var(--aurum-muted)]">{t("lab.none")}</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {sesion.pii.hits.map((hit) => (
                        <li key={hit.category} className="text-sm">
                          <span className="font-semibold text-[var(--color-gold-bright)]">{t(hit.label)}</span>
                          <span className="mono ml-2 text-[0.7rem] text-[var(--aurum-muted)]">
                            {hit.count} · {hit.samples.join(" · ")}
                          </span>
                          <span className="mono mt-1 block text-[0.68rem] text-[var(--aurum-muted)]">{hit.reference}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <h3 className="mono mt-4 text-xs uppercase tracking-[0.14em] text-[var(--aurum-muted)]">{t("lab.clean")}</h3>
                  <pre className="mt-2 whitespace-pre-wrap break-words rounded border border-[var(--aurum-line)] p-3 text-sm">{sesion.pii.clean || "—"}</pre>
                </article>
              ) : null}

              {sesion.grounding ? (
                <article className="aurum-glass p-5">
                  <p className="mono text-xs uppercase tracking-[0.14em] text-[var(--aurum-muted)]">{t("lab.verdict")}</p>
                  <p className="mt-1 text-sm">
                    <span className="gold-text font-semibold">{t(`lab.verdict.${sesion.grounding.verdict}` as TranslationKey)}</span>{" "}
                    <span className="mono text-[0.7rem] text-[var(--aurum-muted)]">
                      {sesion.grounding.supported}/{sesion.grounding.sentences.length} · {sesion.grounding.supportRate}%
                    </span>
                  </p>
                  <ul className="mt-3 space-y-2">
                    {sesion.grounding.sentences.map((frase, indice) => (
                      <li key={indice} className={`border-l-2 pl-3 ${frase.supported ? "border-[var(--color-success)]" : "border-[var(--color-danger)]"}`}>
                        <p className="text-sm">{frase.text}</p>
                        <p className="mono mt-1 text-[0.68rem] text-[var(--aurum-muted)]">
                          {Math.round(frase.coverage * 100)}% · {frase.source ? frase.source.title : t("lab.grounding.sentence")}
                        </p>
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}

              {sesion.context ? (
                <article className="aurum-glass p-5">
                  <p className="mono text-xs uppercase tracking-[0.14em] text-[var(--aurum-muted)]">{t("lab.verdict")}</p>
                  <p className="mt-1 text-sm">
                    <span className="gold-text font-semibold">{t(`lab.verdict.${sesion.context.recommendation}` as TranslationKey)}</span>{" "}
                    <span className="mono text-[0.7rem] text-[var(--aurum-muted)]">
                      ~{sesion.context.estimatedTokens} tokens · {sesion.context.chars} chars
                    </span>
                  </p>
                  <ul className="mt-3 space-y-1">
                    {sesion.context.fits.map((fila) => (
                      <li key={fila.model} className="mono text-[0.72rem] text-[var(--aurum-muted)]">
                        {fila.label}: {fila.ok ? `+${fila.leftover}` : `${fila.leftover}`} tokens
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}

              {sesion.guardrails ? (
                <article className="aurum-glass p-5">
                  <p className="mono text-xs uppercase tracking-[0.14em] text-[var(--aurum-muted)]">{t("lab.verdict")}</p>
                  <p className="mt-1 text-sm">
                    <span className="gold-text font-semibold">{sesion.guardrails.score}/100</span> ·{" "}
                    {sesion.guardrails.ok}/{sesion.guardrails.total} ·{" "}
                    <span className={sesion.guardrails.ready ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}>
                      {sesion.guardrails.ready ? t("lab.ready") : t("lab.notReady")}
                    </span>
                  </p>
                  {sesion.guardrails.missing.length ? (
                    <ul className="mt-3 space-y-2">
                      {sesion.guardrails.missing.map((item) => (
                        <li key={item.id} className="border-l-2 border-[var(--color-warning)] pl-3 text-sm">
                          {t(item.label)}
                          <span className="mono mt-1 block text-[0.68rem] text-[var(--aurum-muted)]">{item.reference}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ) : null}
            </div>
          ) : null}

          {informe ? (
            <article className="aurum-glass p-5">
              <h3 className="mono text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]">{t("lab.export")}</h3>
              <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-words text-[0.78rem]">{informe}</pre>
              <p className="mono mt-2 text-[0.68rem] text-[var(--aurum-muted)]">
                {t("lab.limit")}: {t("lab.limit.selfassessment")}
              </p>
            </article>
          ) : null}

          <p className="mono text-[0.68rem] text-[var(--aurum-muted)]">
            {t("lab.limit")}: {t("lab.limit.patterns")}
          </p>
        </section>
      </div>
    </div>
  );
}

/** Frases de la respuesta sin fuente: se listan para el expediente del alumno. */
export function unsupportedSentences(respuesta: string, fuentes: readonly string[]): string[] {
  const informe = auditGrounding(
    respuesta,
    fuentes.map((texto, indice) => ({ title: `fuente ${indice + 1}`, url: "", text: texto }))
  );
  return splitSentences(respuesta).filter((_, indice) => !informe.sentences[indice]?.supported);
}
