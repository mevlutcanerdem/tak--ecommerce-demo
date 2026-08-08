import { classNames } from '@/lib/utils'

interface RatingProps {
  value: number
  className?: string
  showValue?: boolean
}

export function Rating({ value, className, showValue = true }: RatingProps) {
  return (
    <div className={classNames('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => {
          const fillPercent = Math.max(0, Math.min(1, value - index)) * 100
          return (
            <span key={index} className="relative inline-block h-3.5 w-3.5">
              <svg
                viewBox="0 0 20 20"
                className="absolute inset-0 h-3.5 w-3.5 text-cream-300"
              >
                <path
                  fill="currentColor"
                  d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.9l-5.21 2.6 1-5.79-4.21-4.1 5.82-.85L10 1.5z"
                />
              </svg>
              <span
                className="absolute inset-0 overflow-hidden text-gold-500"
                style={{ width: `${fillPercent}%` }}
              >
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5">
                  <path
                    fill="currentColor"
                    d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.9l-5.21 2.6 1-5.79-4.21-4.1 5.82-.85L10 1.5z"
                  />
                </svg>
              </span>
            </span>
          )
        })}
      </div>
      {showValue && (
        <span className="text-xs text-charcoal-soft">{value.toFixed(1)}</span>
      )}
    </div>
  )
}
