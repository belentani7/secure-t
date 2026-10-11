/**
 * Psicología aplicada al diseño, en tokens que se pueden comprobar.
 *
 * El campus no es una página bonita: es una obra que se estudia durante años.
 * Todo lo que sigue sale de investigación publicada sobre percepción y decisión
 * humana, y vive aquí como **datos tipados** para que un test pueda exigirlos en
 * lugar de confiar en el criterio de quien escribe CSS. La fuente de cada número
 * va citada en `docs/PSICOLOGIA-Y-EXPERIENCIA.md`.
 *
 * Qué se aplica y por qué:
 *
 *  - **Negro profundo + dorado como acento** (regla 60·30·10). El negro casi
 *    neutro domina la escena (≈60 %), las superficies de cristal elevan el
 *    contenido (≈30 %) y el dorado queda para lo que pide acción o atención
 *    (≈10 %). La evidencia de partida es Zhou, Xiao, Yoon y Zhu (2025,
 *    *Journal of Consumer Research*), que midieron que **menos saturación eleva
 *    el estatus percibido** de una marca, con un punto de inflexión entre el 20 %
 *    y el 30 % de saturación. Dos avisos que se respetan aquí: aquel estudio mide
 *    color de producto, no acentos de interfaz —la transposición se hace en la
 *    misma dirección, superficies apagadas y un acento brillante— y su efecto se
 *    **invierte** cuando la marca se presenta como innovadora, por lo que el
 *    dorado de AURUM se reserva para señalar función (acción, dato vivo) y nunca
 *    se usa para reclamar estatus.
 *  - **Ley de Fitts**: cuanto más grande y más cerca está un objetivo, más rápido
 *    y con menos error se alcanza. De ahí `TARGETS.min = 44 px` (mínimo táctil),
 *    separación de 8 px entre objetivos y las acciones principales en el flujo
 *    natural del contenido, no en una esquina perdida.
 *  - **Ley de Hick**: el tiempo de decisión crece con el número de opciones. De
 *    ahí que la navegación se parta en **seis destinos primarios** y un grupo
 *    secundario plegado, y que nunca haya cinco llamadas a la acción con el
 *    mismo peso en una pantalla.
 *  - **Ley de Miller (chunking)**: la memoria de trabajo maneja cuatro o cinco
 *    elementos visuales, no siete. De ahí `CHUNKING.maxPrimary` y los bloques
 *    de contenido cortos con un encabezado propio.
 *  - **Efecto Von Restorff (aislamiento)**: lo distinto se recuerda. Un solo
 *    botón dorado de acción por vista; todo lo demás es fantasma o enlace.
 *  - **Efecto estético-usabilidad y regla del pico-final**: una interfaz que se
 *    siente bien se percibe como más fácil, y la memoria de una sesión se decide
 *    en su pico emocional y en su final. Por eso el horizonte de Río aparece al
 *    principio y acompaña el cierre.
 *  - **Movimiento respetuoso (WCAG 2.3.3)**: nada de parallax de pantalla
 *    completa. Los desplazamientos se limitan a distancias que no disparan el
 *    sistema vestibular (`MOTION.maxRevealShift = 12 px`), todo vive dentro de
 *    `prefers-reduced-motion: no-preference`, y el color y la opacidad son las
 *    herramientas preferidas: son transiciones que la norma no considera
 *    movimiento.
 */

/* -------------------------------------------------------------- color 60·30·10 */

export interface Balance {
  /** Rol del color en la composición y porcentaje de superficie que ocupa. */
  dominant: { role: "fondo"; share: number };
  secondary: { role: "superficies"; share: number };
  accent: { role: "acción"; share: number };
}

/**
 * Regla 60·30·10 aplicada a AURUM. Los porcentajes son superficie, no brillo:
 * el dorado ocupa poco y por eso pesa tanto.
 */
export const BALANCE: Balance = {
  dominant: { role: "fondo", share: 60 },
  secondary: { role: "superficies", share: 30 },
  accent: { role: "acción", share: 10 }
} as const;

