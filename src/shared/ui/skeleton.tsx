import React from 'react'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
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
      className={[
        'animate-pulse rounded-md bg-muted',
        className
      ].join(' ')}
      style={style}
      {...props}
    />
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-4 sm:p-6">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full mb-4 rounded-lg" />
      
      {/* Title skeleton */}
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-3/4 mb-3" />
      
      {/* Excerpt skeleton */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-3" />
      
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
