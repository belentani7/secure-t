// Ultra-smooth motion presets
export const springConfig = {
  stiff: { stiffness: 200, damping: 20 },
  smooth: { stiffness: 100, damping: 15 },
  gentle: { stiffness: 80, damping: 25 },
  floaty: { stiffness: 60, damping: 20 },
};

export const transitionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },

  slideInUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
    transition: { ...springConfig.smooth, type: "spring" },
  },

  slideInDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
    transition: { ...springConfig.smooth, type: "spring" },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.92 },
    transition: { ...springConfig.stiff, type: "spring" },
  },

  rotateIn: {
    initial: { opacity: 0, rotate: -10, scale: 0.9 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 10, scale: 0.9 },
    transition: { ...springConfig.gentle, type: "spring" },
  },

  staggerContainer: {
    animate: {
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { ...springConfig.smooth, type: "spring" },
  },
};

export const hoverVariants = {
  lift: {
    whileHover: { y: -8, transition: { ...springConfig.stiff, type: "spring" } },
    whileTap: { scale: 0.98, transition: { ...springConfig.smooth, type: "spring" } },
  },

  glow: {
    whileHover: { boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)" },
  },

  pulse: {
    whileHover: { scale: 1.05 },
    transition: { ...springConfig.stiff, type: "spring" },
  },
};

export const layoutVariants = {
  container: {
    initial: "hidden",
    animate: "visible",
    exit: "hidden",
    variants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
  },

  item: {
    variants: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
};
