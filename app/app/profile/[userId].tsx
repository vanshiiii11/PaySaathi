import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../src/components/ui/Avatar';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/theme/colors';
import { RatingStars } from '../../src/components/ui/RatingStars';

export default function PublicProfileScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4">
        <Ionicons name="arrow-back" size={28} color={Colors.textPrimary} onPress={() => router.back()} />
        <View className="flex-1" />
        <Ionicons name="flag-outline" size={24} color={Colors.error} onPress={() => router.push(`/report/${userId}`)} />
      </View>

      <ScrollView className="flex-1">
        <View className="items-center px-6 pb-6 border-b border-border">
          <Avatar name="User" size="xl" isVerified />
          <View className="flex-row items-center mt-4 mb-1">
            <Text className="text-2xl font-bold mr-2">User Name</Text>
          </View>
          <Text className="text-text-secondary text-base mb-4">Student at DU. Fast responder.</Text>

          <View className="flex-row bg-gray-50 rounded-2xl p-4 w-full justify-around mb-6">
            <View className="items-center">
              <Text className="text-xl font-bold text-primary">12</Text>
              <Text className="text-xs text-text-secondary">Exchanges</Text>
            </View>
            <View className="w-[1px] bg-border" />
            <View className="items-center">
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-primary mr-1">4.8</Text>
                <Ionicons name="star" size={16} color={Colors.warning} />
              </View>
              <Text className="text-xs text-text-secondary">10 Reviews</Text>
            </View>
          </View>

          <Button
            title="Request Exchange"
            onPress={() => router.push(`/exchange-request/${userId}`)}
            size="lg"
            className="w-full"
          />
        </View>

        <View className="p-6">
          <Text className="font-bold text-lg mb-4 text-text-primary">Recent Reviews</Text>
          
          {[1, 2].map((i) => (
            <View key={i} className="mb-6 border-b border-gray-100 pb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-semibold text-text-primary">Anonymous</Text>
                <Text className="text-xs text-text-tertiary">2 days ago</Text>
              </View>
              <RatingStars value={5} size={14} />
              <Text className="mt-2 text-text-secondary leading-relaxed">
                "Very punctual and friendly. The exchange was quick and smooth in a safe location."
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
