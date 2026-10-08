# edu-engine

Motor educativo compartido (framework-agnostic, sin dependencias runtime) del
ecosistema Belentani. Genera quizzes a partir de lecciones, calcula rachas y
progreso, normaliza planes de lección y degrada sin romper cuando no hay voz
disponible (Node, SSR).

## Estado

- `src/index.ts`: implementación completa, sin dependencias runtime (345 LOC).
- Tests: `node --test tests/quiz.test.mjs` — 8/8 en verde.
- CI: job `edu-engine` en `.github/workflows/ci.yml` de la raíz del repo.
  (La carpeta `.github/workflows` que vivía aquí dentro nunca se ejecutaba:
  GitHub solo lee workflows desde la raíz del repositorio. Se eliminó.)

## API

`grade`, `buildQuizFromLessons`, `pickCongrats`, `computeStreak`,
`MemoryStore` / `getProgress` / `recordAnswer`, `normalizeLessonPlan` /
`nextLesson` / `prevLesson`, `sugerirSiguientePaso`, `TutorAgent`.

El contrato exacto de cada función está fijado por `tests/quiz.test.mjs`.
