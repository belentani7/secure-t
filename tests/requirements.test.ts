/**
 * El contrato de la plataforma consigo misma, comprobado.
 *
 * Aquí no se prueban colores ni rutas: se prueba que **la tabla de requisitos no
 * miente**. Tres familias de comprobaciones:
 *
 *  1. **Coherencia interna**: identificadores únicos y con formato, dominios
 *     existentes, niveles y estados válidos, y el motivo escrito obligatorio en
 *     todo lo que no esté en verde.
 *  2. **Evidencia real**: cada test citado está en el árbol, cada fichero existe,
 *     cada script está declarado en `package.json` y cada marca de workflow está
 *     dentro de su workflow. `VERIFIED` obliga a evidencia **ejecutable**; `CI`,
 *     a evidencia de integración continua.
 *  3. **Sin deriva**: `docs/REQUISITOS.md` dice exactamente lo que dice el código
 *     (totales por estado, por dominio, y la lista de lo que falta con su motivo).
 *
 * Se añaden las comprobaciones que sostienen los requisitos operativos citados:
 * versión del changelog contra el manifiesto, y los artefactos de operación
 * (servidor estático, service worker, contenedores).
 */

import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { globSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DOMAINS,
  LEVELS,
  REQUIREMENTS,
  STATUSES,
  STATUSES_NEEDING_NOTE,
  TARGETS,
  mustGaps,
  requirementStats,
  type Evidence
} from "../packages/shared/src/requirements";

const root = join(__dirname, "..");
const leer = (rel: string) => readFileSync(join(root, rel), "utf8");
const existe = (rel: string) => existsSync(join(root, rel));
const scripts = Object.keys((JSON.parse(leer("package.json")) as { scripts: Record<string, string> }).scripts);

describe("registro de requisitos", () => {
  it("los identificadores son únicos y tienen formato", () => {
    const ids = REQUIREMENTS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id, `${id} no respeta el formato AAA-00`).toMatch(/^[A-Z][A-Z0-9]{1,4}-\d{2}$/);
  });

  it("dominio, nivel y estado son valores declarados", () => {
    for (const r of REQUIREMENTS) {
      expect(Object.keys(DOMAINS), `${r.id}: dominio desconocido`).toContain(r.domain);
      expect(LEVELS).toContain(r.level);
      expect(STATUSES).toContain(r.status);
      expect(r.title.length, `${r.id}: título vacío`).toBeGreaterThan(3);
      expect(r.statement.length, `${r.id}: enunciado demasiado corto`).toBeGreaterThan(20);
      expect(r.source.length, `${r.id}: sin norma o fuente`).toBeGreaterThan(3);
    }
  });

  it("todo lo que no está en verde dice por qué", () => {
    for (const r of REQUIREMENTS) {
      if (STATUSES_NEEDING_NOTE.includes(r.status)) {
        expect(r.note, `${r.id} está en ${r.status} y no explica el motivo`).toBeTruthy();
        expect((r.note ?? "").length, `${r.id}: el motivo es demasiado corto para ser útil`).toBeGreaterThan(60);
      }
    }
  });

  it("nadie declara verde sin evidencia del tipo que corresponde", () => {
    for (const r of REQUIREMENTS) {
      expect(r.evidence.length, `${r.id} no cita evidencia`).toBeGreaterThan(0);
      if (r.status === "VERIFIED") {
        const ejecutable = r.evidence.some((e) => e.kind === "test" || e.kind === "script");
        expect(ejecutable, `${r.id} se declara VERIFIED sin prueba ni script`).toBe(true);
      }
      if (r.status === "CI") {
        const continua = r.evidence.some((e) => e.kind === "workflow" || e.kind === "ci");
        expect(continua, `${r.id} se declara CI sin evidencia de integración continua`).toBe(true);
      }
    }
  });

  it("cada dominio tiene al menos un requisito y todos los dominios se usan", () => {
    const usados = new Set(REQUIREMENTS.map((r) => r.domain));
    for (const domain of Object.keys(DOMAINS)) expect(usados, `${domain} no tiene requisitos`).toContain(domain);
  });
});

