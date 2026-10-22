# PROJECT_MASTER_PROMPT — SECURE T — instituto abierto de ciberseguridad, IA y gobernanza

**Archivo único de contexto, visión extrema, arquitectura deseada y orden de construcción.**  
**Repositorio:** `belentani7/secure-t` · **Fecha:** 2026-10-22  
**Naturaleza:** marco de producto editable; **no sustituye el código ni certifica funcionalidades**.

## A. Qué es hoy: identidad y evidencia

Campus abierto documentado con cuatro itinerarios de 20 semanas: ofensiva responsable, defensiva SOC, IA aplicada segura y gobernanza/compliance. La fuente publicada es el `campus/` estático ensamblado por `scripts/build_site.py`; `client/` SPA y módulos de dominio son capas separadas aún no publicadas en GitHub Pages. Hay `pytest`, `vitest`, `tsc`, scripts de build, documentación de roadmap ambicioso; el README afirma que backend con base de datos y certificaciones verificables **no están desplegados**.

## B. A qué debe llegar: visión máxima del producto

Desarrollar el **instituto de ciberseguridad aplicado más completo posible** sin sustituir aprendizaje por marketing: teoría en profundidad, laboratorios seguros y aislados, simulaciones SOC, análisis de incidentes, IA segura, gobierno de agentes, evaluación reproducible, itinerarios profesionales y acreditación verificable solo cuando sea técnicamente real.

## C. Experiencia que debe recibir la persona usuaria

- Portada premium de instituto académico: orientación por nivel y objetivo profesional, currículo de 20 semanas navegable, prerequisitos, lecciones, casos de estudio y evaluaciones con criterios transparentes.
- Laboratorios **sandbox** con datasets ficticios o autorizados, objetivos explícitos, alcance defensivo y mecanismos de reinicio sin riesgo para sistemas externos.
- Progreso local privado y exportable; dashboard claro de competencias, evidencias de aprendizaje y rutas sugeridas.
- Búsqueda de términos, glosarios multilingües reales y accesibilidad; comunicar cuando traducciones PT/EN/CA estén pendientes.
- Futuro cyber range con colas/quotas/aislamiento y limpieza automática antes de ofrecer acceso público.

## D. Estructuras futuras: ingeniería y sostenibilidad

- Mantener el campus publicable con `scripts/build_site.py --destination _site` y su política de no exponer el árbol completo; no publicar `client/`, secretos, `audit/` o scripts internos por error.
- Estrategia gradual: motor docente `lib/edu-engine/` → evaluaciones locales → servicios aislados y autenticados solo si una función lo exige.
- Política de aislamiento de laboratorios, perfiles de ejecución mínimos, recursos efímeros, telemetría sin datos privados, límites de coste, consentimiento y logging seguro.
- AI gateway solo cuando hay contrato de proveedor y protección anti prompt-injection, filtrado de datos y auditoría; cero claves cliente.
- Gobernanza y credenciales deben distinguir aprendizaje de certificación profesional reconocida; verificabilidad no equivale a acreditación universitaria.

## E. Roadmap de construcción por entregables comprobables

1. Ejecutar `python -m pytest -q tests/`, `pnpm test`, `pnpm typecheck`, `pnpm build` y builder del sitio.
2. Revisar las 4 rutas y fortalecer ejercicios y rúbricas, coherencia de los 20 módulos por curso y enlaces/recursos.
3. Convertir prácticas en laboratorios reproducibles **defensivos y autorizados**, con evaluación local primero.
4. Mejorar UI de campus, accesibilidad, pedagogía y experiencia móvil; comprobar cuatro quizzes y progreso offline.
5. Solo después evaluar backend, roles, identidad, cyber range y credenciales comprobables, con costes y riesgos documentados.

## F. Fronteras que no deben cruzarse

Prohibidas acciones reales contra sistemas no autorizados, acceso a objetivos de terceros, ejecución libre de código de alumnos en infraestructura compartida sin sandbox, certificados falsos, publicación accidental del repo completo o necesidad artificial de cuentas.

## Modo de trabajo para cualquier IA que abra este repositorio

**Lee este archivo antes de escribir código.** Es la brújula de producto, no una declaración de funcionalidades terminadas. Inspecciona código real, historial relevante, documentación y pruebas. Distingue: EXISTE / PARCIAL / PROPUESTA / BLOQUEADA. Prioriza entregar un flujo completo frente a multiplicar páginas decorativas. Mantén historia, identidad y licencia del proyecto; no crees repos nuevos ni fusiones con otros productos. Respeta los datos de usuarios, secretos y límites de permisos. No inventes métricas, testimonios, certificaciones, despliegues o funciones de IA.

**Ciclo de ejecución:** recuperar contexto y fuente de verdad → identificar oportunidad de mayor impacto → definir criterios observables de aceptación → implementar en la arquitectura existente → validar pruebas, UX, accesibilidad, coste y seguridad → describir exactamente qué funciona y qué no → continuar con el siguiente incremento. Nunca publicar, abrir un repositorio privado ni modificar datos personales por inferencia.

**Prompt activador:** «Eres el equipo completo de producto de este repositorio: estrategia, dirección artística, pedagogía cuando proceda, arquitectura, backend, frontend, contenido, QA, privacidad y operaciones. Tu trabajo no es escribir otra auditoría: construye el mejor siguiente incremento del producto descrito aquí, utilizando primero el código y los activos existentes. No diluyas su identidad. Deja una mejora de extremo a extremo, comprobable, accesible y mantenible; diferencia capacidades reales de objetivos aspiracionales».

**Definición estricta de finalizado:** el flujo principal funciona de principio a fin en un entorno reproducible; no hay rutas rotas ni textos de relleno, se gestionan fallos y datos de forma responsable, hay cobertura de regresión, la experiencia es usable con teclado y móvil cuando aplique y no se anuncia como publicado hasta comprobar la URL o artefacto final.
