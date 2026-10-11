import { describe, expect, it } from "vitest";
import {
  EASE_MIN,
  dueCards,
  gradeCard,
  nextDue,
  parseReviewState,
  reviewStats,
  seedDeck,
  syncWithProgress,
  type DeckCourse,
  type ReviewCard
} from "../src/review";

const COURSES: DeckCourse[] = [
  {
    slug: "ciber-defensiva",
    title: "Defensiva",
    weeks: [
      { index: 1, title: "Tríada CIA" },
      { index: 2, title: "Telemetría" },
      { index: 3, title: "Detección" }
    ]
  },
  { slug: "ciber-ofensiva", title: "Ofensiva", weeks: [{ index: 1, title: "Reconocimiento" }] }
];

const TODAY = "2026-01-07";

function card(overrides: Partial<ReviewCard> = {}): ReviewCard {
  return {
    id: "ciber-defensiva/semana-1",
    course: "ciber-defensiva",
    week: 1,
    title: "Tríada CIA",
    url: "/programas/ciber-defensiva/semana/1",
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    lapses: 0,
    due: TODAY,
    ...overrides
  };
}

describe("mazo de repaso", () => {
  it("siembra una tarjeta por semana y ninguna vence más tarde de tres semanas", () => {
    const deck = seedDeck(COURSES, TODAY);
    expect(Object.keys(deck.cards)).toHaveLength(4);
    expect(deck.cards["ciber-defensiva/semana-1"]?.due).toBe(TODAY);
    for (const entry of Object.values(deck.cards)) {
      expect(entry.due >= TODAY).toBe(true);
      expect(entry.due <= "2026-01-28").toBe(true);
    }
  });

  it("no programa todas las tarjetas el mismo día (el mazo no cae encima)", () => {
    const deck = seedDeck(COURSES, TODAY);
    const fechas = new Set(Object.values(deck.cards).map((entry) => entry.due));
    expect(fechas.size).toBeGreaterThan(1);
  });
});

describe("SM-2", () => {
  it("«bien» la primera vez programa a un día y la segunda a seis", () => {
    const primera = gradeCard(card(), 2, TODAY);
    expect(primera.interval).toBe(1);
    expect(primera.due).toBe("2026-01-08");

    const segunda = gradeCard({ ...primera, due: "2026-01-08" }, 2, "2026-01-08");
    expect(segunda.interval).toBe(6);
    expect(segunda.due).toBe("2026-01-14");
  });

  it("a partir de la tercera usa el factor de facilidad", () => {
    const tercera = gradeCard(card({ interval: 6, repetitions: 2, ease: 2.5 }), 2, TODAY);
    expect(tercera.interval).toBe(15); // 6 × 2,5
    expect(tercera.due).toBe("2026-01-22");
  });

  it("«fácil» alarga más que «bien» y «difícil» menos", () => {
    const base = card({ interval: 10, repetitions: 3 });
    const facil = gradeCard(base, 3, TODAY);
    const bien = gradeCard(base, 2, TODAY);
    const dificil = gradeCard(base, 1, TODAY);
    expect(facil.interval).toBeGreaterThan(bien.interval);
    expect(bien.interval).toBeGreaterThan(dificil.interval);
    expect(dificil.interval).toBeGreaterThanOrEqual(1);
  });

  it("«otra vez» vuelve a hoy, resetea repeticiones y baja la facilidad", () => {
    const fallada = gradeCard(card({ interval: 30, repetitions: 5 }), 0, TODAY);
    expect(fallada.interval).toBe(0);
    expect(fallada.repetitions).toBe(0);
    expect(fallada.lapses).toBe(1);
    expect(fallada.due).toBe(TODAY);
    expect(fallada.ease).toBeLessThan(2.5);
  });

  it("la facilidad nunca baja de 1,3 ni sube de 3,2 por muchas notas que se den", () => {
    let actual = card();
    for (let index = 0; index < 20; index += 1) actual = gradeCard(actual, 0, TODAY);
    expect(actual.ease).toBeCloseTo(EASE_MIN, 5);

    let subiendo = card();
    for (let index = 0; index < 20; index += 1) subiendo = gradeCard(subiendo, 3, TODAY);
    expect(subiendo.ease).toBeLessThanOrEqual(3.2);
  });

  it("nunca da más días por «difícil» que por «bien», en todo el rango real", () => {
    // Regresión: la fórmula ingenua (intervalo × facilidad × 1,2) podía programar
    // la tarjeta más lejos por decir «difícil» que por decir «bien».
    for (let intervalo = 1; intervalo <= 365; intervalo += 7) {
      for (const ease of [1.3, 1.7, 2.5, 3.2]) {
        const base = card({ interval: intervalo, repetitions: 4, ease });
        expect(gradeCard(base, 2, TODAY).interval).toBeGreaterThanOrEqual(gradeCard(base, 1, TODAY).interval);
        expect(gradeCard(base, 3, TODAY).interval).toBeGreaterThanOrEqual(gradeCard(base, 2, TODAY).interval);
      }
    }
  });

  it("rechaza notas fuera de rango", () => {
    expect(() => gradeCard(card(), 7, TODAY)).toThrow(/nota de repaso/);
  });
});

