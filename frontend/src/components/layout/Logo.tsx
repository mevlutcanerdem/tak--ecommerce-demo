import { Link } from 'react-router-dom'
import { classNames } from '@/lib/utils'

interface LogoProps {
  className?: string
  light?: boolean
}

export function Logo({ className, light = false }: LogoProps) {
  return (
    <Link
      to="/"
      className={classNames(
        'flex items-center gap-2 font-display text-2xl tracking-wide',
        light ? 'text-cream-50' : 'text-charcoal',
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 text-gold-500" fill="none">
        <path
          d="M16 3 4 12l12 17 12-17L16 3Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M4 12h24M11 12 16 3l5 9M11 12l5 17M21 12l-5 17"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>
      <span>Sumer Jewelry</span>
    </Link>
  )
}
