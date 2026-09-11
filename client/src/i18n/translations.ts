/**
 * Sistema de Traducción Centralizado
 * Idiomas: Portugués Brasil → Español → Inglés
 */

export type Language = "pt-BR" | "es" | "en";

interface TranslationPoint {
  icon: string;
  title: string;
  description: string;
}

interface Translation {
  [key: string]: string | string[] | TranslationPoint[] | Translation;
}

export const translations: Record<Language, Translation> = {
  "pt-BR": {
    // Navegación
    nav: {
      home: "Início",
      courses: "Cursos",
      dashboard: "Painel",
      profile: "Perfil",
      settings: "Configurações",
      logout: "Sair",
      help: "Ajuda",
    },

    // Onboarding
    onboarding: {
      welcome: "Bem-vindo ao Secure-T",
      welcomeSubtitle: "Plataforma educativa segura para criadores",
      description:
        "Aprenda arte, design e programação de forma segura. Seus dados? Apenas um número.",
      getStarted: "Começar",
      next: "Próximo",
      back: "Voltar",
      enter: "Entrar",
      skip: "Pular",

      step1: {
        title: "Bem-vindo",
        subtitle: "Você está seguro aqui",
        description:
          "Secure-T é uma plataforma onde você é anônimo. Sem emails, sem nomes, sem rastreamento.",
        features: [
          "🎨 Cursos de arte digital",
          "🔒 Totalmente anônimo",
          "🚀 Animações incríveis",
          "📚 Conteúdo criativo",
        ],
      },

      step2: {
        title: "Privacidade",
        subtitle: "Como funciona",
        points: [
          {
            icon: "🔐",
            title: "Você é um número",
            description: "Seu token UUID é anônimo",
          },
          {
            icon: "📵",
            title: "Sem emails",
            description: "Não guardamos seu email",
          },
          {
            icon: "🚀",
            title: "Acesso total",
            description: "Cursos, materiais, animações",
          },
        ],
      },

      step3: {
        title: "Seu Token",
        subtitle: "Gerado localmente",
        success: "✅ Token gerado com sucesso",
        generating: "Gerando...",
        generate: "Gerar Token",
        savedInBrowser: "Guardado em seu navegador (seguro)",
      },

      step4: {
        title: "Pronto!",
        subtitle: "Explore nossos cursos",
      },
    },

    // Courses
    courses: {
      title: "Aprenda & Crie",
      subtitle: "Cursos de arte, design e programação criados por artistas",
      explore: "Explorar",
      all: "Todos",
      beginner: "Iniciante",
      intermediate: "Intermediário",
      advanced: "Avançado",
      students: "alunos",
      featured: "✨ Em Destaque",
      seeAll: "Ver Tudo",

      list: {
        digitalArt: {
          title: "Arte Digital Básica",
          description: "Aprenda os fundamentos de desenho digital com Procreate e Photoshop",
        },
        characterDesign: {
          title: "Design de Personagens",
          description: "Crie personagens incríveis para seus projetos e histórias",
        },
        motionGraphics: {
          title: "Motion Graphics Avançado",
          description: "Animações profissionais com After Effects e Cinema 4D",
        },
        webDesign: {
          title: "Design Web Criativo",
          description: "Websites lindos com Figma, React e Tailwind CSS",
        },
        modeling3D: {
          title: "Modelagem 3D",
          description: "Crie modelos 3D com Blender para games e films",
        },
        illustration: {
          title: "Ilustração Digital",
          description: "Técnicas de ilustração para livros, mangás e webtoons",
        },
      },
    },

    // Dashboard
    dashboard: {
      title: "Painel de Controle",
      welcome: "Bem-vindo!",
      yourProgress: "Seu Progresso",
      continueCourse: "Continuar Curso",
      myDownloads: "Meus Downloads",
      recentActivity: "Atividade Recente",
      credits: "Créditos",
      notifications: "Notificações",
    },

    // Downloads
    downloads: {
      title: "Centro de Downloads",
      noDownloads: "Você ainda não fez nenhum download",
      startDownloading: "Comece a explorar cursos",
      active: "Ativo",
      expired: "Expirado",
      downloadMaterials: "Baixar Materiais",
      expiresIn: "Expira em",
      hours: "horas",
      days: "dias",
    },

    // Errors
    errors: {
      tokenExpired: "Token expirado. Gere um novo.",
      invalidToken: "Token inválido ou ausente",
      unauthorized: "Não autorizado",
      notFound: "Não encontrado",
      serverError: "Erro no servidor",
      tryAgain: "Tentar Novamente",
      goHome: "Ir para Início",
    },

    // Settings
    settings: {
      title: "Configurações",
      language: "Idioma",
      theme: "Tema",
      notifications: "Notificações",
      privacy: "Privacidade",
      darkMode: "Modo Escuro",
      lightMode: "Modo Claro",
      about: "Sobre",
      terms: "Termos de Serviço",
      contact: "Contato",
    },

    // Common
    common: {
      loading: "Carregando...",
      save: "Salvar",
      cancel: "Cancelar",
      delete: "Deletar",
      edit: "Editar",
      share: "Compartilhar",
      copy: "Copiar",
      copied: "Copiado!",
      close: "Fechar",
      openMenu: "Abrir Menu",
      closeMenu: "Fechar Menu",
    },
  },

  es: {
    // Navegación
    nav: {
      home: "Inicio",
      courses: "Cursos",
      dashboard: "Panel",
      profile: "Perfil",
      settings: "Configuración",
      logout: "Salir",
      help: "Ayuda",
    },

    // Onboarding
    onboarding: {
      welcome: "Bienvenido a Secure-T",
      welcomeSubtitle: "Plataforma educativa segura para creadores",
      description:
        "Aprende arte, diseño y programación de forma segura. ¿Tus datos? Solo un número.",
      getStarted: "Empezar",
      next: "Siguiente",
      back: "Atrás",
      enter: "Entrar",
      skip: "Saltar",

      step1: {
        title: "Bienvenido",
        subtitle: "Estás seguro aquí",
        description:
          "Secure-T es una plataforma donde eres anónimo. Sin emails, sin nombres, sin rastreo.",
        features: [
          "🎨 Cursos de arte digital",
          "🔒 Totalmente anónimo",
          "🚀 Animaciones increíbles",
          "📚 Contenido creativo",
        ],
      },

      step2: {
        title: "Privacidad",
        subtitle: "Cómo funciona",
        points: [
          {
            icon: "🔐",
            title: "Eres un número",
            description: "Tu token UUID es anónimo",
          },
          {
            icon: "📵",
            title: "Sin emails",
            description: "No guardamos tu email",
          },
          {
            icon: "🚀",
            title: "Acceso total",
            description: "Cursos, materiales, animaciones",
          },
        ],
      },

      step3: {
        title: "Tu Token",
        subtitle: "Generado localmente",
        success: "✅ Token generado con éxito",
        generating: "Generando...",
        generate: "Generar Token",
        savedInBrowser: "Guardado en tu navegador (seguro)",
      },

      step4: {
        title: "¡Listo!",
        subtitle: "Explora nuestros cursos",
      },
    },

    // Courses
    courses: {
      title: "Aprende & Crea",
      subtitle: "Cursos de arte, diseño y programación creados por artistas",
      explore: "Explorar",
      all: "Todos",
      beginner: "Principiante",
      intermediate: "Intermedio",
      advanced: "Avanzado",
      students: "estudiantes",
      featured: "✨ Destacado",
      seeAll: "Ver Todo",

      list: {
        digitalArt: {
          title: "Arte Digital Básico",
          description: "Aprende los fundamentos del dibujo digital con Procreate y Photoshop",
        },
        characterDesign: {
          title: "Diseño de Personajes",
          description: "Crea personajes increíbles para tus proyectos e historias",
        },
        motionGraphics: {
          title: "Motion Graphics Avanzado",
          description: "Animaciones profesionales con After Effects y Cinema 4D",
        },
        webDesign: {
          title: "Diseño Web Creativo",
          description: "Sitios web hermosos con Figma, React y Tailwind CSS",
        },
        modeling3D: {
          title: "Modelado 3D",
          description: "Crea modelos 3D con Blender para juegos y películas",
        },
        illustration: {
          title: "Ilustración Digital",
          description: "Técnicas de ilustración para libros, mangas y webtoons",
        },
      },
    },

    // Dashboard
    dashboard: {
      title: "Panel de Control",
      welcome: "¡Bienvenido!",
      yourProgress: "Tu Progreso",
      continueCourse: "Continuar Curso",
      myDownloads: "Mis Descargas",
      recentActivity: "Actividad Reciente",
      credits: "Créditos",
      notifications: "Notificaciones",
    },

    // Downloads
    downloads: {
      title: "Centro de Descargas",
      noDownloads: "Aún no has realizado ninguna descarga",
      startDownloading: "Comienza a explorar cursos",
      active: "Activo",
      expired: "Expirado",
      downloadMaterials: "Descargar Materiales",
      expiresIn: "Expira en",
      hours: "horas",
      days: "días",
    },

    // Errors
    errors: {
      tokenExpired: "Token expirado. Genera uno nuevo.",
      invalidToken: "Token inválido o ausente",
      unauthorized: "No autorizado",
      notFound: "No encontrado",
      serverError: "Error del servidor",
      tryAgain: "Intentar de Nuevo",
      goHome: "Ir al Inicio",
    },

    // Settings
    settings: {
      title: "Configuración",
      language: "Idioma",
      theme: "Tema",
      notifications: "Notificaciones",
      privacy: "Privacidad",
      darkMode: "Modo Oscuro",
      lightMode: "Modo Claro",
      about: "Acerca de",
      terms: "Términos de Servicio",
      contact: "Contacto",
    },

    // Common
    common: {
      loading: "Cargando...",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      share: "Compartir",
      copy: "Copiar",
      copied: "¡Copiado!",
      close: "Cerrar",
      openMenu: "Abrir Menú",
      closeMenu: "Cerrar Menú",
    },
  },

  en: {
    // Navigation
    nav: {
      home: "Home",
      courses: "Courses",
      dashboard: "Dashboard",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      help: "Help",
    },

    // Onboarding
    onboarding: {
      welcome: "Welcome to Secure-T",
      welcomeSubtitle: "Safe learning platform for creators",
      description:
        "Learn art, design & coding securely. Your data? Just a number.",
      getStarted: "Get Started",
      next: "Next",
      back: "Back",
      enter: "Enter",
      skip: "Skip",

      step1: {
        title: "Welcome",
        subtitle: "You are safe here",
        description:
          "Secure-T is a platform where you are anonymous. No emails, no names, no tracking.",
        features: [
          "🎨 Digital art courses",
          "🔒 Completely anonymous",
          "🚀 Amazing animations",
          "📚 Creative content",
        ],
      },

      step2: {
        title: "Privacy",
        subtitle: "How it works",
        points: [
          {
            icon: "🔐",
            title: "You are a number",
            description: "Your UUID token is anonymous",
          },
          {
            icon: "📵",
            title: "No emails",
            description: "We don't store your email",
          },
          {
            icon: "🚀",
            title: "Full access",
            description: "Courses, materials, animations",
          },
        ],
      },

      step3: {
        title: "Your Token",
        subtitle: "Locally generated",
        success: "✅ Token generated successfully",
        generating: "Generating...",
        generate: "Generate Token",
        savedInBrowser: "Saved in your browser (secure)",
      },

      step4: {
        title: "Ready!",
        subtitle: "Explore our courses",
      },
    },

    // Courses
    courses: {
      title: "Learn & Create",
      subtitle: "Art, design and coding courses created by artists",
      explore: "Explore",
      all: "All",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      students: "students",
      featured: "✨ Featured",
      seeAll: "See All",

      list: {
        digitalArt: {
          title: "Digital Art 101",
          description: "Learn digital drawing fundamentals with Procreate and Photoshop",
        },
        characterDesign: {
          title: "Character Design",
          description: "Create amazing characters for your projects and stories",
        },
        motionGraphics: {
          title: "Advanced Motion Graphics",
          description: "Professional animations with After Effects and Cinema 4D",
        },
        webDesign: {
          title: "Creative Web Design",
          description: "Beautiful websites with Figma, React and Tailwind CSS",
        },
        modeling3D: {
          title: "3D Modeling",
          description: "Create 3D models with Blender for games and films",
        },
        illustration: {
          title: "Digital Illustration",
          description: "Illustration techniques for books, mangas and webtoons",
        },
      },
    },

    // Dashboard
    dashboard: {
      title: "Control Panel",
      welcome: "Welcome!",
      yourProgress: "Your Progress",
      continueCourse: "Continue Course",
      myDownloads: "My Downloads",
      recentActivity: "Recent Activity",
      credits: "Credits",
      notifications: "Notifications",
    },

    // Downloads
    downloads: {
      title: "Download Center",
      noDownloads: "You haven't made any downloads yet",
      startDownloading: "Start exploring courses",
      active: "Active",
      expired: "Expired",
      downloadMaterials: "Download Materials",
      expiresIn: "Expires in",
      hours: "hours",
      days: "days",
    },

    // Errors
    errors: {
      tokenExpired: "Token expired. Generate a new one.",
      invalidToken: "Invalid or missing token",
      unauthorized: "Unauthorized",
      notFound: "Not found",
      serverError: "Server error",
      tryAgain: "Try Again",
      goHome: "Go Home",
    },

    // Settings
    settings: {
      title: "Settings",
      language: "Language",
      theme: "Theme",
      notifications: "Notifications",
      privacy: "Privacy",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      about: "About",
      terms: "Terms of Service",
      contact: "Contact",
    },

    // Common
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      share: "Share",
      copy: "Copy",
      copied: "Copied!",
      close: "Close",
      openMenu: "Open Menu",
      closeMenu: "Close Menu",
    },
  },
};

/**
 * Función helper para acceder a traducciones
 * Uso: t("onboarding.welcome")
 */
export function translate(key: string, language: Language): string {
  const keys = key.split(".");
  let value: any = translations[language];

  for (const k of keys) {
    value = value?.[k];
  }

  return typeof value === "string" ? value : key;
}

/**
 * Hook para React
 */
export function useTranslation(language: Language) {
  return (key: string): string => translate(key, language);
}
