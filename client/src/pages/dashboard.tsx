import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Mail, Calendar, TrendingUp, TrendingDown, DollarSign, PieChart, LineChart, ArrowDownCircle, Send, CreditCard, ArrowUpCircle, Shield, AlertTriangle, Lightbulb } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { FloatingChat } from "@/components/FloatingChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNewsSentiment } from "@/hooks/use-news-sentiment";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { sentimentData, isLoading: newsLoading, error: newsError } = useNewsSentiment();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
    }
  };

  // Datos de ejemplo para las gráficas
  const portfolioData = [
    { name: 'Ene', value: 10000 },
    { name: 'Feb', value: 12000 },
    { name: 'Mar', value: 11000 },
    { name: 'Abr', value: 13500 },
    { name: 'May', value: 15000 },
    { name: 'Jun', value: 14500 },
  ];

  const assetDistribution = [
    { name: 'Acciones', value: 45, color: '#3b82f6' },
    { name: 'Bonos', value: 30, color: '#ef4444' },
    { name: 'ETF', value: 15, color: '#10b981' },
    { name: 'Otros', value: 10, color: '#f59e0b' },
  ];

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

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: User Info */}
            <Card className="hover-elevate transition-all duration-300 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Información de tu cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col justify-center h-full">
                { /* Avatar */}
                <div className="flex items-center justify-center">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.photoURL || ''} className="w-20 h-20" />
                    <AvatarFallback className="w-20 h-20 text-2xl">{user.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Nombre</p>
                      <p className="text-sm text-muted-foreground">{user.displayName}</p>
                    </div>
                </div>

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
              </CardContent>
            </Card>

            {/* Card 2: Transactions */}
            <Card className="hover-elevate transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Button className="w-5 h-5 text-primary" variant="ghost" size="icon">
                    <DollarSign />
                  </Button>
                  Transacciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
                    <ArrowDownCircle className="w-8 h-8 text-green-600" />
                    <span className="text-md">Depositar</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
                    <Send className="w-8 h-8 text-blue-600" />
                    <span className="text-md">Transferir</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
                    <CreditCard className="w-8 h-8 text-purple-600" />
                    <span className="text-md">Pagar</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
                    <ArrowUpCircle className="w-8 h-8 text-orange-600" />
                    <span className="text-md">Retirar</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <span className="text-md">Invertir</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
                    <TrendingDown className="w-8 h-8 text-destructive" />
                    <span className="text-md">Vender</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Market Sentiment */}
            <Card className="hover-elevate transition-all duration-300 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-destructive" />
                  Sentimiento del Mercado
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col h-full">
                  <div>
                    <p className="text-3xl font-bold text-destructive">
                      {sentimentData.length > 0 
                        ? Math.round(sentimentData.reduce((sum, d) => sum + d.value, 0) / sentimentData.length * 100)
                        : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Impacto promedio de noticias</p>
                  </div>
                  <div className="h-[250px] pb-6 relative">
                    {newsLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="h-8 w-8 animate-spin mx-auto mb-2 rounded-full border-4 border-muted-foreground border-t-transparent"></div>
                          <p className="text-sm text-muted-foreground">Analizando noticias...</p>
                        </div>
                      </div>
                    ) : newsError ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-destructive">{newsError}</p>
                      </div>
                    ) : sentimentData.length > 0 ? (
                      <>
                        <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="xMidYMid meet">
                          {/* Y-axis labels (0-1 scale) */}
                          {[1, 0.8, 0.6, 0.4, 0.2, 0].map((value, i) => (
                            <text
                              key={i}
                              x="5"
                              y={20 + i * 20}
                              className="fill-muted-foreground"
                              fontSize="8"
                            >
                              {value}
                            </text>
                          ))}
                          {/* Grid lines */}
                          {[...Array(6)].map((_, i) => (
                            <line
                              key={`grid-${i}`}
                              x1="20"
                              y1={20 + i * 20}
                              x2="300"
                              y2={20 + i * 20}
                              stroke="#e5e7eb"
                              strokeWidth="0.5"
                            />
                          ))}
                          {/* Line path - valores de 0 a 1 (impacto) */}
                          <polyline
                            points={sentimentData.map((item, index) => {
                              const y = 119 - (item.value * 80);
                              const x = 40 + (index * 34);
                              return `${x},${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Dots on line */}
                          {sentimentData.map((item, index) => {
                            const y = 119 - (item.value * 80);
                            const x = 40 + (index * 34);
                            return (
                              <g key={index}>
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  fill="#ef4444"
                                  stroke="white"
                                  strokeWidth="2"
                                />
                                <title>{item.news}</title>
                              </g>
                            );
                          })}
                        </svg>
                        {/* X-axis labels - horas */}
                        <div className="absolute bottom-0 left-10 right-0 flex justify-between px-4">
                          {sentimentData.map((item, index) => (
                            <p key={index} className="text-xs text-muted-foreground">{item.time}</p>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: IA Recommendations */}
            <Card className="hover-elevate transition-all duration-300 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Recomendaciones IA
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
              {/* Financial Cushion Card */}
              <Card className="hover-elevate transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-blue-700" />
                        <h3 className="font-semibold text-blue-900">Colchón Financiero</h3>
                      </div>
                      <p className="text-4xl font-bold text-blue-700 mb-1">$4,500</p>
                      <p className="text-sm text-blue-600">3.2 meses de gastos</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-16 h-16 bg-blue-700/10 rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-blue-700" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Opportunity Card */}
              <Card className="hover-elevate transition-all duration-300 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Oportunidad Detectada</h3>
                      <p className="text-sm text-gray-700">
                        Acción XYZ subvaluada en -12%. Tienes liquidez suficiente para una micro-compra.
                      </p>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Invertir $50 ahora
                  </Button>
                </CardContent>
              </Card>
              
              </CardContent>
            </Card>

            {/* Card 5: Portfolio Value */}
            <Card className="hover-elevate transition-all duration-300 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Valor del Portafolio
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4 flex flex-col justify-center h-full">
                  <div>
                    <p className="text-3xl font-bold text-primary">$14,500</p>
                    <p className="text-sm text-muted-foreground">+12.5% vs mes anterior</p>
                  </div>
                  <div className="h-[250px] flex items-end gap-2">
                    {portfolioData.map((item, index) => {
                      const maxValue = Math.max(...portfolioData.map(d => d.value));
                      const minValue = Math.min(...portfolioData.map(d => d.value));
                      const range = maxValue - minValue;
                      const height = range > 0 ? ((item.value - minValue) / range) * 100 : 50;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <div 
                            className="w-full bg-gradient-to-t from-primary to-primary/70 rounded-t transition-all hover:opacity-80"
                            style={{ height: `${Math.max(height, 10)}%` }}
                          ></div>
                          <p className="text-xs text-muted-foreground">{item.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 6: Asset Distribution */}
            <Card className="hover-elevate transition-all duration-300 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Distribución de Activos
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 relative">
                {/* Pie Chart */}
                <div className="flex items-center justify-center h-full">
                  <svg className="w-full max-w-[280px] h-auto transform" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
                    {(() => {
                      let currentAngle = 0;
                      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];
                      return assetDistribution.map((asset, index) => {
                        const percentage = asset.value;
                        const angle = (percentage / 100) * 360;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + angle;
                        
                        // Calculate path for pie slice
                        const startAngleRad = (startAngle * Math.PI) / 180;
                        const endAngleRad = (endAngle * Math.PI) / 180;
                        
                        const centerX = 150;
                        const centerY = 150;
                        const radius = 135;
                        
                        const x1 = centerX + radius * Math.cos(startAngleRad);
                        const y1 = centerY + radius * Math.sin(startAngleRad);
                        const x2 = centerX + radius * Math.cos(endAngleRad);
                        const y2 = centerY + radius * Math.sin(endAngleRad);
                        
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        
                        const pathData = [
                          `M ${centerX} ${centerY}`,
                          `L ${x1} ${y1}`,
                          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          'Z'
                        ].join(' ');
                        
                        const midAngle = (startAngle + angle / 2) * (Math.PI / 180);
                        const labelRadius = radius * 0.6;
                        const labelX = centerX + labelRadius * Math.cos(midAngle);
                        const labelY = centerY + labelRadius * Math.sin(midAngle);
                        
                        currentAngle = endAngle;
                        
                        return (
                          <g key={index}>
                            <path
                              d={pathData}
                              fill={colors[index]}
                              stroke="white"
                              strokeWidth="4"
                            />
                            <text
                              x={labelX}
                              y={labelY}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-white font-bold"
                              style={{ fontSize: '14px' }}
                            >
                              {percentage}%
                            </text>
                          </g>
                        );
                      });
                    })()}
                  </svg>
                </div>
                
                {/* Labels */}
                <div className="absolute top-2 right-2 md:right-8 space-y-1 md:space-y-2">
                  {assetDistribution.map((asset, index) => (
                    <div key={index} className="flex items-center justify-start gap-1.5 md:gap-2">
                      <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0 ${
                        asset.color === '#3b82f6' ? 'bg-blue-500' :
                        asset.color === '#ef4444' ? 'bg-red-500' :
                        asset.color === '#10b981' ? 'bg-green-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <p className="text-[8px] md:text-xs font-medium whitespace-nowrap">{asset.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

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
        </div>
      </main>
      
      {/* Floating Chat */}
      <FloatingChat />
    </div>
  );
}
