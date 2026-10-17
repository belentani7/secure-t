# Audit-Ready Kit

Toolkit modular para auditorías de seguridad y preparación de cumplimiento en agencias pequeñas. Este repositorio contiene la estructura inicial, no constituye asesoramiento legal ni certificación de cumplimiento.

## Alcance inicial

- CLI de auditoría local.
- Inventario de repositorio.
- Detección de configuraciones inseguras y secretos accidentales.
- Hallazgos con severidad y referencia CWE cuando exista.
- Plantillas editables de políticas.
- Salida JSON y Markdown.
- Generación PDF como adaptador futuro.

## Principios

- No sube código auditado por defecto.
- No persiste secretos.
- No modifica el repositorio auditado sin una orden explícita.
- Todo arreglo se propone como parche revisable.
- Los resultados son técnicos y no sustituyen revisión profesional.

## Desarrollo

```bash
python3 -m aegis_cli scan . --format json
python3 -m aegis_cli scan . --format markdown
```

La primera versión usa solo la biblioteca estándar de Python.
