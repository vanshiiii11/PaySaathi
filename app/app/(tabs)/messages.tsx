import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Avatar } from '../../src/components/ui/Avatar';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Colors } from '../../src/theme/colors';

// Mock data
const threads = [];

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 bg-surface border-b border-border flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-text-primary">Messages</Text>
      </View>

      <FlatList
        data={threads}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center p-4 bg-surface border-b border-borderLight"
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <Avatar name="User" size="lg" />
            <View className="flex-1 ml-3">
              <View className="flex-row justify-between mb-1">
                <Text className="font-bold text-text-primary text-base">User Name</Text>
                <Text className="text-xs text-text-tertiary">12:30 PM</Text>
              </View>
              <Text className="text-sm text-text-secondary" numberOfLines={1}>
                Last message preview...
              </Text>
            </View>
            <View className="w-5 h-5 bg-primary rounded-full items-center justify-center ml-2">
              <Text className="text-white text-[10px] font-bold">1</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles"
            title="No active chats"
            description="Accept an exchange request to start chatting safely."
          />
        }
      />
    </SafeAreaView>
  );
}
