import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { NearbyUser } from '../types';

export const useNearbyUsers = (lat?: number, lng?: number) => {
  return useQuery({
    queryKey: ['nearbyUsers', lat, lng],
    queryFn: async (): Promise<NearbyUser[]> => {
      if (!lat || !lng) return [];
      const { data } = await api.get('/matches/nearby', { params: { lat, lng } });
      return data;
    },
    enabled: !!lat && !!lng,
    refetchInterval: 30000, // 30 seconds
  });
};
