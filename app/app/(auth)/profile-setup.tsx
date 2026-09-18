import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/theme/colors';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    router.push('/(auth)/permissions');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1 px-6">
          <View className="mt-6 mb-8">
            <Text className="text-3xl font-bold text-text-primary mb-2">Create profile</Text>
            <Text className="text-text-secondary text-base">How should other users recognize you?</Text>
          </View>

          <View className="items-center mb-8">
            <TouchableOpacity
              onPress={pickImage}
              className="w-28 h-28 rounded-full bg-gray-100 items-center justify-center border-2 border-dashed border-gray-300 relative"
            >
              {image ? (
                <Image source={{ uri: image }} className="w-full h-full rounded-full" />
              ) : (
                <Ionicons name="camera" size={32} color={Colors.textTertiary} />
              )}
              <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full shadow-sm">
                <Ionicons name="add" size={16} color="white" />
              </View>
            </TouchableOpacity>
            <Text className="mt-3 text-sm text-text-secondary font-medium">Add a photo</Text>
          </View>

          <Input
            label="Full Name"
            placeholder="e.g. Rahul Kumar"
            value={name}
            onChangeText={setName}
          />

          <View className="mt-4">
            <Input
              label="Bio (Optional)"
              placeholder="e.g. Student at DU. Fast responder."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              maxLength={120}
              style={{ height: 80, textAlignVertical: 'top' }}
            />
            <Text className="text-right text-xs text-text-tertiary">{bio.length}/120</Text>
          </View>
        </ScrollView>
        
        <View className="p-6 bg-white border-t border-gray-100">
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!name.trim()}
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
