import { describe, expect, it } from 'vitest';
import { filterCourseCatalog } from '../client/src/lib/course-search';

const courses = [
  { code: 'CY-101', title: 'Cybersecurity Fundamentals', meta: '8 weeks · Beginner' },
  { code: 'WEB-201', title: 'Web Application Security', meta: '10 weeks · Intermediate' },
  { code: 'SOC-301', title: 'Detection Engineering', meta: '12 weeks · Advanced' },
];

describe('search courses: semantic functional contract', () => {
  it('returns the entire catalog for an empty input', () => {
    expect(filterCourseCatalog(courses, '   ')).toEqual(courses);
  });
  it('searches existing course title, code and level (case-insensitive)', () => {
    expect(filterCourseCatalog(courses, 'cy-101').map(item => item.code)).toEqual(['CY-101']);
    expect(filterCourseCatalog(courses, 'SECURITY').map(item => item.code)).toEqual(['CY-101', 'WEB-201']);
    expect(filterCourseCatalog(courses, 'advanced').map(item => item.code)).toEqual(['SOC-301']);
  });
  it('shows no results instead of clearing input or pretending a search ran', () => {
    expect(filterCourseCatalog(courses, 'course-that-does-not-exist')).toEqual([]);
  });
  it('preserves real course objects without mutating the original catalog', () => {
    const before = JSON.stringify(courses);
    expect(filterCourseCatalog(courses, 'web')[0]).toBe(courses[1]);
    expect(JSON.stringify(courses)).toBe(before);
  });
});
