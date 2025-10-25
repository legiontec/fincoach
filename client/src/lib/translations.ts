export type Language = 'es' | 'en';

export interface Translations {
  // Navbar
  navbar: {
    inicio: string;
    comoFunciona: string;
    beneficios: string;
    testimonios: string;
    contacto: string;
    empecemos: string;
  };
  
  // Hero Section
  hero: {
    title: string;
    titleConfidence: string;
    titleNoWith: string;
    titlePanic: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustInvestors: string;
    trustProtected: string;
  };
  
  // How it works section
  howItWorks: {
    title: string;
    subtitle: string;
    step1: {
      title: string;
      description: string;
    };
    step2: {
      title: string;
      description: string;
    };
    step3: {
      title: string;
      description: string;
    };
  };
  
  // Benefits section
  benefits: {
    title: string;
    subtitle: string;
    benefit1: {
      badge: string;
      title: string;
      points: string[];
      demo: {
        marketStatus: string;
        volatilityDetected: string;
        alertTitle: string;
        alertMessage: string;
        recommendation: string;
        recommendationText: string;
      };
    };
    benefit2: {
      badge: string;
      title: string;
      points: string[];
      demo: {
        sentimentScore: string;
        financialNews: string;
        socialMedia: string;
        expertAnalysis: string;
        positive: string;
        neutral: string;
      };
    };
    benefit3: {
      badge: string;
      title: string;
      points: string[];
      demo: {
        financialCushion: string;
        monthsExpenses: string;
        opportunityDetected: string;
        opportunityText: string;
        investButton: string;
      };
    };
  };
  
  // Testimonials section
  testimonials: {
    title: string;
    subtitle: string;
    testimonial1: {
      name: string;
      role: string;
      text: string;
    };
    testimonial2: {
      name: string;
      role: string;
      text: string;
    };
    testimonial3: {
      name: string;
      role: string;
      text: string;
    };
  };
  
  // Contact section
  contact: {
    title: string;
    subtitle: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submitButton: string;
      submittingButton: string;
    };
    info: {
      title: string;
      email: string;
      phone: string;
      location: string;
      hours: string;
      hoursText: string;
    };
    success: {
      title: string;
      message: string;
    };
    error: {
      title: string;
      message: string;
    };
  };
  
  // Final CTA section
  finalCta: {
    title: string;
    subtitle: string;
    button: string;
  };
  
  // Footer
  footer: {
    description: string;
    product: {
      title: string;
      features: string;
      benefits: string;
      pricing: string;
      faq: string;
    };
    company: {
      title: string;
      about: string;
      blog: string;
      press: string;
      careers: string;
    };
    legal: {
      title: string;
      privacy: string;
      terms: string;
      security: string;
      contact: string;
    };
    copyright: string;
    social: {
      twitter: string;
      linkedin: string;
      facebook: string;
      instagram: string;
    };
  };
  
  // Auth Modal
  auth: {
    login: {
      title: string;
      subtitle: string;
      googleButton: string;
      separator: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      submitButton: string;
      noAccount: string;
      registerLink: string;
      terms: string;
      termsLink: string;
      privacyLink: string;
    };
    register: {
      title: string;
      subtitle: string;
      googleButton: string;
      separator: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      confirmPasswordLabel: string;
      confirmPasswordPlaceholder: string;
      submitButton: string;
      hasAccount: string;
      loginLink: string;
      terms: string;
      termsLink: string;
      privacyLink: string;
    };
    closeButton: string;
  };
}

