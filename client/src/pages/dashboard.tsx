import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Mail, Calendar, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-destructive" />
              <span className="text-xl lg:text-2xl font-bold font-heading">
                FinCoach
              </span>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold">
              ¡Bienvenido a FinCoach!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tu asistente inteligente para inversiones está listo para ayudarte a tomar decisiones financieras informadas.
            </p>
          </div>

          {/* User Info Card */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Información de tu cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Miembro desde</p>
                  <p className="text-sm text-muted-foreground">
                    {user.metadata.creationTime ? 
                      new Date(user.metadata.creationTime).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 
                      'Fecha no disponible'
                    }
                  </p>
                </div>
              </div>

              {user.displayName && (
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Nombre</p>
                    <p className="text-sm text-muted-foreground">{user.displayName}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Análisis de Mercado</h3>
                <p className="text-sm text-muted-foreground">
                  Monitorea el estado del mercado en tiempo real y recibe alertas inteligentes.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="font-semibold">Estrategias Personalizadas</h3>
                <p className="text-sm text-muted-foreground">
                  Recibe recomendaciones de inversión adaptadas a tu perfil de riesgo.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Protección Anti-Pánico</h3>
                <p className="text-sm text-muted-foreground">
                  Evita decisiones impulsivas con alertas inteligentes durante la volatilidad.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 text-center space-y-4">
              <h3 className="text-xl font-semibold">🚀 Próximamente</h3>
              <p className="text-muted-foreground">
                Estamos trabajando en nuevas funcionalidades para mejorar tu experiencia de inversión. 
                ¡Mantente atento a las actualizaciones!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
