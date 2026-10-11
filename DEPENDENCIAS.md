# DEPENDENCIAS.md — cada dependencia, justificada

Regla del proyecto, heredada del prompt universal: **no entra ninguna dependencia sin justificar aquí**. Cuando una
biblioteca se puede sustituir por código propio pequeño, se hace (y se documenta en un ADR). Cuando entra, se dice
para qué, qué alternativa se descartó y con qué licencia.

Última revisión: **2026-10-11** (contra el registro real de npm).

---

## 1. Dependencias nuevas del campus AURUM

| Paquete | Versión | Para qué | Alternativas descartadas | Licencia |
|---|---|---|---|---|
| `next` | 16.4.0 | render en servidor, rutas por idioma, metadatos, export estático | Vite+SSG propio (sin SSR real), Astro (menos «framework completo»), Remix (más piezas) | MIT |
| `react` / `react-dom` | 19.3.0 | interfaz del campus y de los componentes | Svelte/Vue (el repositorio ya era React: se mantiene) | MIT |
| `tailwindcss` + `@tailwindcss/postcss` | 4.3.3 | diseño AURUM con tokens, sin CSS muerto | CSS Modules (más código a mano), styled-components (runtime) | MIT |
| `zod` | 4.6.5 | validación de los esquemas de contenido y de las peticiones del agente | validación a mano (más frágil), yup (más pesado) | MIT |
| `tsx` | 4.23.15 | ejecutar los `tools/*.ts` sin paso de build | ts-node (más lento, ESM incómodo) | MIT |
| `vitest` | 5.0.2 | tests de los paquetes y contratos | jest (más configuración para ESM/TS) | MIT |
| `typescript` | 7.0.2 | modo estricto en todo el monorepo | — (ya estaba en el repositorio) | Apache-2.0 |
| `@types/node`, `@types/react`, `@types/react-dom` | 26.6.3 / 19.3.0 | tipos | — | MIT |

Todo lo demás **ya existía** en el repositorio (React 19, Vite 8, Radix, lucide-react, wouter, express, vitest,
tailwind) y no se ha tocado ni eliminado.

## 2. Dependencias que se **sustituyen** por código propio

| Antes | Ahora | Motivo | Dónde |
|---|---|---|---|
| `fuse.js` (en `campus/vendor/`) | motor **BM25 propio** (`packages/shared/src/search.ts`) | se elimina una dependencia de terceros y se gana control del ranking, de los acentos y del comportamiento offline; el paquete vendorizado **se conserva** porque el campus clásico lo usa y su test lo exige | ADR-0005 |
| API de Google Maps (`@types/google.maps`) | — | estaba en las dependencias y no se usaba en el código publicado; se deja el tipo por compatibilidad con `client/`, sin red | auditoría FASE 0 |
| API externa de festivos | cálculo determinista propio | privacidad (nada sale del dispositivo) y funcionamiento sin conexión | ADR-0007 |

## 3. Dependencias del repositorio original que se conservan

Se mantienen íntegras para no romper nada de lo prometido: las 26 piezas de `@radix-ui/*`, `class-variance-authority`,
`clsx`, `cmdk`, `embla-carousel-react`, `input-otp`, `lucide-react`, `next-themes`, `react-day-picker`,
`react-hook-form`, `react-resizable-panels`, `recharts`, `sonner`, `tailwind-merge`, `tw-animate-css`, `vaul`,
`wouter`, `express`, `vite`, `@vitejs/plugin-react`, `@types/express`.

`pnpm audit` detectó **1 vulnerabilidad alta**: `source-map-js < 1.2.2` (GHSA-68fv-2mgg-jv7q), transitiva de
`@tailwindcss/vite`, con PR de Dependabot abierta (#2). Es de herramienta de desarrollo y no llega a producción;
se resuelve al actualizar Tailwind, no forzando el árbol.

## 4. Herramientas de desarrollo y CI (no llegan al sitio publicado)

| Herramienta | Uso | Licencia |
|---|---|---|
| `pytest` | contrato del campus clásico (117 tests) | MIT |
| `gitleaks` | escaneo de secretos en el historial | MIT |
| `@lhci/cli` (Lighthouse CI) | presupuesto ≥ 95 en las cuatro categorías | Apache-2.0 |
| `@axe-core/playwright` | WCAG 2.2 AA en las rutas principales | MPL-2.0 |
| `@vitest/coverage-v8` | cobertura ≥ 80 % en los módulos críticos | MIT |
| `actionlint` | valida los workflows | MIT |

## 5. Lo que **no** entra, y por qué

- **Base de datos**: el campus es estático; el progreso vive en `localStorage`. Una base de datos añadiría cuentas,
  cookies y responsabilidad legal sin mejorar nada de lo prometido.
- **Analítica**: prohibida por la promesa P6 (sin seguimiento).
- **Fuentes de Google / iconos remotos**: apuntes tipográficos del sistema y SVG en línea, para no filtrar IPs y
  para que la página funcione sin conexión.
- **Cadena de bloques / registro público de credenciales**: `PLANNED`. Se documenta como planificado, no se instala
  nada que simule tenerlo.
- **Framework de IA de terceros (LangChain y similares)**: el agente es pequeño, auditable y propio; una capa
  externa dificultaría garantizar la deny-list y la ausencia de telemetría.

## 6. Cómo se actualiza

1. `pnpm outdated` y `pnpm audit` en cada iteración; los resultados se anotan aquí.
2. Dependabot agrupa los parches semanales; una vulnerabilidad crítica tiene prioridad sobre cualquier tarea.
3. Toda dependencia nueva pasa por esta tabla **antes** de entrar en `package.json`.
