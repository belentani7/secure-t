import { describe, expect, it } from 'vitest';
import { CAMPUS_PROGRAMS } from '../client/src/data/campus.generated';

describe('generated campus catalogue: completeness contract', () => {
  it('publishes the four real programs', () => {
    expect(CAMPUS_PROGRAMS.map(program => program.slug)).toEqual([
      'ciber-ofensiva',
      'ciber-defensiva',
      'ia-aplicada-segura',
      'gobernanza-compliance',
    ]);
  });

  it('keeps twenty weeks per program with real titles', () => {
    const weeks = CAMPUS_PROGRAMS.flatMap(program => program.weeks);
    expect(weeks).toHaveLength(80);
    for (const program of CAMPUS_PROGRAMS) {
      expect(program.weeks).toHaveLength(20);
      expect(new Set(program.weeks.map(week => week.title)).size).toBe(20);
      expect(program.weeks.every(week => week.title.length > 3)).toBe(true);
      expect(program.weeks.every(week => week.objective.length > 10)).toBe(true);
    }
  });

  it('carries objectives, assessment, a lab and real source links', () => {
    for (const program of CAMPUS_PROGRAMS) {
      expect(program.objectives.length).toBeGreaterThanOrEqual(3);
      expect(program.assessment.length).toBeGreaterThanOrEqual(3);
      expect(program.lab.title.length).toBeGreaterThan(3);
      expect(program.lab.intro.length).toBeGreaterThan(10);
      expect(program.resources.length).toBeGreaterThan(0);
      expect(
        program.resources.every(resource => resource.url.startsWith('https://')),
      ).toBe(true);
    }
  });

  it('links to the static campus under its own path', () => {
    for (const program of CAMPUS_PROGRAMS) {
      expect(program.links.course).toBe(
        `campus/full/cursos/${program.slug}/index.html`,
      );
      expect(program.weeks.every(week => week.href.startsWith('campus/full/'))).toBe(
        true,
      );
    }
  });
});
