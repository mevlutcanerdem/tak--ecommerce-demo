import { Skeleton } from '@/components/ui/Skeleton'

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  )
}
