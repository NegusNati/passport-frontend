import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import {
  useArticlesQuery,
  useCategoriesQuery,
  useTagsQuery,
} from '@/features/articles/lib/ArticlesQuery'
import type { ArticleApiItem } from '@/features/articles/lib/ArticlesSchema'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { AdSlot } from '@/shared/ui/ad-slot'
import { Container } from '@/shared/ui/container'
import { Seo } from '@/shared/ui/Seo'
import { ArticleGridSkeleton } from '@/shared/ui/skeleton'

import type {
  ArticleFilters as ArticleFiltersType,
  ArticleSearch,
  ArticleSummary,
} from '../schemas/article'
import { ArticleCard } from './ArticleCard'
import { ArticleFilters } from './ArticleFilters'
import { ArticlePagination } from './ArticlePagination'
import { ArticleSearchForm } from './ArticleSearchForm'

export function ArticlesPage() {
  // const navigate = useNavigate({ from: '/articles' })
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ArticleFiltersType>({
    category: 'all',
    tag: 'all',
    dateRange: 'all',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 12

  const debounced = useDebouncedValue(searchQuery, 350)

  const params = useMemo(() => ({
    per_page: perPage,
    page: currentPage,
    sort: 'published_at' as const,
    sort_dir: 'desc' as const,
    // Prefer fast title prefix search; only send when >= 3 chars for performance
    ...(debounced.trim().length >= 3 && { title: debounced.trim() }),
    ...(filters.category !== 'all' && { category: filters.category }),
    ...(filters.tag !== 'all' && { tag: filters.tag }),
  }), [debounced, filters, currentPage, perPage])

  const { data, isLoading } = useArticlesQuery(params)
  const categories = useCategoriesQuery()
  const tags = useTagsQuery()

  const rows: ArticleApiItem[] = data?.data ?? []
  const meta = data?.meta

  const handleSearch = (d: ArticleSearch) => {
    setSearchQuery(d.query)
    setCurrentPage(1)
  }

  const handleFiltersChange = (newFilters: ArticleFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document
      .querySelector('[data-articles-grid]')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
        title="Articles"
        description="Discover our latest products and stories."
        path="/articles"
        extraLinks={getFeedLinks()}
      />

      <ArticleSearchForm
        onSearch={handleSearch}
        initialQuery={searchQuery}
        onQueryChange={(v) => setSearchQuery(v)}
      />

      <section className="border-border border-b py-6">
        <Container>
          <AdSlot preset="sponsored" orientation="horizontal"  />
        </Container>
      </section>

      <ArticleFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={(categories.data?.data ?? []).map((c) => c.slug)}
        tags={(tags.data?.data ?? []).map((t) => t.slug)}
      />

      <section className="py-12" data-articles-grid>
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {debounced.trim().length >= 3 && (
                <span>Search results for &ldquo;{debounced}&rdquo; • </span>
              )}
              {meta?.total ?? 0} articles found
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setCurrentPage(1)
                }}
                className="text-muted-foreground hover:text-foreground text-sm underline"
              >
                Clear search
              </button>
            )}
          </div>

          {isLoading ? (
            <ArticleGridSkeleton count={6} />
          ) : rows.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((a) => (
              <Link
                key={a.id}
                to="/articles/$slug"
                params={{ slug: a.slug }}
                search={(s: Record<string, unknown>) => s}
                preload="intent"
                className="block"
              >
                    <ArticleCard article={mapToUi(a)} />
                  </Link>
                ))}
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
              <div className="text-muted-foreground mb-4 text-4xl">📄</div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">No articles found</h3>
              <p className="text-muted-foreground max-w-md text-sm">
                {searchQuery
                  ? `No articles match your search for &ldquo;${searchQuery}&rdquo;. Try different keywords or clear your search.`
                  : 'No articles match your current filters. Try adjusting your filters or clearing them.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setFilters({ category: 'all', tag: 'all', dateRange: 'all' })
                  setCurrentPage(1)
                }}
                className="text-primary mt-4 text-sm underline hover:opacity-90"
              >
                Show all articles
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
