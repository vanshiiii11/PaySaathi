import React from 'react';
import { View, Image, Text } from 'react-native';
import { Colors } from '../../theme/colors';
import { NearbyUser, ExchangeDirection } from '../../types';

interface UserPinProps {
  user: NearbyUser;
}

export const UserPin: React.FC<UserPinProps> = ({ user }) => {
  const isCash = user.intent === ExchangeDirection.CASH_TO_UPI;
  const pinColor = isCash ? Colors.cashPin : Colors.upiPin;

  return (
    <View className="items-center justify-center">
      <View
        className="w-12 h-12 rounded-full border-2 items-center justify-center bg-white"
        style={{ borderColor: pinColor }}
      >
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} className="w-10 h-10 rounded-full" />
        ) : (
          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: pinColor }}>
            <Text className="text-white font-bold text-xs">{user.name.substring(0, 2).toUpperCase()}</Text>
          </View>
        )}
      </View>
      <View
        className="w-3 h-3 rounded-full mt-1 border-2 border-white"
        style={{ backgroundColor: pinColor }}
      />
    </View>
  );
};
