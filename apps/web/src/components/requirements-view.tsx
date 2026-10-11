import Link from "next/link";
import {
  DOMAINS,
  LEVELS,
  REQUIREMENTS,
  STATUSES,
  TARGETS,
  mustGaps,
  requirementStats,
  translator,
  type DomainId,
  type Level,
  type RequirementStatus,
  type TranslationKey,
  type Locale
} from "@secure-t/shared";
import { localePath, SITE } from "@/lib/site";

/**
 * Requisitos de la plataforma, a la vista.
 *
 * La página no resume «lo bien que va todo»: enseña el registro completo —89
 * requisitos, su nivel, su norma, su estado— y, separada y con el mismo
 * tamaño, **la lista de lo que no está cerrado y por qué**. Los títulos y los
 * motivos viajan en español porque son la fuente en código (el documento
 * técnico), igual que las fichas de estándares; lo que sí se traduce en los
 * cuatro idiomas es el marco: qué es un MUST, qué significa cada estado, qué
 * exige el listón y dónde está cada cosa.
 */

const TONO_ESTADO: Record<RequirementStatus, string> = {
  VERIFIED: "text-[var(--color-mint)]",
  CI: "text-[var(--color-mint)]",
  PARTIAL: "text-[var(--color-saffron)]",
  PLANNED: "text-[var(--color-azure)]",
  BLOCKED: "text-[var(--color-coral)]",
  NOT_VERIFIED: "text-[var(--color-coral)]",
  ACCEPTED: "text-[var(--color-saffron)]",
  OUT_OF_SCOPE: "text-[var(--aurum-muted)]"
};

const LISTON: { clave: TranslationKey; valor: string; nota?: string }[] = [
  { clave: "req.target.wcag", valor: TARGETS.wcag.required, nota: TARGETS.wcag.stretch },
  { clave: "req.target.asvs", valor: `OWASP ASVS 5.0 · ${TARGETS.asvs.target}`, nota: `${TARGETS.asvs.stretch}` },
  {
    clave: "req.target.lighthouse",
    valor: `${TARGETS.lighthouse.performance} / ${TARGETS.lighthouse.accessibility} / ${TARGETS.lighthouse.bestPractices} / ${TARGETS.lighthouse.seo}`
  },
  {
    clave: "req.target.cwv",
    valor: `LCP ≤ ${TARGETS.cwv.lcpMs} ms · INP ≤ ${TARGETS.cwv.inpMs} ms · CLS ≤ ${TARGETS.cwv.cls}`
  },
  { clave: "req.target.coverage", valor: `≥ ${TARGETS.coverage} %` },
  { clave: "req.target.js", valor: `≤ ${TARGETS.jsBudgetKb.target} kB`, nota: `${TARGETS.jsBudgetKb.hard} kB` },
  { clave: "req.target.tests", valor: `≥ ${TARGETS.testsFloor}` },
  { clave: "req.target.pii", valor: `${TARGETS.pii}` },
  { clave: "req.target.vulns", valor: `${TARGETS.criticalVulnerabilities}` }
];

