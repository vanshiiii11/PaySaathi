import React from 'react';
import { View, Text } from 'react-native';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  if (message.type === 'SYSTEM') {
    return (
      <View className="my-2 items-center px-4">
        <View className="bg-gray-200 px-3 py-1 rounded-full">
          <Text className="text-xs text-gray-600 italic text-center">{message.content}</Text>
        </View>
      </View>
    );
  }

  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View className={`my-1 px-4 flex-row ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <View
        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
          isOwn ? 'bg-primary rounded-tr-sm' : 'bg-white rounded-tl-sm border border-gray-100'
        }`}
        style={!isOwn ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        } : {}}
      >
        <Text className={`text-base ${isOwn ? 'text-white' : 'text-text-primary'}`}>
          {message.content}
        </Text>
        <Text className={`text-[10px] mt-1 text-right ${isOwn ? 'text-primary-light' : 'text-text-tertiary'}`}>
          {time}
        </Text>
      </View>
    </View>
  );
};
