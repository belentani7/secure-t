#!/usr/bin/env node
import { execSync } from "child_process";

const platforms = [
  { name: "Vercel", cmd: "vercel deploy --prod" },
  { name: "Netlify", cmd: "netlify deploy --prod" },
  { name: "Cloudflare", cmd: "wrangler publish" },
];

console.log("🚀 Deploying to all platforms...\n");

const failed = [];

for (const { name, cmd } of platforms) {
  try {
    console.log(`📤 ${name}...`);
    execSync(cmd, { stdio: "inherit" });
    console.log(`✅ ${name} OK\n`);
  } catch (e) {
    console.error(`❌ ${name} FAILED\n`);
    failed.push(name);
  }
}

if (failed.length > 0) {
  console.error(`❌ Deploy finished with failures: ${failed.join(", ")}`);
  process.exit(1);
}

console.log("🎉 Deploy complete!");
