/** Filtra únicamente los cursos realmente publicados en la portada. */
export type CatalogSearchItem = {
  code: string;
  title: string;
  meta: string;
};

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
