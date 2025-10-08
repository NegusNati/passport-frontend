import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'

import { type ArticleSummary } from '../schemas/article'

interface ArticleCardProps {
  article: ArticleSummary
  onClick?: () => void
}

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  return (
    <Card
      className={[
        'group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
        'border-border bg-card text-card-foreground overflow-hidden',
      ].join(' ')}
      onClick={onClick}
    >
      {/* Article Image */}
      <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
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

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-card/90 text-card-foreground text-xs font-medium"
          >
            {article.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-0 m-0">
        <span className="text-muted-foreground text-xs">{article.publishedDate}</span>
        <h3 className="text-foreground group-hover:text-muted-foreground line-clamp-2 text-md leading-tight font-semibold">
          {article.title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-2 line-clamp-2 text-sm leading-relaxed">
          {article.excerpt}
        </p>

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium">{article.author}</span>
            <span>•</span>
            <span>{article.readTime} min read</span>
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground text-xs"
              >
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-muted-foreground text-xs">
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