describe("cola de repaso", () => {
  it("devuelve primero lo más atrasado y respeta el límite", () => {
    const state = {
      version: 1 as const,
      created: TODAY,
      cards: {
        a: card({ id: "a", due: "2026-01-05" }),
        b: card({ id: "b", due: "2026-01-07" }),
        c: card({ id: "c", due: "2026-01-20" })
      }
    };
    const cola = dueCards(state, TODAY, 2);
    expect(cola.map((entry) => entry.id)).toEqual(["a", "b"]);
  });

  it("calcula la próxima fecha futura y las estadísticas", () => {
    const state = {
      version: 1 as const,
      created: TODAY,
      cards: {
        a: card({ id: "a", due: TODAY }),
        b: card({ id: "b", due: "2026-01-09", repetitions: 3 }),
        c: card({ id: "c", due: "2026-01-09", lapses: 2 })
      }
    };
    expect(nextDue(state, TODAY)).toBe("2026-01-09");
    const stats = reviewStats(state, TODAY, 5);
    expect(stats.total).toBe(3);
    expect(stats.dueToday).toBe(1);
    expect(stats.learned).toBe(1);
    expect(stats.horizon[0]?.count).toBe(1);
    expect(stats.horizon[2]?.count).toBe(2);
  });
});

describe("persistencia del mazo", () => {
  it("descarta un estado corrupto en lugar de fallar en mitad del repaso", () => {
    expect(parseReviewState("{ no es json }")).toBeNull();
    expect(parseReviewState(JSON.stringify({ version: 2, cards: {} }))).toBeNull();
    expect(parseReviewState(JSON.stringify({ version: 1, cards: { a: { due: "ayer" } } }))).toBeNull();
  });

  it("sanea valores imposibles al cargar", () => {
    const state = parseReviewState(
      JSON.stringify({
        version: 1,
        created: TODAY,
        cards: { a: { due: TODAY, ease: 0.1, interval: -4, repetitions: -1, lapses: -2 } }
      })
    );
    expect(state?.cards.a?.ease).toBe(EASE_MIN);
    expect(state?.cards.a?.interval).toBe(0);
    expect(state?.cards.a?.repetitions).toBe(0);
    expect(state?.cards.a?.lapses).toBe(0);
  });

  it("las semanas recién terminadas entran mañana, no hoy", () => {
    const deck = seedDeck(COURSES, TODAY);
    const sincronizado = syncWithProgress(deck, [{ course: "ciber-ofensiva", week: 1 }], TODAY);
    expect(sincronizado.cards["ciber-ofensiva/semana-1"]?.due).toBe("2026-01-08");
  });
});
