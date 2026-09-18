import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/theme/colors';

export default function TermsScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-text-primary mb-6">Safety First 🛡️</Text>
        
        <View className="bg-primary-light p-4 rounded-xl border border-primary/20 mb-6">
          <Text className="text-primary-dark font-medium leading-relaxed">
            PaySaathi does NOT process payments or hold money. You exchange directly with another person.
          </Text>
        </View>

        <View className="space-y-4 mb-8">
          <View className="flex-row mb-4">
            <Ionicons name="people" size={24} color={Colors.primary} className="mr-3" />
            <Text className="flex-1 text-text-secondary leading-relaxed ml-3">
              Always meet in a public place like a café, mall, or ATM lobby.
            </Text>
          </View>
          <View className="flex-row mb-4">
            <Ionicons name="key" size={24} color={Colors.primary} className="mr-3" />
            <Text className="flex-1 text-text-secondary leading-relaxed ml-3">
              Never share your OTP, UPI PIN, or banking passwords with anyone.
            </Text>
          </View>
          <View className="flex-row mb-4">
            <Ionicons name="warning" size={24} color={Colors.primary} className="mr-3" />
            <Text className="flex-1 text-text-secondary leading-relaxed ml-3">
              Count cash before transferring UPI, or wait for UPI confirmation before handing over cash.
            </Text>
          </View>
          <View className="flex-row mb-4">
            <Ionicons name="flag" size={24} color={Colors.primary} className="mr-3" />
            <Text className="flex-1 text-text-secondary leading-relaxed ml-3">
              Report any suspicious behavior immediately in the app.
            </Text>
          </View>
        </View>

        <View className="flex-1" />

        <TouchableOpacity 
          className="flex-row items-center mb-6"
          activeOpacity={0.7}
          onPress={() => setAgreed(!agreed)}
        >
          <View className={`w-6 h-6 rounded-md border items-center justify-center mr-3 ${
            agreed ? 'bg-primary border-primary' : 'bg-white border-gray-300'
          }`}>
            {agreed && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text className="text-sm text-text-primary flex-1 font-medium">
            I understand these rules and agree to exchange safely.
          </Text>
        </TouchableOpacity>

        <Button
          title="Continue"
          onPress={() => router.push('/(auth)/phone')}
          disabled={!agreed}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
