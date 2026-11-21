import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const root = new URL("../", import.meta.url);
const read = p => readFileSync(new URL(p, root), "utf8");
test("fresh dev and test commands generate their curriculum before Vite and Vitest",()=>{
 const scripts=JSON.parse(read("package.json")).scripts;
 assert.match(scripts.dev,/generate-campus-data\.mjs.*sync-campus\.mjs.*vite/);
 assert.match(scripts.test,/generate-campus-data\.mjs.*vitest run/);
});
test("the student activity showcase explicitly labels its progress figures as fictitious",()=>{
 const source=read("client/src/pages/Home.tsx");
 assert.match(source,/Vista de ejemplo · cifras ficticias, no son datos del alumno/);
});
test("reproducible pnpm workspace pins the checked dependency override and esbuild approval",()=>{
 const config=read("pnpm-workspace.yaml");
 assert.match(config,/body-parser: 1\.20\.9/);
 assert.match(config,/esbuild: true/);
});
