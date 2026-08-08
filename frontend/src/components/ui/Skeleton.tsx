import { classNames } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={classNames('skeleton rounded-sm', className)} />
}
