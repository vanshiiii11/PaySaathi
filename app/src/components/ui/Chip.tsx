import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface ChipProps {
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
  variant?: 'filter' | 'tag' | 'quick-reply';
  color?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  isSelected = false,
  onPress,
  variant = 'filter',
  color,
}) => {
  const getStyleClasses = () => {
    if (variant === 'quick-reply') {
      return 'bg-primary-light border-primary-light px-4 py-2 rounded-full';
    }
    if (isSelected) {
      return 'bg-primary border-primary px-4 py-2 rounded-full';
    }
    return 'bg-gray-100 border-gray-200 px-4 py-2 rounded-full border';
  };

  const getTextStyleClasses = () => {
    if (variant === 'quick-reply') {
      return 'text-primary font-medium text-sm';
    }
    if (isSelected) {
      return 'text-white font-medium text-sm';
    }
    return 'text-text-primary text-sm';
  };

  const content = (
    <View className={`self-start ${getStyleClasses()}`}>
      <Text className={getTextStyleClasses()}>{label}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};
