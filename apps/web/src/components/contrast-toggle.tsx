"use client";

import { useEffect, useState } from "react";
import { translator, type Locale } from "@secure-t/shared";

/**
 * Alterna el modo de alto contraste. Es un requisito de accesibilidad real
 * (WCAG 2.2 AA para usuarios con baja visión), no un adorno: sube el contraste
 * de texto y bordes y refuerza el anillo de foco.
 */
export function ContrastToggle({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const [high, setHigh] = useState(false);

  useEffect(() => {
    try {
      setHigh(document.documentElement.getAttribute("data-contrast") === "high");
    } catch {
      setHigh(false);
    }
  }, []);

  const toggle = () => {
    const next = !high;
    setHigh(next);
    document.documentElement.setAttribute("data-contrast", next ? "high" : "normal");
    try {
      localStorage.setItem("secure-t-contrast", next ? "high" : "normal");
    } catch {
      /* sin almacenamiento: el cambio vale para esta sesión */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={high}
      className="mono rounded-full border border-[var(--aurum-line)] px-2 py-1 text-[0.7rem] uppercase text-[var(--aurum-muted)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold-bright)]"
      title={t("a11y.theme")}
    >
      <span aria-hidden="true">◐</span>
      <span className="sr-only">{t("a11y.theme")}</span>
      <span className="ml-1">{high ? "AAA" : "AA"}</span>
    </button>
  );
}
