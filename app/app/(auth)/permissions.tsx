import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/theme/colors';
import * as Location from 'expo-location';

export default function PermissionsScreen() {
  const router = useRouter();

  const handleAllowLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      router.push('/(tabs)'); // Complete auth flow
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-6 items-center justify-center">
        <View className="w-24 h-24 bg-primary-light rounded-full items-center justify-center mb-8">
          <Ionicons name="location" size={48} color={Colors.primary} />
        </View>
        
        <Text className="text-2xl font-bold text-center text-text-primary mb-4">
          Enable Location
        </Text>
        <Text className="text-base text-center text-text-secondary leading-relaxed mb-12">
          PaySaathi needs your location to show you people nearby who want to exchange cash for UPI.
        </Text>

        <View className="w-full space-y-4">
          <Button
            title="Allow Location"
            onPress={handleAllowLocation}
            size="lg"
            leftIcon={<Ionicons name="location" size={20} color="white" />}
          />
          <View className="mt-4">
            <Button
              title="Maybe Later"
              variant="ghost"
              onPress={() => router.push('/(tabs)')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
