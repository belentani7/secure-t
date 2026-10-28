import { describe, expect, it } from 'vitest';
import {
  CAMPUS_PROGRESS_KEY,
  campusItems,
  courseProgress,
  globalProgress,
  isExamUnlocked,
  normalizeProgress,
  parseProgress,
  progressId,
  serializeProgress,
  toggleProgress,
} from '../client/src/lib/progress';

const ITEMS = [
  'semana-01',
  'semana-02',
  'quiz',
  'laboratorio',
  'proyecto',
  'examen',
];

describe('anonymous campus progress contract', () => {
  it('uses the same storage key as the static campus', () => {
    expect(CAMPUS_PROGRESS_KEY).toBe('stt-progreso');
  });

  it('rejects malformed or forged state instead of trusting storage', () => {
    expect(parseProgress(null)).toEqual({});
    expect(parseProgress('not json')).toEqual({});
    expect(parseProgress('[]')).toEqual({});
    expect(
      normalizeProgress({
        'ciber-ofensiva/semana-01': true,
        'ciber-ofensiva/semana-02': 'yes',
        'ciber-ofensiva/semana-03': false,
      }),
    ).toEqual({ 'ciber-ofensiva/semana-01': true });
  });

  it('toggles items without mutating the previous state', () => {
    const before = {};
    const on = toggleProgress(before, 'ciber-ofensiva', 'semana-01', true);
    expect(on).toEqual({ 'ciber-ofensiva/semana-01': true });
    expect(before).toEqual({});
    const off = toggleProgress(on, 'ciber-ofensiva', 'semana-01', false);
    expect(off).toEqual({});
    expect(on).toEqual({ 'ciber-ofensiva/semana-01': true });
  });

  it('serializes a round-trip that the static campus can read', () => {
    const state = { 'ciber-ofensiva/semana-01': true };
    expect(parseProgress(serializeProgress(state))).toEqual(state);
    expect(progressId('ciber-ofensiva', 'semana-01')).toBe(
      'ciber-ofensiva/semana-01',
    );
  });

  it('computes per-course and global completion honestly', () => {
    const state = {
      'ciber-ofensiva/semana-01': true,
      'ciber-ofensiva/semana-02': true,
    };
    expect(courseProgress(state, 'ciber-ofensiva', ITEMS)).toEqual({
      done: 2,
      total: 6,
      percent: 33,
      complete: false,
    });
    expect(
      globalProgress(state, [
        { slug: 'ciber-ofensiva', items: ITEMS },
        { slug: 'ia-aplicada-segura', items: ITEMS },
      ]),
    ).toEqual({ done: 2, total: 12, percent: 17 });
  });

  it('builds the same item ids the static campus writes', () => {
    expect(campusItems(2)).toEqual([
      'semana-01',
      'semana-02',
      'quiz',
      'laboratorio',
      'proyecto',
      'examen',
    ]);
  });

  it('gates the exam until weeks, quiz and lab are complete', () => {
    let state = {};
    expect(isExamUnlocked(state, 'ciber-ofensiva', ITEMS)).toBe(false);
    for (const item of ['semana-01', 'semana-02', 'quiz', 'laboratorio']) {
      state = toggleProgress(state, 'ciber-ofensiva', item, true);
    }
    expect(isExamUnlocked(state, 'ciber-ofensiva', ITEMS)).toBe(true);
  });
});