/* ------------------------------------------------------------------ tipografía */

/**
 * Escala tipográfica modular (razón 1.25, «tercera menor»). Una escala fija
 * evita el ruido de tamaños arbitrarios y hace que la jerarquía se lea sin
 * pensar: es la parte del diseño que nadie nota y todos agradecen.
 */
export const TYPE_SCALE = {
  ratio: 1.25,
  base: 1.0625,
  steps: {
    micro: 0.68,
    small: 0.85,
    body: 1,
    lead: 1.25,
    h3: 1.5625,
    h2: 1.953,
    h1: 2.441,
    hero: 3.052
  }
} as const;

/**
 * Longitud de línea: 45-75 caracteres por línea es el rango cómodo de lectura;
 * por encima de 80 el ojo pierde el inicio de la línea anterior. El CSS aplica
 * `max-width: 68ch` al párrafo y `62ch` al texto de entrada.
 */
export const MEASURE = { bodyCh: 68, leadCh: 62, maxCh: 80, minCh: 45 } as const;

/**
 * Ritmo vertical en múltiplos de 8 px: el ojo detecta el desorden cuando las
 * distancias compiten entre sí, y el sistema nervioso premia lo regular. La ley
 * de proximidad (Gestalt) hace el resto: lo que está cerca se lee junto.
 */
export const SPACING = {
  unitPx: 8,
  rhythm: [0.5, 1, 1.5, 2.5, 4, 6] as const
} as const;

/* -------------------------------------------------------------------- decisión */

export const CHUNKING = {
  /** Miller aplicado con margen: cuatro o cinco elementos se sostienen de un vistazo. */
  maxPrimary: 6,
  /** Pestañas o filtros visibles antes de esconderlos tras «más filtros». */
  maxVisibleFilters: 8,
  /** Enlaces del pie: se leen, no se estudian. */
  maxFooterLinks: 14
} as const;

/**
 * Ley de Hick: partir la decisión en dos escalones (destino primario → detalle)
 * reduce el tiempo percibido más que acortar la lista completa.
 */
export function hickTime(options: number): number {
  // T = b · log2(n + 1): la constante b es arbitraria (ms por bit) y sólo sirve
  // para comparar dos diseños entre sí, que es para lo que se usa aquí.
  return Math.log2(options + 1);
}

/* ----------------------------------------------------------------- movimiento */

/**
 * Duraciones y curvas. Los rangos salen de la práctica de motion design para
 * interfaz: por debajo de 100 ms el cambio no se percibe como reacción; por
 * encima de 400 ms una microinteracción se siente lenta aunque sea bonita.
 */
export const DURATION = {
  instantMs: 90,
  quickMs: 140,
  calmMs: 320,
  ambientMs: 28_000,
  rules: { min: 90, maxInteraction: 400, ambientMin: 12_000 }
} as const;

export const EASING = {
  /** Salida suave: el movimiento natural frena al final (ease-out). */
  out: "cubic-bezier(0.22, 0.61, 0.36, 1)",
  /** Entrada y salida simétricas, para cambios de estado reversibles. */
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Rebote descartado a propósito: la elasticidad se lee como juego, no como rigor. */
  rejectedBounce: true
} as const;

/**
 * Límites de movimiento. Son deliberadamente pequeños: WCAG 2.3.3 exige que el
 * movimiento disparado por interacción se pueda desactivar, y la literatura
 * sobre trastornos vestibulares señala el desplazamiento grande y el parallax
 * como los desencadenantes típicos. Aquí no hay ninguno de los dos.
 */
export const MOTION = {
  maxRevealShift: 12,
  maxHoverShift: 2,
  maxScale: 1.02,
  staggerMs: 45,
  maxStaggerItems: 8,
  /** Nunca se anima la posición de bloques grandes de texto. */
  forbidden: ["parallax de pantalla completa", "zoom de página", "rotación", "rebote", "desplazamiento lateral del documento"]
} as const;

