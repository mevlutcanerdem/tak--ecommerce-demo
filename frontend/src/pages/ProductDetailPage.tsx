import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProduct, useProducts } from '@/hooks/useProducts'
import { PriceTag } from '@/components/ui/PriceTag'
import { Rating } from '@/components/ui/Rating'
import { Badge } from '@/components/ui/Badge'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useCartStore } from '@/store/cartStore'
import { classNames } from '@/lib/utils'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, isError, refetch } = useProduct(slug)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const { data: relatedData } = useProducts({
    category: product?.category.slug,
    size: 4,
  })

  const relatedProducts = useMemo(
    () => relatedData?.content.filter((p) => p.id !== product?.id).slice(0, 4),
    [relatedData, product],
  )

  if (isLoading) {
    return (
      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <ErrorState
        title="Ürün bulunamadı"
        message="Aradığınız ürün mevcut değil ya da kaldırılmış olabilir."
        onRetry={() => refetch()}
      />
    )
  }

  const outOfStock = product.stock <= 0

  const handleAddToCart = () => {
    if (outOfStock) return
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] ?? '',
        price: product.discountPrice ?? product.price,
        quantity,
        stock: product.stock,
      },
      quantity,
    )
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2200)
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <nav className="mb-8 flex items-center gap-2 text-xs text-charcoal-soft">
        <Link to="/" className="hover:text-gold-600">
          Anasayfa
        </Link>
        <span>/</span>
        <Link to="/urunler" className="hover:text-gold-600">
          Ürünler
        </Link>
        <span>/</span>
        <Link
          to={`/urunler?category=${product.category.slug}`}
          className="hover:text-gold-600"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="aspect-square w-full overflow-hidden bg-cream-100">
            <img
              src={product.images[activeImage] ?? product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image + index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={classNames(
                    'aspect-square overflow-hidden border-2 transition-colors',
                    activeImage === index ? 'border-gold-500' : 'border-transparent',
                  )}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-gold-600">
            {product.category.name}
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-4">
            <Rating value={product.rating} />
            <span className="text-xs text-charcoal-soft">
              {product.stock > 0 ? `${product.stock} adet stokta` : 'Stokta yok'}
            </span>
          </div>

          <PriceTag
            price={product.price}
            discountPrice={product.discountPrice}
            size="lg"
            className="mt-6"
          />

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="outline">{product.material}</Badge>
            {product.isNew && <Badge variant="charcoal">Yeni Sezon</Badge>}
          </div>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-charcoal-soft">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              max={product.stock || 1}
            />
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="btn-primary flex-1 sm:flex-none sm:px-10"
            >
              {outOfStock ? 'Stokta Yok' : 'Sepete Ekle'}
            </button>
          </div>

          {justAdded && (
            <p className="mt-4 text-sm font-medium text-gold-600 animate-fade-in">
              &ldquo;{product.name}&rdquo; sepetinize eklendi.{' '}
              <Link to="/sepet" className="underline">
                Sepete git
              </Link>
            </p>
          )}

          <div className="mt-10 space-y-3 border-t border-charcoal/10 pt-6 text-sm text-charcoal-soft">
            <div className="flex items-center gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-5 w-5 shrink-0 text-gold-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375M3.375 18.75V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.5M14.25 18.75V7.5"
                />
              </svg>
              2-4 iş günü içinde ücretsiz kargo
            </div>
            <div className="flex items-center gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-5 w-5 shrink-0 text-gold-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              14 gün içinde ücretsiz iade
            </div>
            <div className="flex items-center gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-5 w-5 shrink-0 text-gold-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              Güvenli demo ödeme deneyimi
            </div>
          </div>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 text-2xl sm:text-3xl">Benzer Ürünler</h2>
          <ProductGrid products={relatedProducts} isLoading={false} />
        </section>
      )}
    </div>
  )
}

export default ProductDetailPage
