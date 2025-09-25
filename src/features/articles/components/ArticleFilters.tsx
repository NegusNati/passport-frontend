import { Container } from '@/shared/ui/container'

import type { ArticleFilters as ArticleFiltersType } from '../schemas/article'

interface ArticleFiltersProps {
  filters: ArticleFiltersType
  onFiltersChange: (filters: ArticleFiltersType) => void
  categories?: string[]
  tags?: string[]
}

export function ArticleFilters({
  filters,
  onFiltersChange,
  categories = ['all'],
  tags = ['all'],
}: ArticleFiltersProps) {
  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category })
  }

  const handleTagChange = (tag: string) => {
    onFiltersChange({ ...filters, tag })
  }

  return (
    <section className="border-border border-b py-6">
      <Container>
        <div className="space-y-4">
          <div className="text-foreground text-sm font-medium">Filter by</div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {(['all', ...categories.filter((c) => c !== 'all')] as string[]).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={[
                  'rounded-md border px-3 py-1 text-xs transition-colors',
                  'hover:bg-accent hover:text-accent-foreground focus:ring-ring focus:ring-2 focus:outline-none',
                  filters.category === category
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-foreground',
                ].join(' ')}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>

          {/* Tag filters - only show if not filtering by 'all' categories */}
          {filters.category !== 'all' && (
            <div className="flex flex-wrap gap-2">
              {(['all', ...tags.filter((t) => t !== 'all')] as string[]).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagChange(tag)}
                  className={[
                    'rounded-md border px-3 py-1 text-xs transition-colors',
                    'hover:bg-accent hover:text-accent-foreground focus:ring-ring focus:ring-2 focus:outline-none',
                    filters.tag === tag
                      ? 'border-border bg-muted text-foreground'
                      : 'border-input bg-background text-muted-foreground',
                  ].join(' ')}
                >
                  {tag === 'all' ? 'All Tags' : tag}
                </button>
              ))}
            </div>
          )}

          {/* Active filters indicator */}
          {(filters.category !== 'all' || filters.tag !== 'all') && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>Active filters:</span>
              {filters.category !== 'all' && (
                <span className="bg-muted rounded px-2 py-1 text-xs">
                  Category: {filters.category}
                </span>
              )}
              {filters.tag !== 'all' && (
                <span className="bg-muted rounded px-2 py-1 text-xs">Tag: {filters.tag}</span>
              )}
              <button
                type="button"
                onClick={() => onFiltersChange({ category: 'all', tag: 'all', dateRange: 'all' })}
                className="text-muted-foreground hover:text-foreground text-xs underline"
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
