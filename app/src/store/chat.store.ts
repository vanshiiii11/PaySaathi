import { create } from 'zustand';
import { Message } from '../types';

interface ChatState {
  messages: Record<string, Message[]>;
  typing: Record<string, boolean>;
  addMessage: (threadId: string, message: Message) => void;
  setMessages: (threadId: string, messages: Message[]) => void;
  setTyping: (threadId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: {},
  typing: {},
  addMessage: (threadId, message) =>
    set((state) => {
      const threadMessages = state.messages[threadId] || [];
      return {
        messages: {
          ...state.messages,
          [threadId]: [message, ...threadMessages],
        },
      };
    }),
  setMessages: (threadId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [threadId]: messages },
    })),
  setTyping: (threadId, isTyping) =>
    set((state) => ({
      typing: { ...state.typing, [threadId]: isTyping },
    })),
}));
