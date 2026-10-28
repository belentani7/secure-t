#!/usr/bin/env node
import { cpSync, existsSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const output = path.resolve(root, "client", "public");

const STATIC_SURFACES = [
  { source: "campus", target: "campus/full" },
  { source: "conceptos", target: "conceptos" },
  { source: "ui", target: "ui" },
  { source: "404.html", target: "404.html" },
];

function countFiles(target) {
  if (statSync(target).isFile()) return 1;
  return readdirSync(target, { withFileTypes: true }).reduce(
    (total, entry) =>
      total + (entry.isDirectory() ? countFiles(path.join(target, entry.name)) : 1),
    0,
  );
}

export function syncCampus({ destination = output } = {}) {
  const copied = [];
  for (const entry of STATIC_SURFACES) {
    const source = path.join(root, entry.source);
    if (!existsSync(source)) continue;
    const target = path.join(destination, entry.target);
    const cleanupRoot =
      entry.source === "campus" ? path.join(destination, "campus") : target;
    rmSync(cleanupRoot, { recursive: true, force: true });
    cpSync(source, target, { recursive: true, force: true });
    copied.push({ entry: entry.target, files: countFiles(target) });
  }
  return copied;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const flag = args.indexOf("--destination");
  const destination =
    flag !== -1 && args[flag + 1] ? path.resolve(args[flag + 1]) : output;
  const copied = syncCampus({ destination });
  const files = copied.reduce((total, item) => total + item.files, 0);
  console.log(
    `synced ${copied.length} static surfaces (${files} files) -> ${path.relative(root, destination)}`,
  );
  for (const item of copied) console.log(`  ${item.entry}: ${item.files} files`);
}

