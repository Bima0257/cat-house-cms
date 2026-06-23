import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import alert from '../lib/alert';

export function useApi(key, fetchFn, options = {}) {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const { data } = await fetchFn();
      return data;
    },
    ...options,
  });
}

export function useMutationApi(fetchFn, options = {}) {
  const queryClient = useQueryClient();
  const { invalidateKey, successMessage, onSuccess, ...rest } = options;

  return useMutation({
    mutationFn: async (variables) => {
      const { data } = await fetchFn(variables);
      return data;
    },
    onSuccess: (data) => {
      if (successMessage) alert.success(successMessage);
      if (invalidateKey) queryClient.invalidateQueries({ queryKey: [invalidateKey] });
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Terjadi kesalahan';
      alert.error(message);
    },
    ...rest,
  });
}
