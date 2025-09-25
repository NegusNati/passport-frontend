import { createFileRoute } from '@tanstack/react-router'

import { useArticleQuery } from '@/features/articles/lib/ArticlesQuery'
import type { ArticleApiItem } from '@/features/articles/lib/ArticlesSchema'
import { Container } from '@/shared/ui/container'
import { Seo } from '@/shared/ui/Seo'

export const Route = createFileRoute('/articles/$slug')({
  component: ArticleDetail,
})

function ArticleDetail() {
  const { slug } = Route.useParams()
  const { data, isLoading, isError } = useArticleQuery(slug)
  const a = data?.data

  const base =
    (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL || ''
  const clean = String(base).replace(/\/$/, '')
  const feedLinks = [
    { rel: 'alternate', href: `${clean}/api/v1/feeds/articles.rss`, type: 'application/rss+xml' },
    { rel: 'alternate', href: `${clean}/api/v1/feeds/articles.atom`, type: 'application/atom+xml' },
  ]

  return (
    <div className="bg-background min-h-screen">
      <Seo
        title={a?.meta_title ?? a?.title}
        description={a?.meta_description ?? a?.excerpt ?? undefined}
        canonical={a?.canonical_url ?? undefined}
        ogImage={a?.og_image_url ?? a?.featured_image_url ?? undefined}
        extraLinks={feedLinks}
        schemaJson={a ? buildJsonLd(a) : undefined}
      />
      <ArticleBody isLoading={isLoading} isError={isError} article={a} />
    </div>
  )
}

function ArticleBody({
  isLoading,
  isError,
  article,
}: {
  isLoading: boolean
  isError: boolean
  article?: ArticleApiItem
}) {
  if (isLoading)
    return <div className="text-muted-foreground container mx-auto p-6 text-sm">Loading…</div>
  if (isError || !article)
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold">Article Not Found</h1>
        <p className="text-muted-foreground mt-2">Please check the URL and try again.</p>
      </div>
    )

  return (
    <section className="py-10">
      <Container>
        <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
          <header className="mb-6">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">{article.title}</h1>
            <p className="text-muted-foreground text-sm">
              {article.author?.name ? <span>By {article.author.name} • </span> : null}
              {article.published_at ? new Date(article.published_at).toLocaleDateString() : null}
              {article.reading_time ? <span> • {article.reading_time} min read</span> : null}
            </p>
          </header>

          {article.featured_image_url ? (
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="mb-6 w-full rounded-lg"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          ) : null}

          {article.content ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <p className="text-muted-foreground">No content.</p>
          )}
        </article>
      </Container>
    </section>
  )
}

function buildJsonLd(a: ArticleApiItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.meta_title ?? a.title,
    description: a.meta_description ?? a.excerpt,
    image: a.og_image_url ?? a.featured_image_url,
    author: a.author?.name,
    datePublished: a.published_at,
    dateModified: a.updated_at,
    mainEntityOfPage: a.canonical_url,
  }
}
