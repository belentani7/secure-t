# @secure-t/ui · sistema de diseño AURUM

Tokens, componentes y catálogo de historias de la identidad **negro y dorado** (azul sólo para información
secundaria). El paquete es TypeScript puro: la app lo consume tal cual gracias a `transpilePackages`.

- `src/tokens.css` — variables CSS (superficies, dorado, azul, estados, tipografía, foco, movimiento).
- `src/tokens.ts` — los mismos colores en TypeScript para **verificar el contraste** según WCAG 2.2.
- `src/components/*` — `Button`, `Card`, `Badge`, `Progress`, `Callout` con estados de foco visibles.
- `tests/tokens.test.ts` — exige ≥ 4.5:1 en cada par real de la interfaz y AAA (7:1) en el modo de alto contraste.

## Historias

```bash
pnpm --filter @secure-t/ui storybook         # http://localhost:6006
pnpm --filter @secure-t/ui build-storybook   # catálogo estático
```

Las historias (`*.stories.tsx`) documentan cada estado: sólido, fantasma, azul, deshabilitado y compacto; la
tarjeta de programa muestra el uso real del componente.

> Honestidad: las historias y la configuración de Storybook 9 están escritas y versionadas, pero el servidor de
> Storybook **no se ha levantado en el entorno de construcción** (el paquete de Storybook es pesado y el entorno no
> lo conserva). Los componentes sí están en uso en `apps/web` y cubiertos por los tests de tokens.
