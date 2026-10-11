/**
 * Horizonte de Río — el guiño de la casa.
 *
 * Detrás del contenido de la portada, casi invisible, están el **Cristo
 * Redentor** sobre el Corcovado y el **Pan de Azúcar**, con la bruma de la
 * bahía y las luces de la ciudad encendiéndose y apagándose muy despacio. Es una
 * sombra: se ve si se mira, y no molesta si no se mira.
 *
 * Decisiones que no son estéticas:
 *  - **SVG en línea**, no una imagen. El campus promete cero peticiones a
 *    terceros y funciona sin conexión (promesa P3): un `background-image` con una
 *    foto de Río rompería las dos cosas. Aquí el dibujo viaja dentro del HTML y
 *    pesa menos que un párrafo.
 *  - **Decoración invisible para quien no ve**: `aria-hidden` y `focusable`
 *    apagado, sin texto alternativo que ensucie el lector de pantalla.
 *  - **Movimiento mínimo**: deriva de bruma (96 s) y parpadeo de luces (7 s),
 *    sin parallax y sin desplazar nada de sitio. Con `prefers-reduced-motion` la
 *    silueta queda quieta, entera y igual de bonita (WCAG 2.3.3).
 *  - **Tonos más oscuros que el fondo**: las siluetas son negro sobre negro con
 *    un filo dorado tenue; nunca compiten con el texto.
 *
 * El componente se renderiza en el servidor: cero JavaScript.
 */

import { RIO } from "@secure-t/ui/psychology";

/** Luces de la ciudad: x, y, radio y retardo de encendido. */
const LUCES: readonly [number, number, number, number][] = [
  [318, 268, 2.2, 0],
  [352, 274, 1.6, 2.4],
  [396, 262, 2.6, 1.1],
  [438, 278, 1.5, 4.2],
  [472, 266, 2.1, 0.6],
  [512, 282, 1.7, 3.3],
  [548, 270, 2.4, 5.1],
  [588, 284, 1.5, 1.8],
  [628, 272, 2.2, 3.9],
  [668, 286, 1.6, 0.3],
  [706, 274, 2.5, 2.7],
  [742, 288, 1.7, 4.8],
  [782, 276, 2.0, 1.4],
  [820, 290, 1.5, 3.6],
  [862, 278, 2.3, 0.9],
  [902, 288, 1.6, 5.4],
  [944, 276, 2.1, 2.1],
  [986, 286, 1.5, 4.5],
  [1028, 272, 2.4, 0.4],
  [1068, 282, 1.7, 3.1]
] as const;

