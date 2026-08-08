import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      {icon && <div className="mb-5 text-gold-400">{icon}</div>}
      <h3 className="mb-2 font-display text-2xl text-charcoal">{title}</h3>
      {description && (
        <p className="mb-6 max-w-md text-sm text-charcoal-soft">{description}</p>
      )}
      {action}
    </div>
  )
}
