# Idiomas del campus — estado real (sin traducciones falsas)

Política del ecosistema: **PT (Brasil) → ES → EN** (+ català). Esta matriz
declara qué está traducido de verdad y qué no. Nada se marca como traducido
sin estarlo.

| Capa | PT | ES | EN | CA |
|---|---|---|---|---|
| Landing (portada pública) | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| Hub del campus (UI) | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| Páginas de curso (UI + estructura) | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| Itinerarios (UI: orden, prerrequisitos, competencias) | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| Agente, voz, calendario, progreso, credencial (UI) | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| Contenido docente (lecciones, semanas) | 20/80 semanas | VERIFIED (fuente) | 0/80 | 0/80 |
| Quizzes | PLANNED | VERIFIED (fuente) | PLANNED | — |
| Glosarios / chuletas / rúbricas | PLANNED | VERIFIED (fuente) | PLANNED | — |
| Laboratorios | PLANNED | VERIFIED (fuente) | PLANNED | — |
| Voces de bienvenida | VERIFIED | VERIFIED | VERIFIED | VERIFIED |

Las capas de interfaz se comprueban con `packages/shared/tests/i18n.test.ts` (paridad de las 285 claves) y con
`tests/portugues-brasil.test.ts` (el portugués es el de Brasil). La cobertura del material docente la calcula
`pnpm locales` leyendo `campus/cursos/*/i18n/<idioma>/` y la vigila `tests/content-i18n.test.ts`.

## Arquitectura para completarlo

El contenido fuente vive en `content.CURSOS` (idioma ES, campo `idioma`).
Para servir contenido multiidioma sin segundas fuentes de verdad, el motor
soporta la convención de rutas `cursos/<slug>/<lang>/`: al añadir la
traducción al dato fuente, el generador emite la variante bajo su idioma y
esta matriz pasa la celda a VERIFIED. Hasta entonces, cada celda honesta
dice PLANNED.

## Qué hay traducido hoy (20/80)

| Programa | Semanas en pt-BR |
|---|---|
| `ciber-ofensiva` | 1-8 |
| `ciber-defensiva` | 5-8 |
| `ia-aplicada-segura` | 5-8 |
| `gobernanza-compliance` | 5-8 |

Cada fichero se traduce a mano, se revisa con los marcadores léxicos del portugués de Brasil
(`tests/content-i18n.test.ts`) y sólo entonces aparece la celda como traducida. Las semanas que faltan
siguen sirviendo el español marcado con `lang="es"` y su distintivo «em espanhol».
