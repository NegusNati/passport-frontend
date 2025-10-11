import { Link } from '@tanstack/react-router'

import CalendarImage from '@/assets/landingImages/calander_image.png'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Container } from '@/shared/ui/container'
import { Skeleton } from '@/shared/ui/skeleton'

import { useLandingArticlesQuery } from '../lib/LandingQuery'
import type { LandingArticleItem } from '../lib/LandingSchema'

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''

  try {
    return DATE_FORMATTER.format(new Date(dateStr))
  } catch {
    return ''
  }
}

function truncate(text: string | null | undefined, maxLength = 120): string {
  if (!text) return ''
  const normalized = text.trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength).trim()}...`
}

export function ArticleSection() {
  const { data, isLoading, isError } = useLandingArticlesQuery()
  const articles: LandingArticleItem[] = data?.data ?? []
  const showArticles = !isLoading && !isError && articles.length > 0

  return (
    <section id="blogs" className="py-14 sm:py-16">
      <Container>
        <div className="mb-6 flex flex-col items-center justify-center">
          <div>
            <h2 className="max-w-2xl text-center text-2xl font-bold tracking-tight">Articles</h2>
            <p className="text-muted-foreground mt-1 max-w-sm text-center text-sm">
              Your reliable source for passport articles, tips, and travel information.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="m-0 flex gap-6 overflow-x-auto p-1 sm:grid sm:grid-cols-2 sm:overflow-x-visible sm:p-0 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="m-0 max-w-xs min-w-[85vw] flex-shrink-0 overflow-hidden rounded-sm p-0 sm:max-w-none sm:min-w-0 sm:flex-shrink"
              >
                <CardContent className="flex h-full flex-col justify-between p-1">
                  <div className="space-y-2">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {showArticles && (
          <div
            className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent m-0 flex gap-6 overflow-x-auto p-1 sm:grid sm:grid-cols-2 sm:overflow-x-visible sm:p-0 lg:grid-cols-3"
            aria-label="Articles"
          >
            {articles.map((article) => {
              const imageSrc = article.featured_image_url || CalendarImage
              const date = formatDate(article.published_at)
              const excerpt = truncate(article.excerpt, 120)

              return (
                <Link
                  key={article.id}
                  to="/articles/$slug"
                  params={{ slug: article.slug }}
                  preload="intent"
                  className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="m-0 max-w-xs min-w-[85vw] flex-shrink-0 overflow-hidden rounded-sm p-0 transition-shadow hover:shadow-lg sm:max-w-none sm:min-w-0 sm:flex-shrink">
                    <CardContent className="flex h-full flex-col justify-between p-1">
                      <div className="space-y-2">
                        <img
                          src={imageSrc}
                          alt={article.title}
                          className="h-40 w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        {date ? (
                          <p className="text-muted-foreground text-xs">{date}</p>
                        ) : null}
                        <h3 className="text-lg font-semibold tracking-tight line-clamp-2">
                          {article.title}
                        </h3>
                        {excerpt ? (
                          <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        <div className="my-4 flex sm:justify-center md:my-8">
          <Button size="sm" className="px-4 font-semibold sm:w-auto" asChild>
            <Link to="/articles">View All</Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}

export default ArticleSection
