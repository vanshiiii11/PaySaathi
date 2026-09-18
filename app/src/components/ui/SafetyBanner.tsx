import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface SafetyBannerProps {
  compact?: boolean;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ compact = false }) => {
  return (
    <View className="bg-primary-light flex-row items-center p-3 rounded-lg my-2 border border-primary/20">
      <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
      <View className="ml-3 flex-1">
        {!compact && <Text className="font-semibold text-primary-dark mb-1">Safety First</Text>}
        <Text className="text-xs text-primary-dark leading-tight">
          Meet in a public place. Never share OTPs, PINs, or bank details.
        </Text>
      </View>
    </View>
  );
};
