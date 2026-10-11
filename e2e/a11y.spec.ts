import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { LOCALE_LABELS } from "../packages/shared/src/i18n";

/**
 * Auditoría de accesibilidad con axe sobre el export estático.
 *
 * Se revisan las rutas que más usa el estudiante, en los cuatro idiomas, con
 * las reglas de **WCAG 2.2 nivel AA**. Cualquier violación rompe la
 * integración: la accesibilidad no es una recomendación de este campus.
 */

const RUTAS = [
  { path: "/app/", name: "portada PT" },
  { path: "/app/es", name: "portada ES" },
  { path: "/app/en/programas", name: "campus EN" },
  { path: "/app/ca/programas", name: "campus CA" },
  { path: "/app/itinerarios", name: "itinerarios PT" },
  { path: "/app/biblioteca", name: "biblioteca PT" },
  { path: "/app/es/biblioteca", name: "biblioteca ES" },
  { path: "/app/plano", name: "plan de 5 años PT" },
  { path: "/app/laboratorio", name: "laboratorio IA PT" },
  { path: "/app/ca/laboratorio", name: "laboratorio IA CA" },
  { path: "/app/en/itinerarios", name: "itinerarios EN" },
  { path: "/app/pt/programas/ciber-defensiva", name: "programa" },
  { path: "/app/pt/programas/ciber-defensiva/semana/1", name: "lección" },
  { path: "/app/pt/agente", name: "agente" },
  { path: "/app/pt/calendario", name: "calendario" },
  { path: "/app/pt/progreso", name: "progreso" },
  { path: "/app/pt/credencial", name: "credencial" },
  { path: "/app/pt/amenazas", name: "amenazas" },
  { path: "/app/es/estandares", name: "estándares" },
  { path: "/app/ca/privacidad", name: "privacidad" },
  { path: "/app/pt/repaso", name: "repaso" }
];

for (const ruta of RUTAS) {
  test(`${ruta.name} cumple WCAG 2.2 AA`, async ({ page }, testInfo) => {
    // `networkidle` es frágil con un service worker activo: se espera a la
    // carga y a que el contenido principal esté pintado.
    await page.goto(ruta.path, { waitUntil: "load" });
    await page.locator("main").first().waitFor({ state: "visible" });
    const resultados = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();

    if (resultados.violations.length) {
      await testInfo.attach("violaciones", {
        body: JSON.stringify(resultados.violations, null, 2),
        contentType: "application/json"
      });
      // Además del informe adjunto, se emite una anotación del flujo de trabajo:
      // así el detalle exacto (regla y selector) se ve en el propio check, sin
      // depender de descargar el artefacto.
      const resumen = resultados.violations
        .map((v) => `${v.id} [${v.impact}]: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)
        .join(" ;; ");
      console.error(`::error title=axe ${ruta.name}::${resumen.replace(/%/g, "%25").replace(/\r?\n/g, " ")}`);
    }
    expect(resultados.violations, JSON.stringify(resultados.violations.map((v) => v.id), null, 2)).toEqual([]);
  });
}

test("el foco es visible y la navegación por teclado llega al contenido", async ({ page }) => {
  await page.goto("/app/es/agente");
  await page.keyboard.press("Tab");
  const primero = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? "");
  expect(primero.length).toBeGreaterThan(0);
  const salto = await page.locator("a.skip-link").first();
  await expect(salto).toBeAttached();
});

test("el idioma del documento es el correcto en cada ruta", async ({ page }) => {
  // La etiqueta esperada sale de la fuente única (LOCALE_LABELS): el portugués
  // de esta casa es el de Brasil y el <html lang> lo dice, no un «pt» a secas.
  for (const [path, locale] of [
    ["/app/", "pt"],
    ["/app/es", "es"],
    ["/app/en", "en"],
    ["/app/ca", "ca"]
  ] as const) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", LOCALE_LABELS[locale].htmlLang);
  }
});
