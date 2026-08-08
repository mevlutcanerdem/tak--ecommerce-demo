interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  const decrement = () => onChange(Math.max(min, value - 1))
  const increment = () => onChange(Math.min(max, value + 1))

  return (
    <div className="inline-flex items-center border border-charcoal/15">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Azalt"
        className="flex h-11 w-11 items-center justify-center text-lg text-charcoal transition-colors hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        &minus;
      </button>
      <span className="flex h-11 w-12 items-center justify-center border-x border-charcoal/15 text-sm font-medium tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        aria-label="Artır"
        className="flex h-11 w-11 items-center justify-center text-lg text-charcoal transition-colors hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        +
      </button>
    </div>
  )
}
