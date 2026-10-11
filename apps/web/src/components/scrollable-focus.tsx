"use client";

import { useEffect } from "react";

/**
 * Hace alcanzables con el teclado las regiones que se desplazan.
 *
 * Regla `scrollable-region-focusable` de axe: un bloque con desplazamiento
 * propio (un `<pre>` de código largo, una tabla ancha) tiene que poder
 * recorrerse sin ratón. El contenido del campus viene de Markdown, así que no
 * se puede anotar cada bloque a mano: se marcan aquí, y se vuelve a marcar
 * cuando el contenido cambia (los cuestionarios y el agente insertan nodos).
 */
export function ScrollableFocus() {
  useEffect(() => {
    const marcar = () => {
      for (const elemento of document.querySelectorAll<HTMLElement>("pre, .table-wrap")) {
        if (elemento.hasAttribute("tabindex")) continue;
        const desborda =
          elemento.scrollWidth > elemento.clientWidth + 1 || elemento.scrollHeight > elemento.clientHeight + 1;
        if (desborda) {
          elemento.setAttribute("tabindex", "0");
          elemento.setAttribute("role", "group");
        }
      }
    };
    marcar();
    const observador = new MutationObserver(marcar);
    observador.observe(document.body, { childList: true, subtree: true });
    return () => observador.disconnect();
  }, []);

  return null;
}
