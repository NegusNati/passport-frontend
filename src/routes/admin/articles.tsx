import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useDeleteAdminArticleMutation } from '@/features/admin/articles/api/delete-article'
import { useAdminArticlesQuery } from '@/features/admin/articles/api/get-articles'
import { ArticlesTable } from '@/features/admin/articles/components/ArticlesTable'
import { ArticlesSearchSchema } from '@/features/admin/articles/schemas/filters'
import { SectionError, SectionLoading } from '@/features/admin/components/SectionFallback'

export const Route = createFileRoute('/admin/articles')({
  validateSearch: ArticlesSearchSchema.parse,
  component: AdminArticlesPage,
})

function AdminArticlesPage() {
  const navigate = useNavigate({ from: '/admin/articles' })
  const search = Route.useSearch()

  const articlesQuery = useAdminArticlesQuery(search)
  const data = articlesQuery.data?.data ?? []
  const meta = articlesQuery.data?.meta ?? {
    current_page: search.page,
    last_page: 1,
    page_size: search.page_size,
    total: data.length,
  }

  const deleteMutation = useDeleteAdminArticleMutation()

  const handleDelete = async (slug: string) => {
    try {
      await deleteMutation.mutateAsync(slug)
    } catch (error) {
      console.error('Failed to delete article', error)
    }
  }

  const isLoading = articlesQuery.isLoading && data.length === 0
  const isRefetching = articlesQuery.isFetching && data.length > 0
  const error = articlesQuery.error instanceof Error ? articlesQuery.error : null

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
          <p className="text-muted-foreground text-sm">
            Manage article content, publishing status, and metadata.
          </p>
        </div>
        <a
          href="/admin/articles/new"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          New article
        </a>
      </div>

      <SectionLoading loading={isLoading} />
      <SectionError error={error} />

      {data.length > 0 ? (
        <ArticlesTable
          data={data}
          meta={meta}
          isLoading={isRefetching}
          isError={Boolean(error)}
          error={error}
          filters={{
            q: search.q,
            status: search.status,
            category: search.category,
            tag: search.tag,
          }}
          onFilterChange={(updates) => {
            const next = {
              ...search,
              ...updates,
              page: 1,
            }
            navigate({ search: next })
          }}
          onPageChange={(page) => navigate({ search: { ...search, page } })}
          onPageSizeChange={(page_size) => navigate({ search: { ...search, page: 1, page_size } })}
          onDelete={handleDelete}
        />
      ) : null}
    </div>
  )
}
