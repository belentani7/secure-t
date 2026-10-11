/**
 * SBOM en CycloneDX 1.5 a partir de `pnpm-lock.yaml`.
 *
 * Un SBOM sirve para responder a «¿qué hay dentro de este artefacto?» cuando
 * aparece una vulnerabilidad. Se genera desde el lockfile, no desde el disco,
 * así que el inventario **coincide exactamente** con lo que se instala: si
 * alguien añade una dependencia sin resolver el lock, el SBOM lo delata.
 *
 * Detalles deliberados:
 *   · Se ordenan los componentes por nombre → el fichero se puede comparar.
 *   · El número de serie se deriva del contenido (SHA-256) y no es aleatorio.
 *   · Las licencias salen de `DEPENDENCIAS.md` (lo declarado y revisado) y del
 *     mapa estable de paquetes conocidos; lo que no se puede afirmar se marca
 *     `NOASSERTION` en lugar de inventarse.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lock = readFileSync(join(root, "pnpm-lock.yaml"), "utf8");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

/* --------------------------------------------------------- lectura del lock */

/** Devuelve [{name, version, integrity}] en el orden del fichero. */
export function parseLock(text) {
  const inicio = text.indexOf("\npackages:");
  if (inicio < 0) throw new Error("pnpm-lock.yaml sin sección packages:");
  const cuerpo = text.slice(inicio);
  const componentes = [];
  const re = /^ {2}'?((?:@[^@'\s]+\/)?[^@'\s]+)@([^'\s:()]+)'?:\n(?: {4}.*\n)*? {4}resolution: \{integrity: (sha\d+-[A-Za-z0-9+/=]+)\}/gm;
  let coincidencia;
  while ((coincidencia = re.exec(cuerpo)) !== null) {
    componentes.push({ name: coincidencia[1], version: coincidencia[2], integrity: coincidencia[3] });
  }
  if (!componentes.length) throw new Error("no se ha podido leer ningún paquete del lockfile");
  return componentes;
}

/* ---------------------------------------------------------------- licencias */

/** Licencias revisadas y declaradas en DEPENDENCIAS.md (tablas 1 y 4). */
export function licensesFromDocs(text) {
  const mapa = new Map();
  for (const linea of text.split("\n")) {
    if (!linea.startsWith("|")) continue;
    const celdas = linea.split("|").map((celda) => celda.trim());
    if (celdas.length < 5) continue;
    const [paquete, , , , licencia] = [celdas[1], celdas[2], celdas[3], celdas[4], celdas[5] ?? ""];
    if (!paquete.includes("`") || !licencia) continue;
    const limpia = licencia.replace(/[()]/g, "").trim();
    if (!/^(MIT|Apache-2\.0|MPL-2\.0|AGPL-3\.0-only|BSD-2-Clause|BSD-3-Clause|ISC|0BSD|CC0-1\.0|CC-BY-4\.0)$/.test(limpia)) continue;
    for (const nombre of paquete.match(/`([^`]+)`/g) ?? []) {
      for (const alias of nombre.replace(/`/g, "").split(/\s*\/\s*/)) mapa.set(alias.replace(/^@types\/.*/, ""), limpia);
    }
  }
  return mapa;
}

/**
 * Licencia declarada por el propio paquete instalado (dato de primera mano, sin
 * consultar la red). Si no está instalado o no la declara, se devuelve `null` y
 * el componente se marca `NOASSERTION`: preferimos no afirmar antes que afirmar
 * de memoria.
 */
