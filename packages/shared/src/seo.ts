/**
 * Datos estructurados schema.org (JSON-LD).
 *
 * Es lo que permite que un buscador entienda que esto **no** es un blog: es un
 * curso gratuito, en línea, con veinte semanas, sin registro y accesible. Se
 * emiten los tipos que recomienda schema.org para educación:
 *
 *   · `Course` + `CourseInstance` + `Course` anidado en `hasCourseInstance`
 *   · `EducationalOccupationalProgram` para el conjunto de los cuatro programas
 *   · `Organization`, `WebSite` con `SearchAction`, `BreadcrumbList`
 *   · `LearningResource` con `teaches`, `educationalLevel`, `inLanguage`
 *
 * Regla de honestidad: no se inventan valoraciones (`aggregateRating`), ni
 * precios, ni acreditaciones. `isAccessibleForFree: true` y `offers` con precio
 * 0 son reales; la ausencia de datos verificables se deja fuera.
 */

export interface CourseSchemaInput {
  baseUrl: string;
  locale: string;
  slug: string;
  title: string;
  description: string;
  weeks: number;
  hours?: number;
  teaches?: string[];
  url?: string;
  image?: string;
  updated?: string;
}

export const ORG_ID = "#organizacion";
export const SITE_ID = "#campus";

export function organizationJsonLd(baseUrl: string): Record<string, unknown> {
  const base = baseUrl.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${base}/${ORG_ID}`,
    name: "secure T",
    alternateName: ["Campus AURUM", "secure-t"],
    url: `${base}/`,
    description:
      "Instituto abierto de ciberseguridad e inteligencia artificial. Cuatro programas de veinte semanas, gratuitos, sin registro, en cuatro idiomas y funcionales sin conexión.",
    foundingDate: "2025",
    sameAs: ["https://github.com/belentani7/secure-t"],
    knowsLanguage: ["pt", "es", "en", "ca"],
    areaServed: "Worldwide",
    nonprofitStatus: "NonprofitANBI",
    founder: { "@type": "Person", name: "Pedro Belentani", url: "https://github.com/belentani7" },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${base}/{search_term_string}`, actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"] },
      "query-input": "required name=search_term_string"
    }
  };
}

export function websiteJsonLd(baseUrl: string, locales: readonly string[]): Record<string, unknown> {
  const base = baseUrl.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/${SITE_ID}`,
    url: `${base}/`,
    name: "secure T · campus AURUM",
    inLanguage: locales,
    publisher: { "@id": `${base}/${ORG_ID}` },
    license: "https://opensource.org/license/mit",
    isAccessibleForFree: true
  };
}

export function courseJsonLd(input: CourseSchemaInput): Record<string, unknown> {
  const base = input.baseUrl.replace(/\/$/, "");
  const url = `${base}${input.url ?? `/programas/${input.slug}`}`;
  const weeks = input.weeks;
  const horas = input.hours ?? weeks * 6;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${url}#curso`,
    name: input.title,
    description: input.description,
    url,
    inLanguage: input.locale,
    ...(input.image ? { image: input.image } : {}),
    ...(input.updated ? { dateModified: input.updated } : {}),
    provider: { "@id": `${base}/${ORG_ID}` },
    isAccessibleForFree: true,
    license: "https://opensource.org/license/mit",
    educationalLevel: "Intermediate",
    teaches: input.teaches ?? [
      "ciberseguridad",
      "inteligencia artificial",
      "privacidad por diseño",
      "estándares abiertos"
    ],
    about: [
      { "@type": "Thing", name: "Ciberseguridad" },
      { "@type": "Thing", name: "Inteligencia artificial" }
    ],
    competencyRequired: "Conocimientos básicos de informática; no se exige programar para empezar.",
    numberOfCredits: 0,
    offers: {
      "@type": "Offer",
      category: "Free",
      price: 0,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url
    },
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        "@id": `${url}#edicion-2026`,
        name: `Edición abierta · ${input.title}`,
        courseMode: ["online", "self-paced"],
        courseWorkload: `PT${horas}H`,
        inLanguage: input.locale,
        location: { "@type": "VirtualLocation", url },
        maximumAttendeeCapacity: undefined,
        isAccessibleForFree: true,
        instructor: { "@type": "Organization", name: "secure T · agentes docentes AURUM" }
      }
    ],
    syllabusSections: Array.from({ length: weeks }, (_, indice) => ({
      "@type": "Syllabus",
      name: `Semana ${indice + 1}`,
      position: indice + 1,
      url: `${url}/semana/${indice + 1}`
    })),
    accessibilityFeature: [
      "highContrastDisplay",
      "structuralNavigation",
      "tableOfContents",
      "readingOrder",
      "alternativeText",
      "longDescription"
    ],
    accessibilityHazard: "none",
    accessibilityControl: ["fullKeyboardControl", "fullVoiceControl", "fullTextControl"],
    accessibilitySummary:
      "Interfaz en cuatro idiomas con contraste AA y modo de alto contraste, navegación por teclado, foco visible, texto de apoyo y contenido legible sin conexión."
  };
}

export function programListJsonLd(input: {
  baseUrl: string;
  locale: string;
  courses: { slug: string; title: string; description: string }[];
}): Record<string, unknown> {
  const base = input.baseUrl.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${base}/programas#lista`,
    name: "Programas del campus secure T",
    numberOfItems: input.courses.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: input.courses.map((course, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      url: `${base}/programas/${course.slug}`,
      item: {
        "@type": "Course",
        name: course.title,
        description: course.description,
        provider: { "@id": `${base}/${ORG_ID}` },
        isAccessibleForFree: true,
        inLanguage: input.locale
      }
    }))
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Serializa JSON-LD para incrustarlo en un `<script type="application/ld+json">`.
 * Se escapa `<` para que un `</script>` dentro de un texto no rompa el documento.
 */
export function jsonLdScript(data: Record<string, unknown>): string {
  return JSON.stringify(data, (_clave, valor) => (valor === undefined ? undefined : valor)).replace(/</g, "\\u003c");
}
