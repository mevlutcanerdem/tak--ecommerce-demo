import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import { Skeleton } from '@/components/ui/Skeleton'

export function CategoryShowcase() {
  const { data: categories, isLoading, isError } = useCategories()

  if (isError) return null

  return (
    <section className="container-page py-20">
      <div className="mb-12 text-center">
        <span className="eyebrow">Kategoriler</span>
        <h2 className="mt-3 text-3xl sm:text-4xl">Size Özel Koleksiyonlar</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-charcoal-soft">
          Her tarza uygun, özenle seçilmiş dört ana kategoride en sevilen parçalarımızı
          keşfedin.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}

        {categories?.map((category, index) => (
          <Link
            key={category.id}
            to={`/urunler?category=${category.slug}`}
            className="group relative aspect-[3/4] overflow-hidden bg-cream-200 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-elegant group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent transition-opacity duration-300 group-hover:from-charcoal/90" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-5">
              <h3 className="font-display text-xl text-cream-50">{category.name}</h3>
              <span className="mt-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-gold-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Keşfet
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-3.5 w-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
