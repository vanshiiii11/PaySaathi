import React, { useRef, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../src/hooks/useLocation';
import { useNearbyUsers } from '../../src/hooks/useNearbyUsers';
import { useAuthStore } from '../../src/store/auth.store';
import { UserCard } from '../../src/components/user/UserCard';
import { UserPin } from '../../src/components/user/UserPin';
import { Colors } from '../../src/theme/colors';
import { Chip } from '../../src/components/ui/Chip';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { ActivityIndicator } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { location, hasPermission, requestPermission } = useLocation();
  const { user, updateUser } = useAuthStore();
  const { data: users, isLoading } = useNearbyUsers(
    location?.coords.latitude,
    location?.coords.longitude
  );

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [100, '40%', '80%'], []);
  const [filter, setFilter] = useState<'ALL' | 'CASH' | 'UPI'>('ALL');
  
  const isActive = user?.isActive || false;

  const toggleActive = () => {
    // In a real app, this would open a modal to select intent and amount range, then update user
    updateUser({ isActive: !isActive });
  };

  if (hasPermission === false) {
    return (
      <View className="flex-1 bg-white">
        <EmptyState
          icon="location"
          title="Location Required"
          description="We need your location to show people nearby"
          actionLabel="Enable Location"
          onAction={requestPermission}
        />
      </View>
    );
  }

  const filteredUsers = users?.filter((u) => {
    if (filter === 'ALL') return true;
    if (filter === 'CASH') return u.intent === 'CASH_TO_UPI';
    if (filter === 'UPI') return u.intent === 'UPI_TO_CASH';
    return true;
  }) || [];

  return (
    <View className="flex-1">
      {location ? (
        <MapView
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
          mapType="standard"
        >
          {filteredUsers.map((u) => (
            <Marker
              key={u.id}
              coordinate={{ latitude: u.fuzzedLat, longitude: u.fuzzedLng }}
              onPress={() => {
                bottomSheetRef.current?.snapToIndex(1);
                // In real app, highlight user in list or show detail
              }}
            >
              <UserPin user={u} />
            </Marker>
          ))}
        </MapView>
      ) : (
        <View className="flex-1 items-center justify-center bg-gray-100">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}

      {/* Top Bar */}
      <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center bg-white/90 p-3 rounded-2xl shadow-sm">
        <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
          <Text className="text-primary font-bold">₹</Text>
        </View>
        <Text className="font-bold text-lg">Nearby</Text>
        <TouchableOpacity 
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Ionicons name="person" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* FAB */}
      <TouchableOpacity
        className={`absolute top-28 right-4 px-4 py-3 rounded-full flex-row items-center shadow-md ${
          isActive ? 'bg-primary' : 'bg-surface'
        }`}
        onPress={toggleActive}
      >
        <View className={`w-3 h-3 rounded-full mr-2 ${isActive ? 'bg-white' : 'bg-gray-400'}`} />
        <Text className={`font-bold ${isActive ? 'text-white' : 'text-text-primary'}`}>
          {isActive ? 'Active' : 'Go Active'}
        </Text>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{ borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10 }}
      >
        <View className="px-4 py-2 flex-row items-center space-x-2 border-b border-gray-100 pb-3">
          <Chip label="All" isSelected={filter === 'ALL'} onPress={() => setFilter('ALL')} />
          <Chip label="Has Cash" isSelected={filter === 'CASH'} onPress={() => setFilter('CASH')} />
          <Chip label="Needs Cash" isSelected={filter === 'UPI'} onPress={() => setFilter('UPI')} />
        </View>
        <BottomSheetFlatList
          data={filteredUsers}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <UserCard 
              user={item} 
              onRequest={() => router.push(`/exchange-request/${item.id}`)}
              onPress={() => router.push(`/profile/${item.id}`)}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <EmptyState
              icon="search"
              title="No users found"
              description="There are no active users matching your criteria nearby."
            />
          }
        />
      </BottomSheet>
    </View>
  );
}
