import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, KeyboardAvoidingView,
  Platform, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../src/theme/colors';
import { authApi } from '../../src/services/api';
import { useAuthStore } from '../../src/store/auth.store';

export default function OTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (code: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data: any = await authApi.verifyOtp(phone, code);
      const { user, accessToken, refreshToken, isNewUser } = data.data ?? data;
      setAuth(user, accessToken, refreshToken);
      if (isNewUser || !user.name || user.name.startsWith('User_')) {
        router.replace('/(auth)/profile-setup');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      Alert.alert('Invalid OTP', err.message || 'The code you entered is incorrect. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.replace(/[^0-9]/g, '');
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await authApi.sendOtp(phone);
      setCountdown(30);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not resend OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-1 p-6">
          <View className="mt-10 mb-10">
            <Text className="text-3xl font-bold text-text-primary mb-2">Verify OTP</Text>
            <View className="flex-row items-center">
              <Text className="text-text-secondary text-base">Sent to +91 {phone} </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-primary font-bold">Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-between mb-8">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                className="w-12 h-14 bg-surface border rounded-xl text-center text-xl font-bold text-text-primary"
                style={{ borderColor: digit ? Colors.primary : Colors.border }}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                autoFocus={index === 0}
                editable={!isLoading}
              />
            ))}
          </View>

          {isLoading && (
            <View className="items-center mb-4">
              <ActivityIndicator color={Colors.primary} />
              <Text className="text-text-secondary mt-2">Verifying...</Text>
            </View>
          )}

          <View className="items-center mt-4">
            {countdown > 0 ? (
              <Text className="text-text-secondary">
                Resend code in <Text className="font-bold">{countdown}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text className="text-primary font-bold text-base">Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
