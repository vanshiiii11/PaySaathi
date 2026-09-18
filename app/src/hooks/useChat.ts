import { useEffect } from 'react';
import { socketService } from '../services/socket';
import { useChatStore } from '../store/chat.store';

export const useChat = (threadId: string) => {
  const { messages, typing, addMessage, setTyping } = useChatStore();

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.emit('joinThread', threadId);

    socket.on('newMessage', (message) => {
      addMessage(threadId, message);
    });

    socket.on('typing', ({ isTyping }) => {
      setTyping(threadId, isTyping);
    });

    return () => {
      socket.emit('leaveThread', threadId);
      socket.off('newMessage');
      socket.off('typing');
    };
  }, [threadId, addMessage, setTyping]);

  const sendMessage = (content: string) => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('sendMessage', { threadId, content });
    }
  };

  const markRead = () => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('markRead', { threadId });
    }
  };

  return {
    messages: messages[threadId] || [],
    isTyping: typing[threadId] || false,
    sendMessage,
    markRead,
  };
};
