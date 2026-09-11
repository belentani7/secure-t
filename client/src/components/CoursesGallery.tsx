/**
 * Galería de Cursos Futurística
 * Diseño para adolescentes/estudiantes
 * Animaciones personalizadas + Arte
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { springConfig, transitionVariants, hoverVariants } from "@/animations/transitions";

interface Course {
  id: string;
  emoji: string;
  title: {
    "pt-BR": string;
    es: string;
    en: string;
  };
  description: {
    "pt-BR": string;
    es: string;
    en: string;
  };
  level: "iniciante" | "intermediário" | "avançado";
  color: string;
  participants: number;
  imageUrl?: string; // Para fotos que el usuario agregará
}

const COURSES: Course[] = [
  {
    id: "cybersecurity-fundamentals",
    emoji: "🛡️",
    title: {
      "pt-BR": "Fundamentos de Cibersegurança",
      es: "Fundamentos de Ciberseguridad",
      en: "Cybersecurity Fundamentals",
    },
    description: {
      "pt-BR": "Aprenda os fundamentos de segurança digital, redes e proteção de dados",
      es: "Aprende los fundamentos de seguridad digital, redes y protección de datos",
      en: "Learn the fundamentals of digital security, networking and data protection",
    },
    level: "iniciante",
    color: "from-blue-600 to-cyan-600",
    participants: 1240,
  },
  {
    id: "ethical-hacking",
    emoji: "🕵️",
    title: {
      "pt-BR": "Hacking Ético",
      es: "Hacking Ético",
      en: "Ethical Hacking",
    },
    description: {
      "pt-BR": "Testes de penetração e análise de vulnerabilidades de forma ética e legal",
      es: "Pruebas de penetración y análisis de vulnerabilidades de forma ética y legal",
      en: "Penetration testing and vulnerability analysis, done ethically and legally",
    },
    level: "avançado",
    color: "from-red-600 to-orange-600",
    participants: 620,
  },
  {
    id: "web-development",
    emoji: "🌐",
    title: {
      "pt-BR": "Desenvolvimento Web",
      es: "Desarrollo Web",
      en: "Web Development",
    },
    description: {
      "pt-BR": "Sites e aplicações modernas com HTML, CSS, JavaScript e React",
      es: "Sitios y aplicaciones modernas con HTML, CSS, JavaScript y React",
      en: "Modern sites and apps with HTML, CSS, JavaScript and React",
    },
    level: "intermediário",
    color: "from-green-600 to-emerald-600",
    participants: 1089,
  },
  {
    id: "fullstack-development",
    emoji: "⚙️",
    title: {
      "pt-BR": "Desenvolvimento Full-Stack",
      es: "Desarrollo Full-Stack",
      en: "Full-Stack Development",
    },
    description: {
      "pt-BR": "Backend, APIs, bancos de dados e deploy — do zero à produção",
      es: "Backend, APIs, bases de datos y despliegue — de cero a producción",
      en: "Backend, APIs, databases and deployment — from zero to production",
    },
    level: "avançado",
    color: "from-purple-600 to-indigo-600",
    participants: 540,
  },
  {
    id: "programming-languages",
    emoji: "🐍",
    title: {
      "pt-BR": "Linguagens de Programação",
      es: "Lenguajes de Programación",
      en: "Programming Languages",
    },
    description: {
      "pt-BR": "Python, JavaScript, TypeScript e Go: a base de todo desenvolvedor",
      es: "Python, JavaScript, TypeScript y Go: la base de todo desarrollador",
      en: "Python, JavaScript, TypeScript and Go: every developer's foundation",
    },
    level: "iniciante",
    color: "from-yellow-600 to-amber-600",
    participants: 1450,
  },
  {
    id: "devsecops",
    emoji: "🔐",
    title: {
      "pt-BR": "Segurança de Aplicações (DevSecOps)",
      es: "Seguridad de Aplicaciones (DevSecOps)",
      en: "Application Security (DevSecOps)",
    },
    description: {
      "pt-BR": "Como proteger aplicações reais: OWASP, criptografia e boas práticas",
      es: "Cómo proteger aplicaciones reales: OWASP, criptografía y buenas prácticas",
      en: "How to secure real applications: OWASP, cryptography and best practices",
    },
    level: "intermediário",
    color: "from-pink-600 to-rose-600",
    participants: 410,
  },
];

export function CoursesGallery() {
  const { language } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [filter, setFilter] = useState<"todos" | "iniciante" | "intermediário" | "avançado">("todos");

  const filteredCourses = filter === "todos" ? COURSES : COURSES.filter((c) => c.level === filter);
  const activeCourse = COURSES.find((c) => c.id === selectedCourse) ?? null;

  const levelLabels = {
    iniciante:
      language === "pt-BR" ? "Iniciante" : language === "es" ? "Principiante" : "Beginner",
    intermediário:
      language === "pt-BR" ? "Intermediário" : language === "es" ? "Intermedio" : "Intermediate",
    avançado:
      language === "pt-BR" ? "Avançado" : language === "es" ? "Avanzado" : "Advanced",
  };

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
            ? "Cursos de cibersegurança, desenvolvimento web e full-stack, open source"
            : language === "es"
              ? "Cursos de ciberseguridad, desarrollo web y full-stack, open source"
              : "Cybersecurity, web development and full-stack courses, open source"}
        </p>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ...springConfig.smooth, type: "spring" }}
        className="max-w-7xl mx-auto mb-12 flex flex-wrap gap-3"
      >
        {(["todos", "iniciante", "intermediário", "avançado"] as const).map((f, i) => (
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
              key={course.id}
              layout
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.06, ...springConfig.smooth, type: "spring" }}
              whileHover={{ y: -12, scale: 1.02 }}
              onClick={() => setSelectedCourse(course.id)}
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
                    <h3 className="text-xl font-bold text-white mb-2">
                      {course.title[language]}
                    </h3>
                    <p className="text-gray-400 text-sm">{course.description[language]}</p>
                  </div>

                  {/* Level Badge */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${course.color} text-white`}>
                      {levelLabels[course.level]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {course.participants.toLocaleString()} {language === "pt-BR" ? "alunos" : language === "es" ? "estudiantes" : "students"}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-2 rounded-lg transition-all"
                  >
                    {language === "pt-BR"
                      ? "Explorar"
                      : language === "es"
                        ? "Explorar"
                        : "Explore"}
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
            ? "Novos cursos e desafios criados por nossa comunidade open source"
            : language === "es"
              ? "Nuevos cursos y desafíos creados por nuestra comunidad open source"
              : "New courses and challenges created by our open source community"}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg"
        >
          {language === "pt-BR"
            ? "Ver Tudo"
            : language === "es"
              ? "Ver Todo"
              : "See All"}
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

                <h3 className="text-2xl font-bold text-white mb-3">
                  {activeCourse.title[language]}
                </h3>
                <p className="text-gray-400 mb-6">{activeCourse.description[language]}</p>

                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${activeCourse.color} text-white`}>
                    {levelLabels[activeCourse.level]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {activeCourse.participants.toLocaleString()}{" "}
                    {language === "pt-BR" ? "alunos" : language === "es" ? "estudiantes" : "students"}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
