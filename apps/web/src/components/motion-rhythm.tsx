"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
// Sólo constantes: la medición sobre el export real da 0,4 kB comprimidos y evita
// que servidor y cliente se desincronicen con números escritos dos veces.
import { DURATION, MOTION } from "@secure-t/ui/psychology";

/**
 * Ritmo de aparición del contenido.
 *
 * La página no entra de golpe: los bloques suben **doce píxeles** y aparecen al
 * entrar en pantalla, con un escalonado de 45 ms que sólo alcanza a ocho
 * elementos (más sería una cascada, y una cascada cansa). Es deliberadamente
 * sobrio: se aplica a bloques, nunca a texto suelto, nunca a tablas y nunca a
 * nada que se mueva más de lo que el sistema vestibular tolera (WCAG 2.3.3).
 *
 * Tres seguridades, porque un reveal mal hecho deja la página en blanco:
 *  1. El CSS sólo oculta cuando `html[data-psy="on"]`, y esa marca la pone este
 *     componente **después** de comprobar que hay JavaScript: sin JS, todo
 *     visible desde el primer píxel (requisito del campus: funciona sin JS).
 *  2. Con `prefers-reduced-motion: reduce` no se marca nada: contenido quieto y
 *     entero.
 *  3. Si el navegador no tiene `IntersectionObserver`, tampoco se marca.
 */

const SELECTOR = [
  "main section",
  "main article.card",
  "main .card",
  "main .aurum-glass",
  "main dl",
  "main ul.campus-index"
].join(", ");

export function MotionRhythm() {
  const pathname = usePathname();

  useEffect(() => {
    const raiz = document.documentElement;
    const prefiereQuieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefiereQuieto.matches || typeof IntersectionObserver === "undefined") {
      raiz.removeAttribute("data-psy");
      return;
    }

    const nodos = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
      (nodo) =>
        !nodo.closest("[data-psy-off]") &&
        !nodo.matches("table, [data-psy-off]") &&
        // Un bloque ya visible al cargar no se anima: no hay nada que revelar.
        nodo.getBoundingClientRect().top > window.innerHeight * 0.85
    );
    if (nodos.length === 0) return;

    raiz.dataset.psy = "on";
    const observador = new IntersectionObserver(
      (entradas) => {
        let indice = 0;
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const nodo = entrada.target as HTMLElement;
          nodo.style.setProperty("--psy-delay", `${Math.min(indice, MOTION.maxStaggerItems) * MOTION.staggerMs}ms`);
          nodo.classList.add("psy-in");
          observador.unobserve(nodo);
          indice += 1;
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    for (const nodo of nodos) {
      nodo.classList.add("psy-reveal");
      observador.observe(nodo);
    }

    // Si alguien cambia la preferencia con la página abierta, se respeta al momento.
    const alCambiar = () => {
      if (!prefiereQuieto.matches) return;
      raiz.removeAttribute("data-psy");
      for (const nodo of nodos) nodo.classList.add("psy-in");
    };
    prefiereQuieto.addEventListener("change", alCambiar);

    return () => {
      observador.disconnect();
      prefiereQuieto.removeEventListener("change", alCambiar);
    };
  }, [pathname]);

  return null;
}

/** Duración publicada para que el CSS y el JS no se separen (la usa `globals.css`). */
export const PSY_CALM_MS = DURATION.calmMs;
