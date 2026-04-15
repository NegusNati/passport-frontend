import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ethiopic_numbers from '@/assets/landingImages/number.webp'
import {
  prefetchArticleDetail,
  useArticlesQuery,
  useCategoriesQuery,
  useTagsQuery,
} from '@/features/articles/lib/ArticlesQuery'
import type { ArticleApiItem } from '@/features/articles/lib/ArticlesSchema'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { useNetworkConditions } from '@/shared/hooks/useNetworkConditions'
import { AdSlot } from '@/shared/ui/ad-slot'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Container } from '@/shared/ui/container'
import { Input } from '@/shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Seo } from '@/shared/ui/Seo'
import { ArticleGridSkeleton } from '@/shared/ui/skeleton'

import type { ArticleFilters as ArticleFiltersType, ArticleSummary } from '../schemas/article'
import { ArticlePagination } from './ArticlePagination'

export function ArticlesPage() {
  const { t } = useTranslation('articles')
  const queryClient = useQueryClient()
  const network = useNetworkConditions()
  const [searchInput, setSearchInput] = useState('')
  const [committedSearchInput, setCommittedSearchInput] = useState('')
  const [filters, setFilters] = useState<ArticleFiltersType>({
    category: 'all',
    tag: 'all',
    dateRange: 'all',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [isSearching, setIsSearching] = useState(false)
  const perPage = 12

  const debouncedSearchInput = useDebouncedValue(searchInput, network.searchDebounceMs)
  const effectiveSearchInput = network.preferManualSearch
    ? committedSearchInput
    : debouncedSearchInput

  // Track searching state during debounce
  useEffect(() => {
    if (!network.preferManualSearch && searchInput.length >= network.searchMinCharacters) {
      setIsSearching(true)
      const timer = setTimeout(() => setIsSearching(false), network.searchDebounceMs)
      return () => clearTimeout(timer)
    }
    setIsSearching(false)
  }, [
    network.preferManualSearch,
    network.searchDebounceMs,
    network.searchMinCharacters,
    searchInput,
  ])

  useEffect(() => {
    if (!network.preferManualSearch) return
    if (searchInput.trim().length === 0 && committedSearchInput) {
      setCommittedSearchInput('')
    }
  }, [committedSearchInput, network.preferManualSearch, searchInput])

  const params = useMemo(
    () => ({
      per_page: perPage,
      page: currentPage,
      sort: 'published_at' as const,
      sort_dir: 'desc' as const,
      ...(effectiveSearchInput.trim().length >= network.searchMinCharacters && {
        title: effectiveSearchInput.trim(),
      }),
      ...(filters.category !== 'all' && { category: filters.category }),
      ...(filters.tag !== 'all' && { tag: filters.tag }),
    }),
    [effectiveSearchInput, filters, currentPage, network.searchMinCharacters, perPage],
  )

  const { data, isLoading } = useArticlesQuery(params)
  const categories = useCategoriesQuery()
  const tags = useTagsQuery()

  const rows = useMemo<ArticleApiItem[]>(() => data?.data ?? [], [data?.data])
  const meta = data?.meta

  const handleSearch = () => {
    // Reset to page 1 when explicitly searching
    setCurrentPage(1)
    if (network.preferManualSearch) {
      setCommittedSearchInput(searchInput.trim())
    }
    // Scroll to results
    document.querySelector('[data-articles-grid]')?.scrollIntoView({
      behavior:
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      block: 'start',
    })
  }

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }))
    setCurrentPage(1)
  }

  const handleTagChange = (value: string) => {
    setFilters((prev) => ({ ...prev, tag: value }))
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document.querySelector('[data-articles-grid]')?.scrollIntoView({
      behavior:
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      block: 'start',
    })
  }

  useEffect(() => {
    if (!network.allowsPrefetch || network.prefetchBudget === 0) return

    rows.slice(0, network.prefetchBudget).forEach((article) => {
      void prefetchArticleDetail(queryClient, article.slug)
    })
  }, [network.allowsPrefetch, network.prefetchBudget, queryClient, rows])

  const mapToUi = (a: ArticleApiItem): ArticleSummary => ({
    id: String(a.id),
    title: a.title,
    excerpt: a.excerpt ?? '',
    content: a.content ?? '',
    author: a.author?.name ?? '—',
    publishedDate: a.published_at
      ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(a.published_at))
      : '',
    category: a.categories[0]?.name ?? 'General',
    tags: a.tags.map((t) => t.slug),
    readTime: Math.max(1, a.reading_time ?? 0),
    imageUrl: a.featured_image_url ?? undefined,
    featured: false,
  })

  return (
    <div className="min-h-screen">
      <Seo
        title={t('list.seo.title')}
        description={t('list.seo.description')}
        path="/articles"
        extraLinks={getFeedLinks()}
      />

      {!network.isConstrained ? (
        <div className="absolute bottom-[40rem] left-0 z-[-100] ml-2 translate-y-1/4 transform opacity-70 md:opacity-90">
          <img
            src={ethiopic_numbers}
            alt=""
            aria-hidden="true"
            className="hidden h-150 w-150 lg:block"
            width="600"
            height="600"
            loading="lazy"
          />
        </div>
      ) : null}

      {/* Search Section */}
      <section className="py-2">
        <Container>
          <div className="my-4">
            <AdSlot
              orientation="vertical"
              preset="sponsored"
              className="rounded-3xl border border-emerald-100 bg-emerald-50/70"
            />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">{t('list.title')}</h1>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:gap-12">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row">
              {/* Search Input */}
              <div className="relative flex-1">
                <Input
                  placeholder={t('list.search.placeholder')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-11"
                />
                {isSearching && (
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                {t('list.search.button')}
              </Button>
            </div>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row">
              {/* Filter By Label */}
              <span className="text-muted-foreground hidden self-center text-sm md:inline-block">
                {t('list.filters.filterBy')}
              </span>

              {/* Category Filter */}
              <Select value={filters.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-11 w-full md:w-48">
                  <SelectValue placeholder={t('list.filters.category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('list.filters.allCategories')}</SelectItem>
                  {(categories.data?.data ?? []).map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Tags Filter */}
              <Select value={filters.tag} onValueChange={handleTagChange}>
                <SelectTrigger className="h-11 w-full md:w-48">
                  <SelectValue placeholder={t('list.filters.tags')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('list.filters.allTags')}</SelectItem>
                  {(tags.data?.data ?? []).map((t) => (
                    <SelectItem key={t.slug} value={t.slug}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12" data-articles-grid>
        <Container>
          {isLoading ? (
            <ArticleGridSkeleton count={8} />
          ) : rows.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {rows.map((a) => {
                  const article = mapToUi(a)
                  return (
                    <Link
                      key={a.id}
                      to="/articles/$slug"
                      params={{ slug: a.slug }}
                      search={(s: Record<string, unknown>) => s}
                      preload="intent"
                      onMouseEnter={() => {
                        if (!network.allowsPrefetch) return
                        void prefetchArticleDetail(queryClient, a.slug)
                      }}
                      onFocus={() => {
                        if (!network.allowsPrefetch) return
                        void prefetchArticleDetail(queryClient, a.slug)
                      }}
                      onTouchStart={() => {
                        if (!network.allowsPrefetch) return
                        void prefetchArticleDetail(queryClient, a.slug)
                      }}
                      className="flex h-full"
                    >
                      <Card className="flex h-full w-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
                        <div className="w-full flex-[3] overflow-hidden">
                          {article.imageUrl ? (
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              className="h-full w-full object-cover object-center"
                              loading="lazy"
                            />
                          ) : (
                            <div className="bg-muted flex h-full w-full items-center justify-center">
                              <div className="text-muted-foreground">
                                <svg
                                  className="h-12 w-12"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
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
                        <div className="flex flex-[2] flex-col">
                          <CardHeader className="pb-2">
                            <p className="text-primary text-sm">{article.publishedDate}</p>
                          </CardHeader>
                          <CardHeader className="pt-0 pb-3">
                            <h3 className="line-clamp-2 text-lg leading-tight font-bold">
                              {article.title}
                            </h3>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-muted-foreground line-clamp-2 text-sm">
                              {article.excerpt}
                            </p>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  )
                })}
              </div>

              {meta && (
                <ArticlePagination
                  currentPage={meta.current_page}
                  totalPages={meta.last_page}
                  hasNextPage={meta.has_more}
                  hasPrevPage={meta.current_page > 1}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-muted-foreground mb-4 text-4xl">{t('list.empty.icon')}</div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                {t('list.empty.title')}
              </h3>
              <p className="text-muted-foreground max-w-md text-sm">
                {searchInput
                  ? t('list.empty.descriptionWithSearch', { search: searchInput })
                  : t('list.empty.descriptionNoSearch')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchInput('')
                  setFilters({ category: 'all', tag: 'all', dateRange: 'all' })
                  setCurrentPage(1)
                }}
                className="text-primary mt-4 text-sm underline hover:opacity-90"
              >
                {t('list.empty.showAll')}
              </button>
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}

export default ArticlesPage

function getFeedLinks() {
  const base =
    (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL || ''
  const clean = String(base).replace(/\/$/, '')
  return [
    { rel: 'alternate', href: `${clean}/api/v1/feeds/articles.rss`, type: 'application/rss+xml' },
    { rel: 'alternate', href: `${clean}/api/v1/feeds/articles.atom`, type: 'application/atom+xml' },
  ]
}
