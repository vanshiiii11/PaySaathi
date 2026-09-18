import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Colors } from '../../src/theme/colors';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark]}
      style={{ flex: 1 }}
      className="items-center justify-center"
    >
      <MotiView
        from={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 300, duration: 1000 }}
        className="items-center"
      >
        <View className="w-24 h-24 bg-white rounded-3xl items-center justify-center mb-6 shadow-xl">
          <Text className="text-primary text-4xl font-bold">₹</Text>
        </View>
        <Text className="text-white text-4xl font-bold mb-2 tracking-wide">PaySaathi</Text>
        <Text className="text-primary-light text-lg font-medium opacity-90">
          Cash meets digital. Safely.
        </Text>
      </MotiView>
    </LinearGradient>
  );
}
