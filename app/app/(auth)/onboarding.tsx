import React, { useState } from 'react';
import { View, Text, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { Button } from '../../src/components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../src/theme/colors';

const slides = [
  {
    id: '1',
    title: 'Find people nearby',
    description: 'See who\'s around you looking to exchange cash for UPI or vice versa',
    emoji: '🔍',
  },
  {
    id: '2',
    title: 'Chat & agree safely',
    description: 'Connect, set the meeting spot, and finalize the details in our secure chat',
    emoji: '💬',
  },
  {
    id: '3',
    title: 'Meet & exchange',
    description: 'Meet in a public place, complete the exchange, and rate each other',
    emoji: '🤝',
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onMomentumScrollEnd = (event: any) => {
    setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      // Manual scroll would go here if ref existed
    } else {
      router.push('/(auth)/terms');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width }} className="items-center justify-center p-8">
            <Text style={{ fontSize: 100 }} className="mb-12">{slide.emoji}</Text>
            <Text className="text-3xl font-bold text-center text-text-primary mb-4">
              {slide.title}
            </Text>
            <Text className="text-lg text-center text-text-secondary leading-relaxed">
              {slide.description}
            </Text>
          </View>
        ))}
      </Animated.ScrollView>

      <View className="px-8 pb-12 pt-4">
        <View className="flex-row justify-center mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 transition-all ${
                currentIndex === index ? 'bg-primary w-6' : 'bg-gray-200 w-2'
              }`}
            />
          ))}
        </View>

        <Button
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          size="lg"
        />
        {currentIndex < slides.length - 1 && (
          <View className="mt-4">
            <Button
              title="Skip"
              onPress={() => router.push('/(auth)/terms')}
              variant="ghost"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
