// Small, privacy-preserving continuation for fictional exercises.
// Session storage survives reloads in the same tab and is cleared when the tab closes.
// Treat browser storage as untrusted and optional: no accounts, sync or telemetry.
const LANGUAGES = new Set(['pt', 'es', 'en']);
const choice = value => Number.isInteger(value) && value >= 0 && value <= 2;
function valid(data, total, signature) {
  if (!Number.isInteger(total) || total < 1 || total > 100 ||
      typeof signature !== 'string' || !signature || signature.length > 1024 ||
      !data || typeof data !== 'object' || Array.isArray(data)) return false;
  if (data.version !== 1 || data.signature !== signature ||
      !LANGUAGES.has(data.lang) || !Number.isInteger(data.step) ||
      data.step < 0 || data.step > total ||
      typeof data.reviewed !== 'boolean' || !Array.isArray(data.answers) ||
      data.answers.length > total || !data.answers.every(choice) ||
      !(data.pendingChoice === null || choice(data.pendingChoice))) return false;
  if (data.step === total) {
    return data.answers.length === total && !data.reviewed && data.pendingChoice === null;
  }
  return data.answers.length === data.step + Number(data.reviewed) &&
    (!data.reviewed || data.pendingChoice === null);
}
export function loadLabSession(storage, key, total, signature) {
  try {
    if (!storage || typeof key !== 'string') return null;
    const raw = storage.getItem(key);
    if (!raw || raw.length > 2048) return null;
    const data = JSON.parse(raw);
    if (!valid(data, total, signature)) return null;
    return {
      lang: data.lang,
      step: data.step,
      answers: data.answers.slice(),
      reviewed: data.reviewed,
      pendingChoice: data.pendingChoice,
    };
  } catch {
    return null; // Private browsing, blocked storage, or malformed user data.
  }
}
export function saveLabSession(storage, key, total, signature, state) {
  try {
    if (!storage || typeof key !== 'string') return false;
    const data = { ...state, version: 1, signature };
    if (!valid(data, total, signature)) return false;
    storage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false; // Learning must remain usable when storage is denied or full.
  }
}
export function clearLabSession(storage, key) {
  try {
    storage?.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
