import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, Animated } from 'react-native';
import { Colors } from '../../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, leftIcon, rightIcon, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4 w-full">
      {label && <Text className="text-sm text-text-secondary mb-1">{label}</Text>}
      <View
        className={`flex-row items-center bg-surface border rounded-xl px-4 min-h-[48px] ${
          error ? 'border-error' : isFocused ? 'border-primary' : 'border-border'
        }`}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          className="flex-1 text-base text-text-primary py-3"
          placeholderTextColor={Colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && <Text className="text-xs text-error mt-1">{error}</Text>}
    </View>
  );
};
