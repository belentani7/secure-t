/** Filtra únicamente los cursos realmente publicados en la portada. */
export type CatalogSearchItem = {
  code: string;
  title: string;
  meta: string;
};

/** Niveles que el catálogo anuncia hoy en el campo `meta`. */
export const COURSE_LEVELS = [
  "All levels",
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

export type CourseLevel = (typeof COURSE_LEVELS)[number];

/** Filtra por el nivel publicado en `meta`; nunca inventa niveles ni muta. */
export function filterCourseCatalogByLevel<T extends { meta: string }>(
  catalog: readonly T[],
  level: CourseLevel,
): T[] {
  if (level === "All levels") return [...catalog];
  const normalized = level.toLocaleLowerCase();
  return catalog.filter((course) =>
    course.meta.toLocaleLowerCase().includes(normalized),
  );
}

export function filterCourseCatalog<T extends CatalogSearchItem>(
  catalog: readonly T[],
  query: string,
): T[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [...catalog];

  return catalog.filter((course) =>
    [course.code, course.title, course.meta]
      .some((field) => field.toLocaleLowerCase().includes(normalized)),
  );
}
