import { useQuery } from '@tanstack/react-query'
import { fetchFeaturedProducts, fetchProductBySlug, fetchProducts } from '@/lib/api'
import type { ProductQueryParams } from '@/types'

export function useProducts(params: ProductQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    placeholderData: (previousData) => previousData,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: fetchFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug as string),
    enabled: Boolean(slug),
  })
}