export function RioHorizon({ scope = "hero" }: { scope?: "hero" | "cierre" } = {}) {
  // Los `id` de los degradados son únicos por instancia: el validador de la casa
  // no admite ids repetidos, y la portada lleva el horizonte dos veces.
  const id = (nombre: string) => `rio-${scope}-${nombre}`;
  return (
    <span aria-hidden="true" className="aurum-rio" data-marco={RIO.landmark}>
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
        role="presentation"
        focusable="false"
        className="aurum-rio__lienzo"
      >
        <defs>
          {/* Bruma de la bahía: dorado muy apagado que se funde con el negro. */}
          <linearGradient id={id("bruma")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2d477" stopOpacity="0.10" />
            <stop offset="45%" stopColor="#d4af37" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#07070a" stopOpacity="0" />
          </linearGradient>
          {/* Filo del horizonte: la única línea dorada, y es finísima. */}
          <linearGradient id={id("filo")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
            <stop offset="22%" stopColor="#f2d477" stopOpacity="0.5" />
            <stop offset="58%" stopColor="#d4af37" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </linearGradient>
          {/* Montañas lejanas: más claras por la distancia atmosférica. */}
          <linearGradient id={id("lejos")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141420" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#07070a" stopOpacity="1" />
          </linearGradient>
          {/* Primer plano: negro casi absoluto, la sombra más escondida. */}
          <linearGradient id={id("cerca")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0a12" stopOpacity="1" />
            <stop offset="100%" stopColor="#040407" stopOpacity="1" />
          </linearGradient>
          {/* Agua: reflejo apagado, sin destellos que atraigan la mirada. */}
          <linearGradient id={id("agua")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#07070a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Bruma que deriva muy despacio por detrás de todo. */}
        <g className="aurum-rio__bruma">
          <ellipse cx="380" cy="228" rx="360" ry="66" fill={`url(#${id("bruma")})`} />
          <ellipse cx="1040" cy="240" rx="420" ry="72" fill={`url(#${id("bruma")})`} />
        </g>

        {/* Serra dos Órgãos: cordillera lejana, casi plana. */}
        <path
          d="M0,196 L96,176 L150,186 L214,158 L268,178 L322,168 L392,190 L470,166 L520,182 L604,172 L660,192 L744,170 L806,186 L880,164 L946,184 L1010,172 L1088,190 L1152,170 L1226,186 L1300,168 L1372,184 L1440,174 L1440,320 L0,320 Z"
          fill={`url(#${id("lejos")})`}
        />

        {/* Dois Irmãos: dois morros juntos, silueta intermedia. */}
        <path
          d="M1160,206 C1186,150 1210,124 1232,124 C1252,124 1268,146 1290,180 C1302,200 1312,214 1326,226 L1148,226 Z"
          fill="#0d0d16"
        />

        {/* Corcovado con el Cristo Redentor. Solo conozco el gesto: brazos
            abiertos, torre y pedestal. Es una sombra, no un retrato. */}
        <g className="aurum-rio__cristo">
          {/* Montaña */}
          <path
            d="M148,262 C186,232 226,214 268,214 C292,214 316,222 340,236 C362,248 384,258 408,266 L120,266 Z"
            fill="#0b0b13"
          />
          {/* Pedestal */}
          <rect x="262" y="176" width="16" height="40" fill="#07070a" />
          {/* Cuerpo y túnica */}
          <path d="M258,140 L282,140 L286,186 L254,186 Z" fill="#07070a" />
          {/* Brazos abiertos: el trazo horizontal que lo hace reconocible */}
          <rect x="216" y="142" width="108" height="10" rx="3" fill="#07070a" />
          {/* Cabeza */}
          <circle cx="270" cy="130" r="11" fill="#07070a" />
          {/* Halo tenue: la única chispa del conjunto */}
          <circle cx="270" cy="130" r="26" fill={`url(#${id("bruma")})`} className="aurum-rio__halo" />
        </g>

        {/* Pan de Azúcar con el teleférico. */}
        <g className="aurum-rio__pao">
          <path
            d="M960,266 C984,222 1012,196 1046,196 C1080,196 1104,220 1128,266 Z"
            fill="#0b0b13"
          />
          {/* Cable y cabina del teleférico */}
          <path d="M1040,198 L1216,232" stroke="#d4af37" strokeOpacity="0.16" strokeWidth="1.2" fill="none" />
          <rect x="1104" y="216" width="14" height="10" rx="2" fill="#07070a" className="aurum-rio__cabina" />
        </g>

        {/* Orla marítima: la ciudad en sombra, más oscura que todo lo anterior. */}
        <path
          d="M0,266 L300,266 L420,258 L560,266 L760,258 L900,266 L1050,258 L1180,266 L1440,258 L1440,320 L0,320 Z"
          fill={`url(#${id("cerca")})`}
        />

        {/* Luces de la ciudad: se encienden a destiempo, como una ciudad de verdad. */}
        <g className="aurum-rio__luces">
          {LUCES.map(([x, y, r, retardo], indice) => (
            <circle
              key={indice}
              cx={x}
              cy={y}
              r={r}
              fill="#f2d477"
              fillOpacity="0.5"
              style={{ animationDelay: `${retardo}s` }}
            />
          ))}
        </g>

        {/* Reflejo apagado sobre el agua. */}
        <rect x="0" y="286" width="1440" height="34" fill={`url(#${id("agua")})`} />

        {/* Filo del horizonte: una línea de oro de un píxel, ya casi invisible. */}
        <path
          className="aurum-rio__filo"
          d="M0,266 C300,258 420,258 560,264 C760,272 900,258 1050,258 C1180,258 1300,266 1440,258"
          stroke={`url(#${id("filo")})`}
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </span>
  );
}
