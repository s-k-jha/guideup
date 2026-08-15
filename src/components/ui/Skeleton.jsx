import { cn } from '../../lib/utils'

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-muted', className)}
      {...props}
    />
  )
}

export function SkeletonText({ lines = 1, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3.5', i === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-5', className)}>
      <Skeleton className="h-4 w-2/3 mb-3" />
      <Skeleton className="h-3 w-1/3 mb-4" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  )
}
