import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["tests/**/*.test.ts", "client/src/**/__tests__/**/*.test.{ts,tsx}"], environment: "node" } });
