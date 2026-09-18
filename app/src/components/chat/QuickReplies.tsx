import React from 'react';
import { ScrollView, View } from 'react-native';
import { Chip } from '../ui/Chip';

interface QuickRepliesProps {
  onSelect: (reply: string) => void;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ onSelect }) => {
  const replies = ["On my way", "Running 5 mins late", "I'm here", "Be there soon"];

  return (
    <View className="py-2 bg-gray-50 border-t border-gray-200">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {replies.map((reply, index) => (
          <View key={index} className="mr-2">
            <Chip
              label={reply}
              variant="quick-reply"
              onPress={() => onSelect(reply)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
