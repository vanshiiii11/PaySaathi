import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../../src/components/ui/Avatar';
import { RatingStars } from '../../src/components/ui/RatingStars';
import { Chip } from '../../src/components/ui/Chip';
import { Button } from '../../src/components/ui/Button';

export default function RatingScreen() {
  const { exchangeId } = useLocalSearchParams();
  const router = useRouter();
  
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = ["Punctual", "Friendly", "Fair exchange", "Had exact change", "Safe meeting spot"];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        <View className="items-center mt-8 mb-10">
          <Avatar name="User" size="xl" />
          <Text className="text-2xl font-bold mt-4 mb-2">How was your exchange?</Text>
          <Text className="text-text-secondary text-base">Rate your experience with User Name</Text>
        </View>

        <View className="items-center mb-10">
          <RatingStars value={stars} onRate={setStars} size={48} interactive />
        </View>

        {stars > 0 && (
          <>
            <Text className="font-bold text-base mb-4 text-text-primary">What went well?</Text>
            <View className="flex-row flex-wrap gap-2 mb-8">
              {tags.map(tag => (
                <View key={tag} className="mb-2 mr-2">
                  <Chip
                    label={tag}
                    isSelected={selectedTags.includes(tag)}
                    onPress={() => toggleTag(tag)}
                    variant="tag"
                  />
                </View>
              ))}
            </View>

            <Text className="font-bold text-base mb-2 text-text-primary">Add a comment (Optional)</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[100px] text-base"
              placeholder="Tell others about your experience..."
              value={comment}
              onChangeText={setComment}
              multiline
              textAlignVertical="top"
            />
          </>
        )}
      </ScrollView>

      <View className="p-6 border-t border-border">
        <Button
          title="Submit Rating"
          onPress={() => router.back()}
          disabled={stars === 0}
          size="lg"
          className="mb-3"
        />
        <View className="mt-3">
          <Button
            title="Skip for now"
            onPress={() => router.back()}
            variant="ghost"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
