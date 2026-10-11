import { translator, type Locale } from "@secure-t/shared";
import { asset } from "@/lib/site";
import type { PackageIndex } from "@/lib/content";

/**
 * Página de estándares: qué cumple el campus, con qué norma y cómo se comprueba.
 *
 * Y los paquetes para descargar, generados desde el mismo material: libro EPUB,
 * curso SCORM 2004 para un LMS, cartucho Common Cartridge, evaluación QTI y
 * plantillas xAPI. Cada fichero va con su huella SHA-256 publicada.
 */

const CUMPLIMIENTO: { norma: string; detalle: string; evidencia: string }[] = [
  {
    norma: "EPUB 3.3 · EPUB Accessibility 1.1",
    detalle:
      "Libro completo por programa: contenedor OCF con `mimetype` sin comprimir, paquete OPF con `dcterms:modified`, navegación EPUB y metadatos de accesibilidad (modos, características y aviso de peligro).",
    evidencia: "tests/packages-contract.test.ts · prueba de EPUB"
  },
  {
    norma: "SCORM 2004 4th Edition (ADL)",
    detalle:
      "Organización jerárquica con 21 SCO (presentación + 20 semanas), namespaces `imscp_v1p1`, `adlcp_v1p3`, `imsss`, y puente en tiempo de ejecución con `cmi.completion_status`, `cmi.location` y `cmi.session_time`.",
    evidencia: "tests/packages-contract.test.ts · prueba de SCORM"
  },
  {
    norma: "IMS Common Cartridge 1.3",
    detalle: "Cartucho importable con `webcontent` por semana y la evaluación incrustada como `imsqti_xmlv1p2`.",
    evidencia: "tests/packages-contract.test.ts · prueba de Common Cartridge"
  },
  {
    norma: "IMS QTI 1.2",
    detalle:
      "Cuestionario con `response_lid`, `resprocessing`, puntuación por pregunta y retroalimentación correcta/incorrecta; la respuesta correcta se contrasta con `quiz.json`.",
    evidencia: "tests/packages-contract.test.ts · prueba de QTI"
  },
  {
    norma: "xAPI 1.0.3 (ADL · IEEE 9274.1.1-2023)",
    detalle:
      "Declaraciones conformes (UUID, actor anónimo con `account`, verbos del vocabulario de ADL, duraciones ISO 8601) listas para importar en un LRS propio.",
    evidencia: "packages/shared/tests/xapi.test.ts"
  },
  {
    norma: "Open Badges 2.0 y 3.0 (1EdTech)",
    detalle:
      "Insignia firmada con RS256 en el dispositivo, con `Assertion`, `BadgeClass` e `Issuer` conformes, verificable sin servidor con la clave pública incluida.",
    evidencia: "packages/shared/tests/badges.test.ts"
  },
  {
    norma: "schema.org · Course, CourseInstance, Syllabus",
    detalle:
      "Datos estructurados en JSON-LD en las páginas de programa, con temario semana a semana y accesibilidad declarada; sin valoraciones inventadas.",
    evidencia: "packages/shared/tests/seo.test.ts"
  },
  {
    norma: "WCAG 2.2 AA",
    detalle:
      "Contraste verificado por cálculo, `lang` por ruta, foco visible, tamaños de objetivo, movimiento reducido, alto contraste y auditoría estática de las 466 páginas.",
    evidencia: "packages/ui/tests/tokens.test.ts · tools/audit-site.mjs · quality.yml"
  },
  {
    norma: "RGPD (UE) 2016/679",
    detalle: "Sin cuentas ni datos personales; aviso de privacidad con lo que ocurre fuera del navegador y derechos ejercibles sin intermediarios.",
    evidencia: "apps/web/src/components/privacy-view.tsx · tests/contracts.test.ts"
  },
  {
    norma: "RFC 9116 · security.txt",
    detalle: "Canal de reporte de vulnerabilidades con caducidad, alcance y lenguas preferidas.",
    evidencia: "tests/contracts.test.ts"
  },
  {
    norma: "SPDX · CycloneDX 1.5 (SBOM)",
    detalle: "Inventario de dependencias en formato CycloneDX generado desde `pnpm-lock.yaml`, con licencias declaradas.",
    evidencia: "tools/build-sbom.mjs · tests/contracts.test.ts"
  },
  {
    norma: "RFC 5545 · calendario",
    detalle: "Exportación `.ics` con plegado a 75 octetos, festivos reales por país y región y descansos obligatorios.",
    evidencia: "packages/shared/tests/calendar.test.ts"
  }
];

const ETIQUETA: Record<string, string> = {
  epub: "EPUB",
  scorm: "SCORM 2004",
  cc: "Common Cartridge",
  qti: "QTI 1.2",
  xapi: "xAPI"
};