export function RequirementsView({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const stats = requirementStats();
  const bloqueos = mustGaps();
  const dominios = Object.keys(DOMAINS) as DomainId[];

  return (
    <div className="wrap section">
      <p className="eyebrow">{t("nav.requirements")}</p>
      <h1>{t("req.title")}</h1>
      <p className="lead">{t("req.lead")}</p>
      <p className="muted mt-2 text-[0.95rem]">{t("req.method")}</p>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label={t("req.kpi")}>
        {[
          { etiqueta: t("req.kpi.total"), valor: `${stats.total}`, nota: `${Object.keys(DOMAINS).length} ${t("req.kpi.domains")}` },
          {
            etiqueta: t("req.kpi.green"),
            valor: `${stats.greenShare.toString().replace(".", ",")} %`,
            nota: `${stats.byStatus.VERIFIED + stats.byStatus.CI} ${t("req.kpi.of")} ${stats.total}`
          },
          { etiqueta: t("req.kpi.gaps"), valor: `${stats.gaps.length}`, nota: t("req.kpi.gapsNote") },
          {
            etiqueta: t("req.kpi.mustGaps"),
            valor: `${bloqueos.length}`,
            nota: t("req.kpi.mustGapsNote")
          }
        ].map((kpi) => (
          <div key={kpi.etiqueta} className="aurum-glass p-5">
            <p className="mono m-0 text-[0.7rem] uppercase tracking-[0.14em] text-[var(--aurum-muted)]">{kpi.etiqueta}</p>
            <p className="gold-text m-0 text-3xl font-semibold">{kpi.valor}</p>
            <p className="muted m-0 text-[0.88rem]">{kpi.nota}</p>
          </div>
        ))}
      </section>

      <hr className="hairline" />

      <section aria-labelledby="req-liston">
        <h2 id="req-liston">{t("req.targets.title")}</h2>
        <p className="lead">{t("req.targets.lead")}</p>
        <ul className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {LISTON.map((fila) => (
            <li key={fila.clave} className="aurum-glass p-4">
              <p className="m-0 font-semibold text-[var(--color-gold-bright)]">{t(fila.clave)}</p>
              <p className="m-0 text-[0.95rem]">{fila.valor}</p>
              {fila.nota ? <p className="muted m-0 text-[0.85rem]">{fila.nota}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      <hr className="hairline" />

      <section aria-labelledby="req-estados">
        <h2 id="req-estados">{t("req.status.title")}</h2>
        <p className="lead">{t("req.status.lead")}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {STATUSES.map((status) => (
            <div key={status} className="aurum-glass p-4">
              <p className={`mono m-0 text-[0.7rem] uppercase tracking-[0.14em] ${TONO_ESTADO[status]}`}>
                {status} · {stats.byStatus[status]}
              </p>
              <p className="muted m-0 text-[0.88rem]">{t(`req.status.${status}` as TranslationKey)}</p>
            </div>
          ))}
        </div>
        <p className="mono mt-4 text-[0.75rem] text-[var(--aurum-muted)]">
          {LEVELS.map((nivel: Level) => `${nivel}: ${t(`req.level.${nivel}` as TranslationKey)}`).join(" · ")}
        </p>
      </section>

      <hr className="hairline" />

      <section aria-labelledby="req-dominios">
        <h2 id="req-dominios">{t("req.domains.title")}</h2>
        <p className="lead">{t("req.domains.lead")}</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dominios.map((domain) => {
            const delDominio = REQUIREMENTS.filter((r) => r.domain === domain);
            const verde = delDominio.filter((r) => r.status === "VERIFIED" || r.status === "CI").length;
            return (
              <li key={domain} className="aurum-glass p-4">
                <p className="m-0 font-semibold text-[var(--color-gold-bright)]">{t(`req.domain.${domain}` as TranslationKey)}</p>
                <p className="muted m-0 text-[0.88rem]">
                  {delDominio.length} {t("req.kpi.requirements")} · {verde} {t("req.domains.green")}
                </p>
                <p className="mono m-0 text-[0.72rem] text-[var(--aurum-muted)]">
                  {delDominio
                    .map((r) => r.id)
                    .slice(0, 6)
                    .join(" · ")}
                  {delDominio.length > 6 ? " · …" : ""}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <hr className="hairline" />

      <section aria-labelledby="req-falta">
        <h2 id="req-falta">{t("req.gaps.title")}</h2>
        <p className="lead">{t("req.gaps.lead")}</p>
        <ul className="mt-5 space-y-3">
          {stats.gaps.map((r) => (
            <li key={r.id} className="aurum-glass p-4">
              <p className="m-0 flex flex-wrap items-baseline gap-2">
                <span className="mono text-[0.75rem] text-[var(--aurum-muted)]">{r.id}</span>
                <span className={`mono text-[0.72rem] uppercase tracking-[0.12em] ${TONO_ESTADO[r.status]}`}>{r.status}</span>
                <span className="font-semibold">{r.title}</span>
                <span className="mono text-[0.7rem] uppercase text-[var(--aurum-muted)]">{r.level}</span>
              </p>
              <p className="muted mt-1 mb-0 text-[0.9rem]">{r.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <hr className="hairline" />

      <section aria-labelledby="req-verificar">
        <h2 id="req-verificar">{t("req.verify.title")}</h2>
        <p className="lead">{t("req.verify.lead")}</p>
        <pre className="aurum-glass mt-4 overflow-x-auto p-4 text-[0.82rem] leading-relaxed">
          <code>{["pnpm requirements", "pnpm test", "python -m pytest -q tests/", "pnpm audit:site", "pnpm e2e"].join("\n")}</code>
        </pre>
        <p className="muted mt-4 text-[0.95rem]">{t("req.verify.note")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            className="btn"
            href={`${SITE.repo}/blob/main/docs/REQUISITOS.md`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("req.verify.doc")}
          </a>
          <Link className="btn btn-ghost" href={localePath(locale, "/estandares")}>
            {t("standards.title")}
          </Link>
          <Link className="btn btn-ghost" href={localePath(locale, "/experiencia")}>
            {t("nav.experience")}
          </Link>
        </div>
      </section>
    </div>
  );
}
