/**
 * Galería de Cursos — lee academic/curriculum.ts (única fuente de verdad).
 * Sin conteos inventados: muestra lecciones y minutos reales.
 * Diseño para adolescentes/estudiantes. Multiidioma: PT-BR → ES → EN (chrome).
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useLocation } from "wouter";
import { curriculum } from "../../../academic/curriculum.ts";
import { springConfig } from "@/animations/transitions";

type Level = "iniciante" | "intermediário" | "avançado";

interface GalleryCourse {
  code: string;
  lessonId: string;
  emoji: string;
  title: string;
  description: string;
  level: Level;
  color: string;
  lessons: number;
  minutes: number;
  year: number;
}

const PALETTE = [
  { emoji: "🛡️", color: "from-blue-600 to-cyan-600" },
  { emoji: "🌐", color: "from-green-600 to-emerald-600" },
  { emoji: "🐍", color: "from-yellow-600 to-amber-600" },
  { emoji: "🔐", color: "from-red-600 to-orange-600" },
  { emoji: "⚙️", color: "from-purple-600 to-indigo-600" },
  { emoji: "🕵️", color: "from-pink-600 to-rose-600" },
  { emoji: "🚨", color: "from-orange-600 to-red-600" },
];

function levelFromYear(year: number): Level {
  if (year <= 1) return "iniciante";
  if (year >= 4) return "avançado";
  return "intermediário";
}

const COURSES: GalleryCourse[] = curriculum.map((c, i) => ({
  code: c.code,
  lessonId: c.lessons[0]?.id ?? "",
  emoji: PALETTE[i % PALETTE.length].emoji,
  title: c.title,
  description: c.description,
  level: levelFromYear(c.year),
  color: PALETTE[i % PALETTE.length].color,
  lessons: c.lessons.length,
  minutes: c.lessons.reduce((n, l) => n + l.minutes, 0),
  year: c.year,
}));

export function CoursesGallery() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [filter, setFilter] = useState<"todos" | Level>("todos");

  const filteredCourses = filter === "todos" ? COURSES : COURSES.filter((c) => c.level === filter);
  const activeCourse = COURSES.find((c) => c.code === selectedCourse) ?? null;

  const levelLabels: Record<Level, string> = {
    iniciante:
      language === "pt-BR" ? "Iniciante" : language === "es" ? "Principiante" : "Beginner",
    intermediário:
      language === "pt-BR" ? "Intermediário" : language === "es" ? "Intermedio" : "Intermediate",
    avançado:
      language === "pt-BR" ? "Avançado" : language === "es" ? "Avanzado" : "Advanced",
  };

  const metaLine = (c: GalleryCourse) =>
    `${c.lessons} ${language === "pt-BR" ? "aulas" : language === "es" ? "lecciones" : "lessons"} · ${c.minutes} min · Year ${c.year}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          {language === "pt-BR"
            ? "Aprenda & Construa"
            : language === "es"
              ? "Aprende & Construye"
              : "Learn & Build"}
        </h1>
        <p className="text-xl text-gray-400">
          {language === "pt-BR"
            ? "Cursos de cibersegurança, redes e resposta a incidentes, open source"
            : language === "es"
              ? "Cursos de ciberseguridad, redes y respuesta a incidentes, open source"
              : "Cybersecurity, networking and incident response courses, open source"}
        </p>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ...springConfig.smooth, type: "spring" }}
        className="max-w-7xl mx-auto mb-12 flex flex-wrap gap-3"
      >
        {(["todos", "iniciante", "intermediário", "avançado"] as const).map((f) => (
          <motion.button
            key={f}
            layout
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === f
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {f === "todos"
              ? language === "pt-BR"
                ? "Todos"
                : language === "es"
                  ? "Todos"
                  : "All"
              : levelLabels[f]}
          </motion.button>
        ))}
      </motion.div>

      {/* Cursos Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course.code}
              layout
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.06, ...springConfig.smooth, type: "spring" }}
              whileHover={{ y: -12, scale: 1.02 }}
              onClick={() => setSelectedCourse(course.code)}
              className="group cursor-pointer"
            >
              {/* Card */}
              <motion.div
                className={`bg-gradient-to-br ${course.color} p-0.5 rounded-2xl shadow-2xl`}
                whileHover={{ boxShadow: "0 0 40px rgba(168, 85, 247, 0.4)" }}
              >
                <div className="bg-gray-900 rounded-2xl p-6 h-full flex flex-col gap-4">
                  {/* Emoji Grande */}
                  <motion.div
                    whileHover={{ scale: 1.25, rotate: 15, y: -4 }}
                    transition={{ ...springConfig.stiff, type: "spring" }}
                    className="text-6xl"
                  >
                    {course.emoji}
                  </motion.div>

                  {/* Título */}
                  <div>
                    <p className="font-mono text-[10px] text-gray-500 mb-1">{course.code}</p>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{course.description}</p>
                  </div>

                  {/* Level Badge */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${course.color} text-white`}>
                      {levelLabels[course.level]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {metaLine(course)}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/lesson/${course.lessonId}`);
                    }}
                    className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-2 rounded-lg transition-all"
                  >
                    {language === "pt-BR"
                      ? "Começar"
                      : language === "es"
                        ? "Empezar"
                        : "Start"}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Featured Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto mt-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30 backdrop-blur"
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          {language === "pt-BR"
            ? "✨ Em Destaque"
            : language === "es"
              ? "✨ Destacado"
              : "✨ Featured"}
        </h2>
        <p className="text-gray-300 mb-6">
          {language === "pt-BR"
            ? "Comece pelo CY-101: risco é uma decisão. Sem conta, sem e-mail."
            : language === "es"
              ? "Empieza por CY-101: el riesgo es una decisión. Sin cuenta, sin e-mail."
              : "Start with CY-101: risk is a decision. No account, no email."}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/lesson/cy-101-1")}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg"
        >
          {language === "pt-BR"
            ? "Abrir primeira aula"
            : language === "es"
              ? "Abrir primera lección"
              : "Open first lesson"}
        </motion.button>
      </motion.div>

      {/* Modal de detalle del curso */}
      <AnimatePresence>
        {activeCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCourse(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-gradient-to-br ${activeCourse.color} p-0.5 rounded-2xl shadow-2xl max-w-lg w-full`}
            >
              <div className="bg-gray-900 rounded-2xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <motion.div
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-7xl"
                  >
                    {activeCourse.emoji}
                  </motion.div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>

                <p className="font-mono text-[11px] text-gray-500 mb-1">
                  {activeCourse.code} · Year {activeCourse.year}
                </p>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {activeCourse.title}
                </h3>
                <p className="text-gray-400 mb-6">{activeCourse.description}</p>

                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${activeCourse.color} text-white`}>
                    {levelLabels[activeCourse.level]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {metaLine(activeCourse)}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/lesson/${activeCourse.lessonId}`)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {language === "pt-BR"
                    ? "Começar Curso"
                    : language === "es"
                      ? "Empezar Curso"
                      : "Start Course"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
