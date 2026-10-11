/**
 * La psicología aplicada, comprobada.
 *
 * `packages/ui/src/psychology.ts` no es un documento: es el contrato que el CSS
 * y los componentes deben cumplir. Estos tests recorren los números y exigen lo
 * que la investigación sostiene —objetivos grandes, decisiones troceadas,
 * movimiento pequeño— y lo que la norma exige (WCAG 2.2 y 2.3.3). Si alguien
 * cambia un valor por gusto, aquí se entera.
 *
 * Además se comprueba que el CSS real use los mismos límites: un token que
 * nadie aplica es una promesa de folleto.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ATTENTION,
  BALANCE,
  CHUNKING,
  DURATION,
  EASING,
  MEASURE,
  MOTION,
  RIO,
  TARGETS,
  TYPE_SCALE,
  balanceShare,
  clampMeasure,
  fittsOk,
  hickTime,
  motionIsGentle
} from "../src/psychology";

const root = join(__dirname, "..", "..", "..");
const leer = (rel: string) => readFileSync(join(root, rel), "utf8");
const css = leer("apps/web/src/app/globals.css");

describe("balance de color 60·30·10", () => {
  it("suma cien y el acento es la parte pequeña", () => {
    const total = balanceShare("fondo") + balanceShare("superficies") + balanceShare("acción");
    expect(Math.round(total * 100)).toBe(100);
    expect(BALANCE.accent.share).toBeLessThanOrEqual(10);
    expect(BALANCE.dominant.share).toBeGreaterThanOrEqual(BALANCE.secondary.share * 1.5);
  });

  it("el CSS declara el acento y la superficie como variables, no a mano", () => {
    expect(css).toContain("--color-gold:");
    expect(css).toContain("--aurum-glass:");
    expect(css).toContain("--aurum-bg:");
  });
});

describe("tipografía y medida de lectura", () => {
  it("la escala es modular y creciente", () => {
    const pasos = Object.values(TYPE_SCALE.steps);
    for (let i = 1; i < pasos.length; i += 1) expect(pasos[i]!).toBeGreaterThan(pasos[i - 1]!);
    const razon = TYPE_SCALE.steps.h3 / TYPE_SCALE.steps.lead;
    expect(Math.abs(razon - TYPE_SCALE.ratio)).toBeLessThan(0.08);
  });

  it("la línea no pasa de 80 caracteres ni baja de 45", () => {
    expect(clampMeasure(10)).toBe(MEASURE.minCh);
    expect(clampMeasure(500)).toBe(MEASURE.maxCh);
    expect(clampMeasure(68)).toBe(68);
    expect(css).toContain(`--psy-measure-body: ${MEASURE.bodyCh}ch`);
  });
});

describe("leyes de decisión", () => {
  it("Hick se cumple: se elige antes con seis opciones que con trece", () => {
    expect(hickTime(6)).toBeLessThan(hickTime(13));
    expect(CHUNKING.maxPrimary).toBeLessThanOrEqual(7);
  });

  it("la navegación del producto respeta el máximo primario", () => {
    const site = leer("apps/web/src/lib/site.ts");
    const primarios = (site.match(/primary: true/g) ?? []).length;
    expect(primarios).toBe(CHUNKING.maxPrimary);
    expect(primarios).toBeLessThanOrEqual(7);
    // Y lo demás sigue accesible: no se ha escondido, se ha plegado.
    expect(site).toContain('path: "/privacidad"');
    expect(leer("apps/web/src/components/site-header.tsx")).toContain("<details");
  });

  it("Miller se respeta en los grupos de contenido", () => {
    expect(CHUNKING.maxVisibleFilters).toBeLessThanOrEqual(8);
    expect(CHUNKING.maxFooterLinks).toBeLessThanOrEqual(14);
  });
});

describe("ley de Fitts: objetivos alcanzables", () => {
  it("el mínimo táctil es 44 px y hay separación entre objetivos", () => {
    expect(TARGETS.minPx).toBeGreaterThanOrEqual(44);
    expect(TARGETS.gapPx).toBeGreaterThanOrEqual(8);
    expect(fittsOk(44, 8, true)).toBe(true);
    expect(fittsOk(40, 8, true)).toBe(false);
    expect(fittsOk(36, 8, false)).toBe(true);
    expect(fittsOk(20, 8, false)).toBe(false);
  });

  it("el CSS aplica el mínimo a los controles y la separación entre botones", () => {
    expect(css).toContain(`--psy-target: ${TARGETS.minPx}px`);
    expect(css).toMatch(/min-height:\s*var\(--psy-target\)/);
    expect(css).toMatch(/--psy-target-gap:\s*8px/);
    expect(css).toContain(".btn + .btn");
  });
});

describe("movimiento respetuoso (WCAG 2.3.3)", () => {
  it("los límites de movimiento son pequeños por diseño", () => {
    expect(MOTION.maxRevealShift).toBeLessThanOrEqual(12);
    expect(MOTION.maxHoverShift).toBeLessThanOrEqual(2);
    expect(MOTION.maxScale).toBeLessThanOrEqual(1.02);
    expect(MOTION.forbidden).toContain("parallax de pantalla completa");
  });

  it("duraciones dentro de lo que el ojo percibe como reacción", () => {
    expect(DURATION.rules.min).toBeGreaterThanOrEqual(90);
    expect(DURATION.rules.maxInteraction).toBeLessThanOrEqual(400);
    expect(DURATION.rules.ambientMin).toBeGreaterThanOrEqual(12_000);
    expect(EASING.rejectedBounce).toBe(true);
  });

  it("la comprobación de suavidad devuelve falso cuando algo se pasa", () => {
    expect(motionIsGentle({ revealShift: 12, hoverShift: 1, scale: 1, durationMs: 320 })).toBe(true);
    expect(motionIsGentle({ revealShift: 200, hoverShift: 1, scale: 1, durationMs: 320 })).toBe(false);
    expect(motionIsGentle({ revealShift: 12, hoverShift: 1, scale: 1.4, durationMs: 320 })).toBe(false);
    expect(motionIsGentle({ revealShift: 12, hoverShift: 1, scale: 1, durationMs: 900 })).toBe(false);
  });

  it("todo lo animado vive dentro de prefers-reduced-motion", () => {
    // Cada @keyframes declarado tiene su uso envuelto en la consulta de movimiento.
    const bloques = css.split("@media (prefers-reduced-motion: no-preference)");
    expect(bloques.length).toBeGreaterThan(1);
    for (const animacion of ["rio-bruma", "rio-luz", "psy-cross-fade", "aurum-deriva-a", "aurum-deriva-b"]) {
      expect(css).toContain(animacion);
      expect(css).toMatch(new RegExp(`prefers-reduced-motion[\\s\\S]{0,4000}${animacion}`));
    }
    // Y existe la red de seguridad global para quien pide quietud.
    expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]{0,400}animation-duration/);
  });

  it("el reveal sólo oculta cuando hay JavaScript y se confirmó la preferencia", () => {
    const motion = leer("apps/web/src/components/motion-rhythm.tsx");
    expect(motion).toContain('raiz.dataset.psy = "on"');
    expect(motion).toContain("prefers-reduced-motion: reduce");
    expect(motion).toContain("IntersectionObserver");
    expect(css).toContain('html[data-psy="on"] .psy-reveal');
    // Sin la marca, nada está oculto: la página funciona sin JS.
    expect(css).not.toMatch(/^\.psy-reveal\s*\{[^}]*opacity:\s*0/m);
  });
});

describe("atención y recuerdo", () => {
  it("un solo acento por vista (Von Restorff)", () => {
    expect(ATTENTION.maxAccents).toBe(1);
    expect(ATTENTION.maxSimultaneousBadges).toBeLessThanOrEqual(3);
  });
});

describe("el guiño de Río", () => {
  it("es decoración: SVG en línea, sin peticiones y sin movimiento brusco", () => {
    const horizonte = leer("apps/web/src/components/rio-horizon.tsx");
    // Se comprueba el código, no los comentarios (que explican, justamente,
    // por qué no hay imágenes).
    const codigo = horizonte.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    expect(horizonte).toContain('aria-hidden="true"');
    expect(codigo).toContain("<svg");
    expect(codigo).not.toMatch(/https?:\/\//);
    expect(codigo).not.toMatch(/<img|background-image/);
    // Las únicas `url()` permitidas son referencias internas al propio SVG.
    for (const referencia of codigo.match(/url\([^)]*\)/g) ?? []) {
      expect(referencia, `${referencia} sale del documento`).toMatch(/^url\(#/);
    }
    expect(horizonte).toContain("Corcovado");
    expect(horizonte).toContain("Pan de Azúcar");
    expect(RIO.opacity).toBeLessThanOrEqual(0.6);
    expect(RIO.driftSeconds).toBeGreaterThanOrEqual(12_000 / 1000);
  });

  it("está en la portada, abre y cierra la visita, y desaparece en alto contraste", () => {
    const landing = leer("apps/web/src/components/landing.tsx");
    expect((landing.match(/<RioHorizon /g) ?? []).length).toBe(2);
    expect(landing).toContain('scope="hero"');
    expect(landing).toContain('scope="cierre"');
    expect(css).toContain('[data-contrast="high"] .aurum-rio');
    expect(css).toMatch(/\[data-contrast="high"\] \.aurum-rio\s*\{\s*display: none/);
  });

  it("no mete texto en el documento: el guiño no se lee, se ve", () => {
    const horizonte = leer("apps/web/src/components/rio-horizon.tsx");
    const sinComentarios = horizonte.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    // Ni un <text> ni un título accesible dentro del SVG.
    expect(sinComentarios).not.toMatch(/<text|<title|<desc|aria-label/);
  });
});

describe("transiciones entre páginas", () => {
  it("usan View Transitions nativas, sin librería y con fundido corto", () => {
    expect(css).toContain("@view-transition");
    expect(css).toContain("::view-transition-new(root)");
    expect(css).toMatch(/psy-cross-fade 220ms/);
    // Sin dependencias nuevas: el paquete de la web no crece por animar.
    const pkg = JSON.parse(leer("apps/web/package.json")) as { dependencies: Record<string, string> };
    for (const nombre of Object.keys(pkg.dependencies)) {
      expect(nombre, `${nombre} no es una librería de animación`).not.toMatch(/framer-motion|^motion$|gsap|animejs|react-spring|aos|lottie/i);
    }
  });
});

describe("las fuentes están declaradas, no insinuadas", () => {
  it("el código cita la investigación y no confunde mínimos normativos", () => {
    const fuente = leer("packages/ui/src/psychology.ts");
    expect(fuente).toContain("Journal of Consumer Research");
    expect(fuente).toContain("Zhou");
    expect(TARGETS.minPx).toBeGreaterThan(TARGETS.wcagMinimumPx);
    // El mínimo de la casa no se presenta como el de la norma.
    expect(fuente).toContain("WCAG 2.2 SC 2.5.8 (AA)");
    expect(fuente).toContain("2.5.5 (AAA)");
  });
});
