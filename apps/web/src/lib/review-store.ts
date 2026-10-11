"use client";

import { useSyncExternalStore } from "react";
import {
  parseReviewState,
  seedDeck,
  todayISO,
  type DeckCourse,
  type ISODate,
  type ReviewState
} from "@secure-t/shared";

/**
 * Estado del mazo de repaso en el dispositivo.
 *
 * Mismo pacto que el expediente: nada sale del navegador. El mazo se siembra
 * una sola vez (una tarjeta por semana de cada programa) y a partir de ahí sólo
 * se reprograma con las notas del estudiante.
 */

const STORAGE_KEY = "secure-t-review-v1";

let cache: ReviewState | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function read(): ReviewState | null {
  if (cache) return cache;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? parseReviewState(raw) : null;
  } catch {
    cache = null;
  }
  return cache;
}

function write(state: ReviewState) {
  cache = state;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* modo privado: el mazo vive mientras dure la pestaña */
  }
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDeckSnapshot(): ReviewState | null {
  return read();
}

export function useDeck(): ReviewState | null {
  return useSyncExternalStore(subscribe, getDeckSnapshot, () => null);
}

/** Crea el mazo la primera vez (determinista: mismas fechas para el mismo día). */
export function startDeck(courses: DeckCourse[], today: ISODate = todayISO() as ISODate): ReviewState {
  const existing = read();
  if (existing) return existing;
  const state = seedDeck(courses, today);
  write(state);
  return state;
}

export function updateDeck(next: ReviewState) {
  write(next);
}

export function resetDeck() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* sin almacenamiento */
  }
  cache = null;
  emit();
}
