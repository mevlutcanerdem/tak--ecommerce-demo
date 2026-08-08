import { useMutation } from '@tanstack/react-query'
import { loginRequest, registerRequest } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setSession(data.token, data.user)
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: registerRequest,
  })
}
