import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface RatingStarsProps {
  value: number;
  onRate?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onRate,
  size = 16,
  interactive = false,
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View className="flex-row items-center">
      {stars.map((star) => {
        const isFilled = star <= value;
        return (
          <TouchableOpacity
            key={star}
            disabled={!interactive}
            onPress={() => onRate && onRate(star)}
            activeOpacity={interactive ? 0.7 : 1}
            className="mr-1"
          >
            <Ionicons
              name={isFilled ? 'star' : 'star-outline'}
              size={size}
              color={isFilled ? Colors.warning : Colors.border}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
