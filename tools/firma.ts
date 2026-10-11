/**
 * ----------------------------------------------------------------------------
 *  Assinatura do back - secure T
 *
 *  Este campus e um presente de Pedro ao seu amor, T.
 *
 *  A ideia nasceu em casa, a dois: aprender seguranca e inteligencia artificial
 *  sem pagar, sem se cadastrar e sem entregar os proprios dados a ninguem. O que
 *  era um presente passou a ser um instituto aberto - porque a sabedoria, quando
 *  se guarda, encolhe; quando se reparte, cresce.
 *
 *  Fica escrito aqui, do lado do servidor e da compilacao, onde ninguem tropeca
 *  nele sem querer. No site aparece so o que importa: que o conhecimento
 *  pertence a quem o procura (about.love e footer.love nos dicionarios).
 *  tests/firma.test.ts comprova que a dedicatoria nunca vazou para o front.
 * ----------------------------------------------------------------------------
 */

export const FIRMA = {
  /** Quem oferece. */
  de: "Pedro",
  /** Para quem. */
  para: "T",
  /** A dedicatoria inteira, como se escreve a mao. */
  dedicacao: "A Pedro, para T.",
  /** A mesma ideia sem nomes: e esta que pode aparecer no front. */
  publica: "Inspirado numa historia real: o conhecimento pertence a quem o procura.",
  /** Data em que a promessa passou a ter codigo. */
  desde: "2026-10-11"
} as const;

/**
 * A linha que a compilacao deixa no seu log (tools/build-site.mjs). Nada disto
 * entra no HTML publicado: e a assinatura do processo, nao da pagina.
 */
export function selloDeBack(): string {
  return `secure T - ${FIRMA.dedicacao} - desde ${FIRMA.desde}`;
}
