import { Container } from '@/shared/ui/container'
import { SAMPLE_CATEGORIES, SAMPLE_TAGS } from '../lib/dummy-data'
import type { ArticleFilters as ArticleFiltersType } from '../schemas/article'

interface ArticleFiltersProps {
  filters: ArticleFiltersType
  onFiltersChange: (filters: ArticleFiltersType) => void
}

export function ArticleFilters({ filters, onFiltersChange }: ArticleFiltersProps) {
  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category })
  }

  const handleTagChange = (tag: string) => {
    onFiltersChange({ ...filters, tag })
  }

  return (
    <section className="py-6 border-b border-neutral-200">
      <Container>
        <div className="space-y-4">
          <div className="text-sm font-medium text-neutral-700">
            Filter by
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {SAMPLE_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={[
                  'rounded-md border px-3 py-1 text-xs transition-colors',
                  'hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black/20',
                  filters.category === category
                    ? 'border-black bg-black text-white hover:bg-black/90'
                    : 'border-neutral-300 bg-white text-neutral-700'
                ].join(' ')}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>

          {/* Tag filters - only show if not filtering by 'all' categories */}
          {filters.category !== 'all' && (
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagChange(tag)}
                  className={[
                    'rounded-md border px-3 py-1 text-xs transition-colors',
                    'hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black/20',
                    filters.tag === tag
                      ? 'border-neutral-400 bg-neutral-100 text-neutral-900'
                      : 'border-neutral-300 bg-white text-neutral-600'
                  ].join(' ')}
                >
                  {tag === 'all' ? 'All Tags' : tag}
                </button>
              ))}
            </div>
          )}

          {/* Active filters indicator */}
          {(filters.category !== 'all' || filters.tag !== 'all') && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span>Active filters:</span>
              {filters.category !== 'all' && (
                <span className="rounded bg-neutral-100 px-2 py-1 text-xs">
                  Category: {filters.category}
                </span>
              )}
              {filters.tag !== 'all' && (
                <span className="rounded bg-neutral-100 px-2 py-1 text-xs">
                  Tag: {filters.tag}
                </span>
              )}
              <button
                type="button"
                onClick={() => onFiltersChange({ category: 'all', tag: 'all', dateRange: 'all' })}
                className="text-xs text-neutral-500 underline hover:text-neutral-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

export default ArticleFilters
