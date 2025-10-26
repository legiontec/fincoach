import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { chatAPI } from '../lib/chatAPI';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CHAT' }
  | { type: 'LOAD_MESSAGES'; payload: ChatMessage[] };

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [],
        error: null,
      };
    case 'LOAD_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };
    default:
      return state;
  }
}

interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (message: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export { ChatContext };

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Obtener API key del .env
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      dispatch({ type: 'SET_ERROR', payload: 'API key de Gemini no configurada. Contacta al administrador.' });
      return;
    }

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

    // Guardar en localStorage
    const updatedMessages = [...state.messages, userMessage];
    localStorage.setItem('fincoach-chat-history', JSON.stringify(updatedMessages));

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    // Agregar un delay mínimo para que se vea la animación
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Convertir mensajes para la API
      const apiMessages = updatedMessages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      // Llamar a la API de Gemini
      const response = await chatAPI.sendMessage(message, apiKey, apiMessages);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
      
      // Actualizar localStorage
      const finalMessages = [...updatedMessages, assistantMessage];
      localStorage.setItem('fincoach-chat-history', JSON.stringify(finalMessages));
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error al enviar mensaje. Inténtalo de nuevo.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Cargar mensajes del localStorage al inicializar
  React.useEffect(() => {
    const savedMessages = localStorage.getItem('fincoach-chat-history');
    if (savedMessages) {
      try {
        const messages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        dispatch({ type: 'LOAD_MESSAGES', payload: messages });
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  return (
    <ChatContext.Provider value={{ state, dispatch, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}

