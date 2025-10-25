import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/lib/language-context";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const goHome = () => {
    setLocation('/');
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <button
              onClick={goHome}
              className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1"
            >
              <TrendingUp className="w-8 h-8 text-destructive" />
              <span className="text-xl lg:text-2xl font-bold font-heading">
                FinCoach
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-16">
        <div className="text-center space-y-8">
          {/* 404 Icon and Title */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                404
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-muted-foreground">
                Página no encontrada
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Lo sentimos, la página que buscas no existe o ha sido movida. 
                Pero no te preocupes, podemos ayudarte a encontrar lo que necesitas.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={goHome}
              size="lg"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-8 py-6 text-lg border border-destructive-border"
            >
              <Home className="w-5 h-5 mr-2" />
              Ir al Inicio
            </Button>
            
            <Button
              onClick={goBack}
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver Atrás
            </Button>
          </div>

          {/* Help Section */}
          <Card className="max-w-2xl mx-auto mt-12">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-xl font-semibold">¿Necesitas ayuda?</h3>
              <p className="text-muted-foreground">
                Si crees que esto es un error o necesitas asistencia, 
                no dudes en contactarnos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setLocation('/');
                    setTimeout(() => {
                      const contactSection = document.getElementById('contacto');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                >
                  Contactar Soporte
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLocation('/');
                    setTimeout(() => {
                      const featuresSection = document.getElementById('como-funciona');
                      if (featuresSection) {
                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                >
                  Ver Características
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Popular Links */}
          <div className="max-w-3xl mx-auto mt-12">
            <h3 className="text-xl font-semibold mb-6">Enlaces populares</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => {
                  setLocation('/');
                  setTimeout(() => {
                    const heroSection = document.getElementById('inicio');
                    if (heroSection) {
                      heroSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
              >
                <TrendingUp className="w-6 h-6 text-primary" />
                <span className="font-medium">Inicio</span>
                <span className="text-xs text-muted-foreground">Conoce FinCoach</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => {
                  setLocation('/');
                  setTimeout(() => {
                    const featuresSection = document.getElementById('como-funciona');
                    if (featuresSection) {
                      featuresSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
              >
                <TrendingUp className="w-6 h-6 text-destructive" />
                <span className="font-medium">Cómo Funciona</span>
                <span className="text-xs text-muted-foreground">Nuestro proceso</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => {
                  setLocation('/');
                  setTimeout(() => {
                    const benefitsSection = document.getElementById('beneficios');
                    if (benefitsSection) {
                      benefitsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
              >
                <TrendingUp className="w-6 h-6 text-primary" />
                <span className="font-medium">Beneficios</span>
                <span className="text-xs text-muted-foreground">Lo que obtienes</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
