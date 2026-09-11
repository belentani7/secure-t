export type LessonType = "theory" | "practice" | "lab" | "assessment";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  minutes: number;
  objective: string;
  content: string;
  evidencePrompt?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  code: string;
  title: string;
  year: number;
  credits: number;
  description: string;
  competencies: string[];
  modules: Module[];
}

export interface LessonPlan {
  course: Course;
  lessons: Lesson[];
  byId: Record<string, number>;
  length: number;
}

export type LessonLike = {
  id?: unknown;
  title?: unknown;
  type?: unknown;
  minutes?: unknown;
  objective?: unknown;
  content?: unknown;
  evidencePrompt?: unknown;
};

export type CourseLike = {
  code?: unknown;
  title?: unknown;
  year?: unknown;
  credits?: unknown;
  description?: unknown;
  competencies?: unknown;
  lessons?: unknown;
  modules?: unknown;
};

const LESSON_TYPES: readonly LessonType[] = ["theory", "practice", "lab", "assessment"];

export function normalizeLesson(src: LessonLike | undefined | null): Lesson | null {
  if (!src || typeof src !== "object") return null;
  const id = String(src.id ?? "").trim();
  if (!id) return null;
  const type = LESSON_TYPES.includes(src.type as LessonType) ? (src.type as LessonType) : "theory";
  const minutes = Number(src.minutes);
  return {
    id,
    title: String(src.title ?? id),
    type,
    minutes: Number.isFinite(minutes) ? minutes : 0,
    objective: String(src.objective ?? ""),
    content: String(src.content ?? ""),
    evidencePrompt: src.evidencePrompt === undefined ? undefined : String(src.evidencePrompt),
  };
}

export function normalizeCourse(src: CourseLike | undefined | null): Course | null {
  if (!src || typeof src !== "object") return null;
  const code = String(src.code ?? "").trim();
  if (!code) return null;
  let modules: Module[] = [];
  if (Array.isArray(src.modules)) {
    const out: Module[] = [];
    src.modules.forEach((raw, i) => {
      const m = (raw ?? {}) as { id?: unknown; title?: unknown; lessons?: unknown };
      const lessons: Lesson[] = [];
      if (Array.isArray(m.lessons)) {
        for (const l of m.lessons) {
          const nl = normalizeLesson(l as LessonLike);
          if (nl) lessons.push(nl);
        }
      }
      if (lessons.length) {
        out.push({ id: String(m.id ?? `module-${i + 1}`), title: String(m.title ?? `Module ${i + 1}`), lessons });
      }
    });
    modules = out;
  } else if (Array.isArray(src.lessons)) {
    const lessons: Lesson[] = [];
    for (const l of src.lessons) {
      const nl = normalizeLesson(l as LessonLike);
      if (nl) lessons.push(nl);
    }
    if (lessons.length) modules = [{ id: "default", title: code, lessons }];
  }
  const competencies: string[] = Array.isArray(src.competencies) ? src.competencies.map(String) : [];
  const year = Number(src.year);
  const credits = Number(src.credits);
  return {
    code,
    title: String(src.title ?? code),
    year: Number.isFinite(year) ? year : 0,
    credits: Number.isFinite(credits) ? credits : 0,
    description: String(src.description ?? ""),
    competencies,
    modules,
  };
}

export function normalizeLessonPlan(src: CourseLike | undefined | null): LessonPlan | null {
  const course = normalizeCourse(src);
  if (!course) return null;
  const lessons = course.modules.flatMap((m) => m.lessons);
  const byId: Record<string, number> = {};
  lessons.forEach((l, i) => {
    byId[l.id] = i;
  });
  return { course, lessons, byId, length: lessons.length };
}

export function nextLesson(plan: LessonPlan, lessonId: string): Lesson | undefined {
  const idx = plan.byId[lessonId];
  if (idx === undefined || idx + 1 >= plan.lessons.length) return undefined;
  return plan.lessons[idx + 1];
}

export function prevLesson(plan: LessonPlan, lessonId: string): Lesson | undefined {
  const idx = plan.byId[lessonId];
  if (idx === undefined || idx <= 0) return undefined;
  return plan.lessons[idx - 1];
}
