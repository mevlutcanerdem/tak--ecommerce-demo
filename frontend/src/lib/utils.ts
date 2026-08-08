const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export function calculateDiscountPercent(
  price: number,
  discountPrice: number | null,
): number | null {
  if (discountPrice == null || discountPrice >= price) return null
  return Math.round(((price - discountPrice) / price) * 100)
}
