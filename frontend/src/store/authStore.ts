import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/types'

// SECURITY NOTE: the JWT is persisted to localStorage (via zustand's `persist`
// middleware) rather than an httpOnly cookie. This is a deliberate simplification
// for this demo — it avoids wiring httpOnly cookies through nginx/CORS/backend —
// but it means the token is readable by any JS running on this origin (XSS
// exposure). A production build should issue the JWT as an httpOnly, Secure,
// SameSite cookie set by the backend instead. Never log this token to the
// console or place it in a URL/query string.
interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: () => boolean
  setSession: (token: string, user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: () => Boolean(get().token),
      setSession: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'sumer-jewelry-auth',
    },
  ),
)
