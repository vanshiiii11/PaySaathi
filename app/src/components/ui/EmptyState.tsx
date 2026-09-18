import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Button } from './Button';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-6">
        <Ionicons name={icon} size={40} color={Colors.textTertiary} />
      </View>
      <Text className="text-xl font-bold text-text-primary text-center mb-2">{title}</Text>
      <Text className="text-base text-text-secondary text-center mb-8">{description}</Text>
      {actionLabel && onAction && (
        <View className="w-full">
          <Button title={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
};
