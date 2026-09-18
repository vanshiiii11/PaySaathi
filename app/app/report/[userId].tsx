import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/theme/colors';

export default function ReportScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const reasons = [
    "No-show", 
    "Suspicious behavior", 
    "Asked for OTP/PIN", 
    "Harassment", 
    "Scam attempt", 
    "Other"
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-border">
        <Ionicons name="close" size={28} color={Colors.textPrimary} onPress={() => router.back()} />
        <Text className="flex-1 text-center font-bold text-lg mr-7">Report User</Text>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-errorLight p-4 rounded-xl mb-6 flex-row items-start">
          <Ionicons name="warning" size={20} color={Colors.error} className="mr-2 mt-1" />
          <Text className="flex-1 text-error font-medium leading-relaxed ml-2">
            Reports are strictly confidential. We will review this report and take appropriate action to keep the community safe.
          </Text>
        </View>

        <Text className="font-bold text-base mb-4 text-text-primary">Why are you reporting this user?</Text>
        
        {reasons.map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setReason(r)}
            className="flex-row items-center py-3 border-b border-gray-100"
          >
            <View className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${
              reason === r ? 'border-primary' : 'border-gray-300'
            }`}>
              {reason === r && <View className="w-3 h-3 bg-primary rounded-full" />}
            </View>
            <Text className="text-base text-text-primary">{r}</Text>
          </TouchableOpacity>
        ))}

        <Text className="font-bold text-base mt-8 mb-2 text-text-primary">Additional Details (Optional)</Text>
        <TextInput
          className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[120px] text-base"
          placeholder="Please provide any extra context that might help us investigate..."
          value={details}
          onChangeText={setDetails}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      <View className="p-6 border-t border-border">
        <Button
          title="Submit Report"
          onPress={() => {
            // Submit logic
            router.back();
          }}
          disabled={!reason}
          variant="danger"
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

// Minimal TouchableOpacity added inline for convenience
import { TouchableOpacity } from 'react-native';
