import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';

interface SkeletonLoaderProps {
  width: number | string;
  height: number | string;
  borderRadius?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width,
  height,
  borderRadius = 8,
}) => {
  return (
    <View style={{ width, height, borderRadius, overflow: 'hidden', backgroundColor: '#E5E7EB' }}>
      <MotiView
        from={{ translateX: -100, opacity: 0.5 }}
        animate={{ translateX: 400, opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 1500,
          loop: true,
          repeatReverse: false,
        }}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#F3F4F6',
        }}
      />
    </View>
  );
};
