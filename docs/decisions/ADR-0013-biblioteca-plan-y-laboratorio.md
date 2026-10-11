# ADR-0013 — Currículo de cinco años, biblioteca abierta y laboratorio de IA

- **Estado**: aceptada
- **Fecha**: 2026-10-11
- **Contexto de la decisión**: el propietario cerró el alcance del producto con tres frases: «es de cinco años de
  ciberseguridad», «saca el máximo de información de los acervos abiertos y de YouTube» y «el módulo de IA tiene que
  ser una herramienta completa, no un chat decorativo».
- **Decisiones relacionadas**: ADR-0003 (identidad AURUM), ADR-0006 (transportes del agente), ADR-0008 (contenido
  fuente única), ADR-0012 (estándares interoperables).

## Decisión

1. **Malla de cinco años explícita y navegable.** Se publica `packages/shared/src/curriculum-5y.ts` con **200 semanas
   repartidas en 10 franjas de 20** (dos semestres por año). Cuatro franjas son los programas ya escritos
   (`CAMPUS_WEEKS_PUBLISHED = 80`); las seis restantes están declaradas con su modo de estudio (`programa`,
   `laboratorio`, `proyecto`), su nivel, sus competencias y los recursos abiertos que las sostienen. La página
   `/plano` (y `/es|en|ca/plano`) enseña la malla entera **diciendo cuáles están escritas y cuáles no**.
2. **Biblioteca abierta con regla de procedencia.** Se publica `packages/shared/src/library.ts` con 59 recursos
   abiertos (canales, cursos, plataformas de práctica, documentación oficial, laboratorios y CTF) que se enlazan a su
   origen legítimo. Se prohíben por dato y por test los espejos y agregadores que redistribuyen cursos de pago sin
   autorización (`DOMINIOS_PROHIBIDOS`).
3. **Laboratorio de IA como instrumento, no como escaparate.** Se publica `packages/shared/src/lab.ts` con cinco
   instrumentos deterministas que se ejecutan en el dispositivo —auditoría de prompt frente a OWASP LLM01, redacción
   de datos personales, auditoría de fundamento (¿la respuesta está en las fuentes?), presupuesto de contexto y
   evaluación de salvaguardas— y `/laboratorio` como mesa de trabajo con exportación de expediente en Markdown.
4. **El agente usa herramientas.** `packages/shared/src/tutor-tools.ts` define cinco herramientas **de sólo lectura**
   (`listar_programas`, `resumen_semana`, `recomendar_biblioteca`, `ruta_itinerario`, `plan_estudio`) que
   `packages/agent` ejecuta en cada pregunta y publica en el campo `tools` del contrato de respuesta. La consola del
   agente las muestra bajo el título «Qué hizo el tutor».

## Motivos

- **Un plan que no se puede comprobar no es un plan.** Sin la malla declarada, «cinco años» era una frase de
  portada. Con la malla, cada semana del quinquenio tiene una franja responsable (`phaseAt`), y la página puede
  decir a la vez «esto ya está escrito» y «esto falta».
- **La regla de procedencia es la propia ética del campus, aplicada a sí misma.** La semana 1 de ofensiva enseña a
  trabajar con permiso por escrito; enlazar espejos de cursos de pago sería contradecir la lección.
- **Un instrumento que promete de más es peor que ninguno.** Cada instrumento y cada regla declaran su límite
  (`lab.limit.*`), y el test exige que ese límite esté redactado en los cuatro idiomas.
- **Herramientas de sólo lectura: el mínimo privilegio también en el tutor** (OWASP LLM06 *Excessive Agency*). El
  agente puede leer y ordenar material publicado; no puede escribir, publicar, gastar ni tocar nada.
- **Determinismo y cero red**: los tres módulos son funciones puras; un test comprueba que no hay `fetch`, ni azar,
  ni reloj en el laboratorio.

## Consecuencias

- **A favor**: la malla es la fuente única del plan y del tutor (`plan_estudio`), así que la página, el agente y los
  tests no pueden divergir; la biblioteca se amplía editando datos, no código; el laboratorio funciona sin conexión y
  sin servidor, coherente con la promesa de cero datos personales.
- **Coste asumido**: el plan declara 120 semanas sin material publicado. Es un dato incómodo y aparece de forma
  destacada en la página; se prefiere a un índice que finja estar terminado.
- **Riesgo**: los recursos de la biblioteca son enlaces de terceros; su contenido puede cambiar o caer. No se
  archivan copias (sería redistribuir material ajeno): se enlaza al autor y se revisan las URL con el test de
  forma (`https`, sin duplicados, sin dominios prohibidos).
- **Lo que este ADR no decide**: el calendario año a año de las franjas pendientes (depende de cuándo se escriba el
  material) y la grabación en estudio de las locuciones asociadas a las nuevas asignaturas.
