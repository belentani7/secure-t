import { describe, expect, it } from "vitest";
import {
  breadcrumbJsonLd,
  courseJsonLd,
  jsonLdScript,
  organizationJsonLd,
  programListJsonLd,
  websiteJsonLd
} from "../src/seo";

/**
 * Datos estructurados: lo que un buscador necesita para entender el campus.
 *
 * Además de los campos obligatorios, se comprueba una regla de honestidad: no
 * se emiten valoraciones ni acreditaciones que no existen. Un `aggregateRating`
 * inventado sería exactamente el tipo de mentira que este repositorio prohíbe.
 */

const BASE = "https://belentani7.github.io/secure-t/app";

const curso = courseJsonLd({
  baseUrl: BASE,
  locale: "es",
  slug: "ciber-defensiva",
  title: "Ciberseguridad Defensiva: Operar como SOC",
  description: "Tríada CIA, telemetría, detección y respuesta a incidentes.",
  weeks: 20,
  updated: "2026-10-11"
});

describe("organización y sitio", () => {
  it("la organización declara identidad, idiomas, autor y código fuente", () => {
    const organizacion = organizationJsonLd(BASE) as Record<string, any>;
    expect(organizacion["@type"]).toBe("EducationalOrganization");
    expect(organizacion["@id"]).toBe(`${BASE}/#organizacion`);
    expect(organizacion.knowsLanguage).toEqual(["pt", "es", "en", "ca"]);
    expect(organizacion.sameAs).toContain("https://github.com/belentani7/secure-t");
    expect(organizacion.founder.name).toBe("Pedro Belentani");
    expect(organizacion.potentialAction["query-input"]).toBe("required name=search_term_string");
  });

  it("el sitio declara los cuatro idiomas y que es gratis", () => {
    const sitio = websiteJsonLd(BASE, ["pt", "es", "en", "ca"]) as Record<string, any>;
    expect(sitio.inLanguage).toEqual(["pt", "es", "en", "ca"]);
    expect(sitio.isAccessibleForFree).toBe(true);
    expect(sitio.license).toContain("mit");
  });
});

describe("curso", () => {
  it("tiene los campos que exige schema.org para un Course", () => {
    expect(curso["@type"]).toBe("Course");
    for (const campo of ["name", "description", "provider", "hasCourseInstance", "offers"]) {
      expect(curso[campo], `falta ${campo}`).toBeDefined();
    }
    expect((curso.offers as Record<string, unknown>).price).toBe(0);
  });

  it("describe la edición en línea, a ritmo propio y sin coste", () => {
    const instancia = (curso.hasCourseInstance as Record<string, any>[])[0]!;
    expect(instancia["@type"]).toBe("CourseInstance");
    expect(instancia.courseMode).toEqual(["online", "self-paced"]);
    expect(instancia.courseWorkload).toBe("PT120H");
    expect(instancia.isAccessibleForFree).toBe(true);
    expect(instancia.location["@type"]).toBe("VirtualLocation");
  });

  it("publica el temario semana a semana con su URL real", () => {
    const temario = curso.syllabusSections as Record<string, unknown>[];
    expect(temario).toHaveLength(20);
    expect(temario[19]).toMatchObject({
      "@type": "Syllabus",
      name: "Semana 20",
      position: 20,
      url: `${BASE}/programas/ciber-defensiva/semana/20`
    });
  });

  it("declara la accesibilidad del contenido (schema.org accessibilityFeature)", () => {
    expect(curso.accessibilityFeature).toContain("highContrastDisplay");
    expect(curso.accessibilityFeature).toContain("structuralNavigation");
    expect(curso.accessibilityHazard).toBe("none");
    expect(curso.accessibilityControl).toContain("fullKeyboardControl");
  });

  it("no inventa valoraciones, acreditaciones ni plazas", () => {
    const serializado = JSON.stringify(curso);
    expect(serializado).not.toMatch(/aggregateRating|reviewCount|ratingValue|accreditation/);
    expect((curso.hasCourseInstance as Record<string, any>[])[0]?.maximumAttendeeCapacity).toBeUndefined();
  });
});

describe("listados y migas", () => {
  it("el listado de programas conserva el orden y el número de elementos", () => {
    const lista = programListJsonLd({
      baseUrl: BASE,
      locale: "es",
      courses: [
        { slug: "ciber-ofensiva", title: "Ofensiva", description: "…" },
        { slug: "ciber-defensiva", title: "Defensiva", description: "…" }
      ]
    }) as Record<string, any>;
    expect(lista.numberOfItems).toBe(2);
    expect(lista.itemListElement[0].position).toBe(1);
    expect(lista.itemListElement[1].url).toBe(`${BASE}/programas/ciber-defensiva`);
  });

  it("las migas numeran desde 1 y mantienen el orden recibido", () => {
    const migas = breadcrumbJsonLd([
      { name: "Campus", url: `${BASE}/programas` },
      { name: "Defensiva", url: `${BASE}/programas/ciber-defensiva` }
    ]) as Record<string, any>;
    expect(migas["@type"]).toBe("BreadcrumbList");
    expect(migas.itemListElement.map((item: { position: number }) => item.position)).toEqual([1, 2]);
  });
});

describe("incrustación segura", () => {
  it("escapa `<` para que un texto no pueda cerrar el script", () => {
    const json = jsonLdScript({ name: "Curso </script><script>alert(1)</script>" });
    expect(json).not.toContain("</script>");
    expect(json).toContain("\\u003c");
    expect(JSON.parse(json).name).toContain("</script>");
  });

  it("omite las claves indefinidas en lugar de escribir null", () => {
    const json = jsonLdScript({ name: "x", hueco: undefined });
    expect(json).not.toContain("hueco");
  });
});
