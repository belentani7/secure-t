import Link from "next/link";
import { translator, type Locale } from "@secure-t/shared";
import { ATTENTION, BALANCE, CHUNKING, DURATION, EASING, MEASURE, MOTION, RIO, TARGETS, TYPE_SCALE } from "@secure-t/ui/psychology";
import { localePath, SITE } from "@/lib/site";
import { RioHorizon } from "./rio-horizon";

/**
 * Experiencia — la página que enseña la investigación detrás del diseño.
 *
 * No es una página de escaparate: es el cuaderno de laboratorio del campus. Cada
 * número que se ve aquí es el mismo que usan el CSS y los componentes, y está
 * comprobado por un test. Si un día alguien sube el dorado al 40 % de la
 * pantalla o hace botones de 30 píxeles, esta página y su prueba lo dirán.
 */

interface Ley {
  id: string;
  nombre: string;
  enunciado: string;
  aplicacion: string;
  cifra: string;
}

function leyes(t: ReturnType<typeof translator>): Ley[] {
  return [
    {
      id: "hick",
      nombre: "Ley de Hick",
      enunciado: t("experience.hick.body"),
      aplicacion: t("experience.hick.use"),
      cifra: `${CHUNKING.maxPrimary} ${t("experience.laws.links")}`
    },
    {
      id: "fitts",
      nombre: "Ley de Fitts",
      enunciado: t("experience.fitts.body"),
      aplicacion: t("experience.fitts.use"),
      cifra: `${TARGETS.minPx} px · ${TARGETS.gapPx} px`
    },
    {
      id: "miller",
      nombre: "Ley de Miller",
      enunciado: t("experience.miller.body"),
      aplicacion: t("experience.miller.use"),
      cifra: `${CHUNKING.maxVisibleFilters} · ${CHUNKING.maxFooterLinks}`
    },
    {
      id: "vorrestorff",
      nombre: "Efecto Von Restorff",
      enunciado: t("experience.vonrestorff.body"),
      aplicacion: t("experience.vonrestorff.use"),
      cifra: `${ATTENTION.maxAccents} ${t("experience.laws.accent")}`
    },
    {
      id: "aesthetic",
      nombre: "Efecto estético-usabilidad",
      enunciado: t("experience.aesthetic.body"),
      aplicacion: t("experience.aesthetic.use"),
      cifra: `${Math.round(BALANCE.dominant.share / BALANCE.accent.share)}:1`
    },
    {
      id: "peak",
      nombre: "Regla del pico-final",
      enunciado: t("experience.peak.body"),
      aplicacion: t("experience.peak.use"),
      cifra: "2"
    }
  ];
}

