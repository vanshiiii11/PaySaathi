import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary' }) => {
  const getStyle = () => {
    switch (variant) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'primary': return 'bg-primary-light text-primary-dark';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const styleClass = getStyle();
  const [bgClass, textClass] = styleClass.split(' ');

  return (
    <View className={`${bgClass} px-2 py-1 rounded-full self-start`}>
      <Text className={`${textClass} text-xs font-medium`}>{label}</Text>
    </View>
  );
};
