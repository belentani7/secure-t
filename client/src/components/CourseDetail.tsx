/**
 * Módulo de Detalle del Curso - Material Didáctico Estructurado
 * Módulos, lecciones, quizzes interactivos y seguimiento de progreso
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { springConfig } from "@/animations/transitions";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: "video" | "text" | "interactive";
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  progress: number;
}

interface CourseDetailProps {
  courseId: string;
  courseName: string;
  courseEmoji: string;
  courseColor: string;
  onClose: () => void;
}

export function CourseDetail({
  courseId,
  courseName,
  courseEmoji,
  courseColor,
  onClose,
}: CourseDetailProps) {
  const { language } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  // Mock modules - en producción vendrían de API
  const modules: Module[] = [
    {
      id: "module-1",
      title: language === "pt-BR" ? "Conceitos Fundamentais" : "Conceptos Fundamentales",
      description:
        language === "pt-BR"
          ? "Introdução aos conceitos básicos"
          : "Introducción a los conceptos básicos",
      progress: 100,
      lessons: [
        {
          id: "lesson-1",
          title: language === "pt-BR" ? "O que é Segurança?" : "¿Qué es Seguridad?",
          description:
            language === "pt-BR"
              ? "Entenda os pilares da segurança digital"
              : "Comprende los pilares de la seguridad digital",
          duration: 12,
          type: "video",
          completed: true,
        },
        {
          id: "lesson-2",
          title:
            language === "pt-BR" ? "Tipos de Ameaças" : "Tipos de Amenazas",
          description:
            language === "pt-BR"
              ? "Conheça as principais ameaças"
              : "Conoce las principales amenazas",
          duration: 15,
          type: "text",
          completed: true,
        },
        {
          id: "lesson-3",
          title:
            language === "pt-BR"
              ? "Proteção Básica"
              : "Protección Básica",
          description:
            language === "pt-BR"
              ? "Primeiras medidas de proteção"
              : "Primeras medidas de protección",
          duration: 10,
          type: "interactive",
          completed: false,
        },
      ],
    },
    {
      id: "module-2",
      title:
        language === "pt-BR" ? "Criptografia Prática" : "Criptografía Práctica",
      description:
        language === "pt-BR"
          ? "Aprendar criptografia do mundo real"
          : "Aprender criptografía del mundo real",
      progress: 50,
      lessons: [
        {
          id: "lesson-4",
          title:
            language === "pt-BR" ? "Hash Functions" : "Funciones Hash",
          description:
            language === "pt-BR"
              ? "Como funcionam algoritmos de hash"
              : "Cómo funcionan los algoritmos hash",
          duration: 18,
          type: "video",
          completed: true,
        },
        {
          id: "lesson-5",
          title:
            language === "pt-BR"
              ? "Criptografia Simétrica"
              : "Criptografía Simétrica",
          description:
            language === "pt-BR"
              ? "AES, DES e outros cifrados"
              : "AES, DES y otros cifrados",
          duration: 20,
          type: "text",
          completed: false,
        },
      ],
    },
  ];

  const currentModule = modules.find((m) => m.id === selectedModule);
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.completed).length,
    0
  );
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ ...springConfig.smooth, type: "spring" }}
        onClick={(e) => e.stopPropagation()}
        className={`bg-gradient-to-br ${courseColor} p-0.5 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden`}
      >
        <div className="bg-gray-900 rounded-2xl h-full overflow-y-auto">
          {/* Header */}
          <motion.div
            className="sticky top-0 bg-gray-900 border-b border-gray-800 p-8 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between mb-6">
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-5xl"
              >
                {courseEmoji}
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
              >
                ✕
              </motion.button>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{courseName}</h2>

            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">
                  {language === "pt-BR"
                    ? "Seu Progresso"
                    : "Tu Progreso"}
                </span>
                <span className="text-sm font-semibold text-purple-400">
                  {overallProgress}%
                </span>
              </div>
              <motion.div
                className="w-full h-2 bg-gray-700 rounded-full overflow-hidden"
                layout
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ ...springConfig.smooth, type: "spring", delay: 0.2 }}
                />
              </motion.div>
              <div className="text-xs text-gray-500">
                {completedLessons} de {totalLessons}{" "}
                {language === "pt-BR" ? "lições" : "lecciones"}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {!selectedModule ? (
              // Modules List
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {language === "pt-BR" ? "Módulos" : "Módulos"}
                </h3>
                {modules.map((module) => (
                  <motion.button
                    key={module.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    onClick={() => setSelectedModule(module.id)}
                    className="w-full text-left"
                  >
                    <div className="bg-gray-800/50 hover:bg-gray-800 p-4 rounded-lg border border-gray-700 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">
                          {module.title}
                        </h4>
                        <span className="text-sm text-purple-400 font-medium">
                          {module.progress}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        {module.description}
                      </p>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${module.progress}%` }}
                          transition={{
                            ...springConfig.gentle,
                            type: "spring",
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {module.lessons.length}{" "}
                        {language === "pt-BR" ? "lições" : "lecciones"}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : currentModule ? (
              // Lessons List
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springConfig.smooth, type: "spring" }}
                className="space-y-4"
              >
                <motion.button
                  whileHover={{ x: -4 }}
                  onClick={() => setSelectedModule(null)}
                  className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-2 mb-4"
                >
                  ← {language === "pt-BR" ? "Voltar" : "Atrás"}
                </motion.button>

                <h3 className="text-xl font-bold text-white">
                  {currentModule.title}
                </h3>

                <div className="space-y-3">
                  {currentModule.lessons.map((lesson, i) => (
                    <motion.button
                      key={lesson.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: i * 0.05,
                        ...springConfig.smooth,
                        type: "spring",
                      }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      onClick={() => setActiveLesson(lesson.id)}
                      className="w-full text-left"
                    >
                      <div
                        className={`p-4 rounded-lg border transition-all ${
                          lesson.completed
                            ? "bg-green-900/20 border-green-500/30"
                            : "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-xl pt-1">
                            {lesson.type === "video"
                              ? "▶️"
                              : lesson.type === "text"
                                ? "📄"
                                : "🎮"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-white">
                                {lesson.title}
                              </h4>
                              {lesson.completed && (
                                <span className="text-green-400">✓</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              {lesson.description}
                            </p>
                            <div className="text-xs text-gray-500 mt-2">
                              ⏱️ {lesson.duration} min
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
