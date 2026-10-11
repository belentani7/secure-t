import { defineConfig, devices } from "@playwright/test";

/**
 * Configuración de las pruebas de extremo a extremo.
 *
 * El sitio se sirve desde `apps/web/out` (el mismo export estático que se
 * publica en GitHub Pages bajo `/app`), con un servidor propio para que las
 * rutas `/app/...` existan exactamente como en producción.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { outputFolder: "e2e/salida/informe", open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"] } },
    { name: "movil", use: { ...devices["Pixel 7"] } }
  ],
  webServer: {
    command: "node tools/serve-static.mjs --port 4173",
    url: "http://127.0.0.1:4173/app/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
});
