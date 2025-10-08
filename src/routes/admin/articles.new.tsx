import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useCreateAdminArticleMutation } from '@/features/admin/articles/api/create-article'
import { ArticleForm } from '@/features/admin/articles/components/ArticleForm'
import type { AdminArticleCreatePayload, AdminArticleUpdatePayload } from '@/features/admin/articles/schemas/create'

export const Route = createFileRoute('/admin/articles/new')({
  component: AdminArticleCreatePage,
})

function AdminArticleCreatePage() {
  const navigate = useNavigate({ from: '/admin/articles/new' })
  const mutation = useCreateAdminArticleMutation()

  async function handleSubmit(values: AdminArticleCreatePayload | AdminArticleUpdatePayload) {
    const article = await mutation.mutateAsync(values as AdminArticleCreatePayload)
    navigate({ to: '/admin/articles/$slug', params: { slug: article.slug }, search: (prev) => prev, replace: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create article</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Draft a new article and manage publication settings.
        </p>
      </div>

      <ArticleForm
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        errorMessage={mutation.error instanceof Error ? mutation.error.message : null}
      />
    </div>
  )
}
