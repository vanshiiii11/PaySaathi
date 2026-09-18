import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useExchange = () => {
  const queryClient = useQueryClient();

  const useCreateExchange = useMutation({
    mutationFn: (data: any) => api.post('/exchanges', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    },
  });

  const useUpdateExchange = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.patch(`/exchanges/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeExchange'] });
    },
  });

  return { useCreateExchange, useUpdateExchange };
};
