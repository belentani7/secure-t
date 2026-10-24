import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('admissions CTA truthfulness', () => {
  it('does not advertise open admissions when there is no application route', () => {
    const home = readFileSync(new URL('../client/src/pages/Home.tsx', import.meta.url), 'utf8');
    const app = readFileSync(new URL('../client/src/App.tsx', import.meta.url), 'utf8');

    expect(app).not.toContain('path="/apply"');
    expect(home).not.toContain('APPLICATIONS OPEN');
    expect(home).not.toContain('Admisiones abiertas');
    expect(home).toContain('APPLICATIONS COMING SOON');
    expect(home).toContain('Applications coming soon');
  });
});
