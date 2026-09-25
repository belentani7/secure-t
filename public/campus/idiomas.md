# Idiomas del campus — estado real (sin traducciones falsas)

Política del ecosistema: **PT → ES → EN** (+ català adicional). Esta matriz
declara qué está traducido de verdad y qué no. Nada se marca como traducido
sin estarlo.

| Capa | PT | ES | EN | CA |
|---|---|---|---|---|
| Landing (portada pública) | VERIFIED | VERIFIED | VERIFIED | — |
| Hub del campus (UI) | PLANNED | VERIFIED | PLANNED | PLANNED |
| Páginas de curso (UI + estructura) | PLANNED | VERIFIED | PLANNED | PLANNED |
| Contenido docente (lecciones, semanas) | PLANNED | VERIFIED (fuente) | PLANNED | PLANNED |
| Quizzes | PLANNED | VERIFIED (fuente) | PLANNED | — |
| Glosarios / chuletas / rúbricas | PLANNED | VERIFIED (fuente) | PLANNED | — |
| Laboratorios | PLANNED | VERIFIED (fuente) | PLANNED | — |
| Credencial / progreso / búsqueda (UI) | PLANNED | VERIFIED | PLANNED | — |
| Voces de bienvenida | VERIFIED | VERIFIED | VERIFIED | VERIFIED |

## Arquitectura para completarlo

El contenido fuente vive en `content.CURSOS` (idioma ES, campo `idioma`).
Para servir contenido multiidioma sin segundas fuentes de verdad, el motor
soporta la convención de rutas `cursos/<slug>/<lang>/`: al añadir la
traducción al dato fuente, el generador emite la variante bajo su idioma y
esta matriz pasa la celda a VERIFIED. Hasta entonces, cada celda honesta
dice PLANNED.
