

<!-- repo-forge:docs-arquitectura:inicio -->
# Arquitectura

## Tipo

herramienta de línea de comandos en Python

## Piezas observadas

| Pieza | Evidencia |
|---|---|
| Lenguajes | Markdown 45.3%, HTML 31.4%, JavaScript 10.6%, JSON 9.0%, CSS 2.4%, TypeScript 0.7% |
| Puntos de entrada | belentani7-secure-t-7d4d5d6/aegis_cli/__main__.py |
| Páginas HTML | 28 |
| Tests | 0 archivos |
| Dependencias de paquete | 0 |

## Capas propuestas

```text
contenido/      datos y textos versionados
plataforma/     ficha, diseño y contrato del producto
brand/          tokens, marca y activos
scripts/        verificación y operación
tests/          pruebas ejecutables
```

La propuesta no mueve archivos existentes: describe dónde debe vivir lo nuevo para que
el repositorio siga siendo legible.

## Deuda declarada

- Sin tests: cualquier afirmación de funcionamiento es fe.
- 6 lenguajes: coste de contexto alto.

<!-- repo-forge:arquitectura -->
<!-- repo-forge:docs-arquitectura:fin -->
