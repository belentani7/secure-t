# CANON — secure-t

> Estado: VERIFIED / DOCUMENTED ONLY. Observado online el 2026-10-15.

## Misión
Plataforma formativa centrada en seguridad, cursos y recorridos prácticos.

## Arquitectura observada
TypeScript/Vite con campus, public, tests, drizzle, Docker, docker-compose.yml, workflows y Vitest.

## Estado
- VERIFIED: catálogo y estructura full-stack.
- RISK: workflow principal con problema relacionado con secretos o historial.
- PENDING: confirmar que compose no contiene credenciales hardcoded y que los tests ejecutan.
- NON-GOAL: declarar cumplimiento solo por tener configuración de Gitleaks.

## Gates
Typecheck, tests, build, Gitleaks/CodeQL reales, revisión de Docker, dependencias y fixtures sintéticos.

## Decisión
Producto CORE educativo especializado. Primero cerrar seguridad y CI; después ampliar contenido.
