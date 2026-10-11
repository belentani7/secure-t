"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LIBRARY,
  LIBRARY_COSTS,
  LIBRARY_KINDS,
  LIBRARY_LANGS,
  LIBRARY_LEVELS,
  filterLibrary,
  libraryStats,
  translator,
  type LibraryCost,
  type LibraryKind,
  type LibraryLang,
  type LibraryLevel,
  type Locale,
  type TranslationKey
} from "@secure-t/shared";

/**
 * Biblioteca abierta del campus.
 *
 * Enlaza autores, plataformas y documentación oficial — nunca espejos de cursos
 * de pago — y dice en qué idioma está cada recurso antes de que se haga clic.
 * Todo el filtrado es local y determinista: no hay peticiones, no hay cuentas y
 * no se registra qué mira nadie.
 */

const PROGRAMAS: { slug: string; key: TranslationKey }[] = [
  { slug: "ciber-ofensiva", key: "track.ofensiva-profesional.name" },
  { slug: "ciber-defensiva", key: "track.defensa-soc.name" },
  { slug: "ia-aplicada-segura", key: "track.ia-responsable.name" },
  { slug: "gobernanza-compliance", key: "track.ruta-completa.name" }
];

function Chips<T extends string>({
  opciones,
  activas,
  onToggle,
  etiqueta
}: {
  opciones: readonly T[];
  activas: readonly T[];
  onToggle: (valor: T) => void;
  etiqueta: (valor: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group">
      {opciones.map((opcion) => {
        const activa = activas.includes(opcion);
        return (
          <button
            key={opcion}
            type="button"
            onClick={() => onToggle(opcion)}
            aria-pressed={activa}
            className="aurum-chip px-3 py-1 text-xs transition-colors hover:text-[var(--color-gold)]"
          >
            {etiqueta(opcion)}
          </button>
        );
      })}
    </div>
  );
}

export function LibraryView({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const [query, setQuery] = useState("");
  const [kinds, setKinds] = useState<LibraryKind[]>([]);
  const [langs, setLangs] = useState<LibraryLang[]>([]);
  const [costs, setCosts] = useState<LibraryCost[]>([]);
  const [levels, setLevels] = useState<LibraryLevel[]>([]);
  const [course, setCourse] = useState<string>("");

  // El plan de cinco años enlaza aquí con `?curso=`: el filtro llega puesto sin
  // pasar por el servidor ni depender de `useSearchParams` (export estático).
  useEffect(() => {
    const parametro = new URLSearchParams(window.location.search).get("curso");
    if (parametro && PROGRAMAS.some((programa) => programa.slug === parametro)) setCourse(parametro);
  }, []);

  const stats = useMemo(() => libraryStats(), []);
  const resultados = useMemo(
    () =>
      filterLibrary({
        query,
        ...(kinds.length ? { kinds } : {}),
        ...(langs.length ? { langs } : {}),
        ...(costs.length ? { costs } : {}),
        ...(levels.length ? { levels } : {}),
        ...(course ? { course } : {})
      }),
    [query, kinds, langs, costs, levels, course]
  );

  const alternar = <T extends string>(lista: T[], valor: T, setter: (v: T[]) => void) =>
    setter(lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);

  return (
    <div className="wrap section">
      <p className="eyebrow">{t("nav.library")}</p>
      <h1>{t("library.title")}</h1>
      <p className="lead">{t("library.lead")}</p>
      <p className="mono mt-3 text-xs text-[var(--aurum-muted)]">
        {t("library.stats", {
          total: stats.total,
          domains: stats.domains,
          projects: stats.coursesCovered,
          kinds: LIBRARY_KINDS.length
        })}
      </p>

      <div className="aurum-glass mt-8 grid gap-5 p-5">
        <div>
          <label className="mono mb-2 block text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]" htmlFor="library-q">
            {t("nav.search")}
          </label>
          <input
            id="library-q"
            type="search"
            value={query}
            onChange={(evento) => setQuery(evento.target.value)}
            className="w-full rounded border border-[var(--aurum-line)] bg-transparent px-3 py-2 text-sm"
            placeholder="OWASP, ATT&CK, linux, CTF…"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mono mb-2 text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]">{t("library.filter.kind")}</p>
            <Chips
              opciones={LIBRARY_KINDS}
              activas={kinds}
              onToggle={(valor) => alternar(kinds, valor, setKinds)}
              etiqueta={(valor) => t(`library.kind.${valor}` as TranslationKey)}
            />
          </div>
          <div>
            <p className="mono mb-2 text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]">{t("library.filter.lang")}</p>
            <Chips
              opciones={LIBRARY_LANGS}
              activas={langs}
              onToggle={(valor) => alternar(langs, valor, setLangs)}
              etiqueta={(valor) => t(`library.lang.${valor}` as TranslationKey)}
            />
          </div>
          <div>
            <p className="mono mb-2 text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]">{t("library.filter.cost")}</p>
            <Chips
              opciones={LIBRARY_COSTS}
              activas={costs}
              onToggle={(valor) => alternar(costs, valor, setCosts)}
              etiqueta={(valor) => t(`library.cost.${valor}` as TranslationKey)}
            />
          </div>
          <div>
            <p className="mono mb-2 text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]">{t("library.filter.level")}</p>
            <Chips
              opciones={LIBRARY_LEVELS}
              activas={levels}
              onToggle={(valor) => alternar(levels, valor, setLevels)}
              etiqueta={(valor) => t(`library.level.${valor}` as TranslationKey)}
            />
          </div>
        </div>

        <div>
          <label className="mono mb-2 block text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]" htmlFor="library-course">
            {t("library.filter.course")}
          </label>
          <select
            id="library-course"
            value={course}
            onChange={(evento) => setCourse(evento.target.value)}
            className="rounded border border-[var(--aurum-line)] bg-transparent px-3 py-2 text-sm"
          >
            <option value="">{t("library.filter.all")}</option>
            {PROGRAMAS.map((programa) => (
              <option key={programa.slug} value={programa.slug}>
                {t(programa.key)}
              </option>
            ))}
          </select>
        </div>

        <p aria-live="polite" className="mono text-xs text-[var(--color-gold-bright)]">
          {t("library.results", { count: resultados.length })}
        </p>
      </div>

      {resultados.length === 0 ? (
        <p className="mt-8 text-[var(--aurum-muted)]">{t("library.empty")}</p>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {resultados.map((recurso) => (
            <li key={recurso.id} className="aurum-glass flex flex-col gap-2 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="gold-text text-lg font-semibold">{recurso.name}</h2>
                <span className="mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--aurum-muted)]">
                  {t(`library.kind.${recurso.kind}` as TranslationKey)} · {t(`library.level.${recurso.level}` as TranslationKey)}
                </span>
              </div>
              <p className="text-sm text-[var(--aurum-muted)]">{recurso.org}</p>
              <p className="text-sm" lang={recurso.lang === "multi" ? undefined : recurso.lang === "pt" ? "pt-BR" : recurso.lang}>
                {recurso.note}
              </p>
              <p className="mono mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] text-[var(--aurum-muted)]">
                <span>{t(`library.lang.${recurso.lang}` as TranslationKey)}</span>
                <span>{t(`library.cost.${recurso.cost}` as TranslationKey)}</span>
                <span>{recurso.tags.slice(0, 3).join(" · ")}</span>
              </p>
              <a
                className="mt-2 self-start text-sm text-[var(--color-gold)] underline underline-offset-4"
                href={recurso.url}
                target="_blank"
                rel="noopener noreferrer external"
              >
                {t("library.open")}
                <span className="sr-only"> ({t("library.newTab")})</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <section className="aurum-glass mt-10 p-6">
        <h2 className="gold-text text-lg font-semibold">{t("library.rule.title")}</h2>
        <p className="mt-2 text-sm text-[var(--aurum-muted)]">{t("library.rule.body")}</p>
        <p className="mono mt-3 text-[0.68rem] text-[var(--aurum-muted)]">
          {LIBRARY.length} · packages/shared/tests/library.test.ts
        </p>
      </section>
    </div>
  );
}
