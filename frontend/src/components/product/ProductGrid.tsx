import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'

interface ProductGridProps {
  products: Product[] | undefined
  isLoading: boolean
  emptyMessage?: string
}

export function ProductGrid({ products, isLoading, emptyMessage }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            className="h-12 w-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 7.5 12 3 3 7.5m18 0-9 4.5m9-4.5v9L12 21m0-9L3 7.5m9 4.5v9m-9-9v9l9 4.5"
            />
          </svg>
        }
        title="Ürün bulunamadı"
        description={
          emptyMessage ??
          'Aramanızla eşleşen bir ürün bulunamadı. Farklı bir filtre deneyin.'
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
