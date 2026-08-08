import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatPrice } from '@/lib/utils'

export function CartPage() {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const subtotal = useCartStore((state) => state.subtotal())

  if (items.length === 0) {
    return (
      <div className="container-page py-14">
        <EmptyState
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              className="h-14 w-14"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.876-4.99 2.13-7.5H5.25M7.5 14.25 5.106 5.272M6.75 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          }
          title="Sepetiniz boş"
          description="Henüz sepetinize ürün eklemediniz. Koleksiyonumuza göz atarak beğendiğiniz parçaları keşfedin."
          action={
            <Link to="/urunler" className="btn-primary">
              Alışverişe Başla
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="mb-10 text-3xl sm:text-4xl">Sepetim</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-charcoal/10">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 py-6 sm:gap-6">
              <Link
                to={`/urun/${item.slug}`}
                className="h-24 w-24 shrink-0 overflow-hidden bg-cream-100 sm:h-32 sm:w-32"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      to={`/urun/${item.slug}`}
                      className="font-display text-base text-charcoal hover:text-gold-600 sm:text-lg"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-charcoal-soft">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    aria-label="Ürünü kaldır"
                    className="text-charcoal-soft transition-colors hover:text-red-500"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.productId, q)}
                    max={item.stock}
                  />
                  <span className="font-display text-base text-charcoal">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit border border-charcoal/10 bg-white p-6">
          <h2 className="mb-6 font-display text-xl">Sipariş Özeti</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-charcoal-soft">
              <span>Ara Toplam</span>
              <span className="text-charcoal">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal-soft">
              <span>Kargo</span>
              <span className="text-charcoal">Ücretsiz</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-charcoal/10 pt-4 font-display text-lg">
            <span>Toplam</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link to="/odeme" className="btn-primary mt-6 w-full">
            Ödemeye Geç
          </Link>
          <Link
            to="/urunler"
            className="mt-3 block text-center text-sm text-charcoal-soft hover:text-gold-600"
          >
            Alışverişe Devam Et
          </Link>
        </aside>
      </div>
    </div>
  )
}

export default CartPage
