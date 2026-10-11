"use client";

import { useMemo, useState } from "react";
import {
  completionOf,
  credentialText,
  formatShort,
  sha256Hex,
  translator,
  type Locale
} from "@secure-t/shared";
import { downloadText, useProgress } from "@/lib/progress-store";
import { issueBadge, resetIssuerKey, siteBaseUrl, type IssuedBadge } from "@/lib/badge-store";
import { recordBadgeEarned } from "@/lib/xapi-store";

interface CourseInput {
  slug: string;
  title: string;
  weeks: number;
}

/**
 * Credencial de aprovechamiento, en tres formatos que se complementan:
 *
 *  1. **Texto + SHA-256** (lo que ya existía): comprobable recalculando el hash.
 *  2. **Open Badges 2.0 firmado (RS256)**: credencial interoperable que cualquier
 *     plataforma de insignias puede leer, verificable sin servidor.
 *  3. **Open Badges 3.0 / VC 1.1**: la vista moderna del mismo expediente.
 *
 * Y un verificador para pegar una credencial recibida y comprobar su firma.
 * Lo que **no** se promete: registro público de emisiones ni revisión humana de
 * evidencias; eso figura como PLANIFICADO, también dentro de la credencial.
 */
export function CredentialView({ locale, courses }: { locale: Locale; courses: CourseInput[] }) {
  const t = translator(locale);
  const record = useProgress();
  const [selected, setSelected] = useState(courses[0]?.slug ?? "");
  const [hash, setHash] = useState<string | null>(null);
  const [badge, setBadge] = useState<IssuedBadge | null>(null);
  const [trabajando, setTrabajando] = useState(false);
  const [verifyText, setVerifyText] = useState("");
  const [verifyResult, setVerifyResult] = useState<{ state: "idle" | "ok" | "bad"; reason?: string }>({ state: "idle" });

  const course = courses.find((entry) => entry.slug === selected) ?? courses[0];
  const report = course ? completionOf(record, course.slug, course.weeks) : null;

  const credential = useMemo(() => {
    if (!course || !report) return null;
    return {
      course,
      report,
      text: credentialText({
        token: record.token,
        slug: course.slug,
        courseTitle: course.title,
        weeksTotal: report.weeksDone,
        issuedAt: new Date().toISOString().slice(0, 10),
        locale
      })
    };
  }, [course, report, record.token, locale]);

  const emitirTexto = async () => {
    if (!credential) return;
    setHash(await sha256Hex(credential.text));
  };

  const emitirInsignia = async () => {
    if (!course || !report) return;
    setTrabajando(true);
    try {
      const emitida = await issueBadge({
        slug: course.slug,
        title: course.title,
        weeks: course.weeks,
        weeksDone: report.weeksDone,
        token: record.token,
        locale
      });
      setBadge(emitida);
      recordBadgeEarned(
        { token: record.token, locale, slug: course.slug, title: course.title },
        { weeks: report.weeksDone }
      );
    } finally {
      setTrabajando(false);
    }
  };

  const verificar = async () => {
    if (!credential) return;
    const esperado = hash ?? (await sha256Hex(credential.text));
    const normalizado = verifyText.trim().toLowerCase();
    setVerifyResult(
      normalizado && normalizado === esperado.toLowerCase()
        ? { state: "ok" }
        : { state: "bad", reason: t("credential.invalid") }
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <section aria-labelledby="credential-title">
        <h1 id="credential-title">{t("credential.title")}</h1>
        <p className="lead">{t("credential.lead")}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="credential-course">{t("campus.courses")}</label>
            <select id="credential-course" value={selected} onChange={(event) => setSelected(event.target.value)}>
              {courses.map((entry) => (
                <option key={entry.slug} value={entry.slug}>
                  {entry.title}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="credential-token">{t("progress.token")}</label>
            <input id="credential-token" readOnly value={record.token} className="mono text-[0.78rem]" />
          </div>
        </div>

        {report && !report.ready ? (
          <div className="maintenance-note mt-4">
            <p className="m-0 font-semibold text-[var(--color-saffron)]">{t("credential.incomplete")}</p>
            <p className="mono m-0 text-[0.78rem]">{report.missing.join(" · ")}</p>
            <div
              className="progress mt-2"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={report.percent}
              aria-label={t("progress.completed")}
            >
              <span style={{ width: `${report.percent}%` }} />
            </div>
            <p className="mono m-0 mt-2 text-[0.72rem] text-[var(--aurum-muted)]">
              {t("credential.requirements")} — {t("credential.phase2")}
            </p>
          </div>
        ) : null}

        <h2 className="mt-7">{t("badge.title")}</h2>
        <p className="muted">{t("badge.lead")}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" className="btn" onClick={() => void emitirInsignia()} disabled={!course || trabajando}>
            {trabajando ? t("common.loading") : t("badge.export")}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => void emitirTexto()} disabled={!course}>
            {t("credential.generate")} (SHA-256)
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => badge && downloadText(`credencial-ob2-${course?.slug}.json`, JSON.stringify(badge.serialized, null, 2))}
            disabled={!badge}
          >
            {t("common.download")} .json
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => badge && downloadText(`credencial-ob3-${course?.slug}.json`, JSON.stringify(badge.ob3, null, 2))}
            disabled={!badge}
          >
            {t("badge.ob3")}
          </button>
        </div>

        {badge ? (
          <article className="credential mt-6">
            <p className="eyebrow">Open Badges 2.0 · RS256</p>
            <h3 className="m-0 text-lg">{badge.badgeClass.name}</h3>
            <dl className="mono mt-3 grid gap-2 text-[0.76rem] sm:grid-cols-2">
              <div>
                <dt className="text-[var(--aurum-muted)]">id</dt>
                <dd className="m-0 break-all">{badge.assertion.id}</dd>
              </div>
              <div>
                <dt className="text-[var(--aurum-muted)]">recipient</dt>
                <dd className="m-0">{badge.assertion.recipient.type} · {t("progress.anonymous")}</dd>
              </div>
              <div>
                <dt className="text-[var(--aurum-muted)]">issuedOn</dt>
                <dd className="m-0">{formatShort(badge.assertion.issuedOn.slice(0, 10), locale)}</dd>
              </div>
              <div>
                <dt className="text-[var(--aurum-muted)]">kid</dt>
                <dd className="m-0 break-all">{String(badge.serialized.jwk.kid)}</dd>
              </div>
            </dl>
            <pre tabIndex={0} className="mono mt-3 max-h-32 overflow-auto break-all text-[0.68rem] whitespace-pre-wrap">{badge.serialized.jws}</pre>
            {badge.problems.length ? (
              <p className="mono text-[0.72rem] text-[var(--color-coral)]">⚠ {badge.problems.join(" · ")}</p>
            ) : (
              <p className="mono text-[0.72rem] text-[var(--color-mint)]">
                {t("badge.valid")} · Open Badges 2.0 · {siteBaseUrl()}
              </p>
            )}
            <p className="mono text-[0.68rem] text-[var(--aurum-muted)]">
              {badge.serialized.note} · {t("credential.phase2")}
            </p>
          </article>
        ) : null}

        {credential ? (
          <article className="credential mt-6">
            <p className="eyebrow">secure T · SHA-256</p>
            <pre tabIndex={0} className="mono m-0 overflow-x-auto text-[0.78rem] whitespace-pre-wrap">{credential.text}</pre>
            <p className="mono mt-3 break-all text-[0.72rem] text-[var(--color-gold-bright)]">
              {t("credential.verify")}: {hash ?? "—"}
            </p>
          </article>
        ) : null}
      </section>

      <aside className="space-y-4">
        <section className="card" aria-labelledby="credential-check">
          <h2 id="credential-check" className="card-title">
            {t("badge.verify")}
          </h2>
          <p className="muted text-[0.9rem]">{t("badge.paste")}</p>
          <div className="field mt-3">
            <label htmlFor="credential-check-file">{t("badge.file")}</label>
            <input
              id="credential-check-file"
              type="file"
              accept="application/json,.json"
              onChange={async (event) => {
                const archivo = event.target.files?.[0];
                if (!archivo) return;
                setVerifyText(await archivo.text());
                setVerifyResult({ state: "idle" });
              }}
            />
          </div>
          <div className="field mt-3">
            <label htmlFor="credential-check-hash">{t("credential.verify")} (SHA-256)</label>
            <textarea
              id="credential-check-hash"
              rows={3}
              value={verifyText}
              onChange={(event) => {
                setVerifyText(event.target.value);
                setVerifyResult({ state: "idle" });
              }}
              className="mono text-[0.78rem]"
              placeholder='{"jws":"…","jwk":{…}} o un hash'
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-sm" onClick={() => void verificar()}>
              {t("credential.verify")}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={async () => {
                const { verifyBadge } = await import("@/lib/badge-store");
                const resultado = await verifyBadge(verifyText);
                setVerifyResult({ state: resultado.valid ? "ok" : "bad", ...(resultado.reason ? { reason: resultado.reason } : {}) });
              }}
            >
              Open Badges (firma)
            </button>
          </div>
          {verifyResult.state !== "idle" ? (
            <p
              className={`mono mt-2 text-[0.78rem] ${verifyResult.state === "ok" ? "text-[var(--color-mint)]" : "text-[var(--color-coral)]"}`}
              role="status"
            >
              {verifyResult.state === "ok" ? t("badge.valid") : `${t("badge.invalid")}${verifyResult.reason ? ` · ${verifyResult.reason}` : ""}`}
            </p>
          ) : null}
        </section>

        <section className="card">
          <h2 className="card-title">{t("badge.key")}</h2>
          <p className="muted m-0 text-[0.9rem]">{t("badge.keyNote")}</p>
          <button
            type="button"
            className="btn btn-ghost btn-sm mt-3"
            onClick={() => {
              if (window.confirm(`${t("badge.resetKey")}?`)) void resetIssuerKey();
            }}
          >
            {t("badge.resetKey")}
          </button>
        </section>

        <section className="card">
          <h2 className="card-title">{t("credential.phase2")}</h2>
          <p className="muted m-0 text-[0.9rem]">{t("footer.honesty")}</p>
        </section>
      </aside>
    </div>
  );
}
