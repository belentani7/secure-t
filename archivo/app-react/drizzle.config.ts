import { defineConfig } from "drizzle-kit";
export default defineConfig({ schema: "./drizzle/schema.ts", out: "./drizzle/migrations", dialect: "postgresql", dbCredentials: { url: process.env.DATABASE_URL || "postgresql://secure_t:change-me@localhost:5432/secure_t" }, strict: true, verbose: true });
