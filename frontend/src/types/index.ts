export interface Category {
  id: number
  name: string
  slug: string
  imageUrl: string
}

export interface ProductCategoryRef {
  id: number
  name: string
  slug: string
}

export interface Product {
  id: number
  slug: string
  name: string
  description: string
  price: number
  discountPrice: number | null
  material: string
  stock: number
  rating: number
  featured: boolean
  isNew: boolean
  images: string[]
  category: ProductCategoryRef
}

export interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

export type SortOption = 'price_asc' | 'price_desc' | 'newest'

export interface ProductQueryParams {
  category?: string
  search?: string
  sort?: SortOption
  page?: number
  size?: number
}

export interface AuthUser {
  id: number
  name: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface ShippingDetails {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
}

export interface OrderItemRequest {
  productId: number
  quantity: number
}

export interface CreateOrderRequest {
  items: OrderItemRequest[]
  shipping: ShippingDetails
  email: string
}

export interface OrderItem {
  productId: number
  productName: string
  quantity: number
  price: number
  subtotal: number
}

export interface Order {
  id: number
  orderNumber: string
  status: string
  total: number
  items: OrderItem[]
  createdAt: string
  shipping?: ShippingDetails
  email?: string
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

export interface CartItem {
  productId: number
  slug: string
  name: string
  image: string
  price: number
  quantity: number
  stock: number
}
