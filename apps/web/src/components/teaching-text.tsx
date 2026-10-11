import { translator, type Locale } from "@secure-t/shared";

/**
 * El material docente todavía está en español (pt/en/ca: PLANEADO). Mientras
 * eso siga siendo cierto, cada fragmento se marca con **su** idioma: WCAG 2.2
 * (3.1.2 Language of Parts) exige declarar el idioma de cada trozo, y un lector
 * de pantalla que salta de portugués a español lo agradece.
 *
 * Cuando el contenido se traduzca, esta pieza se queda sin uso y se retira: es
 * una etiqueta honesta, no un apaño permanente.
 */
export function TeachingText({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  if (locale === "es") return <>{children}</>;
  const t = translator(locale);
  return (
    <span lang="es" title={t("content.inSpanish")}>
      {children}
    </span>
  );
}

/** Distintivo visible y accesible del mismo hecho. */
export function TeachingBadge({ locale }: { locale: Locale }) {
  if (locale === "es") return null;
  const t = translator(locale);
  return (
    <span
      lang={locale}
      className="mono rounded border border-[var(--aurum-line)] px-1.5 py-0.5 text-[0.62rem] uppercase tracking-[0.12em] text-[var(--aurum-muted)]"
    >
      {t("content.inSpanish")}
    </span>
  );
}
