import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useArticleQuery } from '@/features/articles/lib/ArticlesQuery'
import type { ArticleApiItem } from '@/features/articles/lib/ArticlesSchema'
import { Container } from '@/shared/ui/container'
import { Seo } from '@/shared/ui/Seo'
import { Badge } from '@/shared/ui/badge'

export const Route = createFileRoute('/articles/$slug')({
  component: ArticleDetail,
})

function ArticleDetail() {
  const { slug } = Route.useParams()
  const navigate = useNavigate({ from: '/articles/$slug' })
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
        path={!a?.canonical_url ? `/articles/${slug}` : undefined}
        ogImage={a?.og_image_url ?? a?.featured_image_url ?? undefined}
        extraLinks={feedLinks}
        schemaJson={a ? buildJsonLd(a) : undefined}
      />
      <ArticleBody
        isLoading={isLoading}
        isError={isError}
        article={a}
        onBack={() => navigate({ to: '/articles' })}
      />
    </div>
  )
}

function ArticleBody({
  isLoading,
  isError,
  article,
  onBack,
}: {
  isLoading: boolean
  isError: boolean
  article?: ArticleApiItem
  onBack: () => void
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
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_320px]">
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <button
              type="button"
              className="text-muted-foreground mb-4 text-sm underline hover:text-foreground"
              onClick={onBack}
            >
              ← Back to Articles
            </button>
            <header className="mb-6">
              <h1 className="mb-2 text-3xl font-bold tracking-tight">{article.title}</h1>
              <p className="text-muted-foreground text-sm">
                {article.author?.name ? <span>By {article.author.name} • </span> : null}
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString()
                  : null}
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

            {article.excerpt ? (
              <p className="text-muted-foreground text-lg">{article.excerpt}</p>
            ) : null}

            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p className="text-muted-foreground">No content.</p>
            )}
          </article>

          {/* Meta panel */}
          <aside className="border-border bg-card text-card-foreground sticky top-4 h-fit rounded-xl border p-4">
            <h2 className="mb-3 text-base font-semibold">Article details</h2>
            <dl className="space-y-2 text-sm">
              {article.author?.name && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-muted-foreground">Author</dt>
                  <dd className="col-span-2">{article.author.name}</dd>
                </div>
              )}
              {article.categories?.length ? (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-muted-foreground">Categories</dt>
                  <dd className="col-span-2 flex flex-wrap gap-1">
                    {article.categories.map((c) => (
                      <Badge key={c.slug} variant="secondary">
                        {c.name}
                      </Badge>
                    ))}
                  </dd>
                </div>
              ) : null}
              {article.tags?.length ? (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-muted-foreground">Tags</dt>
                  <dd className="col-span-2 flex flex-wrap gap-1">
                    {article.tags.map((t) => (
                      <Badge key={t.slug} variant="outline">
                        {t.name}
                      </Badge>
                    ))}
                  </dd>
                </div>
              ) : null}
              {typeof article.word_count === 'number' && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-muted-foreground">Words</dt>
                  <dd className="col-span-2">{article.word_count}</dd>
                </div>
              )}
              {article.created_at && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-muted-foreground">Created</dt>
                  <dd className="col-span-2">
                    {new Date(article.created_at).toLocaleString()}
                  </dd>
                </div>
              )}
              {article.updated_at && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd className="col-span-2">
                    {new Date(article.updated_at).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>
            {article.canonical_url ? (
              <div className="mt-3">
                <a
                  href={article.canonical_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm underline"
                >
                  View canonical URL
                </a>
              </div>
            ) : null}
          </aside>
        </div>
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
