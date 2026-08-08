import axios, { type AxiosError } from 'axios'
import type {
  ApiError,
  AuthUser,
  Category,
  CreateOrderRequest,
  LoginRequest,
  LoginResponse,
  Order,
  PagedResponse,
  Product,
  ProductQueryParams,
  RegisterRequest,
} from '@/types'
import { useAuthStore } from '@/store/authStore'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Beklenmeyen bir hata oluştu.',
): string {
  const axiosError = error as AxiosError<ApiError>
  return axiosError?.response?.data?.message ?? fallback
}

// ---- Categories ----
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>('/categories')
  return data
}

// ---- Products ----
export async function fetchProducts(
  params: ProductQueryParams,
): Promise<PagedResponse<Product>> {
  const { data } = await apiClient.get<PagedResponse<Product>>('/products', {
    params,
  })
  return data
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${slug}`)
  return data
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>('/products/featured')
  return data
}

// ---- Auth ----
export async function loginRequest(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', payload)
  return data
}

export async function registerRequest(payload: RegisterRequest): Promise<AuthUser> {
  const { data } = await apiClient.post<AuthUser>('/auth/register', payload)
  return data
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>('/auth/me')
  return data
}

// ---- Orders ----
export async function createOrder(payload: CreateOrderRequest): Promise<Order> {
  const { data } = await apiClient.post<Order>('/orders', payload)
  return data
}

export async function fetchOrderById(id: number | string): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/orders/${id}`)
  return data
}

export async function fetchMyOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>('/orders')
  return data
}
