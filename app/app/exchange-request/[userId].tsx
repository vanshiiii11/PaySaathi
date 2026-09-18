import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Chip } from '../../src/components/ui/Chip';
import { Avatar } from '../../src/components/ui/Avatar';
import { Colors } from '../../src/theme/colors';

export default function ExchangeRequestScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<'CASH_TO_UPI' | 'UPI_TO_CASH'>('CASH_TO_UPI');
  const [note, setNote] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('');

  const handleSend = () => {
    // API call to send request
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-row items-center p-4 border-b border-border">
          <Ionicons name="close" size={28} color={Colors.textPrimary} onPress={() => router.back()} />
          <Text className="flex-1 text-center font-bold text-lg mr-7">Request Exchange</Text>
        </View>

        <ScrollView className="flex-1 p-6">
          <View className="items-center mb-8 bg-gray-50 p-4 rounded-2xl">
            <Avatar name="User" size="lg" />
            <Text className="font-bold text-xl mt-3 mb-1">User Name</Text>
            <Text className="text-text-secondary text-sm">0.5 km away • 4.8 ★</Text>
          </View>

          <Text className="font-bold text-base mb-3">What do you have?</Text>
          <View className="flex-row space-x-3 mb-6">
            <Chip
              label="I have Cash (Need UPI)"
              isSelected={direction === 'CASH_TO_UPI'}
              onPress={() => setDirection('CASH_TO_UPI')}
            />
            <Chip
              label="I have UPI (Need Cash)"
              isSelected={direction === 'UPI_TO_CASH'}
              onPress={() => setDirection('UPI_TO_CASH')}
            />
          </View>

          <Input
            label="Amount (₹)"
            placeholder="Enter amount (e.g. 500)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            leftIcon={<Text className="text-gray-500 font-bold">₹</Text>}
          />

          <Input
            label="Meeting Point Suggestion (Optional)"
            placeholder="e.g. CCD near Metro station"
            value={meetingPoint}
            onChangeText={setMeetingPoint}
          />

          <View className="mt-2">
            <Input
              label="Note (Optional)"
              placeholder="e.g. I only have 500 rupee notes"
              value={note}
              onChangeText={setNote}
              multiline
              style={{ height: 80, textAlignVertical: 'top' }}
              maxLength={200}
            />
          </View>

          <View className="bg-primary-light p-4 rounded-xl mt-4 border border-primary/20">
            <Text className="text-xs text-primary-dark font-medium leading-relaxed">
              The exchange happens in person. PaySaathi facilitates introductions only. Wait for them to accept before heading out.
            </Text>
          </View>
        </ScrollView>
        
        <View className="p-6 border-t border-border">
          <Button
            title="Send Request"
            onPress={handleSend}
            disabled={!amount}
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
