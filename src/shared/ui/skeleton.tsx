import { type HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
}

export function Skeleton({ className = '', width, height, ...props }: SkeletonProps) {
  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  }

  return (
    <div
      className={['bg-muted animate-pulse rounded-md', className].join(' ')}
      style={style}
      {...props}
    />
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="border-border bg-card text-card-foreground rounded-xl border p-4 shadow-sm sm:p-6">
      {/* Image skeleton */}
      <Skeleton className="mb-4 h-48 w-full rounded-lg" />

      {/* Title skeleton */}
      <Skeleton className="mb-2 h-6 w-full" />
      <Skeleton className="mb-3 h-6 w-3/4" />

      {/* Excerpt skeleton */}
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-3 h-4 w-5/6" />

      {/* Author and date skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default Skeleton
