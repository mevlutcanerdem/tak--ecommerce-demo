import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOrder, fetchMyOrders } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export function useMyOrders() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  return useQuery({
    queryKey: ['orders', 'mine'],
    queryFn: fetchMyOrders,
    enabled: isAuthenticated,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
