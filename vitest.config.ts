import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Configuración única de vitest para todo el monorepo.
 *
 * Se prueban los **fuentes** de los paquetes (no copias compiladas) y se cubren
 * tanto los contratos que ya existían en `tests/` como los nuevos de
 * `packages/*​/tests/`. La cobertura se exige en los módulos críticos: calendario,
 * agente y progreso; el resto es interfaz y se valida con axe y Lighthouse.
 */

const dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@secure-t/shared": `${dirname}packages/shared/src/index.ts`,
      "@secure-t/agent": `${dirname}packages/agent/src/index.ts`,
      "@secure-t/ui": `${dirname}packages/ui/src/index.ts`,
      // El alias del campus se resuelve igual que en Next: así el test de la API
      // importa la ruta real, no una copia con las rutas reescritas a mano.
      "@": `${dirname}apps/web/src`
    }
  },
  test: {
    include: ["tests/**/*.test.ts", "packages/*/tests/**/*.test.ts"],
    environment: "node",
    reporters: process.env.CI ? ["default", "junit"] : ["default"],
    outputFile: { junit: "coverage/junit.xml" },
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "coverage",
      include: [
        "packages/shared/src/calendar/**",
        "packages/shared/src/search.ts",
        "packages/shared/src/progress.ts",
        "packages/shared/src/markdown.ts",
        "packages/agent/src/**"
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 70
      }
    }
  }
});
