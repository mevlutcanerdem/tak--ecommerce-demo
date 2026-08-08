import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ErrorState } from '@/components/ui/ErrorState'
import { classNames } from '@/lib/utils'
import type { SortOption } from '@/types'

const PAGE_SIZE = 12

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'price_asc', label: 'Fiyat: Artan' },
  { value: 'price_desc', label: 'Fiyat: Azalan' },
]

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const category = searchParams.get('category') ?? undefined
  const search = searchParams.get('search') ?? undefined
  const sort = (searchParams.get('sort') as SortOption | null) ?? 'newest'
  const page = Number(searchParams.get('page') ?? '0')

  const { data: categories } = useCategories()
  const { data, isLoading, isError, refetch, isFetching } = useProducts({
    category,
    search,
    sort,
    page,
    size: PAGE_SIZE,
  })

  useEffect(() => {
    setSearchInput(search ?? '')
  }, [search])

  const updateParams = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    })
    if (!('page' in updates)) {
      next.delete('page')
    }
    setSearchParams(next)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ search: searchInput.trim() || undefined })
  }

  const activeCategoryName = useMemo(
    () => categories?.find((c) => c.slug === category)?.name,
    [categories, category],
  )

  const totalPages = data?.totalPages ?? 0

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-10 text-center">
        <span className="eyebrow">Koleksiyon</span>
        <h1 className="mt-3 text-3xl sm:text-4xl">
          {activeCategoryName ? activeCategoryName : 'Tüm Ürünler'}
        </h1>
        {search && (
          <p className="mt-3 text-sm text-charcoal-soft">
            &ldquo;{search}&rdquo; için arama sonuçları
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        {/* Sidebar filters */}
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <button
            type="button"
            onClick={() => setIsFilterOpen((v) => !v)}
            className="mb-4 flex w-full items-center justify-between border border-charcoal/15 px-4 py-3 text-sm font-medium lg:hidden"
          >
            Filtrele
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className={classNames(
                'h-4 w-4 transition-transform',
                isFilterOpen && 'rotate-180',
              )}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          <div
            className={classNames(
              'space-y-8',
              isFilterOpen ? 'block' : 'hidden lg:block',
            )}
          >
            <form onSubmit={handleSearchSubmit}>
              <label className="label-field">Ürün Ara</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Örn: kalp kolye"
                  className="input-field"
                />
              </div>
            </form>

            <div>
              <h3 className="label-field mb-3">Kategoriler</h3>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => updateParams({ category: undefined })}
                  className={classNames(
                    'rounded-sm px-3 py-2 text-left text-sm transition-colors',
                    !category
                      ? 'bg-charcoal text-cream-50'
                      : 'text-charcoal-soft hover:bg-cream-100',
                  )}
                >
                  Tümü
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => updateParams({ category: cat.slug })}
                    className={classNames(
                      'rounded-sm px-3 py-2 text-left text-sm transition-colors',
                      category === cat.slug
                        ? 'bg-charcoal text-cream-50'
                        : 'text-charcoal-soft hover:bg-cream-100',
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product listing */}
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-charcoal-soft">
              {data ? `${data.totalElements} ürün bulundu` : ' '}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-charcoal-soft">
                Sırala:
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="border border-charcoal/15 bg-white px-3 py-2 text-sm text-charcoal focus:border-gold-500 focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isError ? (
            <ErrorState
              onRetry={() => refetch()}
              message="Ürünler yüklenirken bir hata oluştu."
            />
          ) : (
            <>
              <ProductGrid
                products={data?.content}
                isLoading={isLoading}
                emptyMessage="Bu filtrelerle eşleşen ürün bulunamadı. Farklı bir kategori veya arama terimi deneyin."
              />

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 0 || isFetching}
                    onClick={() => updateParams({ page: String(page - 1) })}
                    className="btn-secondary px-4 py-2 text-xs disabled:opacity-30"
                  >
                    Önceki
                  </button>
                  <span className="px-3 text-sm text-charcoal-soft">
                    Sayfa {page + 1} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages - 1 || isFetching}
                    onClick={() => updateParams({ page: String(page + 1) })}
                    className="btn-secondary px-4 py-2 text-xs disabled:opacity-30"
                  >
                    Sonraki
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopPage
