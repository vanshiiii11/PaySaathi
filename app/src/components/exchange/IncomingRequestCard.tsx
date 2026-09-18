import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Exchange, ExchangeDirection } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Colors } from '../../theme/colors';

interface IncomingRequestCardProps {
  exchange: Exchange;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingRequestCard: React.FC<IncomingRequestCardProps> = ({
  exchange,
  onAccept,
  onDecline,
}) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const requester = exchange.requester;
  if (!requester) return null;

  const needs = exchange.direction === ExchangeDirection.CASH_TO_UPI ? 'UPI' : 'Cash';

  return (
    <View className="bg-white p-5 rounded-2xl border border-primary m-4 shadow-lg shadow-black/10">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-primary font-bold text-sm">New Request</Text>
        <Text className="text-error font-mono font-bold text-sm">{formatTime(timeLeft)}</Text>
      </View>
      
      <View className="flex-row items-center mb-4">
        <Avatar name={requester.name} uri={requester.avatarUrl} size="lg" isVerified={requester.isVerified} />
        <View className="ml-3 flex-1">
          <Text className="font-bold text-lg text-text-primary">{requester.name}</Text>
          <Text className="text-text-secondary text-sm">Needs {needs}</Text>
        </View>
        <Text className="font-bold text-2xl text-text-primary">₹{exchange.amount}</Text>
      </View>

      {exchange.note && (
        <View className="bg-gray-50 p-3 rounded-lg mb-4">
          <Text className="text-text-secondary italic text-sm">"{exchange.note}"</Text>
        </View>
      )}

      <View className="flex-row justify-between space-x-3">
        <View className="flex-1">
          <Button title="Decline" variant="outline" onPress={onDecline} />
        </View>
        <View className="flex-1">
          <Button title="Accept" onPress={onAccept} />
        </View>
      </View>
    </View>
  );
};
