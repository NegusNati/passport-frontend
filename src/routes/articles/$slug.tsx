import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Check, Link as LinkIcon, Share2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ListParams } from '@/features/articles/lib/ArticlesApi'
import { useArticleQuery, useArticlesQuery } from '@/features/articles/lib/ArticlesQuery'
import type { ArticleApiItem } from '@/features/articles/lib/ArticlesSchema'
import { loadI18nNamespaces } from '@/i18n'
import { LexicalViewer } from '@/shared/components/rich-text/LexicalViewer'
import { AdSlot } from '@/shared/ui/ad-slot'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Container } from '@/shared/ui/container'
import { Seo } from '@/shared/ui/Seo'
import { ArticleDetailSkeleton, RelatedArticleCardSkeleton } from '@/shared/ui/skeleton'

export const Route = createFileRoute('/articles/$slug')({
  loader: async () => {
    await loadI18nNamespaces(['articles'])
  },
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
    () => (relatedQuery.data?.data ?? []).filter((item) => item.slug !== a?.slug).slice(0, 3),
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

  const { t } = useTranslation('articles')

  if (isLoading) return <ArticleDetailSkeleton />
  if (isError || !article)
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold">{t('detail.notFound.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('detail.notFound.description')}</p>
      </div>
    )

  const authorName = article.author?.name ?? t('detail.author.defaultName')
  const publishedDate = article.published_at ? formatDisplayDate(article.published_at) : undefined
  const readingTime = estimateReadingTime(article)
  const headlineSummary = article.excerpt ?? 'Search for blog post by blog title'

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <div className="mx-auto max-w-6xl md:grid md:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] md:items-start md:gap-10 lg:gap-12">
          <div className="mx-auto max-w-3xl space-y-8 md:mx-0 md:max-w-none md:pr-6 lg:pr-10">
            <div className="md:hidden">
              <AdSlot
                orientation="horizontal"
                preset="sponsored"
                className="rounded-3xl border border-emerald-100 bg-emerald-50/70"
              />
            </div>

            {/* Navigation Bar */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-medium transition"
                onClick={onBack}
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                {t('detail.navigation.back')}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="text-muted-foreground/80 hover:text-foreground border-border hover:bg-muted flex h-9 w-9 items-center justify-center rounded-full border transition"
                  aria-label={t('detail.navigation.share')}
                >
                  <Share2 className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-muted-foreground/80 hover:text-foreground border-border hover:bg-muted flex h-9 w-9 items-center justify-center rounded-full border transition"
                  aria-label={t('detail.navigation.copyLink')}
                >
                  {copied ? (
                    <Check className="size-4 text-emerald-600" />
                  ) : (
                    <LinkIcon className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Title and Subtitle */}
            <div className="space-y-4 text-center">
              <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">{headlineSummary}</p>
            </div>

            {/* Author Section */}
            <div className="flex items-center justify-center gap-3">
              <span className="bg-primary flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white">
                {getInitials(authorName)}
              </span>
              <div className="space-y-0.5">
                <p className="text-foreground text-base font-semibold">{authorName}</p>
                <p className="text-muted-foreground text-sm">
                  {publishedDate ?? '—'}
                  {publishedDate && readingTime ? ' · ' : null}
                  {readingTime ? t('detail.author.readTime', { time: readingTime }) : null}
                </p>
              </div>
            </div>

            {/* Featured Image */}
            {article.featured_image_url ? (
              <img
                src={article.featured_image_url}
                alt={article.title}
                className="w-full rounded-2xl object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <div className="bg-muted h-64 w-full rounded-2xl sm:h-80" aria-hidden="true" />
            )}

            {/* Article Content */}
            <div className="max-w-none leading-relaxed">
              <LexicalViewer content={article.content ?? ''} />
            </div>

            {/* Related Articles */}
            {relatedIsLoading ? (
              <div className="space-y-6">
                <h2 className="text-foreground text-xl font-semibold">
                  {t('detail.related.title')}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <RelatedArticleCardSkeleton />
                  <RelatedArticleCardSkeleton />
                </div>
              </div>
            ) : relatedArticles.length ? (
              <div className="space-y-6">
                <h2 className="text-foreground text-xl font-semibold">
                  {t('detail.related.title')}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
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
          <aside className="hidden md:sticky md:top-24 md:block">
            <AdSlot
              orientation="vertical"
              preset="sponsored"
              className="rounded-3xl border border-emerald-100 bg-emerald-50/70"
            />
          </aside>
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
  const { t } = useTranslation('articles')
  const publishedDate = article.published_at ? formatDisplayDate(article.published_at) : '—'
  const summarySource = article.excerpt ?? (article.content ? stripHtml(article.content) : '')
  const summary = summarySource ? truncate(summarySource, 80) : t('detail.related.readMore')

  return (
    <Link to="/articles/$slug" params={{ slug: article.slug }} preload="intent" className="block">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="bg-muted aspect-16/9 w-full overflow-hidden">
          {article.featured_image_url ? (
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="h-full w-full object-cover object-center"
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
        </div>
        <CardHeader className="pb-2">
          <p className="text-primary text-sm">{publishedDate}</p>
        </CardHeader>
        <CardHeader className="pt-0 pb-3">
          <h3 className="line-clamp-2 text-base leading-tight font-bold">{article.title}</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground line-clamp-2 text-sm">{summary}</p>
        </CardContent>
      </Card>
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
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'PE'
  )
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
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
