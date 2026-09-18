import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Exchange, ExchangeStatus, ExchangeDirection } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../theme/colors';

interface ExchangeCardProps {
  exchange: Exchange;
  currentUserId: string;
  onPress?: () => void;
}

export const ExchangeCard: React.FC<ExchangeCardProps> = ({ exchange, currentUserId, onPress }) => {
  const isRequester = exchange.requesterId === currentUserId;
  const counterpart = isRequester ? exchange.partner : exchange.requester;
  const iNeed = isRequester
    ? exchange.direction === ExchangeDirection.CASH_TO_UPI ? 'UPI' : 'Cash'
    : exchange.direction === ExchangeDirection.CASH_TO_UPI ? 'Cash' : 'UPI';

  const getStatusColor = (status: ExchangeStatus) => {
    switch (status) {
      case ExchangeStatus.PENDING: return Colors.warning;
      case ExchangeStatus.ACCEPTED: return Colors.primary;
      case ExchangeStatus.COMPLETED: return Colors.success;
      case ExchangeStatus.DECLINED:
      case ExchangeStatus.CANCELLED:
      case ExchangeStatus.EXPIRED: return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  if (!counterpart) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="bg-white p-4 mb-3 border-b border-border flex-row items-center"
    >
      <Avatar name={counterpart.name} uri={counterpart.avatarUrl} size="md" />
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-bold text-text-primary text-base">{counterpart.name}</Text>
          <Text className="font-bold text-text-primary">₹{exchange.amount}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-text-secondary">
            {isRequester ? 'Requested' : 'Providing'} {iNeed}
          </Text>
          <Text
            className="text-xs font-semibold"
            style={{ color: getStatusColor(exchange.status) }}
          >
            {exchange.status}
          </Text>
        </View>
        <Text className="text-xs text-text-tertiary mt-2">
          {new Date(exchange.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
