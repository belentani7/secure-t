/**
 * Sistema de Animaciones Personalizadas para Secure-T
 * Diseño futurístico para adolescentes
 */

import { Variants } from "framer-motion";

/**
 * Animación: Entrada fade + slide up
 * Uso: Componentes que entran desde abajo
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Animación: Glow pulsante
 * Uso: Botones destacados, elementos interactivos
 */
export const glowPulse: Variants = {
  initial: {
    opacity: 0.8,
    boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
  },
  animate: {
    opacity: [0.8, 1, 0.8],
    boxShadow: [
      "0 0 20px rgba(168, 85, 247, 0.5)",
      "0 0 40px rgba(168, 85, 247, 0.8)",
      "0 0 20px rgba(168, 85, 247, 0.5)",
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Animación: Rotación infinita
 * Uso: Loaders, elementos rotativos (emojis en cards)
 */
export const infiniteRotate: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/**
 * Animación: Flotación suave
 * Uso: Elementos decorativos, fondos
 */
export const float: Variants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Animación: Escala + Giro (entrada dinámica)
 * Uso: Modales, popups
 */
export const scaleInRotate: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    rotate: -180,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    rotate: 180,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Animación: Slide laterale con blur
 * Uso: Transiciones entre secciones
 */
export const slideInBlur: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Animación: Bounce (rebote)
 * Uso: Botones, elementos que piden atención
 */
export const bounce: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  },
};

/**
 * Animación: Onda de energía
 * Uso: Efectos de energía, ondas
 */
export const energyWave: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Animación: Stagger (entrada secuencial de items)
 * Uso: Listas, grillas de cursos
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * Animación: Neon flicker (parpadeo neón)
 * Uso: Títulos futurísticos, acentos
 */
export const neonFlicker: Variants = {
  animate: {
    opacity: [1, 0.8, 1, 0.9, 1],
    textShadow: [
      "0 0 10px rgba(168, 85, 247, 1)",
      "0 0 20px rgba(168, 85, 247, 0.7)",
      "0 0 10px rgba(168, 85, 247, 1)",
      "0 0 15px rgba(168, 85, 247, 0.8)",
      "0 0 10px rgba(168, 85, 247, 1)",
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Animación: Gradient flow (flujo de gradiente)
 * Uso: Fondos, acentos, bordes
 */
export const gradientFlow: Variants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Animación: Shake (temblor)
 * Uso: Alertas, errores, efectos dramáticos
 */
export const shake: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * Animación: Prisma 3D (efecto de profundidad)
 * Uso: Cards, elementos interactivos
 */
export const prismDepth: Variants = {
  initial: {
    rotateX: 0,
    rotateY: 0,
    z: 0,
  },
  hover: {
    rotateX: 5,
    rotateY: 5,
    z: 50,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Preset de animación: Entrada futurística completa
 * Combina múltiples efectos para entrada dramática
 */
export const futuristicEntry: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.8,
    filter: "blur(20px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.320, 1], // custom easing
    },
  },
};

const animationPresets = {
  fadeInUp,
  glowPulse,
  infiniteRotate,
  float,
  scaleInRotate,
  slideInBlur,
  bounce,
  energyWave,
  neonFlicker,
  gradientFlow,
  shake,
  prismDepth,
  futuristicEntry,
};

/**
 * Hook customizado para usar animaciones
 * Exportar como: export { useSecureTAnimation }
 */
export const useSecureTAnimation = (type: keyof typeof animationPresets) => {
  return animationPresets[type] || fadeInUp;
};
