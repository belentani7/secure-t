import { describe, expect, it } from 'vitest';
import {
  COURSE_LEVELS,
  filterCourseCatalogByLevel,
} from '../client/src/lib/course-search';

const courses = [
  { code: 'CY-101', title: 'Cybersecurity Fundamentals', meta: '8 weeks · Beginner' },
  { code: 'WEB-201', title: 'Web Application Security', meta: '10 weeks · Intermediate' },
  { code: 'SOC-301', title: 'Detection Engineering', meta: '12 weeks · Advanced' },
  { code: 'GOV-110', title: 'Digital Governance', meta: '6 weeks · Beginner' },
];

describe('filter courses by level: semantic functional contract', () => {
  it('publishes the levels the catalogue actually supports', () => {
    expect(COURSE_LEVELS).toEqual([
      'All levels',
      'Beginner',
      'Intermediate',
      'Advanced',
    ]);
  });

  it('returns a copy of the whole catalogue for All levels', () => {
    const result = filterCourseCatalogByLevel(courses, 'All levels');
    expect(result).toEqual(courses);
    expect(result).not.toBe(courses);
  });

  it('filters by the real level advertised in the course meta', () => {
    expect(filterCourseCatalogByLevel(courses, 'Beginner').map(c => c.code)).toEqual([
      'CY-101',
      'GOV-110',
    ]);
    expect(
      filterCourseCatalogByLevel(courses, 'Intermediate').map(c => c.code),
    ).toEqual(['WEB-201']);
    expect(filterCourseCatalogByLevel(courses, 'Advanced').map(c => c.code)).toEqual([
      'SOC-301',
    ]);
  });

  it('returns no courses instead of pretending a filter matched', () => {
    expect(
      filterCourseCatalogByLevel(
        [{ code: 'X', title: 'X', meta: '4 weeks · Foundation' }],
        'Advanced',
      ),
    ).toEqual([]);
  });

  it('preserves course identity without mutating the original catalogue', () => {
    const before = JSON.stringify(courses);
    expect(filterCourseCatalogByLevel(courses, 'Beginner')[0]).toBe(courses[0]);
    expect(JSON.stringify(courses)).toBe(before);
  });
});
