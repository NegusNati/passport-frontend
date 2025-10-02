import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'

import { DataTable } from '@/features/table/DataTable'

import type { AdminArticle, AdminArticlesMeta } from '../schemas/article'
import type { ArticlesSearchParams } from '../schemas/filters'
import { ArticlesFilters } from './ArticlesFilters'

const statusClasses: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  published: 'bg-primary/10 text-primary',
  scheduled: 'bg-accent text-accent-foreground',
  archived: 'bg-muted text-muted-foreground',
}

type ArticlesTableProps = {
  data: AdminArticle[]
  meta: AdminArticlesMeta
  isLoading: boolean
  isError: boolean
  error: Error | null
  filters: Pick<ArticlesSearchParams, 'q' | 'status' | 'category' | 'tag'>
  onFilterChange: (updates: Partial<Pick<ArticlesSearchParams, 'q' | 'status' | 'category' | 'tag'>>) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onDelete?: (slug: string) => void
}

export function ArticlesTable({
  data,
  meta,
  isLoading,
  isError,
  error,
  filters,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
  onDelete,
}: ArticlesTableProps) {
  const columns = useMemo<ColumnDef<AdminArticle>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.title}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
       cell: ({ row }) => {
         const status = row.original.status
         const classes = statusClasses[status] ?? 'bg-muted text-muted-foreground'
         return (
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${classes}`}
              role="status"
              aria-label={`Status: ${status}`}
            >
              {status}
            </span>
          )
        },
      },
      {
        accessorKey: 'author',
        header: 'Author',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.author?.name ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'published_at',
        header: 'Published',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.published_at ? formatDate(row.original.published_at) : '—'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <a
              href={`/admin/articles/${row.original.slug}`}
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Edit
            </a>
            {onDelete ? (
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-md border border-destructive bg-destructive/10 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  if (confirm('Delete this article? This action can be undone later.')) {
                    onDelete(row.original.slug)
                  }
                }}
              >
                Delete
              </button>
            ) : null}
          </div>
        ),
      },
    ],
    [onDelete],
  )

  const fallbackPageSize = data.length > 0 ? data.length : 10
  const pageSize = meta.page_size ?? meta.per_page ?? fallbackPageSize
  const pageIndex = (meta.current_page ?? 1) - 1
  const pageCount = meta.last_page ?? 1

  return (
    <div className="space-y-4">
      <ArticlesFilters filters={filters} onFilterChange={onFilterChange} />
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        pagination={{
          pageCount,
          pageIndex,
          pageSize,
          onPageChange,
          onPageSizeChange,
        }}
        tableTitle="Articles"
      />
    </div>
  )
}

function formatDate(value: string) {
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dt)
}