export const translations: Record<Language, Translations> = {
  es: {
    navbar: {
      inicio: "Inicio",
      comoFunciona: "¿Cómo funciona?",
      beneficios: "Beneficios",
      testimonios: "Testimonios",
      contacto: "Contacto",
      empecemos: "¡Empecemos!",
    },
    hero: {
      title: "Invierte con",
      titleConfidence: "Confianza",
      titleNoWith: "No con",
      titlePanic: "Pánico",
      subtitle: "Tu asistente inteligente que te guía a través de la volatilidad del mercado, impulsado por IA y tus finanzas de Capital One.",
      ctaPrimary: "¡Empieza a Invertir Inteligentemente!",
      ctaSecondary: "Ver cómo funciona",
      trustInvestors: "Inversores activos",
      trustProtected: "Protegidos del pánico",
    },
    howItWorks: {
      title: "¿Cómo funciona FinCoach?",
      subtitle: "Tres pilares tecnológicos que transforman tu experiencia de inversión",
      step1: {
        title: "Análisis de Sentimiento en Tiempo Real",
        description: "Monitoreamos noticias financieras, redes sociales y blogs para predecir reacciones emocionales del mercado antes de que afecten tu portafolio.",
      },
      step2: {
        title: "Alertas Proactivas Anti-Pánico",
        description: "Cuando el mercado entra en pánico pero tu portafolio es estable, recibe notificaciones calmantes con datos contextuales que te mantienen enfocado.",
      },
      step3: {
        title: "Micro-Estrategias Personalizadas",
        description: "Usando tus datos de Capital One, determinamos tu capacidad financiera y sugerimos inversiones estratégicas en el momento óptimo.",
      },
    },
    benefits: {
      title: "Beneficios que transforman tu inversión",
      subtitle: "FinCoach no solo predice precios, predice tus emociones y te ayuda a tomar mejores decisiones",
      benefit1: {
        badge: "Protección Emocional",
        title: "Guía Proactiva en Momentos Críticos",
        points: [
          "Evita el pánico de ventas masivas con alertas contextuales basadas en IA",
          "Recibe notificaciones calmantes cuando el mercado está volátil pero tu portafolio es estable",
          "Mantén la calma con datos contextuales que respaldan tus decisiones",
        ],
        demo: {
          marketStatus: "Estado del Mercado",
          volatilityDetected: "Volatilidad Alta Detectada",
          alertTitle: "⚠️ Alerta Anti-Pánico",
          alertMessage: "El mercado muestra pánico de venta, pero tu portafolio permanece estable. Mantén la calma y evita decisiones emocionales.",
          recommendation: "Recomendación",
          recommendationText: "Mantener posición actual. Oportunidad de compra en 48h.",
        },
      },
      benefit2: {
        badge: "Inteligencia Artificial",
        title: "Decisiones Basadas en Datos Reales",
        points: [
          "Análisis de sentimiento del mercado en tiempo real de múltiples fuentes",
          "Modelos de Machine Learning predicen reacciones emocionales del inversor minorista",
          "Integración directa con tu cuenta de Capital One para estrategias personalizadas",
        ],
        demo: {
          sentimentScore: "Puntuación de Sentimiento",
          financialNews: "Noticias Financieras",
          socialMedia: "Redes Sociales",
          expertAnalysis: "Análisis de Expertos",
          positive: "Positivo",
          neutral: "Neutral",
        },
      },
      benefit3: {
        badge: "Personalización Total",
        title: "Inversión Inteligente y Segura",
        points: [
          "Calculamos tu \"colchón financiero\" para sugerir inversiones sin riesgo",
          "Micro-compras estratégicas cuando el mercado ofrece oportunidades",
          "Promoción de inversión a largo plazo y estabilidad financiera",
        ],
        demo: {
          financialCushion: "Colchón Financiero",
          monthsExpenses: "3.2 meses de gastos",
          opportunityDetected: "💡 Oportunidad Detectada",
          opportunityText: "Acción XYZ subvaluada en -12%. Tienes liquidez suficiente para una micro-compra.",
          investButton: "Invertir $50 ahora",
        },
      },
    },
    testimonials: {
      title: "Lo que dicen nuestros usuarios",
      subtitle: "Miles de inversores ya confían en FinCoach para tomar mejores decisiones",
      testimonial1: {
        name: "María Contreras",
        role: "Inversora Principiante",
        text: "FinCoach me salvó de vender todo durante el pánico de marzo. Las alertas me mantuvieron calmada y ahora mi portafolio está +15% arriba. ¡Increíble!",
      },
      testimonial2: {
        name: "Jorge Ramírez",
        role: "Profesional de Fintech",
        text: "La integración con Capital One es brillante. Las micro-estrategias son precisas y personalizadas. Es como tener un asesor financiero 24/7.",
      },
      testimonial3: {
        name: "Ana Sánchez",
        role: "Emprendedora",
        text: "Finalmente entiendo el mercado. El análisis de sentimiento me da confianza que nunca tuve. Ya no invierto con miedo, invierto con datos.",
      },
    },
    contact: {
      title: "¿Listo para invertir con confianza?",
      subtitle: "Contáctanos y descubre cómo FinCoach puede transformar tu experiencia de inversión",
      form: {
        nameLabel: "Nombre completo",
        namePlaceholder: "Tu nombre",
        emailLabel: "Email",
        emailPlaceholder: "tu@email.com",
        messageLabel: "Mensaje",
        messagePlaceholder: "Cuéntanos cómo podemos ayudarte...",
        submitButton: "Enviar mensaje",
        submittingButton: "Enviando...",
      },
      info: {
        title: "Información de contacto",
        email: "Email",
        phone: "Teléfono",
        location: "Ubicación",
        hours: "Horario de atención",
        hoursText: "Lunes a Viernes: 9:00 AM - 6:00 PM\nSábados: 10:00 AM - 2:00 PM\nDomingos: Cerrado",
      },
      success: {
        title: "¡Mensaje enviado!",
        message: "Nos pondremos en contacto contigo pronto.",
      },
      error: {
        title: "Error",
        message: "No se pudo enviar el mensaje. Intenta de nuevo.",
      },
    },
    finalCta: {
      title: "Deja de invertir con miedo.\nEmpieza a invertir con inteligencia.",
      subtitle: "Únete a miles de inversores que ya transformaron su forma de invertir con FinCoach",
      button: "¡Empecemos ahora!",
    },
    footer: {
      description: "Tu asistente inteligente de inversión impulsado por IA",
      product: {
        title: "Producto",
        features: "Características",
        benefits: "Beneficios",
        pricing: "Precios",
        faq: "FAQ",
      },
      company: {
        title: "Empresa",
        about: "Sobre Nosotros",
        blog: "Blog",
        press: "Prensa",
        careers: "Carreras",
      },
      legal: {
        title: "Legal",
        privacy: "Privacidad",
        terms: "Términos",
        security: "Seguridad",
        contact: "Contacto",
      },
      copyright: "© 2025 FinCoach. Todos los derechos reservados.",
      social: {
        twitter: "Twitter",
        linkedin: "LinkedIn",
        facebook: "Facebook",
        instagram: "Instagram",
      },
    },
    auth: {
      login: {
        title: "Iniciar Sesión",
        subtitle: "Accede a tu cuenta de FinCoach",
        googleButton: "Continuar con Google",
        separator: "o continúa con email",
        emailLabel: "Email",
        emailPlaceholder: "tu@email.com",
        passwordLabel: "Contraseña",
        passwordPlaceholder: "Tu contraseña",
        submitButton: "Iniciar Sesión",
        noAccount: "¿No tienes cuenta?",
        registerLink: "Regístrate",
        terms: "Al continuar, aceptas nuestros",
        termsLink: "Términos de Servicio",
        privacyLink: "Política de Privacidad",
      },
      register: {
        title: "Crear Cuenta",
        subtitle: "Únete a FinCoach y comienza a invertir con confianza",
        googleButton: "Registrarse con Google",
        separator: "o continúa con email",
        nameLabel: "Nombre completo",
        namePlaceholder: "Tu nombre completo",
        emailLabel: "Email",
        emailPlaceholder: "tu@email.com",
        passwordLabel: "Contraseña",
        passwordPlaceholder: "Tu contraseña",
        confirmPasswordLabel: "Confirmar contraseña",
        confirmPasswordPlaceholder: "Confirma tu contraseña",
        submitButton: "Crear Cuenta",
        hasAccount: "¿Ya tienes cuenta?",
        loginLink: "Inicia sesión",
        terms: "Al continuar, aceptas nuestros",
        termsLink: "Términos de Servicio",
        privacyLink: "Política de Privacidad",
      },
      closeButton: "Cerrar modal",
    },
  },
  en: {
    navbar: {
      inicio: "Home",
      comoFunciona: "How it works",
      beneficios: "Benefits",
      testimonios: "Testimonials",
      contacto: "Contact",
      empecemos: "Get Started!",
    },
    hero: {
      title: "Invest with",
      titleConfidence: "Confidence",
      titleNoWith: "Not",
      titlePanic: "Panic",
      subtitle: "Your intelligent assistant that guides you through market volatility, powered by AI and your Capital One finances.",
      ctaPrimary: "Start Investing Smart!",
      ctaSecondary: "See how it works",
      trustInvestors: "Active investors",
      trustProtected: "Protected from panic",
    },
    howItWorks: {
      title: "How does FinCoach work?",
      subtitle: "Three technological pillars that transform your investment experience",
      step1: {
        title: "Real-Time Sentiment Analysis",
        description: "We monitor financial news, social media, and blogs to predict market emotional reactions before they affect your portfolio.",
      },
      step2: {
        title: "Proactive Anti-Panic Alerts",
        description: "When the market panics but your portfolio remains stable, receive calming notifications with contextual data that keeps you focused.",
      },
      step3: {
        title: "Personalized Micro-Strategies",
        description: "Using your Capital One data, we determine your financial capacity and suggest strategic investments at the optimal moment.",
      },
    },
    benefits: {
      title: "Benefits that transform your investment",
      subtitle: "FinCoach doesn't just predict prices, it predicts your emotions and helps you make better decisions",
      benefit1: {
        badge: "Emotional Protection",
        title: "Proactive Guidance in Critical Moments",
        points: [
          "Avoid panic selling with AI-based contextual alerts",
          "Receive calming notifications when the market is volatile but your portfolio is stable",
          "Stay calm with contextual data that supports your decisions",
        ],
        demo: {
          marketStatus: "Market Status",
          volatilityDetected: "High Volatility Detected",
          alertTitle: "⚠️ Anti-Panic Alert",
          alertMessage: "The market shows selling panic, but your portfolio remains stable. Stay calm and avoid emotional decisions.",
          recommendation: "Recommendation",
          recommendationText: "Maintain current position. Buying opportunity in 48h.",
        },
      },
      benefit2: {
        badge: "Artificial Intelligence",
        title: "Data-Driven Decisions",
        points: [
          "Real-time market sentiment analysis from multiple sources",
          "Machine Learning models predict retail investor emotional reactions",
          "Direct integration with your Capital One account for personalized strategies",
        ],
        demo: {
          sentimentScore: "Sentiment Score",
          financialNews: "Financial News",
          socialMedia: "Social Media",
          expertAnalysis: "Expert Analysis",
          positive: "Positive",
          neutral: "Neutral",
        },
      },
      benefit3: {
        badge: "Total Personalization",
        title: "Smart and Safe Investment",
        points: [
          "We calculate your \"financial cushion\" to suggest risk-free investments",
          "Strategic micro-purchases when the market offers opportunities",
          "Promotion of long-term investment and financial stability",
        ],
        demo: {
          financialCushion: "Financial Cushion",
          monthsExpenses: "3.2 months of expenses",
          opportunityDetected: "💡 Opportunity Detected",
          opportunityText: "Stock XYZ undervalued by -12%. You have sufficient liquidity for a micro-purchase.",
          investButton: "Invest $50 now",
        },
      },
    },
    testimonials: {
      title: "What our users say",
      subtitle: "Thousands of investors already trust FinCoach to make better decisions",
      testimonial1: {
        name: "Maria Contreras",
        role: "Beginner Investor",
        text: "FinCoach saved me from selling everything during the March panic. The alerts kept me calm and now my portfolio is +15% up. Incredible!",
      },
      testimonial2: {
        name: "Jorge Ramirez",
        role: "Fintech Professional",
        text: "The Capital One integration is brilliant. The micro-strategies are precise and personalized. It's like having a financial advisor 24/7.",
      },
      testimonial3: {
        name: "Ana Sanchez",
        role: "Entrepreneur",
        text: "I finally understand the market. The sentiment analysis gives me confidence I never had. I no longer invest with fear, I invest with data.",
      },
    },
    contact: {
      title: "Ready to invest with confidence?",
      subtitle: "Contact us and discover how FinCoach can transform your investment experience",
      form: {
        nameLabel: "Full name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "your@email.com",
        messageLabel: "Message",
        messagePlaceholder: "Tell us how we can help you...",
        submitButton: "Send message",
        submittingButton: "Sending...",
      },
      info: {
        title: "Contact information",
        email: "Email",
        phone: "Phone",
        location: "Location",
        hours: "Business hours",
        hoursText: "Monday to Friday: 9:00 AM - 6:00 PM\nSaturdays: 10:00 AM - 2:00 PM\nSundays: Closed",
      },
      success: {
        title: "Message sent!",
        message: "We will contact you soon.",
      },
      error: {
        title: "Error",
        message: "Could not send message. Please try again.",
      },
    },
    finalCta: {
      title: "Stop investing with fear.\nStart investing with intelligence.",
      subtitle: "Join thousands of investors who have already transformed their way of investing with FinCoach",
      button: "Let's get started now!",
    },
    footer: {
      description: "Your intelligent investment assistant powered by AI",
      product: {
        title: "Product",
        features: "Features",
        benefits: "Benefits",
        pricing: "Pricing",
        faq: "FAQ",
      },
      company: {
        title: "Company",
        about: "About Us",
        blog: "Blog",
        press: "Press",
        careers: "Careers",
      },
      legal: {
        title: "Legal",
        privacy: "Privacy",
        terms: "Terms",
        security: "Security",
        contact: "Contact",
      },
      copyright: "© 2025 FinCoach. All rights reserved.",
      social: {
        twitter: "Twitter",
        linkedin: "LinkedIn",
        facebook: "Facebook",
        instagram: "Instagram",
      },
    },
    auth: {
      login: {
        title: "Log In",
        subtitle: "Access your FinCoach account",
        googleButton: "Continue with Google",
        separator: "or continue with email",
        emailLabel: "Email",
        emailPlaceholder: "your@email.com",
        passwordLabel: "Password",
        passwordPlaceholder: "Your password",
        submitButton: "Log In",
        noAccount: "Don't have an account?",
        registerLink: "Sign up",
        terms: "By continuing, you accept our",
        termsLink: "Terms of Service",
        privacyLink: "Privacy Policy",
      },
      register: {
        title: "Create Account",
        subtitle: "Join FinCoach and start investing with confidence",
        googleButton: "Sign up with Google",
        separator: "or continue with email",
        nameLabel: "Full name",
        namePlaceholder: "Your full name",
        emailLabel: "Email",
        emailPlaceholder: "your@email.com",
        passwordLabel: "Password",
        passwordPlaceholder: "Your password",
        confirmPasswordLabel: "Confirm password",
        confirmPasswordPlaceholder: "Confirm your password",
        submitButton: "Create Account",
        hasAccount: "Already have an account?",
        loginLink: "Log in",
        terms: "By continuing, you accept our",
        termsLink: "Terms of Service",
        privacyLink: "Privacy Policy",
      },
      closeButton: "Close modal",
    },
  },
};
