# ADR-0004 · Licencia MIT para lo nuevo, AGPL-3.0-only para edu-engine

- **Estado:** aceptado (2026-10-11)
- **Contexto:** el `LICENSE` de la raíz declara MIT (heredero de SecureTea), mientras que la documentación interna
  de `docs/UNIFICACION-ELITE.md` afirmaba AGPLv3 y `lib/edu-engine/` está publicado como AGPL-3.0-only. Quien
  encargó la elevación delegó la decisión.
- **Decisión:** el código nuevo del repositorio se publica como **MIT** (coherente con el `LICENSE` de la raíz y con
  el material educativo abierto); `lib/edu-engine/` conserva **AGPL-3.0-only** con su propio aviso, sin mezclar
  ficheros.
- **Por qué:** la primera promesa del campus es que cualquiera pueda copiarlo, traducirlo y abrirlo desde el disco;
  MIT lo permite sin fricción. Respetar la AGPL del motor evita relicenciar trabajo ajeno.
- **Alternativas descartadas:** AGPL para todo (contradice el LICENSE existente y complica la reutilización
  educativa); unificar en MIT dentro de `lib/edu-engine` (relicenciamiento indebido).
- **Consecuencias:** la licencia queda documentada en README, `DEPENDENCIAS.md` y este ADR; si un día se reutiliza
  código de edu-engine en la web, esa parte será AGPL y se marcará fichero a fichero.
