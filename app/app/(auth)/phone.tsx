import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export default function PhoneScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push({ pathname: '/(auth)/otp', params: { phone: data.phone } });
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 p-6">
            <View className="mt-10 mb-10">
              <Text className="text-3xl font-bold text-text-primary mb-2">Enter your number</Text>
              <Text className="text-text-secondary text-base">
                We'll send you an OTP to verify your account
              </Text>
            </View>

            <View className="flex-row">
              <View className="w-20 mr-3">
                <Input value="+91" editable={false} />
              </View>
              <View className="flex-1">
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Phone Number"
                      keyboardType="numeric"
                      maxLength={10}
                      value={value}
                      onChangeText={onChange}
                      error={errors.phone?.message as string}
                      autoFocus
                    />
                  )}
                />
              </View>
            </View>

            <View className="flex-1" />

            <Text className="text-center text-xs text-text-tertiary mb-4 px-4">
              We use your number only for verification. By continuing you agree to our Terms of Service.
            </Text>
            <Button
              title="Send OTP"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              size="lg"
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