describe("la evidencia citada existe de verdad", () => {
  const evidencias: Array<[string, Evidence]> = REQUIREMENTS.flatMap((r) => r.evidence.map((e) => [r.id, e] as [string, Evidence]));

  it("los ficheros y pruebas citados están en el árbol", () => {
    for (const [id, e] of evidencias) {
      if (e.kind === "test" || e.kind === "file") {
        expect(existe(e.ref), `${id} cita ${e.ref}, que no existe`).toBe(true);
      }
    }
  });

  it("los scripts citados están declarados en package.json", () => {
    for (const [id, e] of evidencias) {
      if (e.kind === "script") expect(scripts, `${id} cita el script «${e.ref}», que no existe`).toContain(e.ref);
    }
  });

  it("las marcas citadas están dentro de su workflow", () => {
    for (const [id, e] of evidencias) {
      if (e.kind === "workflow") {
        expect(existe(e.ref), `${id} cita el workflow ${e.ref}`).toBe(true);
        expect(leer(e.ref), `${id}: el workflow ${e.ref} no contiene «${e.marker}»`).toContain(e.marker);
      }
    }
  });

  it("las ejecuciones de CI citadas son identificadores plausibles", () => {
    for (const [id, e] of evidencias) {
      if (e.kind === "ci") expect(e.ref, `${id}: identificador de ejecución inválido`).toMatch(/^\d{6,}$/);
    }
  });
});

describe("el documento generado no se separa del código", () => {
  const doc = leer("docs/REQUISITOS.md");
  const stats = requirementStats();

  it("el resumen coincide con el registro", () => {
    expect(doc).toContain(`- **Total**: ${stats.total} requisitos en ${Object.keys(DOMAINS).length} dominios — ${stats.byLevel.MUST} MUST, ${stats.byLevel.SHOULD} SHOULD, ${stats.byLevel.MAY} MAY`);
    expect(doc).toContain(`- **En verde**: ${stats.byStatus.VERIFIED + stats.byStatus.CI} de ${stats.total} (${stats.greenShare.toString().replace(".", ",")} %)`);
    expect(doc).toContain(`- **Obligatorios sin cerrar**: ${mustGaps().length}`);
  });

  it("la tabla por estado y por dominio coincide", () => {
    for (const status of STATUSES) expect(doc).toContain(`| ${status} | ${stats.byStatus[status]} |`);
    for (const [dominio, nombre] of Object.entries(DOMAINS)) {
      const delDominio = REQUIREMENTS.filter((r) => r.domain === dominio);
      const verde = delDominio.filter((r) => r.status === "VERIFIED" || r.status === "CI").length;
      expect(doc).toContain(`| ${nombre} | ${delDominio.length} | ${verde} de ${delDominio.length} |`);
    }
  });

  it("cada requisito aparece con su estado, y los pendientes con su motivo", () => {
    for (const r of REQUIREMENTS) {
      expect(doc, `falta ${r.id} en el documento`).toContain(`\`${r.id}\` | ${r.level} |`);
      if (STATUSES_NEEDING_NOTE.includes(r.status)) {
        expect(doc, `falta el motivo de ${r.id}`).toContain(`**${r.id} — ${r.title}** (\`${r.status}\`) — ${r.note}`);
      }
    }
  });

  it("el documento publica el listón y cómo se verifica", () => {
    expect(doc).toContain(`${TARGETS.testsFloor}`);
    expect(doc).toContain(`LCP ≤ ${TARGETS.cwv.lcpMs} ms`);
    expect(doc).toContain("pnpm requirements");
    expect(doc).toContain("pnpm test");
  });
});

