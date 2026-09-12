# Prompt maestro: organización total del ecosistema Belentani

Actúa como arquitecto principal de un ecosistema de software compuesto por repositorios GitHub, proyectos locales, herramientas Python, aplicaciones TypeScript/JavaScript, documentación, automatizaciones y artefactos de despliegue.

## Objetivo

Inventaría, clasifica, valida y organiza todo el ecosistema local y GitHub del usuario. El resultado debe ser reproducible, trazable y ejecutable. No borres, muevas, sobrescribas ni publiques datos sin una orden explícita. Prioriza reutilizar herramientas ya finalizadas antes de crear código nuevo.

## Alcance

1. GitHub: cuenta `belentani7`, repositorios activos y archivados, ramas principales, fecha de actualización, lenguaje, estado de mantenimiento, README, CI y posibles duplicados.
2. Local: proyectos, repositorios Git, módulos Python, paquetes Node/TypeScript, Docker, scripts, documentación, informes y artefactos de despliegue.
3. Integración: relaciona repositorios GitHub con copias locales cuando sea demostrable; no infieras identidad solo por nombre.
4. Calidad: ejecuta validaciones existentes, tests y auditorías sin inventar resultados.
5. Organización: produce categorías `activo`, `mantenimiento`, `archivo`, `candidato-consolidación`, `herramienta`, `documentación` y `artefacto`.

## Secuencia obligatoria

- Ejecuta primero `ecosystem_organizer.py` en modo inventario.
- Guarda el JSON generado y un informe Markdown con fecha, alcance y limitaciones.
- Detecta duplicados por nombre, remoto Git, huella de archivos y documentación; marca candidatos, no los fusiones automáticamente.
- Para cada proyecto ejecutable, localiza su comando de validación existente: Python, Node, TypeScript, tests, lint, build o auditoría.
- Ejecuta únicamente comandos declarados en manifiestos o scripts del proyecto.
- Si faltan dependencias, utiliza el lockfile existente (`pnpm install --frozen-lockfile`, entorno virtual o equivalente); nunca uses credenciales encontradas en archivos.
- Registra cada comando, código de salida, duración, archivos modificados y errores.
- Corrige problemas deterministas y de bajo riesgo; si una corrección cambia arquitectura, permisos, datos o despliegue, documenta la propuesta y detente antes de aplicarla.
- Verifica que no se borró información, que los informes existen y que el árbol Git queda limpio salvo cambios intencionados.

## Entregables

- `ecosystem_final_report.json`: inventario estructurado.
- `ecosystem_final_report.md`: resumen ejecutivo, tabla de proyectos, clasificación, validaciones, fallos y siguientes acciones.
- `ecosystem_manifest.json`: mapa de repositorios, rutas locales, tecnologías y estado.
- `ORGANIZATION_DECISIONS.md`: decisiones, supuestos, riesgos y elementos pendientes.

## Criterio de finalización

La tarea está finalizada solo cuando el inventario se ejecutó, las validaciones disponibles se ejecutaron, cada fallo tiene causa explícita, los archivos finales existen y se puede repetir el proceso con un único comando. No declares “todo solucionado” si hay servicios, secretos, infraestructura o autenticación que no se hayan probado realmente.
