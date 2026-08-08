import { Link } from 'react-router-dom'
import { useFeaturedProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/product/ProductGrid'

export function FeaturedProducts() {
  const { data: products, isLoading, isError } = useFeaturedProducts()

  if (isError) {
    return null
  }

  return (
    <section className="bg-cream-100/60 py-20">
      <div className="container-page">
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <span className="eyebrow">Öne Çıkanlar</span>
          <h2 className="text-3xl sm:text-4xl">En Çok Beğenilen Parçalar</h2>
          <p className="max-w-xl text-sm text-charcoal-soft">
            Editörlerimizin seçtiği, en çok tercih edilen ve mevsimin öne çıkan
            tasarımlarını keşfedin.
          </p>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />

        {!isLoading && products && products.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Link to="/urunler" className="btn-secondary">
              Tüm Ürünleri Gör
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
