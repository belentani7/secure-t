"use client";

import { useSyncExternalStore } from "react";
import {
  completionOf,
  emptyProgress,
  markWeek,
  parseProgress,
  recordQuiz,
  sealProgress,
  setFlag,
  setProject,
  verifyProgress,
  type CompletionReport,
  type ProgressRecord,
  type SignedProgress
} from "@secure-t/shared";

/**
 * Expediente anónimo del estudiante, almacenado sólo en su dispositivo.
 *
 * Cumple la promesa P6 del contrato original: no hay cuenta, no hay correo y
 * ningún dato sale del navegador. Se añade lo que faltaba (deuda D11):
 * exportar/importar firmado con SHA-256 y detección de manipulación.
 */

const STORAGE_KEY = "secure-t-progress-v1";

function newToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `anon-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

let cache: ProgressRecord | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function read(): ProgressRecord {
  if (cache) return cache;
  if (typeof window === "undefined") {
    cache = emptyProgress("ssr-placeholder");
    return cache;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? parseProgress(raw) : null;
    cache = parsed ?? emptyProgress(newToken());
  } catch {
    cache = emptyProgress(newToken());
  }
  return cache;
}

function write(next: ProgressRecord) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* modo privado: el expediente vive mientras dure la pestaña */
  }
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): ProgressRecord {
  return read();
}

/** Hook de lectura: cualquier componente ve el mismo expediente actualizado. */
export function useProgress(): ProgressRecord {
  // El servidor no tiene expediente: se usa un marcador y el cliente hidrata.
  return useSyncExternalStore(subscribe, getSnapshot, () => emptyProgress("ssr-placeholder"));
}

/** Token anónimo del expediente: identifica al estudiante en xAPI sin nombrarlo. */
export function currentToken(): string {
  return read().token;
}

export function toggleWeek(slug: string, week: number, done: boolean) {
  const record = read();
  write(markWeek(record, slug, week, done));
}

export function saveQuiz(slug: string, score: number, total: number) {
  write(recordQuiz(read(), slug, score, total));
}

export function saveFlag(slug: string, flag: "lab" | "exam", value = true) {
  write(setFlag(read(), slug, flag, value));
}

export function saveProject(slug: string, note: string) {
  write(setProject(read(), slug, note));
}

export function resetProgress() {
  write(emptyProgress(newToken()));
}

export function progressFor(record: ProgressRecord, slug: string, weeks = 20): CompletionReport {
  return completionOf(record, slug, weeks);
}

/** Exporta el expediente firmado: el archivo se puede llevar a otro dispositivo. */
export async function exportProgress(): Promise<{ filename: string; json: string }> {
  const signed: SignedProgress = await sealProgress(read());
  const stamp = new Date().toISOString().slice(0, 10);
  return { filename: `secure-t-expediente-${stamp}.json`, json: JSON.stringify(signed, null, 2) };
}

export async function importProgress(text: string): Promise<{ ok: boolean; reason?: string }> {
  const parsed = parseProgress(text);
  if (!parsed) return { ok: false, reason: "invalid" };
  const withSeal = JSON.parse(text) as SignedProgress;
  if (typeof withSeal.seal === "string") {
    const valid = await verifyProgress(withSeal);
    if (!valid) return { ok: false, reason: "seal" };
  }
  write(parsed);
  return { ok: true };
}

export function downloadText(filename: string, text: string, type = "application/json") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
