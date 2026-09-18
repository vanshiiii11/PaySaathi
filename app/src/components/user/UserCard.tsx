import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar } from '../ui/Avatar';
import { RatingStars } from '../ui/RatingStars';
import { Badge } from '../ui/Badge';
import { NearbyUser, ExchangeDirection } from '../../types';
import { Button } from '../ui/Button';

interface UserCardProps {
  user: NearbyUser;
  onRequest: (user: NearbyUser) => void;
  onPress?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onRequest, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 border border-border flex-row items-center"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Avatar name={user.name} uri={user.avatarUrl} size="lg" isVerified={user.isVerified} />
      
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-base font-bold text-text-primary" numberOfLines={1}>
            {user.name}
          </Text>
          <Text className="text-xs text-text-secondary font-medium">
            {user.distanceKm.toFixed(1)} km away
          </Text>
        </View>
        
        <View className="flex-row items-center mb-2">
          <RatingStars value={user.rating} size={14} />
          <Text className="text-xs text-text-secondary ml-1">({user.ratingCount})</Text>
        </View>
        
        <View className="flex-row items-center justify-between">
          <View>
            <Badge
              label={user.intent === ExchangeDirection.CASH_TO_UPI ? 'Has Cash' : 'Needs Cash'}
              variant={user.intent === ExchangeDirection.CASH_TO_UPI ? 'success' : 'primary'}
            />
            {(user.minAmount || user.maxAmount) && (
              <Text className="text-xs text-text-secondary mt-1">
                ₹{user.minAmount || 0} - ₹{user.maxAmount || 0}
              </Text>
            )}
          </View>
          <Button
            title="Request"
            size="sm"
            onPress={() => onRequest(user)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
