import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const home = readFileSync(new URL('../client/src/pages/Home.tsx', import.meta.url), 'utf8');

describe('Secure T public demo navigation', () => {
  it('directs visitor to the existing student demo instead of claiming to create an account', () => {
    expect(home).not.toContain('Create your profile');
    expect(home).toContain('Open demo student portal');
    expect(home).toContain('href="/record"');
  });

  it('does not show nonfunctional buttons for unavailable learning paths and academic guide', () => {
    expect(home).not.toContain('Read the academic guide <ArrowRight');
    expect(home).toContain('Academic guide coming soon');
    expect(home).not.toContain('Esta ruta académica se habilitará al completar tu perfil.');
    expect(home).toContain('pathways.map(({ icon: Icon, accent, kicker, title, description, courses: courseMeta }) => <article');
  });
  it('does not make course preview tiles navigate to the unrelated student record', () => {
    expect(home).not.toContain('filteredCourses.map(({ code, title, meta, color, icon: Icon, progress }) => <Link');
    expect(home).toContain('filteredCourses.map(({ code, title, meta, color, icon: Icon, progress }) => <article');
    expect(home).toContain('Sample progress — not your record');
  });

});
