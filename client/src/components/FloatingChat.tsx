import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Trash2 } from 'lucide-react';
import { useChatContext } from '../contexts/ChatContext';
import { useLanguage } from '../lib/language-context';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Usar el hook personalizado que maneja correctamente el contexto
  const { state, dispatch, sendMessage } = useChatContext();
  const { t } = useLanguage();
  
  // Función personalizada para enviar mensaje con control de typing
  const handleSendMessage = async (message: string) => {
    setIsTyping(true);
    
    try {
      await sendMessage(message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const messageToSend = input.trim();
    setInput('');
    
    await handleSendMessage(messageToSend);
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
    localStorage.removeItem('fincoach-chat-history');
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-background border border-border rounded-lg shadow-2xl z-40 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                FinCoach AI
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {state.messages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm mt-8">
                <div className="mb-2">💬</div>
                <p className="font-medium">¡Hola! Soy tu asistente financiero</p>
                <p className="text-xs mt-1">
                  Pregúntame sobre Capital One, inversiones o el mercado financiero
                </p>
              </div>
            ) : (
              state.messages.slice(-10).map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            
            {isTyping && <TypingIndicator />}
            
            {state.error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive text-sm">{state.error}</p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-border">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-background text-foreground"
                disabled={state.isLoading}
                maxLength={200}
              />
              
              {state.messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearChat}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Limpiar chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              <button
                type="submit"
                disabled={!input.trim() || state.isLoading}
                className="p-2 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground disabled:text-muted-foreground rounded-lg transition-colors disabled:cursor-not-allowed"
                aria-label="Enviar"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center"
        aria-label="Abrir chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </>
  );
};
