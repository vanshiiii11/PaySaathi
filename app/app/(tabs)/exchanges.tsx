import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExchangeCard } from '../../src/components/exchange/ExchangeCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useAuthStore } from '../../src/store/auth.store';

// Mock data
const exchanges = [];

export default function ExchangesScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 bg-surface border-b border-border">
        <Text className="text-2xl font-bold text-text-primary">History</Text>
      </View>

      <FlatList
        data={exchanges}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <ExchangeCard 
            exchange={item} 
            currentUserId={user?.id || ''} 
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="swap-horizontal"
            title="No exchanges yet"
            description="Go active on the map to start matching with people nearby!"
          />
        }
      />
    </SafeAreaView>
  );
}
