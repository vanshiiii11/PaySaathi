import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Colors } from '../../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
}) => {
  const getBgColor = () => {
    if (disabled) return 'bg-gray-300';
    switch (variant) {
      case 'primary': return 'bg-primary';
      case 'secondary': return 'bg-accent';
      case 'outline': return 'bg-transparent border border-primary';
      case 'ghost': return 'bg-transparent';
      case 'danger': return 'bg-error';
      default: return 'bg-primary';
    }
  };

  const getTextColor = () => {
    if (disabled) return 'text-gray-500';
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger': return 'text-white';
      case 'outline':
      case 'ghost': return 'text-primary';
      default: return 'text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'py-2 px-4 rounded-full min-h-[36px]';
      case 'md': return 'py-3 px-6 rounded-full min-h-[48px]';
      case 'lg': return 'py-4 px-8 rounded-full min-h-[56px]';
      default: return 'py-3 px-6 rounded-full min-h-[48px]';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`flex-row items-center justify-center ${getBgColor()} ${getSizeClasses()}`}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? Colors.primary : '#fff'} />
      ) : (
        <>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text className={`font-semibold text-center ${getTextColor()} ${size === 'lg' ? 'text-lg' : 'text-base'}`}>
            {title}
          </Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};
