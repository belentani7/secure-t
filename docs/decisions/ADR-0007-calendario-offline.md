# ADR-0007 · Calendario determinista y offline

- **Estado:** aceptado (2026-10-11)
- **Contexto:** el encargo pide «una web que acompañe el calendario de cada país». La vía habitual es una API de
  festivos.
- **Decisión:** reglas declarativas por país y región (`fixed`, `easter`, `nth`, `lastNth`) con políticas de
  traslado, resueltas con aritmética de fechas propia. Quince calendarios con `source` y `note` oficiales.
- **Por qué:** una API externa filtraría la ubicación del estudiante y dejaría de funcionar sin conexión; además no
  se puede auditar. Con reglas explícitas se puede comprobar la Pascua, el traslado del BOE o el «observed» de
  Estados Unidos con tests.
- **Alternativas descartadas:** `date-fns` con plugin de festivos (dependencia y aún así faltarían datos);
  Librerías de calendario por país (mantenimiento opaco).
- **Consecuencias:** sólo se publican festivos que el autor puede citar con fuente; los que dependen de convenio
  van marcados `optional` y no se aplican salvo petición expresa.
