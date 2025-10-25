import { useState, useEffect, useRef } from "react";
import { Menu, X, TrendingUp, Shield, Target, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { useLanguage } from "@/lib/language-context";
import { LanguageSelector } from "@/components/LanguageSelector";
import { AuthModal } from "@/components/AuthModal";
import { useAuthModal } from "@/hooks/use-auth-modal";
import heroImage from "@assets/generated_images/FinCoach_hero_illustration_investment_app_f7646911.png";
import sentimentIcon from "@assets/generated_images/AI_sentiment_analysis_icon_5335477c.png";
import alertIcon from "@assets/generated_images/Anti-panic_alert_notification_icon_96b616d9.png";
import strategyIcon from "@assets/generated_images/Personalized_strategy_target_icon_0159b5a8.png";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { isOpen, openModal, closeModal } = useAuthModal();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: t.contact.success.title,
        description: t.contact.success.message,
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: t.contact.error.title,
        description: error.message || t.contact.error.message,
        variant: "destructive",
      });
    },
  });

  const handleContactSubmit = (data: InsertContactMessage) => {
    contactMutation.mutate(data);
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll("[data-animate]");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1"
              data-testid="button-logo"
            >
              <TrendingUp className="w-8 h-8 text-destructive" />
              <span className="text-xl lg:text-2xl font-bold font-heading">
                FinCoach
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="link-inicio"
              >
                {t.navbar.inicio}
              </button>
              <button
                onClick={() => scrollToSection("como-funciona")}
                className="text-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="link-como-funciona"
              >
                {t.navbar.comoFunciona}
              </button>
              <button
                onClick={() => scrollToSection("beneficios")}
                className="text-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="link-beneficios"
              >
                {t.navbar.beneficios}
              </button>
              <button
                onClick={() => scrollToSection("testimonios")}
                className="text-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="link-testimonios"
              >
                {t.navbar.testimonios}
              </button>
              <button
                onClick={() => scrollToSection("contacto")}
                className="text-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="link-contacto"
              >
                {t.navbar.contacto}
              </button>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <LanguageSelector />
              </div>
              <Button
                variant="default"
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hidden md:inline-flex border border-destructive-border"
                onClick={openModal}
                data-testid="button-empecemos-nav"
              >
                {t.navbar.empecemos}
              </Button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden hover-elevate active-elevate-2 p-2 rounded-md"
                data-testid="button-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

      </nav>

        {/* Mobile dropdown menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'fixed inset-0 z-50 bg-white opacity-100' 
            : 'fixed inset-0 z-50 bg-white opacity-0 pointer-events-none'
        }`}>
          <div className="flex flex-col h-screen">
            {/* Keep original navbar visible */}
            <div className="flex items-center justify-between h-16 lg:h-20 px-4 sm:px-6 border-b border-border">
              {/* Logo */}
              <button
                onClick={() => scrollToSection("hero")}
                className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1"
                data-testid="button-logo-mobile"
              >
                <TrendingUp className="w-8 h-8 text-destructive" />
                <span className="text-xl font-bold font-heading">
                  FinCoach
                </span>
              </button>
              
              {/* Close button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="hover-elevate active-elevate-2 p-2 rounded-md transition-all duration-200"
                data-testid="button-menu-toggle"
                aria-label="Cerrar menú"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          
          {/* Menu content */}
          <div className={`flex-1 px-4 sm:px-6 py-4 space-y-3 overflow-y-auto bg-white transition-all duration-300 ease-out ${
            mobileMenuOpen 
              ? 'transform translate-y-0 opacity-100' 
              : 'transform -translate-y-4 opacity-0'
          }`}>
            <button
              onClick={() => {
                scrollToSection("inicio");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-md hover-elevate active-elevate-2 transition-all duration-200"
              data-testid="link-mobile-inicio"
            >
              {t.navbar.inicio}
            </button>
            <button
              onClick={() => {
                scrollToSection("como-funciona");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-md hover-elevate active-elevate-2 transition-all duration-200"
              data-testid="link-mobile-como-funciona"
            >
              {t.navbar.comoFunciona}
            </button>
            <button
              onClick={() => {
                scrollToSection("beneficios");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-md hover-elevate active-elevate-2 transition-all duration-200"
              data-testid="link-mobile-beneficios"
            >
              {t.navbar.beneficios}
            </button>
            <button
              onClick={() => {
                scrollToSection("testimonios");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-md hover-elevate active-elevate-2 transition-all duration-200"
              data-testid="link-mobile-testimonios"
            >
              {t.navbar.testimonios}
            </button>
            <button
              onClick={() => {
                scrollToSection("contacto");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-md hover-elevate active-elevate-2 transition-all duration-200"
              data-testid="link-mobile-contacto"
            >
              {t.navbar.contacto}
            </button>
          </div>
          
          {/* Bottom section with language selector and CTA */}
          <div className={`p-4 sm:p-6 border-t border-border bg-white transition-all duration-300 ease-out ${
            mobileMenuOpen 
              ? 'transform translate-y-0 opacity-100' 
              : 'transform translate-y-4 opacity-0'
          }`}>
            <div className="flex gap-2 items-center">
              <LanguageSelector />
              <Button
                variant="default"
                className="flex-1 bg-destructive text-destructive-foreground border border-destructive-border"
                onClick={() => {
                  openModal();
                  setMobileMenuOpen(false);
                }}
                data-testid="button-empecemos-mobile"
              >
                {t.navbar.empecemos}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="inicio" className="relative overflow-hidden py-8 md:py-16 lg:py-24" data-testid="section-hero" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight" data-testid="text-hero-title">
                  {t.hero.title}{" "}
                  <span className="text-primary">{t.hero.titleConfidence}</span>,<br />
                  {t.hero.titleNoWith} <span className="text-destructive">{t.hero.titlePanic}</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl" data-testid="text-hero-subtitle">
                  {t.hero.subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border border-destructive-border w-full sm:w-auto"
                  onClick={openModal}
                  data-testid="button-hero-cta-primary"
                >
                  {t.hero.ctaPrimary}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
                  onClick={() => scrollToSection("como-funciona")}
                  data-testid="button-hero-cta-secondary"
                >
                  {t.hero.ctaSecondary}
                </Button>
              </div>

              <div className="flex flex-row items-center gap-4 sm:gap-8 pt-4">
                <div className="text-sm text-muted-foreground" data-testid="text-hero-trust">
                  <div className="font-semibold text-foreground text-lg sm:text-xl lg:text-2xl">5,000+</div>
                  <div className="text-xs sm:text-sm">{t.hero.trustInvestors}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="font-semibold text-foreground text-lg sm:text-xl lg:text-2xl">$10M+</div>
                  <div className="text-xs sm:text-sm">{t.hero.trustProtected}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="font-semibold text-foreground text-lg sm:text-xl lg:text-2xl">4.9/5</div>
                  <div className="text-xs sm:text-sm">{t.hero.trustRating}</div>
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative mt-8 lg:mt-0" data-testid="image-hero">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="FinCoach - Asistente de inversión con IA"
                  className="w-full h-auto max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-16 lg:py-24 bg-muted/30" data-testid="section-como-funciona" data-animate>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold" data-testid="text-como-funciona-title">
              {t.howItWorks.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-como-funciona-subtitle">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="relative hover-elevate transition-all duration-300" data-testid="card-step-1">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mx-auto">
                  <img src={sentimentIcon} alt="Análisis de Sentimiento" className="w-12 h-12" />
                </div>
                <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-semibold">{t.howItWorks.step1.title}</h3>
                  <p className="text-muted-foreground">
                    {t.howItWorks.step1.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="relative hover-elevate transition-all duration-300" data-testid="card-step-2">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-destructive/10 mx-auto">
                  <img src={alertIcon} alt="Alertas Anti-Pánico" className="w-12 h-12" />
                </div>
                <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-semibold">{t.howItWorks.step2.title}</h3>
                  <p className="text-muted-foreground">
                    {t.howItWorks.step2.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="relative hover-elevate transition-all duration-300" data-testid="card-step-3">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mx-auto">
                  <img src={strategyIcon} alt="Micro-Estrategias" className="w-12 h-12" />
                </div>
                <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-semibold">{t.howItWorks.step3.title}</h3>
                  <p className="text-muted-foreground">
                    {t.howItWorks.step3.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-16 lg:py-24" data-testid="section-beneficios" data-animate>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold" data-testid="text-beneficios-title">
              {t.benefits.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.benefits.subtitle}
            </p>
          </div>

          <div className="space-y-24">
            {/* Benefit 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                  <Shield className="w-5 h-5" />
                  {t.benefits.benefit1.badge}
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold" data-testid="text-benefit-1-title">
                  {t.benefits.benefit1.title}
                </h3>
                <ul className="space-y-4 text-lg text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                    <span>{t.benefits.benefit1.points[0]}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                    <span>{t.benefits.benefit1.points[1]}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                    <span>{t.benefits.benefit1.points[2]}</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardContent className="space-y-4 p-4">
                    <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                      <Shield className="w-8 h-8 text-primary" />
                      <div>
                        <div className="font-semibold">{t.benefits.benefit1.demo.marketStatus}</div>
                        <div className="text-sm text-muted-foreground">{t.benefits.benefit1.demo.volatilityDetected}</div>
                      </div>
                    </div>
                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <div className="font-semibold text-destructive mb-2">{t.benefits.benefit1.demo.alertTitle}</div>
                      <p className="text-sm">
                        {t.benefits.benefit1.demo.alertMessage}
                      </p>
                    </div>
                    <div className="p-4 bg-background rounded-lg border border-border">
                      <div className="text-sm text-muted-foreground mb-2">{t.benefits.benefit1.demo.recommendation}</div>
                      <p className="font-medium">{t.benefits.benefit1.demo.recommendationText}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive font-medium">
                  <TrendingUp className="w-5 h-5" />
                  {t.benefits.benefit2.badge}
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold" data-testid="text-benefit-2-title">
                  {t.benefits.benefit2.title}
                </h3>
                <ul className="space-y-4 text-lg text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span>{t.benefits.benefit2.points[0]}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span>{t.benefits.benefit2.points[1]}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span>{t.benefits.benefit2.points[2]}</span>
                  </li>
                </ul>
              </div>
              <div className="lg:order-1 relative">
                <Card className="p-8 bg-gradient-to-br from-destructive/5 to-destructive/10">
                  <CardContent className="space-y-4 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">{t.benefits.benefit2.demo.sentimentScore}</h4>
                      <span className="text-2xl font-bold text-primary">+7.2</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{t.benefits.benefit2.demo.financialNews}</span>
                          <span className="text-primary">{t.benefits.benefit2.demo.positive}</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{t.benefits.benefit2.demo.socialMedia}</span>
                          <span className="text-muted-foreground">{t.benefits.benefit2.demo.neutral}</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-muted-foreground" style={{ width: "50%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{t.benefits.benefit2.demo.expertAnalysis}</span>
                          <span className="text-primary">{t.benefits.benefit2.demo.positive}</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                  <Target className="w-5 h-5" />
                  {t.benefits.benefit3.badge}
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold" data-testid="text-benefit-3-title">
                  {t.benefits.benefit3.title}
                </h3>
                <ul className="space-y-4 text-lg text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                    <span>{t.benefits.benefit3.points[0]}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                    <span>{t.benefits.benefit3.points[1]}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                    <span>{t.benefits.benefit3.points[2]}</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-destructive/5">
                  <CardContent className="space-y-4 p-4">
                    <div className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
                      <div>
                        <div className="text-sm text-muted-foreground">{t.benefits.benefit3.demo.financialCushion}</div>
                        <div className="text-2xl font-bold">$4,500</div>
                        <div className="text-xs text-muted-foreground">{t.benefits.benefit3.demo.monthsExpenses}</div>
                      </div>
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="font-semibold text-primary mb-2">{t.benefits.benefit3.demo.opportunityDetected}</div>
                      <p className="text-sm mb-3">
                        {t.benefits.benefit3.demo.opportunityText}
                      </p>
                      <Button size="sm" className="w-full bg-primary text-primary-foreground border border-primary-border">
                        {t.benefits.benefit3.demo.investButton}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-16 lg:py-24 bg-muted/30" data-testid="section-testimonios" data-animate>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold" data-testid="text-testimonios-title">
              {t.testimonials.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.testimonials.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="hover-elevate transition-all duration-300" data-testid="card-testimonial-1">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                    MC
                  </div>
                  <div>
                    <div className="font-semibold">{t.testimonials.testimonial1.name}</div>
                    <div className="text-sm text-muted-foreground">{t.testimonials.testimonial1.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "{t.testimonials.testimonial1.text}"
                </p>
                <div className="flex gap-1 text-destructive">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="hover-elevate transition-all duration-300" data-testid="card-testimonial-2">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center text-destructive font-bold text-lg">
                    JR
                  </div>
                  <div>
                    <div className="font-semibold">{t.testimonials.testimonial2.name}</div>
                    <div className="text-sm text-muted-foreground">{t.testimonials.testimonial2.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "{t.testimonials.testimonial2.text}"
                </p>
                <div className="flex gap-1 text-destructive">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="hover-elevate transition-all duration-300" data-testid="card-testimonial-3">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                    AS
                  </div>
                  <div>
                    <div className="font-semibold">{t.testimonials.testimonial3.name}</div>
                    <div className="text-sm text-muted-foreground">{t.testimonials.testimonial3.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "{t.testimonials.testimonial3.text}"
                </p>
                <div className="flex gap-1 text-destructive">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-12 sm:py-16 lg:py-24" data-testid="section-contacto" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Contact Form */}
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold" data-testid="text-contacto-title">
                  {t.contact.title}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  {t.contact.subtitle}
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleContactSubmit)} className="space-y-3 sm:space-y-4" data-testid="form-contact">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">{t.contact.form.nameLabel}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.contact.form.namePlaceholder}
                            {...field}
                            data-testid="input-contact-name"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">{t.contact.form.emailLabel}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t.contact.form.emailPlaceholder}
                            {...field}
                            data-testid="input-contact-email"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">{t.contact.form.messageLabel}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t.contact.form.messagePlaceholder}
                            rows={4}
                            {...field}
                            data-testid="input-contact-message"
                            className="resize-none w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive-border text-sm sm:text-base py-3 sm:py-4"
                    disabled={contactMutation.isPending}
                    data-testid="button-contact-submit"
                  >
                    {contactMutation.isPending ? t.contact.form.submittingButton : t.contact.form.submitButton}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Right: Contact Info */}
            <div className="space-y-6 sm:space-y-8 mt-8 lg:mt-0">
              <Card className="p-4 sm:p-6 lg:p-8">
                <CardContent className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{t.contact.info.title}</h3>
                  
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold mb-1 text-sm sm:text-base">{t.contact.info.email}</div>
                      <a href="mailto:contacto@fincoach.com" className="text-muted-foreground hover:text-primary text-xs sm:text-sm break-all">
                        contacto@fincoach.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold mb-1 text-sm sm:text-base">{t.contact.info.phone}</div>
                      <a href="tel:+528112345678" className="text-muted-foreground hover:text-destructive text-xs sm:text-sm">
                        +52 81 1234 5678
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold mb-1 text-sm sm:text-base">{t.contact.info.location}</div>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Monterrey, Nuevo León<br />
                        México
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 sm:p-6 lg:p-8 bg-primary from-primary to-destructive rounded-2xl text-white">
                <h4 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{t.contact.info.hours}</h4>
                <p className="opacity-90 text-sm sm:text-base">
                  {t.contact.info.hoursText.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < t.contact.info.hoursText.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gray from-primary via-primary to-destructive" data-testid="section-cta-final" data-animate>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white" data-testid="text-cta-final-title">
            {t.finalCta.title.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < t.finalCta.title.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
            {t.finalCta.subtitle}
          </p>
          <Button
            size="lg"
            className="bg-white text-gray hover:bg-white/90 text-sm sm:text-base lg:text-lg px-8 sm:px-12 py-4 sm:py-6 shadow-2xl border border-gray-200 w-full sm:w-auto"
            onClick={openModal}
            data-testid="button-cta-final"
          >
            {t.finalCta.button}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 lg:py-16" data-testid="section-footer">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-destructive" />
                <span className="text-xl sm:text-2xl font-bold">FinCoach</span>
              </div>
              <p className="text-white/80 text-sm">
                {t.footer.description}
              </p>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.product.title}</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <button onClick={() => scrollToSection("como-funciona")} className="hover:text-white transition-colors">
                    {t.footer.product.features}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("beneficios")} className="hover:text-white transition-colors">
                    {t.footer.product.benefits}
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">{t.footer.product.pricing}</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">{t.footer.product.faq}</a>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.company.title}</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="hover:text-white transition-colors">{t.footer.company.about}</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">{t.footer.company.blog}</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">{t.footer.company.press}</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">{t.footer.company.careers}</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal.title}</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="hover:text-white transition-colors">{t.footer.legal.privacy}</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">{t.footer.legal.terms}</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">{t.footer.legal.security}</a>
                </li>
                <li>
                  <button onClick={() => scrollToSection("contacto")} className="hover:text-white transition-colors">
                    {t.footer.legal.contact}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-white/70">
                {t.footer.copyright}
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  {t.footer.social.twitter}
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  {t.footer.social.linkedin}
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  {t.footer.social.facebook}
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  {t.footer.social.instagram}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <AuthModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
