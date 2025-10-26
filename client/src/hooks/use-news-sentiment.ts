import { useState, useEffect } from 'react';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface SentimentData {
  time: string;
  value: number;
  news: string;
}

const NEWS_API_URL = 'https://gnews.io/api/v4/search';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

export function useNewsSentiment() {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar datos inicialmente
    fetchNewsAndAnalyze();
    
    // Recargar automáticamente cada 3 horas (10800000 ms)
    const interval = setInterval(() => {
      fetchNewsAndAnalyze();
    }, 3 * 60 * 60 * 1000); // 3 horas
    
    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, []);

  const fetchNewsAndAnalyze = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Obtener noticias de la API
      const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
      if (!newsApiKey) {
        throw new Error('API key de noticias no configurada');
      }

      const newsResponse = await fetch(
        `${NEWS_API_URL}?q=finance&lang=es&max=10&apikey=${newsApiKey}`
      );

      if (!newsResponse.ok) {
        throw new Error('Error al obtener noticias');
      }

      const newsData = await newsResponse.json();
      const articles: NewsArticle[] = newsData.articles || [];

      if (articles.length === 0) {
        throw new Error('No se encontraron noticias');
      }

      // 2. Analizar el sentimiento de cada noticia con Gemini
      const analyzedData = await analyzeNewsSentiment(articles);

      // 3. Formatear para la gráfica (8 horas distribuidas en el día)
      const formattedData = formatDataForGraph(analyzedData);

      setSentimentData(formattedData);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Error al obtener noticias');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeNewsSentiment = async (articles: NewsArticle[]): Promise<Array<{ news: string; impact: number }>> => {
    console.log('🔍 Analyzing', articles.length, 'news articles with simulated values');
    
    // Simular valores de impacto basados en palabras clave en los títulos
    const simulateImpact = (title: string, description: string): number => {
      const text = (title + ' ' + description).toLowerCase();
      
      // Palabras clave muy negativas → alto impacto
      const veryNegativeKeywords = ['crisis', 'caída', 'pérdida', 'fraude', 'escalación', 'pánico', 'colapso', 'bancarrota'];
      if (veryNegativeKeywords.some(keyword => text.includes(keyword))) {
        return Math.random() * 0.3 + 0.7; // 0.7-1.0
      }
      
      // Palabras clave negativas → impacto alto
      const negativeKeywords = ['recesión', 'baja', 'caída', 'problema', 'riesgo', 'volatilidad', 'deuda'];
      if (negativeKeywords.some(keyword => text.includes(keyword))) {
        return Math.random() * 0.2 + 0.5; // 0.5-0.7
      }
      
      // Palabras clave positivas → bajo impacto
      const positiveKeywords = ['crecimiento', 'ganancia', 'éxito', 'mejora', 'aumento', 'premio', 'nominada', 'superan'];
      if (positiveKeywords.some(keyword => text.includes(keyword))) {
        return Math.random() * 0.2; // 0.0-0.2
      }
      
      // Neutral → impacto moderado-bajo
      return Math.random() * 0.3 + 0.2; // 0.2-0.5
    };
    
    const result = articles.map((article) => ({
      news: article.title.substring(0, 60),
      impact: Math.max(0, Math.min(1, simulateImpact(article.title, article.description)))
    }));
    
    console.log('✅ Final analyzed data:', result);
    return result;
  };

  const formatDataForGraph = (analyzedData: Array<{ news: string; impact: number }>): SentimentData[] => {
    // Distribute news across 8 time slots (every 3 hours)
    const times = ['3h', '6h', '9h', '12h', '15h', '18h', '21h', '24h'];
    
    // Take first 8 news items (if we have more)
    const selectedData = analyzedData.slice(0, 8);
    
    // Fill remaining slots with default values if we have fewer than 8
    while (selectedData.length < 8) {
      selectedData.push({ news: 'Sin noticias disponibles', impact: 0.1 });
    }

    return selectedData.map((item, index) => ({
      time: times[index],
      value: item.impact,
      news: item.news
    }));
  };

  return { sentimentData, isLoading, error };
}