function agrupar(index: PackageIndex | null) {
  if (!index) return [];
  const porCurso = new Map<string, { slug: string; title: string; files: { tipo: string; path: string; bytes: number }[] }>();
  for (const curso of index.courses) porCurso.set(curso.slug, { slug: curso.slug, title: curso.title, files: [] });
  for (const file of index.files) {
    const [slug, sufijo] = descomponer(file.path);
    const entrada = porCurso.get(slug);
    if (!entrada || !sufijo) continue;
    entrada.files.push({ tipo: sufijo, path: file.path, bytes: file.bytes });
  }
  return [...porCurso.values()];
}

function descomponer(path: string): [string, string | null] {
  if (path.endsWith(".epub")) return [path.replace(/\.epub$/, ""), "epub"];
  if (path.endsWith("-scorm2004.zip")) return [path.replace(/-scorm2004\.zip$/, ""), "scorm"];
  if (path.endsWith(".imscc")) return [path.replace(/\.imscc$/, ""), "cc"];
  if (path.endsWith("-qti12.xml")) return [path.replace(/-qti12\.xml$/, ""), "qti"];
  if (path.endsWith("-xapi.json")) return [path.replace(/-xapi\.json$/, ""), "xapi"];
  return ["", null];
}

export function StandardsView({ locale, index }: { locale: Locale; index: PackageIndex | null }) {
  const t = translator(locale);
  const cursos = agrupar(index);

  return (
    <div className="wrap section">
      <p className="eyebrow">{t("standards.title")}</p>
      <h1>{t("standards.title")}</h1>
      <p className="lead">{t("standards.lead")}</p>

      <section className="mt-8" aria-labelledby="paquetes">
        <h2 id="paquetes">{t("standards.download")}</h2>
        {index ? (
          <p className="mono text-[0.75rem] text-[var(--aurum-muted)]">
            {index.files.length} ficheros · {new Date(index.generatedAt).toISOString().slice(0, 10)} ·{" "}
            <a href={asset("/packages/index.json")}>index.json</a> (huellas SHA-256)
          </p>
        ) : null}
        <div className="grid-2 mt-4">
          {cursos.map((curso) => (
            <article key={curso.slug} className="card">
              <h3 className="card-title">{curso.title}</h3>
              <ul className="space-y-1 text-sm">
                {curso.files.map((file) => (
                  <li key={file.path} className="flex items-center justify-between gap-3">
                    <a href={asset(`/packages/${file.path}`)} download>
                      {ETIQUETA[file.tipo] ?? file.tipo}
                    </a>
                    <span className="mono text-[0.7rem] text-[var(--aurum-muted)]">{(file.bytes / 1024).toFixed(0)} kB</span>
                  </li>
                ))}
                <li className="flex items-center justify-between gap-3">
                  <a href={asset(`/badges/${curso.slug}.svg`)} download>
                    {t("badge.title")} (SVG)
                  </a>
                  <span className="mono text-[0.7rem] text-[var(--aurum-muted)]">Open Badges</span>
                </li>
              </ul>
            </article>
          ))}
        </div>
        <p className="mono mt-3 text-[0.75rem] text-[var(--aurum-muted)]">{t("xapi.note")}</p>
      </section>

      <section className="mt-12" aria-labelledby="cumplimiento">
        <h2 id="cumplimiento">{t("standards.title")}</h2>
        <div tabIndex={0} className="table-wrap mt-4">
          <table>
            <caption className="sr-only">{t("standards.title")}</caption>
            <thead>
              <tr>
                <th scope="col">Norma</th>
                <th scope="col">Qué se aplica</th>
                <th scope="col">Dónde se comprueba</th>
              </tr>
            </thead>
            <tbody>
              {CUMPLIMIENTO.map((fila) => (
                <tr key={fila.norma}>
                  <th scope="row" className="align-top">
                    {fila.norma}
                  </th>
                  <td>{fila.detalle}</td>
                  <td className="mono text-[0.72rem] text-[var(--aurum-muted)]">{fila.evidencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mono mt-3 text-[0.72rem] text-[var(--aurum-muted)]">
          Lo que <strong>no</strong> está: LTI 1.3 (integración con un LMS como herramienta externa), registro público de
          credenciales y revocación en línea. Se declaran como PLANIFICADOS en lugar de aparentarlos. Detalle completo en{" "}
          <a href="https://github.com/belentani7/secure-t/blob/main/docs/ESTANDARES.md">docs/ESTANDARES.md</a> ·{ " " }
          <a href="https://github.com/belentani7/secure-t/blob/main/docs/decisions/ADR-0011-cabeceras-y-csp.md">
            ADR-0011
          </a>.
        </p>
      </section>
    </div>
  );
}
