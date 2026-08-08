import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { PriceTag } from '@/components/ui/PriceTag'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const outOfStock = product.stock <= 0

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (outOfStock) return
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] ?? '',
        price: product.discountPrice ?? product.price,
        quantity: 1,
        stock: product.stock,
      },
      1,
    )
  }

  return (
    <Link
      to={`/urun/${product.slug}`}
      className="group flex flex-col overflow-hidden bg-white transition-shadow duration-300 ease-elegant hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-elegant group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew && <Badge variant="charcoal">Yeni</Badge>}
          {product.discountPrice != null && product.discountPrice < product.price && (
            <Badge variant="gold">İndirim</Badge>
          )}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/50">
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal">
              Stokta Yok
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={outOfStock}
          className="absolute inset-x-3 bottom-3 translate-y-3 rounded-sm bg-charcoal/95 py-2.5 text-xs font-medium uppercase tracking-widest text-cream-50 opacity-0 transition-all duration-300 ease-elegant hover:bg-gold-600 group-hover:translate-y-0 group-hover:opacity-100 disabled:pointer-events-none"
        >
          Sepete Ekle
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[11px] uppercase tracking-wide text-gold-600">
          {product.category.name}
        </span>
        <h3 className="font-display text-base leading-snug text-charcoal">
          {product.name}
        </h3>
        <Rating value={product.rating} />
        <PriceTag
          price={product.price}
          discountPrice={product.discountPrice}
          className="mt-1"
        />
      </div>
    </Link>
  )
}
