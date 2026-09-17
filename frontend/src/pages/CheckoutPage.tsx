import { useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useCreateOrder } from '@/hooks/useOrders'
import { formatPrice } from '@/lib/utils'
import { getApiErrorMessage } from '@/lib/api'
import {
  validateShippingForm,
  type ShippingFormErrors,
  type ShippingFormValues,
} from '@/lib/validation'
import { classNames } from '@/lib/utils'

const initialValues: ShippingFormValues = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  email: '',
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const subtotal = useCartStore((state) => state.subtotal())
  const clearCart = useCartStore((state) => state.clearCart)
  const user = useAuthStore((state) => state.user)

  const [values, setValues] = useState<ShippingFormValues>({
    ...initialValues,
    fullName: user?.name ?? '',
    email: user?.email ?? '',
  })
  const [errors, setErrors] = useState<ShippingFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const createOrderMutation = useCreateOrder()
  // Guards against navigating away mid-submit: clearCart() empties the cart
  // right before we route to the confirmation page, and without this flag
  // the empty-cart check below would win that race and bounce back to /sepet.
  const orderPlacedRef = useRef(false)

  if (items.length === 0 && !orderPlacedRef.current) {
    return <Navigate to="/sepet" replace />
  }

  const handleChange =
    (field: keyof ShippingFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const validationErrors = validateShippingForm(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      const order = await createOrderMutation.mutateAsync({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shipping: {
          fullName: values.fullName.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
          postalCode: values.postalCode.trim(),
        },
        email: values.email.trim(),
      })

      orderPlacedRef.current = true
      clearCart()
      navigate(`/siparis-onay/${order.orderNumber}`, { state: { order } })
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          'Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
        ),
      )
    }
  }

  const inputClass = (field: keyof ShippingFormValues) =>
    classNames(
      'input-field',
      errors[field] && 'border-red-400 focus:border-red-400 focus:ring-red-400',
    )

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="mb-10 text-3xl sm:text-4xl">Ödeme</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <section>
            <h2 className="mb-4 font-display text-xl">Teslimat Bilgileri</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-field" htmlFor="fullName">
                  Ad Soyad
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={values.fullName}
                  onChange={handleChange('fullName')}
                  className={inputClass('fullName')}
                  placeholder="Ayşe Yılmaz"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="label-field" htmlFor="email">
                  E-posta
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  className={inputClass('email')}
                  placeholder="ornek@eposta.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="label-field" htmlFor="phone">
                  Telefon
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={handleChange('phone')}
                  className={inputClass('phone')}
                  placeholder="0532 123 45 67"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="label-field" htmlFor="address">
                  Adres
                </label>
                <textarea
                  id="address"
                  rows={3}
                  autoComplete="street-address"
                  value={values.address}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, address: e.target.value }))
                    setErrors((prev) => ({ ...prev, address: undefined }))
                  }}
                  className={inputClass('address')}
                  placeholder="Mahalle, cadde, sokak, no, daire"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="label-field" htmlFor="city">
                  Şehir
                </label>
                <input
                  id="city"
                  type="text"
                  autoComplete="address-level2"
                  value={values.city}
                  onChange={handleChange('city')}
                  className={inputClass('city')}
                  placeholder="İstanbul"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="label-field" htmlFor="postalCode">
                  Posta Kodu
                </label>
                <input
                  id="postalCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={values.postalCode}
                  onChange={handleChange('postalCode')}
                  className={inputClass('postalCode')}
                  placeholder="34000"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl">Ödeme Yöntemi</h2>
            <div className="flex items-start gap-3 border border-gold-300 bg-gold-50 p-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="mt-0.5 h-5 w-5 shrink-0 text-gold-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              <div className="text-sm text-charcoal">
                <p className="font-medium">Demo Ödeme (Kapıda Ödeme Simülasyonu)</p>
                <p className="mt-1 text-charcoal-soft">
                  Bu bir demo mağazadır. Gerçek bir ödeme işlemi gerçekleştirilmez, kart
                  bilgisi talep edilmez ve para transferi yapılmaz. Siparişiniz demo
                  amaçlı kayıt altına alınır.
                </p>
              </div>
            </div>
          </section>

          {submitError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={createOrderMutation.isPending}
            className="btn-primary w-full sm:w-auto sm:px-12"
          >
            {createOrderMutation.isPending
              ? 'Sipariş Oluşturuluyor...'
              : 'Siparişi Tamamla'}
          </button>
        </form>

        <aside className="h-fit border border-charcoal/10 bg-white p-6">
          <h2 className="mb-6 font-display text-xl">Sipariş Özeti</h2>
          <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-cream-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-[10px] font-semibold text-cream-50">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-charcoal">{item.name}</p>
                  <p className="text-xs text-charcoal-soft">{formatPrice(item.price)}</p>
                </div>
                <span className="text-sm font-medium text-charcoal">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 border-t border-charcoal/10 pt-4 text-sm">
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
          <Link
            to="/sepet"
            className="mt-4 block text-center text-sm text-charcoal-soft hover:text-gold-600"
          >
            Sepete Dön
          </Link>
        </aside>
      </div>
    </div>
  )
}

export default CheckoutPage
