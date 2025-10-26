import { useState, useEffect } from 'react';

export interface ResilienceScoreData {
  score: number;
  status: 'excelente' | 'bueno' | 'regular' | 'bajo';
  message: string;
}

export function useResilienceScore(userData: any) {
  const [data, setData] = useState<ResilienceScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateScore = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // For now, calculate a mock score based on user data
        // In production, this would call the Python model API
        const mockScore = 75 + Math.floor(Math.random() * 20); // Score between 75-95
        let status: 'excelente' | 'bueno' | 'regular' | 'bajo';
        let message: string;

        if (mockScore >= 90) {
          status = 'excelente';
          message = 'Tu situación financiera es excelente. Tienes un colchón sólido.';
        } else if (mockScore >= 75) {
          status = 'bueno';
          message = 'Tu situación financiera es buena. Mantén el ritmo de ahorro.';
        } else if (mockScore >= 50) {
          status = 'regular';
          message = 'Tu situación financiera es regular. Considera aumentar tus ahorros.';
        } else {
          status = 'bajo';
          message = 'Tu situación financiera requiere atención. Reduce gastos y aumenta ahorros.';
        }

        setData({
          score: mockScore,
          status,
          message,
        });
      } catch (err: any) {
        console.error('Error calculating resilience score:', err);
        setError(err.message || 'Error al calcular el score de resiliencia');
      } finally {
        setIsLoading(false);
      }
    };

    if (userData) {
      calculateScore();
    }
  }, [userData]);

  return {
    data,
    isLoading,
    error,
  };
}
