#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");

const SCAN_DIRS = [
  "client/src",
  "server",
  "shared",
  "auth",
  "academic",
  "education/edu-engine/src",
].map((d) => join(ROOT, d));

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const SKIP_DIR_NAMES = new Set(["node_modules", "dist", "build", ".git"]);

const PATTERNS = [
  { name: "emails", regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g },
  { name: "phone numbers", regex: /(?:\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]?\d{4}\b/g },
  { name: "hardcoded user names", regex: /\buser\s*=\s*"[^"]+"/g },
  { name: "API secrets", regex: /\b(?:sk|ghp|gho|AKIA|AIza|xox[baprs])[-_][A-Za-z0-9_-]{16,}\b/g },
  { name: "private keys", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
];

function walk(dir, files = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return files; // el directorio no existe todavía, no es un error de auditoría
  }

  for (const entry of entries) {
    if (SKIP_DIR_NAMES.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (SOURCE_EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
      files.push(fullPath);
    }
  }
  return files;
}

console.log("🔍 Auditing for personal data...\n");

const files = SCAN_DIRS.flatMap((dir) => walk(dir));
let found = false;

for (const filePath of files) {
  const content = readFileSync(filePath, "utf-8");
  const relPath = relative(ROOT, filePath);

  for (const { name, regex } of PATTERNS) {
    const matches = content.match(regex);
    if (matches) {
      console.log(`⚠️  Found potential ${name} in ${relPath}:`);
      for (const m of matches) console.log(`   ${m}`);
      found = true;
    }
  }
}

console.log(`\nScanned ${files.length} files across ${SCAN_DIRS.map((d) => relative(ROOT, d)).join(", ")}`);

if (!found) {
  console.log("✅ No personal data found in source code!");
} else {
  console.log("\n❌ Review the findings above before deploying");
  process.exit(1);
}
