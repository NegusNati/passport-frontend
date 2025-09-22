import React from 'react'
import { Container } from '@/shared/ui/container'
import { AdSlot } from '@/shared/ui/ad-slot'
import { ArticleGridSkeleton } from '@/shared/ui/skeleton'
import { ArticleSearchForm } from './ArticleSearchForm'
import { ArticleFilters } from './ArticleFilters'
import { ArticleCard } from './ArticleCard'
import { ArticlePagination } from './ArticlePagination'
import { 
  DUMMY_ARTICLES, 
  filterArticlesByCategory, 
  filterArticlesByTag, 
  searchArticles, 
  paginateArticles 
} from '../lib/dummy-data'
import type { ArticleFilters as ArticleFiltersType, ArticleSearch } from '../schemas/article'

export function ArticlesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filters, setFilters] = React.useState<ArticleFiltersType>({
    category: 'all',
    tag: 'all',
    dateRange: 'all'
  })
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)

  const pageSize = 12

  // Apply filters and search
  const filteredArticles = React.useMemo(() => {
    let articles = DUMMY_ARTICLES

    // Apply search query
    if (searchQuery.trim()) {
      articles = searchArticles(articles, searchQuery)
    }

    // Apply category filter
    articles = filterArticlesByCategory(articles, filters.category)

    // Apply tag filter
    articles = filterArticlesByTag(articles, filters.tag)

    return articles
  }, [searchQuery, filters])

  // Paginate results
  const paginationResult = React.useMemo(() => {
    return paginateArticles(filteredArticles, currentPage, pageSize)
  }, [filteredArticles, currentPage, pageSize])

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters])

  const handleSearch = (data: ArticleSearch) => {
    setIsLoading(true)
    setSearchQuery(data.query)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 300)
  }

  const handleFiltersChange = (newFilters: ArticleFiltersType) => {
    setIsLoading(true)
    setFilters(newFilters)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 200)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of results
    document.querySelector('[data-articles-grid]')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search Section */}
      <ArticleSearchForm 
        onSearch={handleSearch} 
        initialQuery={searchQuery}
      />

      {/* Ad Banner Section */}
      <section className="py-6 border-b border-border">
        <Container>
          <AdSlot 
            preset="sponsored" 
            orientation="horizontal" 
            className="rounded-xl"
          />
        </Container>
      </section>

      {/* Filters Section */}
      <ArticleFilters 
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Articles Grid Section */}
      <section className="py-12" data-articles-grid>
        <Container>
          {/* Results info */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {searchQuery && (
                <span>Search results for "{searchQuery}" • </span>
              )}
              {paginationResult.totalItems} articles found
            </div>
            
            {/* Clear search button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setIsLoading(true)
                  setTimeout(() => setIsLoading(false), 200)
                }}
                className="text-sm text-muted-foreground underline hover:text-foreground"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <ArticleGridSkeleton count={6} />
          ) : (
            <>
              {/* Articles Grid */}
              {paginationResult.articles.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginationResult.articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onClick={() => {
                        // TODO: Navigate to article detail page
                        console.log('Navigate to article:', article.id)
                      }}
                    />
                  ))}
                </div>
              ) : (
                // No results state
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 text-4xl text-muted-foreground">📄</div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    No articles found
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {searchQuery 
                      ? `No articles match your search for "${searchQuery}". Try different keywords or clear your search.`
                      : 'No articles match your current filters. Try adjusting your filters or clearing them.'
                    }
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setFilters({ category: 'all', tag: 'all', dateRange: 'all' })
                      setIsLoading(true)
                      setTimeout(() => setIsLoading(false), 200)
                    }}
                    className="mt-4 text-sm text-primary underline hover:opacity-90"
                  >
                    Show all articles
                  </button>
                </div>
              )}

              {/* Pagination */}
              {paginationResult.articles.length > 0 && (
                <ArticlePagination
                  currentPage={paginationResult.currentPage}
                  totalPages={paginationResult.totalPages}
                  hasNextPage={paginationResult.hasNextPage}
                  hasPrevPage={paginationResult.hasPrevPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </Container>
      </section>
    </div>
  )
}

export default ArticlesPage
