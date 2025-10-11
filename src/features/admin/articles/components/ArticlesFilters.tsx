import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import type { ArticlesSearchParams } from '../schemas/filters'

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'archived', label: 'Archived' },
]

type FilterState = Pick<ArticlesSearchParams, 'q' | 'status' | 'category' | 'tag'>

type ArticlesFiltersProps = {
  filters: FilterState
  onFilterChange: (updates: Partial<FilterState>) => void
}

export function ArticlesFilters({ filters, onFilterChange }: ArticlesFiltersProps) {
  return (
    <div className="bg-background grid gap-4 rounded-lg border p-4 md:grid-cols-4">
      <div className="grid gap-2">
        <Label htmlFor="article-search">Search</Label>
        <Input
          id="article-search"
          value={filters.q ?? ''}
          onChange={(event) => onFilterChange({ q: event.target.value || undefined })}
          placeholder="Title or keyword"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="article-status">Status</Label>
        <Select
          value={filters.status ?? undefined}
          onValueChange={(value) =>
            onFilterChange({ status: (value || undefined) as ArticlesSearchParams['status'] })
          }
        >
          <SelectTrigger id="article-status">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__" disabled>
              All statuses
            </SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="article-category">Category</Label>
        <Input
          id="article-category"
          value={filters.category ?? ''}
          onChange={(event) => onFilterChange({ category: event.target.value || undefined })}
          placeholder="Category slug"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="article-tag">Tag</Label>
        <Input
          id="article-tag"
          value={filters.tag ?? ''}
          onChange={(event) => onFilterChange({ tag: event.target.value || undefined })}
          placeholder="Tag slug"
        />
      </div>
    </div>
  )
}
