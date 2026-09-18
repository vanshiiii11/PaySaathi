import React from 'react';
import { View, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isVerified?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 'md', isVerified = false }) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm': return { width: 32, height: 32, borderRadius: 16 };
      case 'md': return { width: 44, height: 44, borderRadius: 22 };
      case 'lg': return { width: 56, height: 56, borderRadius: 28 };
      case 'xl': return { width: 80, height: 80, borderRadius: 40 };
      default: return { width: 44, height: 44, borderRadius: 22 };
    }
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const dims = getDimensions();

  return (
    <View style={{ width: dims.width, height: dims.height }}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: dims.width, height: dims.height, borderRadius: dims.borderRadius }}
          className="bg-gray-200"
        />
      ) : (
        <View
          style={{ width: dims.width, height: dims.height, borderRadius: dims.borderRadius }}
          className="bg-primary items-center justify-center"
        >
          <Text className="text-white font-bold" style={{ fontSize: dims.width / 2.5 }}>
            {getInitials(name)}
          </Text>
        </View>
      )}
      {isVerified && (
        <View
          className="absolute bottom-0 right-0 bg-white rounded-full items-center justify-center"
          style={{ width: dims.width * 0.35, height: dims.height * 0.35, padding: 2 }}
        >
          <Ionicons name="checkmark-circle" size={dims.width * 0.25} color={Colors.success} />
        </View>
      )}
    </View>
  );
};
