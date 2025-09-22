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
    <section className="py-6 border-b border-border">
      <Container>
        <div className="space-y-4">
          <div className="text-sm font-medium text-foreground">
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
                  'hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring',
                  filters.category === category
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-foreground'
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
                  'hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring',
                  filters.tag === tag
                    ? 'border-border bg-muted text-foreground'
                    : 'border-input bg-background text-muted-foreground'
                  ].join(' ')}
                >
                  {tag === 'all' ? 'All Tags' : tag}
                </button>
              ))}
            </div>
          )}

          {/* Active filters indicator */}
          {(filters.category !== 'all' || filters.tag !== 'all') && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Active filters:</span>
              {filters.category !== 'all' && (
                <span className="rounded bg-muted px-2 py-1 text-xs">
                  Category: {filters.category}
                </span>
              )}
              {filters.tag !== 'all' && (
                <span className="rounded bg-muted px-2 py-1 text-xs">
                  Tag: {filters.tag}
                </span>
              )}
              <button
                type="button"
                onClick={() => onFiltersChange({ category: 'all', tag: 'all', dateRange: 'all' })}
                className="text-xs text-muted-foreground underline hover:text-foreground"
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
