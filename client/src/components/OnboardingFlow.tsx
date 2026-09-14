/**
 * Onboarding Amigable - NO Terminal
 * Interfaz futurística para adolescentes/estudiantes
 * Multiidioma: PT-BR → ES → EN
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useLocation } from "wouter";
import { useAnonymousToken } from "@/auth/token";
import { curriculum } from "../../../academic/curriculum.ts";
import { springConfig, transitionVariants, hoverVariants } from "@/animations/transitions";

const LANGUAGES = {
  "pt-BR": {
    title: "Bem-vindo ao Secure-T",
    subtitle: "Infraestrutura de segurança inteligente, open source",
    description:
      "Aprenda cibersegurança, desenvolvimento web e programação de forma segura. Seus dados? Apenas um número.",
    cta: "Começar",
    features: [
      "🛡️ Cursos de cibersegurança",
      "🔒 Totalmente anônimo",
      "🌐 Projetos full-stack reais",
      "💻 Conteúdo open source",
    ],
  },
  es: {
    title: "Bienvenido a Secure-T",
    subtitle: "Infraestructura de seguridad inteligente, open source",
    description:
      "Aprende ciberseguridad, desarrollo web y programación de forma segura. ¿Tus datos? Solo un número.",
    cta: "Empezar",
    features: [
      "🛡️ Cursos de ciberseguridad",
      "🔒 Totalmente anónimo",
      "🌐 Proyectos full-stack reales",
      "💻 Contenido open source",
    ],
  },
  en: {
    title: "Welcome to Secure-T",
    subtitle: "Intelligent security infrastructure, open source",
    description:
      "Learn cybersecurity, web development & programming securely. Your data? Just a number.",
    cta: "Get Started",
    features: [
      "🛡️ Cybersecurity courses",
      "🔒 Completely anonymous",
      "🌐 Real full-stack projects",
      "💻 Open source content",
    ],
  },
};

interface OnboardingFlowProps {
  onComplete?: (token: string) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [, navigate] = useLocation();
  const { language, setLanguage } = useLanguage();
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const { token, isValid } = useAnonymousToken();
  const t = LANGUAGES[language];

  const steps = [
    // Step 0: Bienvenida
    {
      title: t.title,
      subtitle: t.subtitle,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <p className="text-lg text-gray-300 text-center max-w-md">
            {t.description}
          </p>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-2 gap-4 max-w-md"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.1 },
              },
            }}
          >
            {t.features.map((feature, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 10 },
                  visible: { opacity: 1, scale: 1, y: 0 },
                }}
                transition={{ ...springConfig.gentle, type: "spring" }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-4 rounded-lg border border-purple-500/30 backdrop-blur cursor-pointer transition-all"
              >
                <p className="text-sm text-gray-200">{feature}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Language Selector */}
          <div className="flex gap-2 justify-center">
            {(["pt-BR", "es", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  language === lang
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {lang === "pt-BR" ? "🇧🇷 PT" : lang === "es" ? "🇪🇸 ES" : "🇺🇸 EN"}
              </button>
            ))}
          </div>
        </motion.div>
      ),
      action: () => setStep(1),
    },

    // Step 1: Explicación de Privacidad
    {
      title: language === "pt-BR" ? "Privacidade" : language === "es" ? "Privacidad" : "Privacy",
      subtitle:
        language === "pt-BR"
          ? "Como funciona"
          : language === "es"
            ? "Cómo funciona"
            : "How it works",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 max-w-md"
        >
          <div className="space-y-3">
            {[
              {
                icon: "🔐",
                title:
                  language === "pt-BR"
                    ? "Você é um número"
                    : language === "es"
                      ? "Eres un número"
                      : "You are a number",
                description:
                  language === "pt-BR"
                    ? "Seu token UUID é anônimo"
                    : language === "es"
                      ? "Tu token UUID es anónimo"
                      : "Your UUID token is anonymous",
              },
              {
                icon: "📵",
                title:
                  language === "pt-BR"
                    ? "Sem emails"
                    : language === "es"
                      ? "Sin emails"
                      : "No emails",
                description:
                  language === "pt-BR"
                    ? "Não guardamos seu email"
                    : language === "es"
                      ? "No guardamos tu email"
                      : "We don't store your email",
              },
              {
                icon: "🚀",
                title:
                  language === "pt-BR"
                    ? "Acesso total"
                    : language === "es"
                      ? "Acceso total"
                      : "Full access",
                description:
                  language === "pt-BR"
                    ? "Cursos, materiais, animações"
                    : language === "es"
                      ? "Cursos, materiales, animaciones"
                      : "Courses, materials, animations",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700"
              >
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ),
      action: () => setStep(2),
    },

    // Step 2: Generar Token
    {
      title: language === "pt-BR" ? "Seu Token" : language === "es" ? "Tu Token" : "Your Token",
      subtitle:
        language === "pt-BR"
          ? "Gerado localmente"
          : language === "es"
            ? "Generado localmente"
            : "Locally generated",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 max-w-md"
        >
          {token && isValid ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 p-6 rounded-lg border border-green-500/50 backdrop-blur"
            >
              <p className="text-sm text-green-300 text-center mb-3">
                {language === "pt-BR"
                  ? "✅ Token gerado com sucesso"
                  : language === "es"
                    ? "✅ Token generado con éxito"
                    : "✅ Token generated successfully"}
              </p>
              <div className="bg-black/50 p-3 rounded font-mono text-xs text-green-400 break-all">
                {token.value}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                {language === "pt-BR"
                  ? "Guardado em seu navegador (seguro)"
                  : language === "es"
                    ? "Guardado en tu navegador (seguro)"
                    : "Saved in your browser (secure)"}
              </p>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                setIsGeneratingToken(true);
                // Token ya fue generado por useAnonymousToken
                await new Promise((r) => setTimeout(r, 500));
                setIsGeneratingToken(false);
              }}
              disabled={isGeneratingToken}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {isGeneratingToken
                ? language === "pt-BR"
                  ? "Gerando..."
                  : language === "es"
                    ? "Generando..."
                    : "Generating..."
                : language === "pt-BR"
                  ? "Gerar Token"
                  : language === "es"
                    ? "Generar Token"
                    : "Generate Token"}
            </motion.button>
          )}
        </motion.div>
      ),
      action: () => setStep(3),
    },

    // Step 3: Explorar Cursos
    {
      title: language === "pt-BR" ? "Pronto!" : language === "es" ? "¡Listo!" : "Ready!",
      subtitle:
        language === "pt-BR"
          ? "Explore nossos cursos"
          : language === "es"
            ? "Explora nuestros cursos"
            : "Explore our courses",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 max-w-md"
        >
          <div className="grid grid-cols-1 gap-3">
            {curriculum.slice(0, 3).map((course, i) => (
              <motion.div
                key={course.code}
                whileHover={{ x: 5 }}
                onClick={() => {
                  const first = course.lessons[0];
                  if (first) navigate(`/lesson/${first.id}`);
                }}
                className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              >
                <span className="text-2xl">{["🛡️", "🌐", "⚙️"][i % 3]}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white">{course.title}</p>
                  <p className="text-xs text-gray-400">{course.code} · {course.lessons.length} aulas</p>
                </div>
                <span className="text-purple-400">→</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ),
      action: () => {
        if (onComplete && token) onComplete(token.value);
      },
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      {/* Fondo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"
        />
      </div>

      {/* Contenedor principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="bg-gray-900/80 backdrop-blur border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ ...springConfig.smooth, type: "spring" }}
            className="text-center mb-8"
          >
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {currentStep.title}
            </motion.h1>
            <motion.p
              className="text-gray-400 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...springConfig.smooth, type: "spring" }}
            >
              {currentStep.subtitle}
            </motion.p>
          </motion.div>

          {/* Contenido */}
          <div className="flex justify-center mb-8">{currentStep.content}</div>

          {/* Botones de navegación */}
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ...springConfig.smooth, type: "spring" }}
          >
            {step > 0 && (
              <motion.button
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all font-medium"
              >
                ← {language === "pt-BR" ? "Voltar" : language === "es" ? "Atrás" : "Back"}
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={currentStep.action}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all shadow-lg"
            >
              {step === steps.length - 1
                ? language === "pt-BR"
                  ? "Entrar"
                  : language === "es"
                    ? "Entrar"
                    : "Enter"
                : t.cta}
            </motion.button>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            className="flex gap-2 justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {steps.map((_, i) => (
              <motion.div
                key={i}
                layout
                initial={{ scale: 0.6, opacity: 0.4 }}
                animate={{
                  scale: i === step ? 1.3 : i < step ? 1 : 0.8,
                  opacity: i <= step ? 1 : 0.4,
                  width: i === step ? 32 : i < step ? 32 : 8,
                }}
                transition={{ ...springConfig.stiff, type: "spring" }}
                className={`h-2 rounded-full transition-all cursor-pointer hover:scale-110 ${
                  i <= step
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-gray-600"
                }`}
                onClick={() => i <= step && setStep(i)}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