export function licenseFromPackage(name, version) {
  // pnpm deja la dependencia directa enlazada en la raíz y el resto dentro de
  // `.pnpm/<nombre>@<versión>/node_modules/<nombre>`: se miran los dos sitios.
  const candidatas = [
    join(root, "node_modules", name, "package.json"),
    join(root, "node_modules", ".pnpm", `${name}@${version}`, "node_modules", name, "package.json")
  ];
  const ruta = candidatas.find((candidata) => existsSync(candidata));
  if (!ruta) return null;
  try {
    const meta = JSON.parse(readFileSync(ruta, "utf8"));
    const bruto = meta.license ?? (Array.isArray(meta.licenses) ? meta.licenses.map((l) => l.type).join(" OR ") : null);
    if (!bruto || typeof bruto !== "string") return null;
    const limpia = bruto.replace(/^(\(|\s+)|(\)|\s+)$/g, "");
    if (/^[A-Za-z0-9.+-]+$/.test(limpia)) return { id: limpia };
    return { expression: limpia };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------- conversión */

const b64aHex = (texto) => Buffer.from(texto, "base64").toString("hex");

/** Da a la licencia la forma que exige CycloneDX 1.5 (`license.id` o `expression`). */
function formaLicencia(entrada) {
  if (!entrada) return { expression: "NOASSERTION" };
  return "id" in entrada ? { license: entrada } : entrada;
}

function purl(name, version) {
  const escapado = name.startsWith("@") ? `%40${name.slice(1)}` : name;
  return `pkg:npm/${escapado}@${version}`;
}

const REPOSITORIO = "https://github.com/belentani7/secure-t";

export function buildSbom({ componentes, licencias, generado }) {
  const ordenados = [...componentes].sort((a, b) =>
    a.name === b.name ? a.version.localeCompare(b.version) : a.name.localeCompare(b.name)
  );
  const body = {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    version: 1,
    metadata: {
      timestamp: generado,
      tools: [{ vendor: "secure-t", name: "tools/build-sbom.mjs", version: pkg.version }],
      component: {
        type: "application",
        "bom-ref": "pkg:npm/secure-t@0.2.0",
        name: "secure-t",
        version: pkg.version,
        description: "Campus abierto de ciberseguridad e IA (dos campus: AURUM y clásico).",
        licenses: [{ license: { id: "MIT" } }],
        externalReferences: [
          { type: "vcs", url: REPOSITORIO },
          { type: "website", url: "https://belentani7.github.io/secure-t/" }
        ]
      }
    },
    components: ordenados.map(({ name, version, integrity }) => ({
      type: "library",
      "bom-ref": purl(name, version),
      name,
      version,
      purl: purl(name, version),
      hashes: [{ alg: "SHA-512", content: b64aHex(integrity.split("-")[1]) }],
      licenses: [
        licencias.has(name) ? { license: { id: licencias.get(name) } } : formaLicencia(licenseFromPackage(name, version))
      ]
    }))
  };
  const sinSerie = JSON.stringify(body, null, 2);
  const serie = createHash("sha256").update(sinSerie).digest("hex").slice(0, 32);
  const uuid = `${serie.slice(0, 8)}-${serie.slice(8, 12)}-4${serie.slice(13, 16)}-a${serie.slice(17, 20)}-${serie.slice(20, 32)}`;
  return { ...body, serialNumber: `urn:uuid:${uuid}` };
}

/**
 * Fecha del SBOM: `SOURCE_DATE_EPOCH` si está definida (comportamiento
 * reproducible estándar) y, si no, la fecha de modificación del lockfile. Nunca
 * `Date.now()`: dos ejecuciones sobre el mismo árbol deben dar el mismo fichero,
 * y así el test puede comprobarlo.
 */
export function generate() {
  const componentes = parseLock(lock);
  const licencias = licensesFromDocs(readFileSync(join(root, "DEPENDENCIAS.md"), "utf8"));
  const rutaLock = join(root, "pnpm-lock.yaml");
  const epoch = process.env.SOURCE_DATE_EPOCH
    ? Number(process.env.SOURCE_DATE_EPOCH) * 1000
    : statSync(rutaLock).mtimeMs;
  return buildSbom({ componentes, licencias, generado: new Date(epoch).toISOString() });
}

/* ------------------------------------------------------------------ main */

const salida = join(root, "apps", "web", "public", "sbom.cdx.json");
mkdirSync(dirname(salida), { recursive: true });
const sbom = generate();
writeFileSync(salida, `${JSON.stringify(sbom, null, 2)}\n`, "utf8");
const conLicencia = sbom.components.filter((c) => c.licenses[0].license?.id).length;
const sinAfirmar = sbom.components.filter((c) => !c.licenses[0].license?.id).length;
console.log(`SBOM CycloneDX 1.5 → ${salida}`);
console.log(`  componentes: ${sbom.components.length}`);
console.log(`  licencias declaradas: ${conLicencia} · sin afirmar: ${sinAfirmar}`);
console.log(`  serial: ${sbom.serialNumber}`);
