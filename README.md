# SECURE T — Campus abierto de seguridad digital

**Proyecto recuperado del código de trabajo local el 21 de noviembre de 2026.** Esta es una plataforma educativa independiente, no una simple colección de diseños ni un repositorio con solamente `.gitignore`.

## Producto implementado

- Aplicación React 19 con Vite, CSS Tailwind, navegación en `/`, `/campus`, `/progress`, `/mentor`, `/services`, `/notifications`, `/record`, `/credentials`, `/research`, `/faculty`, `/admin` y `/settings`. Estas rutas son pantallas de demostración del producto; las funciones que requieran un servicio externo o autenticación no están garantizadas.
- Material formativo conservado en `campus/`, con planes, ejercicios, itinerarios, laboratorios **simulados** y recursos accesibles por navegador, sin conectar con sistemas de terceros.
- Las pantallas principales se cargan con React real desde `client/src/main.tsx` y un `client/index.html` válido. La portada decorativa previa se conserva como copia de seguridad fuera del repositorio.
- La traducción ya se inicializa desde `I18nProvider` antes de ejecutar los hooks de idioma.

## Ejecutar

```bash
npm ci --no-audit --no-fund --legacy-peer-deps
npm run typecheck
node --test tests/react-entry-integrity.test.mjs
npm run build
node scripts/verify-bundle.mjs
npm run dev
# O bien: npm run quality:check para ejecutar todas las pruebas y el build
```

`npm run build` produce `dist/public` (sitio estático). El verificador comprueba que existe un **bundle React real**, que el HTML apunta a recursos JavaScript/CSS existentes y que el campus publicado contiene sus rutas y estilos. Las rutas del router requieren fallback a `index.html` en el proveedor de hosting.

## Limitaciones explícitas

No se emiten diplomas oficiales. Las acciones con IA, credenciales, autenticación o notificaciones requieren integraciones y no deben confundirse con prestaciones ya desplegadas. Las pruebas de compilación y tipado no sustituyen la navegación visual ni las pruebas reales de acceso. La publicación en Vercel no queda verificada solo por incluir `vercel.json`.

## Procedencia y seguridad

Fuente: `webs-reparadas/secure-t` del workspace autorizado. Se conservaron los originales. Se excluyeron los historiales de auditoría, versiones experimentales no elegidas y archivos privados de credenciales. Consulta `RECOVERY_SOURCE_20261121.json` para el recuento técnico de archivos recuperados.

Este repositorio unifica el código ejecutable, el campus y los materiales educativos sin declarar cientos de experimentos como productos independientes.


### Correcciones de reproducibilidad (21-11-2026)

El desarrollo y las pruebas regeneran el currículo antes de cargar React; de esta forma una instalación limpia no depende de un archivo de campus generado en una sesión anterior. Se incluye `pnpm-workspace.yaml` con la única excepción de compilación permitida (`esbuild`) y el override de `body-parser` ya presente en el lockfile. La portada distingue explícitamente los indicadores ficticios de ejemplo del progreso real de un alumno. Estos cambios no acreditan cuentas, titulaciones ni funciones remotas que aún no estén implementadas.