describe("los requisitos operativos citados se sostienen", () => {
  it("el changelog y el manifiesto van a la misma versión (CAL-07)", () => {
    const version = (JSON.parse(leer("package.json")) as { version: string }).version;
    const changelog = leer("CHANGELOG.md");
    expect(changelog).toContain(`## [${version}]`);
    // Y la primera versión del changelog es la última publicada, no una antigua.
    const primera = changelog.match(/^## \[(\d+\.\d+\.\d+)\]/m)?.[1];
    expect(primera).toBe(version);
  });

  it("el servidor estático escucha en todas las interfaces (OPS-02)", () => {
    const servidor = leer("tools/serve-static.mjs");
    expect(servidor).toContain('server.listen(port, "0.0.0.0"');
  });

  it("el service worker cachea con versión explícita (OPS-03)", () => {
    const sw = leer("apps/web/public/sw.js");
    expect(sw).toMatch(/CACHE|VERSION|cacheName/i);
    expect(sw).toMatch(/v\d+/);
    expect(sw).toContain("addEventListener");
  });

  it("el despliegue alternativo existe y declara su servicio (OPS-04)", () => {
    expect(existe("docker-compose.yml")).toBe(true);
    expect(existe("Dockerfile")).toBe(true);
    const compose = leer("docker-compose.yml");
    expect(compose).toContain("services:");
    expect(compose).toMatch(/build:|image:/);
  });

  it("el suelo de pruebas es real: casos escritos y cifras publicadas (CAL-01)", () => {
    // Dos comprobaciones encadenadas, porque un suelo en el papel no vale nada:
    //  1. el árbol contiene suficientes casos escritos para sostener lo que se publica;
    //  2. las cifras que publica el README suman, al menos, el suelo de ejecutadas.
    const ts = globSync(["packages/*/tests/**/*.test.ts", "tests/**/*.test.ts"]).map(leer).join("\n");
    const casosTs = (ts.match(/(?:^|\s)(?:it|test)\(/g) ?? []).length;
    const py = globSync(["tests/*.py"]).map(leer).join("\n");
    const casosPy = (py.match(/def test_/g) ?? []).length;
    expect(casosTs + casosPy, `sólo ${casosTs + casosPy} casos escritos`).toBeGreaterThanOrEqual(TARGETS.declaredCasesFloor);

    // El README no puede dar dos cifras distintas de la misma suite: si cita el
    // número en dos sitios (arranque y verificación), tienen que coincidir.
    const readme = leer("README.md");
    const cifras = (patron: RegExp) => [...readme.matchAll(patron)].map((m) => Number(m[1]));
    const vitest = [...new Set(cifras(/(\d+) tests vitest/g).concat(cifras(/# \d+ ficheros, (\d+) tests/g)))];
    const pytest = [...new Set(cifras(/(\d+) tests del campus/g).concat(cifras(/pytest -q tests\/\s+# (\d+) tests/g)))];
    expect(vitest.length, `el README publica ${vitest.length} cifras distintas de vitest: ${vitest.join(", ")}`).toBe(1);
    expect(pytest.length, `el README publica ${pytest.length} cifras distintas de pytest: ${pytest.join(", ")}`).toBe(1);
    expect(vitest[0] ?? 0, "el README no publica el número de tests de vitest").toBeGreaterThan(0);
    expect(pytest[0] ?? 0, "el README no publica el número de tests de pytest").toBeGreaterThan(0);
    expect(
      (vitest[0] ?? 0) + (pytest[0] ?? 0),
      `el README publica ${(vitest[0] ?? 0) + (pytest[0] ?? 0)} pruebas ejecutadas, por debajo del suelo de ${TARGETS.testsFloor}`
    ).toBeGreaterThanOrEqual(TARGETS.testsFloor);
  });

  it("el servidor sirve comprimido y con caché (PERF-05)", () => {
    const servidor = leer("tools/serve-static.mjs");
    expect(servidor, "sin compresión no se sostiene el presupuesto de peso").toMatch(/brotli|gzip/);
    expect(servidor, "sin cabeceras de caché cada visita vuelve a descargar todo").toMatch(/Cache-Control|immutable|max-age/i);
    expect(existe("apps/web/public/_headers"), "las cabeceras del host tienen que viajar con el sitio").toBe(true);
  });

  it("el árbol no lleva restos de herramientas (CAL-08)", () => {
    // Un `.orig`, un `.rej` o un `*~` versionado es un accidente esperando a
    // confundir a quien lea: se comprueba contra git, no contra un listado a mano.
    const seguidos = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" }).split("\n");
    const restos = seguidos.filter((f) => /\.(orig|rej|bak|swp)$|~$/.test(f));
    expect(restos, `restos versionados: ${restos.join(", ")}`).toEqual([]);
  });

  it("el ensamblado del sitio comprueba secretos antes de publicar (OPS-07)", () => {
    const ensamblado = leer("tools/build-site.mjs");
    expect(ensamblado).toMatch(/secreto|secret/i);
  });
});
