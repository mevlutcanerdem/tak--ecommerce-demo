import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useMyOrders } from '@/hooks/useOrders'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDate, formatPrice } from '@/lib/utils'

export function AccountPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { data: orders, isLoading, isError, refetch } = useMyOrders()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Hesabım</span>
          <h1 className="mt-3 text-3xl sm:text-4xl">
            Merhaba, {user?.name ?? 'Kullanıcı'}
          </h1>
          <p className="mt-2 text-sm text-charcoal-soft">{user?.email}</p>
        </div>
        <button type="button" onClick={handleLogout} className="btn-secondary">
          Çıkış Yap
        </button>
      </div>

      <h2 className="mb-6 font-display text-xl">Sipariş Geçmişim</h2>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          message="Siparişleriniz yüklenirken bir hata oluştu."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (!orders || orders.length === 0) && (
        <EmptyState
          title="Henüz siparişiniz yok"
          description="İlk siparişinizi vererek koleksiyonumuzu keşfetmeye başlayın."
          action={
            <Link to="/urunler" className="btn-primary">
              Alışverişe Başla
            </Link>
          }
        />
      )}

      {!isLoading && orders && orders.length > 0 && (
        <div className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 py-5"
            >
              <div>
                <p className="font-medium text-charcoal">#{order.orderNumber}</p>
                <p className="text-xs text-charcoal-soft">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-sm text-charcoal-soft">{order.items.length} ürün</div>
              <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gold-600">
                {order.status}
              </span>
              <span className="font-display text-lg text-charcoal">
                {formatPrice(order.total)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AccountPage