export interface MotionCheck {
  revealShift: number;
  hoverShift: number;
  scale: number;
  durationMs: number;
}

/** ¿Este movimiento se queda dentro de lo que el sistema vestibular tolera? */
export function motionIsGentle(check: MotionCheck): boolean {
  return (
    check.revealShift <= MOTION.maxRevealShift &&
    check.hoverShift <= MOTION.maxHoverShift &&
    check.scale <= MOTION.maxScale &&
    check.durationMs >= DURATION.rules.min &&
    check.durationMs <= DURATION.rules.maxInteraction
  );
}

/* ---------------------------------------------------------------------- Fitts */

export const TARGETS = {
  /**
   * 44 px es el mínimo adoptado por la casa: coincide con las guías de plataforma
   * (Apple HIG 44 pt) y con WCAG 2.1 SC 2.5.5 (AAA). El mínimo normativo de
   * WCAG 2.2 SC 2.5.8 (AA) es 24×24 px CSS: quedamos muy por encima.
   */
  minPx: 44,
  /** Separación para no pulsar el vecino por error. */
  gapPx: 8,
  /** En puntero fino se puede reducir algo, nunca por debajo de los 24 px legales. */
  pointerFinePx: 32,
  /** Mínimo normativo de WCAG 2.2 SC 2.5.8 (AA), citado para no confundirlo con el de la casa. */
  wcagMinimumPx: 24
} as const;

export function fittsOk(sizePx: number, gapPx = TARGETS.gapPx, coarsePointer = true): boolean {
  const minimo = coarsePointer ? TARGETS.minPx : TARGETS.pointerFinePx;
  return sizePx >= minimo && gapPx >= TARGETS.gapPx;
}

/* ----------------------------------------------------------------- atención */

/**
 * Efecto Von Restorff: un solo elemento distinto por vista. `maxAccents = 1`
 * significa un botón dorado por pantalla; si hay dos, ninguno destaca.
 */
export const ATTENTION = { maxAccents: 1, maxSimultaneousBadges: 3, eyebrowLetterspacing: "0.22em" } as const;

/**
 * Regla del pico-final: lo que se recuerda de una sesión es su momento más
 * intenso y su despedida. La portada abre con el horizonte y cierra con él.
 */
export const PEAK_END = { heroMoment: true, closingMoment: true } as const;

/* --------------------------------------------------------- horizonte de Río */

/**
 * Guiño a Río de Janeiro: el Cristo Redentor sobre el Corcovado y el Pan de
 * Azúcar, dibujados como sombras en el propio HTML.
 *
 * Es decoración pura, así que cumple tres reglas: va en SVG en línea (cero
 * peticiones de red, coherente con la promesa de privacidad), es invisible para
 * los lectores de pantalla (`aria-hidden`) y su movimiento es opacidad y
 * deriva lenta, nunca desplazamiento de la página.
 */
export const RIO = {
  /** Nombre interno del guiño; no genera texto visible. */
  landmark: "rio-de-janeiro",
  /** Opacidad base de la silueta: sombra, no dibujo. */
  opacity: 0.42,
  /** Deriva de la bruma: minutos, no segundos. */
  driftSeconds: 96,
  /** Parpadeo de las luces de la ciudad. */
  cityLightSeconds: 7,
  /** Alto del horizonte en porcentaje del contenedor del héroe. */
  heightPercent: 34,
  reduceMotion: "static-silhouette"
} as const;

/* ------------------------------------------------------------ utilidades UI */

/** Ancho de línea recomendado para un texto de lectura (en `ch`). */
export function clampMeasure(chars: number): number {
  return Math.min(MEASURE.maxCh, Math.max(MEASURE.minCh, chars));
}

/** Fracción del total que ocupa un rol del balance 60·30·10. */
export function balanceShare(role: "fondo" | "superficies" | "acción"): number {
  const tabla = [BALANCE.dominant, BALANCE.secondary, BALANCE.accent];
  const encontrado = tabla.find((entrada) => entrada.role === role);
  return encontrado ? encontrado.share / 100 : 0;
}
