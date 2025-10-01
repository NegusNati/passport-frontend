import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { queryClient } from '@/api/queryClient'
import { adminKeys } from '@/features/admin/lib/keys'
import { ArticleForm } from '@/features/admin/articles/components/ArticleForm'
import { fetchAdminArticle, useAdminArticleQuery } from '@/features/admin/articles/api/get-article'
import { useUpdateAdminArticleMutation } from '@/features/admin/articles/api/update-article'
import { useDeleteAdminArticleMutation } from '@/features/admin/articles/api/delete-article'

export const Route = createFileRoute('/admin/articles/$slug')({
  loader: async ({ params }) => {
    await queryClient.ensureQueryData({
      queryKey: adminKeys.articles.detail(params.slug),
      queryFn: () => fetchAdminArticle(params.slug),
    })
    return { slug: params.slug }
  },
  component: AdminArticleEditPage,
})

function AdminArticleEditPage() {
  const { slug } = Route.useParams()
  const navigate = useNavigate({ from: '/admin/articles/$slug' })
  const articleQuery = useAdminArticleQuery(slug)
  const updateMutation = useUpdateAdminArticleMutation(slug)
  const deleteMutation = useDeleteAdminArticleMutation()

  const article = articleQuery.data?.data

  if (articleQuery.isLoading || !article) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit article</h1>
        <p className="text-muted-foreground text-sm">Loading article data…</p>
      </div>
    )
  }

  async function handleSubmit(values: Parameters<typeof updateMutation.mutateAsync>[0]) {
    await updateMutation.mutateAsync(values)
  }

  async function handleDelete() {
    if (!confirm('Delete this article? This action can be undone later via restore.')) return
    await deleteMutation.mutateAsync(slug)
    navigate({ to: '/admin/articles', search: (prev) => prev, replace: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit article</h1>
          <p className="text-muted-foreground mt-1 text-sm">Slug: {article.slug}</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-md border border-destructive bg-destructive/10 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      <ArticleForm
        article={article}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        errorMessage={
          updateMutation.error instanceof Error
            ? updateMutation.error.message
            : deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : null
        }
      />
    </div>
  )
}
