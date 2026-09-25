# Estudio profundo de proyectos con el mismo objetivo — Secure T University

Fecha: 2026-09-12 · Método: análisis comparado de plataformas de referencia + inventario interno + plan de compleción por motor Python (eduforge).

## 1. Proyectos de referencia y su estructura

| Plataforma | Objetivo | Componentes de su estructura | Qué copiamos |
|---|---|---|---|
| [Harvard CS50 / CS50x](https://pll.harvard.edu/course/cs50-introduction-computer-science) | Curso abierto universitario con certificado | Lectures + **9 problem sets** (trabajos obligatorios) + labs semanales + **proyecto final** → certificado si todo se aprueba | El patrón "nada se certifica sin psets + proyecto final"; la exigencia de evidencia por semana |
| [The Odin Project](https://www.theodinproject.com/) ([currículo en GitHub](https://github.com/theodinproject/curriculum)) | Formación profesional gratuita full-stack | Foundations → rutas de carrera; lecciones escritas + recursos curados de la web; **proyectos con portfolio**; checkpoints de conocimiento al final de sección | Lecciones escritas propias + recursos abiertos citados; checkpoint al final de cada bloque |
| [Coursera](https://www.coursera.support/s/article/learner-000002244) | Plataforma MOOC universitaria | Módulos semanales: vídeo + lectura + **quiz calificado** + **labs calificados** + **peer review** + capstone | El módulo semanal estándar (lectura + ejercicio + quiz) y el capstone de cierre |
| [SEED Labs](https://seedsecuritylabs.org/) (Syracuse) | Educación práctica en ciberseguridad | **40+ labs hands-on** (software, red, web, cripto, OS) mapeados a capítulos de manuales; guía paso a paso + tareas + tareas esperadas | El formato de guía de laboratorio: objetivo, setup en entorno local legal, pasos, evidencia a capturar, limpieza |
| [NICE Framework / CAE-C](https://niccs.cisa.gov/tools/nice-framework) ([requisitos CAE-CD](https://dl.dod.cyber.mil/wp-content/uploads/cae/pdf/unclass-cae-cd_designation_requirements.pdf)) | Estándar académico de programas de ciberseguridad | Los programas acreditados deben **mapear sus cursos a Knowledge Units** alineados con NICE | El mapa curricular curso → unidades de conocimiento → competencias del mercado |

## 2. Estructura completa objetivo (la síntesis)

Una universidad digital de ciber/IA completa y auto-hospedable tiene 4 capas:

```
CAPA 1 — INSTITUCIÓN
  landing trilingüe (quién somos, acceso virtual, plan 0 €)   ✅ hecho

CAPA 2 — CATÁLOGO Y CONTENIDO
  hub del campus (PWA offline)                                ✅ hecho
  curso: syllabus + semanas + lecciones + recursos            ✅ hecho (4 cursos × 4 semanas)
  quiz interactivo por curso                                  ✅ hecho (3 ítems — refuerzado a 6)
  glosario de términos del curso                              ❌ faltaba → generado
  chuleta / cheatsheet del curso                              ❌ faltaba → generado
  guía de laboratorio estilo SEED (local y legal)             ❌ faltaba → generado

CAPA 3 — EVALUACIÓN Y PROGRESO
  rúbrica de evaluación por curso (30/30/40 con niveles)      ❌ faltaba → generada
  examen final + brief del proyecto (entregables, defensa)    ❌ faltaba → generado
  seguimiento de progreso (token anónimo, local)              ❌ faltaba → generado
  credencial con sello hash verificable                       ❌ faltaba → generada (SHA-256; anclaje blockchain = fase 2)

CAPA 4 — GOBIERNO ACADÉMICO
  calendario académico (4 años × cursos)                      ❌ faltaba → generado
  mapa curricular a unidades NICE/CAE                         ❌ faltaba → generado
  búsqueda en todo el campus                                  ❌ faltaba → generado
  agente tutor vivo (cápsulas + issues)                       ✅ hecho
```

## 3. Análisis de carencias (gap analysis) antes de esta fase

| # | Componente | Referencia que lo exige | Estado | Decisión |
|---|---|---|---|---|
| 1 | Ejercicios/psets por semana | CS50 (9 psets obligatorios) | parcial (hay "ejercicio" en semanas) | se mantiene; se refuerza quiz a 6 ítems |
| 2 | Checkpoint de conocimiento por curso | Odin + Coursera | débil (quiz de 3 ítems) | +3 ítems por curso |
| 3 | Rúbrica de evaluación | toda academia seria | **faltaba** | `rubrica.md` por curso |
| 4 | Examen final + brief de proyecto | CS50 capstone | **faltaba** | `examen.md` por curso |
| 5 | Guía de laboratorio hands-on | SEED Labs | **faltaba** (labs "próximamente") | `laboratorio.md` por curso (local y legal) |
| 6 | Glosario | estándar universitario | **faltaba** | `glosario.md` por curso (~16 términos) |
| 7 | Chuleta de repaso | práctica extendida | **faltaba** | `chuleta.md` por curso |
| 8 | Progreso del estudiante | Coursera/Odin | **faltaba** | `progreso.html` (token anónimo + localStorage) |
| 9 | Credencial verificable | CS50 cert / STORY blockchain | **faltaba** | `credencial.html` (SHA-256 client-side, verificable sin servidor) |
| 10 | Búsqueda en el campus | toda plataforma | **faltaba** | `buscar.html` + `indice.json` |
| 11 | Calendario académico | universidad real | **faltaba** | `calendario.md` |
| 12 | Mapa curricular NICE/CAE | acreditación CAE-C | **faltaba** | `mapa-curricular.md` |

## 4. La forma más eficiente de completarlo

**Un solo motor Python genera todo** desde la única fuente de verdad (`eduforge/content.py`):
nuevo módulo `eduforge/academy.py` que produce las 12 piezas de las capas 2–4 en
`campus/` de cada repo educativo. Ventajas:

1. **Cero mantenimiento manual**: los 4 cursos (y los futuros que entren en
   `REPO_COURSES`) reciben rúbrica, examen, glosario, chuleta y lab automáticamente.
2. **Consistencia total**: mismos pesos 30/30/40, misma estructura, mismo idioma de
   regla (PT > ES > EN) que el resto del ecosistema.
3. **Sin backend**: progreso, credencial y búsqueda son estáticos + client-side,
   coherentes con el principio "sin datos personales" (el estudiante es un token).
4. **Regenerable y auditable**: `python -m eduforge.academy` reproduce byte a byte.

Honestidad de ingeniería: la credencial generada hoy es un **sello SHA-256 verificable
sin servidor**; el anclaje real en blockchain sigue siendo roadmap (fase 2), como ya
declara la propia página de credencial.

## 5. Auditoría de lo generado

- `py_compile` de todo el motor; pytest del repo (2/2).
- Todos los JSON generados parsean; HTML balanceado (parser propio, 0 errores).
- Comprobador de enlaces: todos los `href` de las páginas nuevas resuelven a archivos reales.
- gitleaks en cada commit (limpio); escaneo Mimosa al final de la fase.

## 6. Fuentes

- [Harvard CS50 — página oficial del curso](https://pll.harvard.edu/course/cs50-introduction-computer-science) · [CS50x 2026](https://cs50.harvard.edu/x/)
- [The Odin Project](https://www.theodinproject.com/) · [currículo (GitHub)](https://github.com/theodinproject/curriculum)
- [Coursera — tipos de evaluación (Help Center)](https://www.coursera.support/s/article/learner-000002244)
- [SEED Labs](https://seedsecuritylabs.org/) · [publicaciones y mapeo a manuales](https://seedsecuritylabs.org/publications.html)
- [NICE Framework (CISA/NICCS)](https://niccs.cisa.gov/tools/nice-framework) · [requisitos CAE-CD (PDF, DoD Cyber Exchange)](https://dl.dod.cyber.mil/wp-content/uploads/cae/pdf/unclass-cae-cd_designation_requirements.pdf) · [programa NCAE-C](https://www.caecommunity.org/about-the-ncae-c-program)
