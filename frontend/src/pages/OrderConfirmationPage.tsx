import { Link, useLocation, useParams } from 'react-router-dom'
import type { Order } from '@/types'
import { formatDate, formatPrice } from '@/lib/utils'

export function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const location = useLocation()
  const order = (location.state as { order?: Order } | null)?.order

  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-50 text-gold-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <span className="eyebrow">Sipariş Alındı</span>
        <h1 className="mt-3 text-3xl sm:text-4xl">
          Teşekkürler, siparişiniz oluşturuldu!
        </h1>
        <p className="mt-4 text-sm text-charcoal-soft">
          Sipariş numaranız{' '}
          <span className="font-medium text-charcoal">#{orderNumber}</span>. Bu bir demo
          mağaza olduğu için gerçek bir kargo veya ödeme işlemi gerçekleşmeyecektir.
        </p>
      </div>

      {order ? (
        <div className="mx-auto mt-12 max-w-2xl border border-charcoal/10 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-charcoal-soft">
                Sipariş No
              </p>
              <p className="font-medium text-charcoal">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-charcoal-soft">Tarih</p>
              <p className="font-medium text-charcoal">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-charcoal-soft">Durum</p>
              <p className="font-medium text-gold-600">{order.status}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-charcoal">
                  {item.productName}{' '}
                  <span className="text-charcoal-soft">&times; {item.quantity}</span>
                </span>
                <span className="font-medium text-charcoal">
                  {formatPrice(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t border-charcoal/10 pt-4 font-display text-lg">
            <span>Toplam</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      ) : (
        <p className="mx-auto mt-8 max-w-md text-center text-sm text-charcoal-soft">
          Sipariş detaylarını görüntülemek için hesabım sayfasındaki sipariş geçmişinizi
          kontrol edebilirsiniz.
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link to="/urunler" className="btn-primary">
          Alışverişe Devam Et
        </Link>
        <Link to="/hesabim" className="btn-secondary">
          Siparişlerim
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
