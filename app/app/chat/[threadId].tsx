import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../../src/hooks/useChat';
import { useAuthStore } from '../../src/store/auth.store';
import { MessageBubble } from '../../src/components/chat/MessageBubble';
import { QuickReplies } from '../../src/components/chat/QuickReplies';
import { SafetyBanner } from '../../src/components/ui/SafetyBanner';
import { Colors } from '../../src/theme/colors';

export default function ChatScreen() {
  const { threadId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { messages, isTyping, sendMessage } = useChat(threadId as string);
  const [inputText, setInputText] = useState('');
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center p-4 bg-surface border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center mr-3">
          <Text className="font-bold text-primary">U</Text>
        </View>
        <View className="flex-1">
          <Text className="font-bold text-lg text-text-primary">User Name</Text>
          <Text className="text-xs text-primary font-medium">Active now</Text>
        </View>
        <TouchableOpacity onPress={() => router.push(`/report/user-id`)} className="p-2">
          <Ionicons name="flag-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        className="flex-1"
      >
        {showSafetyBanner && (
          <View className="px-4 pt-2">
            <SafetyBanner compact />
            <TouchableOpacity 
              className="absolute top-4 right-6 p-1 bg-primary-light rounded-full"
              onPress={() => setShowSafetyBanner(false)}
            >
              <Ionicons name="close" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} isOwn={item.senderId === user?.id} />
          )}
          inverted
          contentContainerStyle={{ paddingVertical: 16 }}
        />

        {isTyping && (
          <View className="px-4 py-2">
            <Text className="text-xs text-text-tertiary italic">User is typing...</Text>
          </View>
        )}

        <QuickReplies onSelect={handleQuickReply} />

        <View className="p-3 bg-surface border-t border-border flex-row items-end">
          <TextInput
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 min-h-[48px] max-h-[120px] text-base text-text-primary"
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            className={`ml-3 w-12 h-12 rounded-full items-center justify-center ${
              inputText.trim() ? 'bg-primary' : 'bg-gray-200'
            }`}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? 'white' : Colors.textTertiary} 
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
