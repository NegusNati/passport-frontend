import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Check, Link as LinkIcon, Share2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import type { ListParams } from '@/features/articles/lib/ArticlesApi'
import { useArticleQuery, useArticlesQuery } from '@/features/articles/lib/ArticlesQuery'
import type { ArticleApiItem } from '@/features/articles/lib/ArticlesSchema'
import { AdSlot } from '@/shared/ui/ad-slot'
import { Badge } from '@/shared/ui/badge'
import { Container } from '@/shared/ui/container'
import { Seo } from '@/shared/ui/Seo'

export const Route = createFileRoute('/articles/$slug')({
  component: ArticleDetail,
})

function ArticleDetail() {
  const { slug } = Route.useParams()
  const navigate = useNavigate({ from: '/articles/$slug' })
  const { data, isLoading, isError } = useArticleQuery(slug)
  const a = data?.data
  const primaryCategory = a?.categories?.[0]?.slug
  const relatedParams = useMemo<ListParams>(
    () => ({
      per_page: 4,
      page: 1,
      sort: 'published_at',
      sort_dir: 'desc',
      category: primaryCategory ?? undefined,
    }),
    [primaryCategory],
  )
  const relatedQuery = useArticlesQuery(relatedParams, { enabled: Boolean(a) })
  const relatedArticles = useMemo(
    () =>
      (relatedQuery.data?.data ?? [])
        .filter((item) => item.slug !== a?.slug)
        .slice(0, 3),
    [relatedQuery.data?.data, a?.slug],
  )

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
        relatedArticles={relatedArticles}
        relatedIsLoading={relatedQuery.isLoading}
      />
    </div>
  )
}

function ArticleBody({
  isLoading,
  isError,
  article,
  onBack,
  relatedArticles,
  relatedIsLoading,
}: {
  isLoading: boolean
  isError: boolean
  article?: ArticleApiItem
  onBack: () => void
  relatedArticles: ArticleApiItem[]
  relatedIsLoading: boolean
}) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = useCallback(async () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.clipboard)
      return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link', error)
    }
  }, [])

  const handleShare = useCallback(async () => {
    if (typeof window === 'undefined') return
    const shareData = {
      title: article?.title ?? '',
      text: article?.excerpt ?? article?.title ?? '',
      url: window.location.href,
    }
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (error) {
        console.error('Share failed', error)
      }
    }
    handleCopyLink()
  }, [article?.title, article?.excerpt, handleCopyLink])

  if (isLoading)
    return <div className="text-muted-foreground container mx-auto p-6 text-sm">Loading…</div>
  if (isError || !article)
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold">Article Not Found</h1>
        <p className="text-muted-foreground mt-2">Please check the URL and try again.</p>
      </div>
    )

  const authorName = article.author?.name ?? 'Passport.ET Editorial'
  const publishedDate = article.published_at ? formatDisplayDate(article.published_at) : undefined
  const readingTime = estimateReadingTime(article)
  const headlineSummary = article.excerpt ?? 'Search for blog posts by blog title.'
  const categories = article.categories ?? []

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <div className="space-y-10 lg:space-y-12">
            <div className="border-border/60 bg-card/80 supports-[backdrop-filter]:bg-card/60 rounded-3xl border px-5 py-6 shadow-sm sm:px-8 sm:py-8">
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <button
                  type="button"
                  className="text-muted-foreground inline-flex items-center gap-2 font-medium transition hover:text-foreground"
                  onClick={onBack}
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Blogs
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="text-muted-foreground/80 hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:bg-muted"
                    aria-label="Share article"
                  >
                    <Share2 className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="text-muted-foreground/80 hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:bg-muted"
                    aria-label="Copy article link"
                  >
                    {copied ? <Check className="size-4 text-emerald-600" /> : <LinkIcon className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-3">
                  <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                    {article.title}
                  </h1>
                  <p className="text-muted-foreground text-base leading-relaxed">{headlineSummary}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">
                      {getInitials(authorName)}
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-foreground text-sm font-semibold leading-tight">{authorName}</p>
                      <p className="text-muted-foreground text-xs">
                        {publishedDate ?? '—'}
                        {publishedDate && readingTime ? ' · ' : null}
                        {readingTime ? `${readingTime} min read` : null}
                      </p>
                    </div>
                  </div>
                  {categories.length ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category.slug}
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 border-emerald-100 text-xs font-medium"
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  {copied ? (
                    <span className="text-emerald-600 text-xs font-medium">Link copied!</span>
                  ) : null}
                </div>
              </div>
            </div>

            {article.featured_image_url ? (
              <img
                src={article.featured_image_url}
                alt={article.title}
                className="w-full rounded-[1.75rem] object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <div
                className="bg-emerald-50 border border-emerald-100 h-64 w-full rounded-[1.75rem] sm:h-80"
                aria-hidden="true"
              />
            )}

            <div className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed">
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <p className="text-muted-foreground">No content.</p>
              )}
            </div>

            {relatedIsLoading ? (
              <p className="text-muted-foreground text-sm">Loading similar articles…</p>
            ) : relatedArticles.length ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-foreground text-xl font-semibold">Others like this</h2>
                  <Link
                    to="/articles"
                    className="text-primary text-sm font-medium underline-offset-4 hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedArticles.map((related) => (
                    <RelatedArticleCard key={related.id} article={related} />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="lg:hidden">
              <AdSlot
                orientation="horizontal"
                preset="sponsored"
                className="rounded-3xl border border-emerald-100 bg-emerald-50/70"
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <AdSlot
              orientation="vertical"
              preset="sponsored"
              className="rounded-3xl border border-emerald-100 bg-emerald-50/70"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

function RelatedArticleCard({ article }: { article: ArticleApiItem }) {
  const publishedDate = article.published_at ? formatDisplayDate(article.published_at) : '—'
  const readingTime = estimateReadingTime(article)
  const summarySource = article.excerpt ?? (article.content ? stripHtml(article.content) : '')
  const summary = summarySource ? truncate(summarySource, 120) : 'Read the full story.'

  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      preload="intent"
      className="bg-muted/40 hover:bg-muted/60 border-border/60 text-left flex h-full flex-col justify-between rounded-2xl border px-5 py-6 transition-shadow hover:shadow-sm"
    >
      <span className="text-emerald-700 text-xs font-semibold uppercase tracking-[0.3em]">
        {publishedDate}
      </span>
      <div className="mt-4 space-y-2">
        <h3 className="text-foreground text-base font-semibold leading-snug line-clamp-2">
          {article.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{summary}</p>
      </div>
      {readingTime ? (
        <span className="text-muted-foreground mt-4 text-xs font-medium">{readingTime} min read</span>
      ) : null}
    </Link>
  )
}

function formatDisplayDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

function estimateReadingTime(article: ArticleApiItem) {
  if (typeof article.reading_time === 'number' && article.reading_time > 0) {
    return article.reading_time
  }
  if (typeof article.word_count === 'number' && article.word_count > 0) {
    return Math.max(1, Math.round(article.word_count / 225))
  }
  return undefined
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'PE'
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function truncate(value: string, maxLength = 140) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1).trimEnd()}…`
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
