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
    <div className="border-border bg-card rounded-xl border overflow-hidden shadow-sm">
      {/* Image skeleton - takes 60% height */}
      <Skeleton className="h-48 w-full" />

      {/* Content section - takes 40% height */}
      <div className="p-4 space-y-3">
        {/* Date skeleton */}
        <Skeleton className="h-4 w-24" />

        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Excerpt skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    </div>
  )
}

export function ArticleGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function RelatedArticleCardSkeleton() {
  return (
    <div className="border-border bg-card rounded-xl border overflow-hidden shadow-sm">
      {/* Image skeleton */}
      <Skeleton className="aspect-16/9 w-full" />

      {/* Content section */}
      <div className="p-4 space-y-3">
        {/* Date skeleton */}
        <Skeleton className="h-4 w-24" />

        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>

        {/* Excerpt skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </div>
  )
}

export function ArticleDetailSkeleton() {
  return (
    <section className="py-10 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Navigation Bar skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>

          {/* Title and Subtitle skeleton */}
          <div className="space-y-4 text-center">
            <div className="space-y-3">
              <Skeleton className="mx-auto h-12 w-full max-w-3xl" />
              <Skeleton className="mx-auto h-12 w-5/6 max-w-2xl" />
            </div>
            <Skeleton className="mx-auto h-6 w-full max-w-2xl" />
          </div>

          {/* Author Section skeleton */}
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>

          {/* Featured Image skeleton */}
          <Skeleton className="h-80 w-full rounded-2xl" />

          {/* Article Content skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="pt-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="pt-4" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Related Articles skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-6 sm:grid-cols-2">
              <RelatedArticleCardSkeleton />
              <RelatedArticleCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skeleton
