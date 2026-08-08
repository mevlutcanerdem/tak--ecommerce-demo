import { calculateDiscountPercent, formatPrice } from '@/lib/utils'
import { classNames } from '@/lib/utils'

interface PriceTagProps {
  price: number
  discountPrice: number | null
  size?: 'sm' | 'lg'
  className?: string
}

export function PriceTag({
  price,
  discountPrice,
  size = 'sm',
  className,
}: PriceTagProps) {
  const hasDiscount = discountPrice != null && discountPrice < price
  const percent = calculateDiscountPercent(price, discountPrice)

  return (
    <div className={classNames('flex flex-wrap items-baseline gap-2', className)}>
      <span
        className={classNames(
          'font-display text-charcoal',
          size === 'lg' ? 'text-3xl' : 'text-base font-medium',
        )}
      >
        {formatPrice(hasDiscount ? (discountPrice as number) : price)}
      </span>
      {hasDiscount && (
        <>
          <span
            className={classNames(
              'text-charcoal-soft/70 line-through',
              size === 'lg' ? 'text-lg' : 'text-sm',
            )}
          >
            {formatPrice(price)}
          </span>
          {percent && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-500">
              %{percent} indirim
            </span>
          )}
        </>
      )}
    </div>
  )
}
