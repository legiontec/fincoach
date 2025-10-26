import { useState, useEffect } from 'react';

export interface AIRecommendation {
  type: 'opportunity' | 'alert' | 'cushion';
  title: string;
  message: string;
  action?: string;
  actionLabel?: string;
}

export function useAIRecommendations(
  resilienceScore: number | null,
  marketSentiment: number | null
) {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateRecommendation = async () => {
      if (resilienceScore === null || marketSentiment === null) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Try multiple possible environment variable names
        const apiKey = 
          import.meta.env.VITE_MODEL_GEMINI_API_KEY || 
          import.meta.env.MODEL_GEMINI_API_KEY ||
          import.meta.env.VITE_GEMINI_API_KEY;
        
        
        if (!apiKey) {
          throw new Error('API key de Gemini no configurada. Variable: VITE_MODEL_GEMINI_API_KEY');
        }

        // Determine recommendation type based on score and sentiment
        const hasStableFinances = resilienceScore >= 70;
        const hasMarketStress = marketSentiment < 0.5;

        let recommendationType: 'opportunity' | 'alert' | 'cushion';
        let prompt: string;

         if (hasMarketStress && hasStableFinances) {
           // Show anti-panic alert
           recommendationType = 'alert';
           prompt = `Usuario: Finanzas estables (${resilienceScore}/100), mercado con pánico (${(marketSentiment * 100).toFixed(0)}%). Genera mensaje anti-pánico en un párrafo corto sin formato markdown.`;
         } else if (hasStableFinances && !hasMarketStress) {
           // Show investment opportunity
           recommendationType = 'opportunity';
           prompt = `Usuario: Finanzas estables (${resilienceScore}/100), mercado favorable (${(marketSentiment * 100).toFixed(0)}%). Genera mensaje de oportunidad de inversión en un párrafo corto sin formato markdown.`;
         } else {
           // Show financial cushion info
           recommendationType = 'cushion';
           prompt = `Usuario: Score ${resilienceScore}/100, mercado ${(marketSentiment * 100).toFixed(0)}%. Genera consejos para mejorar colchón financiero en un párrafo corto sin formato markdown.`;
         }

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Error HTTP ${response.status}`);
        }

        const data = await response.json();
        
        // Validate response structure
        if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
          console.error('Invalid API response structure:', data);
          throw new Error('La API no devolvió candidatos de respuesta válidos');
        }

        const candidate = data.candidates[0];
        
        // Check if response was blocked
        if (candidate.finishReason === 'SAFETY') {
          throw new Error('La respuesta fue bloqueada por filtros de seguridad');
        }

        // Extract text safely - try multiple extraction methods
        let generatedMessage = '';
        
        // If response was truncated (MAX_TOKENS) or content is empty, use fallback
        if (candidate.finishReason === 'MAX_TOKENS' || !candidate.content || Object.keys(candidate.content).length <= 1) {
          // Will generate fallback message below
        } else {
          // Method 1: Standard structure with parts array
          if (candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts)) {
            if (candidate.content.parts.length > 0 && candidate.content.parts[0].text) {
              generatedMessage = candidate.content.parts[0].text.trim();
            } else if (candidate.content.parts.length > 0 && typeof candidate.content.parts[0] === 'string') {
              generatedMessage = candidate.content.parts[0].trim();
            }
          }
          
          // Method 2: Try direct text property
          if (!generatedMessage && candidate.content?.text) {
            generatedMessage = candidate.content.text.trim();
          }
          
          // Method 3: Try candidate.text directly
          if (!generatedMessage && candidate.text) {
            generatedMessage = candidate.text.trim();
          }
        }
        
        // If message is empty, generate fallback message
        if (!generatedMessage) {
          // Generate fallback based on recommendation type
          if (recommendationType === 'alert') {
            generatedMessage = `Tu situación financiera es sólida (score: ${resilienceScore}/100) y el mercado actual muestra volatilidad. Mantén la calma y evita decisiones emocionales de venta. Tu colchón financiero te permite navegar esta volatilidad sin apuro.`;
          } else if (recommendationType === 'opportunity') {
            generatedMessage = `Tienes finanzas estables (score: ${resilienceScore}/100) y el mercado es favorable. Considera realizar una micro-inversión estratégica de $50-100 para aprovechar las condiciones actuales.`;
          } else {
            generatedMessage = `Tu colchón financiero requiere fortalecerse. Score actual: ${resilienceScore}/100. Considera aumentar tus ahorros mensuales y reducir gastos no esenciales.`;
          }
        }

        const titles = {
          alert: 'Alerta Anti-Pánico',
          opportunity: 'Oportunidad Detectada',
          cushion: 'Colchón Financiero',
        };

        const actions = {
          alert: undefined,
          opportunity: 'Invertir $50 ahora',
          cushion: undefined,
        };

        setRecommendation({
          type: recommendationType,
          title: titles[recommendationType],
          message: generatedMessage,
          action: actions[recommendationType],
          actionLabel: recommendationType === 'opportunity' ? 'Invertir $50 ahora' : undefined,
        });
      } catch (err: any) {
        console.error('Error generating AI recommendation:', err);
        setError(err.message || 'Error al generar recomendación');
        
        // Fallback recommendation
        const fallbackRecommendation: AIRecommendation = {
          type: resilienceScore >= 70 ? 'opportunity' : 'cushion',
          title: 'Recomendación FinCoach',
          message: 'Tu situación financiera requiere atención especializada. Contacta con un asesor financiero para obtener una evaluación personalizada.',
        };
        setRecommendation(fallbackRecommendation);
      } finally {
        setIsLoading(false);
      }
    };

    generateRecommendation();
  }, [resilienceScore, marketSentiment]);

  return {
    recommendation,
    isLoading,
    error,
  };
}