export function ExperienceView({ locale }: { locale: Locale }) {
  const t = translator(locale);
  return (
    <div className="wrap section">
      <p className="eyebrow">{t("nav.experience")}</p>
      <h1>{t("experience.title")}</h1>
      <p className="lead">{t("experience.lead")}</p>
      <p className="mono mt-3 text-xs text-[var(--aurum-muted)]">{t("experience.method")}</p>

      <section className="mt-12" aria-labelledby="psy-color">
        <h2 id="psy-color">{t("experience.color.title")}</h2>
        <p className="lead">{t("experience.color.lead")}</p>
        <div className="grid-3 mt-6">
          <article className="aurum-glass p-5">
            <p className="mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--aurum-muted)]">
              {t("experience.color.dominant")}
            </p>
            <p className="gold-text text-3xl font-semibold">{BALANCE.dominant.share} %</p>
            <p className="muted m-0 text-[0.92rem]">{t("experience.color.dominantNote")}</p>
          </article>
          <article className="aurum-glass p-5">
            <p className="mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--aurum-muted)]">
              {t("experience.color.secondary")}
            </p>
            <p className="gold-text text-3xl font-semibold">{BALANCE.secondary.share} %</p>
            <p className="muted m-0 text-[0.92rem]">{t("experience.color.secondaryNote")}</p>
          </article>
          <article className="aurum-glass p-5">
            <p className="mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--aurum-muted)]">
              {t("experience.color.accent")}
            </p>
            <p className="gold-text text-3xl font-semibold">{BALANCE.accent.share} %</p>
            <p className="muted m-0 text-[0.92rem]">{t("experience.color.accentNote")}</p>
          </article>
        </div>
        <p className="muted mt-4 text-[0.95rem]">{t("experience.color.why")}</p>
      </section>

      <hr className="hairline" />

      <section aria-labelledby="psy-lectura">
        <h2 id="psy-lectura">{t("experience.type.title")}</h2>
        <p className="lead">{t("experience.type.lead")}</p>
        <div className="grid-2 mt-5">
          <div className="aurum-glass p-5">
            <p className="mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--aurum-muted)]">
              {t("experience.type.scale")}
            </p>
            <p className="m-0 text-[1.5625rem] leading-snug">1,25 × {TYPE_SCALE.ratio}</p>
            <p className="muted m-0 text-[0.92rem]">{t("experience.type.scaleNote")}</p>
          </div>
          <div className="aurum-glass p-5">
            <p className="mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--aurum-muted)]">
              {t("experience.type.measure")}
            </p>
            <p className="m-0 text-[1.5625rem] leading-snug">
              {MEASURE.minCh}–{MEASURE.maxCh} {t("experience.type.chars")}
            </p>
            <p className="muted m-0 text-[0.92rem]">{t("experience.type.measureNote")}</p>
          </div>
        </div>
      </section>

      <hr className="hairline" />

      <section aria-labelledby="psy-leyes">
        <h2 id="psy-leyes">{t("experience.laws.title")}</h2>
        <p className="lead">{t("experience.laws.lead")}</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {leyes(t).map((ley) => (
            <li key={ley.id} className="aurum-glass p-5">
              <header className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="card-title m-0">{ley.nombre}</h3>
                <span className="mono text-[0.72rem] text-[var(--color-gold-bright)]">{ley.cifra}</span>
              </header>
              <p className="muted mt-2 text-[0.95rem]">{ley.enunciado}</p>
              <p className="m-0 text-[0.95rem]">{ley.aplicacion}</p>
            </li>
          ))}
        </ul>
      </section>

      <hr className="hairline" />

      <section aria-labelledby="psy-movimiento">
        <h2 id="psy-movimiento">{t("experience.motion.title")}</h2>
        <p className="lead">{t("experience.motion.lead")}</p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { valor: `${MOTION.maxRevealShift} px`, clave: t("experience.motion.shift") },
            { valor: `${MOTION.maxHoverShift} px`, clave: t("experience.motion.hover") },
            { valor: `${DURATION.calmMs} ms`, clave: t("experience.motion.calm") },
            { valor: `${RIO.driftSeconds} s`, clave: t("experience.motion.ambient") }
          ].map((dato) => (
            <div key={dato.clave} className="aurum-glass p-4">
              <dt className="mono text-[0.72rem] uppercase tracking-[0.12em] text-[var(--aurum-muted)]">{dato.clave}</dt>
              <dd className="gold-text m-0 text-2xl font-semibold">{dato.valor}</dd>
            </div>
          ))}
        </dl>
        <p className="muted mt-4 text-[0.95rem]">{t("experience.motion.note")}</p>
        <p className="mono mt-2 text-[0.72rem] text-[var(--aurum-muted)]">
          {EASING.out} · {t("experience.motion.noBounce")}
        </p>
      </section>

      <hr className="hairline" />

      <section aria-labelledby="psy-rio">
        <h2 id="psy-rio">{t("experience.rio.title")}</h2>
        <p className="lead">{t("experience.rio.lead")}</p>
        <div className="rio-cierre mt-6" data-psy-off>
          <RioHorizon scope="cierre" />
        </div>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            { titulo: t("experience.rio.svg"), cuerpo: t("experience.rio.svgNote") },
            { titulo: t("experience.rio.shadow"), cuerpo: t("experience.rio.shadowNote") },
            { titulo: t("experience.rio.quiet"), cuerpo: t("experience.rio.quietNote") }
          ].map((item) => (
            <li key={item.titulo} className="aurum-glass p-4">
              <p className="mb-1 font-semibold text-[var(--color-gold-bright)]">{item.titulo}</p>
              <p className="muted m-0 text-[0.92rem]">{item.cuerpo}</p>
            </li>
          ))}
        </ul>
      </section>

      <hr className="hairline" />

      <section aria-labelledby="psy-prueba">
        <h2 id="psy-prueba">{t("experience.proof.title")}</h2>
        <p className="lead">{t("experience.proof.lead")}</p>
        <ul className="mt-4 space-y-2 text-[0.95rem]">
          <li>
            <code>packages/ui/src/psychology.ts</code> — {t("experience.proof.code")}
          </li>
          <li>
            <code>packages/ui/tests/psychology.test.ts</code> — {t("experience.proof.test")}
          </li>
          <li>
            <code>apps/web/src/app/globals.css</code> — {t("experience.proof.css")}
          </li>
        </ul>
        <p className="muted mt-4 text-[0.95rem]">{t("experience.proof.highContrast")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn" href={localePath(locale, "/programas")}>
            {t("hero.cta.campus")}
          </Link>
          <a className="btn btn-ghost" href={`${SITE.repo}/blob/main/docs/PSICOLOGIA-Y-EXPERIENCIA.md`} rel="noopener noreferrer" target="_blank">
            {t("experience.proof.docs")}
          </a>
        </div>
      </section>
    </div>
  );
}
