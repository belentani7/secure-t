/** Tipos públicos de `tools/build-sbom.mjs` (lo importa tests/contracts.test.ts). */

export interface LockComponent {
  name: string;
  version: string;
  integrity: string;
}

export interface SbomComponent {
  type: "library";
  "bom-ref": string;
  name: string;
  version: string;
  purl: string;
  hashes: { alg: string; content: string }[];
  licenses: Record<string, unknown>[];
}

export interface Sbom {
  bomFormat: "CycloneDX";
  specVersion: "1.5";
  version: number;
  serialNumber: string;
  metadata: {
    timestamp: string;
    tools: { vendor: string; name: string; version: string }[];
    component: Record<string, unknown>;
  };
  components: SbomComponent[];
}

export function parseLock(text: string): LockComponent[];
export function licensesFromDocs(text: string): Map<string, string>;
export function licenseFromPackage(name: string, version: string): { id: string } | { expression: string } | null;
export function buildSbom(input: { componentes: LockComponent[]; licencias: Map<string, string>; generado: string }): Sbom;
export function generate(): Sbom;
