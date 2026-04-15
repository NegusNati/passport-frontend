import { ArrowUpRight, Clock3 } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'

import { type ArticleSummary } from '../schemas/article'

interface ArticleCardProps {
  article: ArticleSummary
  onClick?: () => void
  variant?: 'feature' | 'default' | 'compact'
  className?: string
}

export function ArticleCard({
  article,
  onClick,
  variant = 'default',
  className,
}: ArticleCardProps) {
  const isFeature = variant === 'feature'
  const isCompact = variant === 'compact'

  return (
    <Card
      className={cn(
        'group border-border/70 bg-card text-card-foreground flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.6rem] border shadow-[0_18px_40px_-28px_rgba(15,23,42,0.25)] transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_28px_70px_-36px_rgba(5,150,105,0.32)] active:scale-[0.992]',
        className,
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'bg-muted relative w-full overflow-hidden',
          isFeature ? 'aspect-[4/3] sm:aspect-[16/11]' : 'aspect-[16/10]',
        )}
      >
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
            loading="lazy"
            width={isFeature ? 960 : 640}
            height={isFeature ? 720 : 400}
            decoding="async"
          />
        ) : (
          <div className="bg-muted flex h-full w-full items-center justify-center">
            <div className="text-muted-foreground">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-slate-900 uppercase shadow-sm backdrop-blur"
          >
            {article.category}
          </Badge>
          {isFeature ? (
            <span className="rounded-full border border-white/30 bg-slate-950/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              Editor&apos;s Pick
            </span>
          ) : null}
        </div>
      </div>

      <CardHeader className="space-y-3 p-5 pb-3 sm:p-6 sm:pb-3">
        <div className="text-muted-foreground flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium tracking-[0.08em] uppercase">
          <span>{article.publishedDate}</span>
          <span className="bg-border/80 h-1 w-1 rounded-full" aria-hidden="true" />
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {article.readTime} min read
          </span>
        </div>
        <h3
          className={cn(
            'text-foreground max-w-[18ch] leading-[1.05] font-semibold tracking-[-0.03em] text-balance transition-colors duration-200 group-hover:text-emerald-900',
            isFeature
              ? 'text-[1.55rem] sm:text-[1.9rem]'
              : isCompact
                ? 'text-[1.05rem]'
                : 'text-[1.25rem]',
          )}
        >
          {article.title}
        </h3>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col p-5 pt-0 sm:p-6 sm:pt-0">
        <p
          className={cn(
            'text-muted-foreground min-w-0 text-sm leading-6',
            isFeature ? 'line-clamp-4 max-w-[56ch]' : 'line-clamp-3',
          )}
        >
          {article.excerpt}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-slate-200/70 pt-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                Byline
              </p>
              <p className="text-foreground mt-1 truncate text-sm font-medium">{article.author}</p>
            </div>
            <span className="text-foreground inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 transition-[transform,background-color,border-color] duration-200 group-hover:border-emerald-200 group-hover:bg-emerald-50">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>

        {!isCompact && article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-muted-foreground rounded-full border-slate-200/80 bg-white px-2.5 py-1 text-[11px]"
              >
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge
                variant="outline"
                className="text-muted-foreground rounded-full border-slate-200/80 bg-white px-2.5 py-1 text-[11px]"
              >
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ArticleCard
