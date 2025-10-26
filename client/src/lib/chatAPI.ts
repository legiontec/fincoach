interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

class ChatAPI {
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

  async sendMessage(
    content: string,
    apiKey: string,
    previousMessages: any[] = []
  ): Promise<string> {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Sanitize input
    const sanitizedContent = this.sanitizeInput(content);
    
    // Build context from previous messages (limit to last 6 for context)
    const recentMessages = previousMessages.slice(-6);
    let conversationHistory = '';
    if (recentMessages.length > 0) {
      conversationHistory = recentMessages
        .map(msg => `${msg.role === 'user' ? 'Usuario' : 'FinCoach'}: ${msg.content}`)
        .join('\n') + '\n\n';
    }

    // Create the prompt with system instructions and user query
    const systemInstructions = `Eres FinCoach, un asistente financiero experto especializado en inversiones, Capital One y análisis de mercados. Tu objetivo es ayudar a los usuarios a tomar decisiones financieras informadas y educadas.

INSTRUCCIONES IMPORTANTES:
- Sé muy conciso y directo, máximo 1 párrafo corto
- NO uses formato markdown en tus respuestas
- Evita usar listas con guiones o numeración
- Mantén tus respuestas breves para que quepan bien en la interfaz móvil
- Siempre incluye información práctica y accionable
- Organiza consejos de forma clara y concisa
- Sugiere estrategias específicas de inversión y gestión de riesgo
- Menciona consideraciones de mercado, volatilidad y diversificación
- Incluye información sobre productos de Capital One cuando sea relevante
- Proporciona consejos prácticos sobre ahorro, presupuesto y planificación financiera
- Siempre recuerda que las inversiones conllevan riesgo y no son garantía de ganancias
- Recomienda consultar con un asesor financiero para decisiones importantes`;

    const conversationContext = `CONTEXTO DE LA CONVERSACIÓN:
${conversationHistory}

CONSULTA ACTUAL: ${sanitizedContent}

Responde como FinCoach, un experto financiero profesional que quiere brindar la mejor orientación financiera posible al usuario.`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemInstructions + "\n\n" + conversationContext
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
            candidateCount: 1,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Error desconocido';
        
        try {
          const errorData = await response.json();
          console.error('API Error Response:', errorData);
          
          if (response.status === 400) {
            if (errorData.error?.message?.includes('API_KEY_INVALID')) {
              errorMessage = 'API key inválida. Verifica que sea correcta y esté habilitada para Gemini API.';
            } else if (errorData.error?.message?.includes('PERMISSION_DENIED')) {
              errorMessage = 'Permisos denegados. Verifica que tu API key tenga acceso a Gemini API.';
            } else {
              errorMessage = `Error de solicitud: ${errorData.error?.message || 'Solicitud malformada'}`;
            }
          } else if (response.status === 401) {
            errorMessage = 'API key no autorizada. Verifica que sea válida y esté activa.';
          } else if (response.status === 403) {
            errorMessage = 'Acceso prohibido. Tu API key no tiene permisos para usar Gemini API.';
          } else if (response.status === 429) {
            errorMessage = 'Límite de solicitudes excedido. Espera unos minutos antes de intentar de nuevo.';
          } else if (response.status === 500) {
            errorMessage = 'Error interno del servidor de Google. Inténtalo de nuevo en unos momentos.';
          } else {
            errorMessage = `Error HTTP ${response.status}: ${errorData.error?.message || 'Error del servidor'}`;
          }
        } catch (parseError) {
          errorMessage = `Error HTTP ${response.status}. No se pudo obtener más información del error.`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Validate response structure
      if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
        throw new Error('La API no devolvió candidatos de respuesta. Inténtalo de nuevo.');
      }

      const candidate = data.candidates[0];
      
      // Check if the response was blocked by safety filters
      if (candidate.finishReason === 'SAFETY') {
        throw new Error('La respuesta fue bloqueada por filtros de seguridad. Intenta reformular tu pregunta.');
      }
      
      // Adaptación para la estructura de respuesta de Gemini 2.5
      let assistantResponse = '';
      
      if (candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts)) {
        // Estructura estándar
        if (candidate.content.parts.length > 0) {
          if (candidate.content.parts[0].text) {
            assistantResponse = candidate.content.parts[0].text;
          } else if (typeof candidate.content.parts[0] === 'string') {
            assistantResponse = candidate.content.parts[0];
          }
        }
      } else if (candidate.text) {
        // Estructura alternativa
        assistantResponse = candidate.text;
      } else if (typeof candidate === 'string') {
        // Respuesta directa como string
        assistantResponse = candidate;
      }
      
      if (!assistantResponse) {
        console.error('Estructura de respuesta desconocida:', candidate);
        throw new Error('No se pudo extraer la respuesta del asistente. Inténtalo de nuevo.');
      }
      return this.sanitizeOutput(assistantResponse);

    } catch (error: any) {
      console.error('Chat API Error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.');
      }
      
      // Handle timeout errors
      if (error.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado. Inténtalo de nuevo.');
      }
      
      // Re-throw our custom errors
      if (error.message.includes('API key') || error.message.includes('Error HTTP') || error.message.includes('filtros de seguridad')) {
        throw error;
      }
      
      // Generic error fallback
      throw new Error(`Error inesperado: ${error.message || 'Algo salió mal. Inténtalo de nuevo.'}`);
    }
  }

  private sanitizeInput(input: string): string {
    // Remove potential harmful content and limit length
    return input
      .trim()
      .slice(0, 4000)
      .replace(/[<>]/g, '') // Remove potential HTML/XML tags
      .replace(/javascript:/gi, '') // Remove potential JS injection
      .replace(/data:/gi, '') // Remove data URLs
      .replace(/vbscript:/gi, ''); // Remove VBScript
  }

  private sanitizeOutput(output: string): string {
    // Basic sanitization for output while preserving formatting
    return output
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  // Method to validate API key format (Google AI API keys start with AIza)
  isValidApiKey(apiKey: string): boolean {
    return Boolean(apiKey && apiKey.length > 30 && apiKey.startsWith('AIza'));
  }

  // Method to test API key validity
  async testApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Hola, ¿funciona la API?"
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 10,
          }
        }),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const chatAPI = new ChatAPI();
