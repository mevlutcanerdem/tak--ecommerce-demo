import type { ReactNode } from 'react'
import { classNames } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'gold' | 'charcoal' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'gold', className }: BadgeProps) {
  const styles: Record<string, string> = {
    gold: 'bg-gold-500 text-white',
    charcoal: 'bg-charcoal text-cream-50',
    outline: 'border border-charcoal/20 text-charcoal bg-white/80',
  }

  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
