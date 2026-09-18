import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../src/components/ui/Avatar';
import { useAuthStore } from '../../src/store/auth.store';
import { Colors } from '../../src/theme/colors';

export default function ProfileScreen() {
  const { user, clearAuth } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView>
        <View className="bg-surface p-6 items-center border-b border-border">
          <Avatar name={user?.name || 'User'} uri={user?.avatarUrl} size="xl" isVerified={user?.isVerified} />
          <Text className="text-2xl font-bold mt-4 mb-1">{user?.name || 'User'}</Text>
          <Text className="text-text-secondary mb-4">+91 ••••• ••{user?.phone?.slice(-3) || '000'}</Text>
          
          <View className="flex-row justify-around w-full mt-4 bg-gray-50 p-4 rounded-2xl">
            <View className="items-center">
              <Text className="text-xl font-bold text-primary">{user?.exchangeCount || 0}</Text>
              <Text className="text-xs text-text-secondary">Exchanges</Text>
            </View>
            <View className="w-[1px] bg-border" />
            <View className="items-center">
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-primary mr-1">{user?.rating || 0}</Text>
                <Ionicons name="star" size={16} color={Colors.warning} />
              </View>
              <Text className="text-xs text-text-secondary">Rating</Text>
            </View>
          </View>
        </View>

        <View className="p-4 mt-2">
          <Text className="font-bold text-lg mb-4 text-text-primary px-2">Settings</Text>
          
          <View className="bg-surface rounded-2xl overflow-hidden border border-borderLight shadow-sm">
            <SettingItem icon="person-outline" title="Edit Profile" />
            <SettingItem icon="notifications-outline" title="Notifications" />
            <SettingItem icon="shield-checkmark-outline" title="Privacy & Security" />
            <SettingItem icon="help-circle-outline" title="Help & Support" />
          </View>

          <View className="bg-surface rounded-2xl overflow-hidden border border-borderLight mt-4 shadow-sm">
            <TouchableOpacity 
              className="flex-row items-center p-4 bg-white"
              onPress={clearAuth}
            >
              <View className="w-10 h-10 rounded-full bg-errorLight items-center justify-center mr-3">
                <Ionicons name="log-out-outline" size={20} color={Colors.error} />
              </View>
              <Text className="flex-1 font-semibold text-error">Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SettingItem = ({ icon, title }: { icon: any, title: string }) => (
  <TouchableOpacity className="flex-row items-center p-4 bg-white border-b border-borderLight">
    <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3">
      <Ionicons name={icon} size={20} color={Colors.textSecondary} />
    </View>
    <Text className="flex-1 font-semibold text-text-primary text-base">{title}</Text>
    <Ionicons name="chevron-forward" size={20} color={Colors.border} />
  </TouchableOpacity>
);
