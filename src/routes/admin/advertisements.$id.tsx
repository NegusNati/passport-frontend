import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useAdvertisementQuery } from '@/features/admin/advertisements/api/get-advertisement'
import { useUpdateAdvertisementMutation } from '@/features/admin/advertisements/api/update-advertisement'
import { AdminAdvertisementForm } from '@/features/admin/advertisements/components/AdminAdvertisementForm'
import type { AdvertisementUpdatePayload } from '@/features/admin/advertisements/schemas/create'

export const Route = createFileRoute('/admin/advertisements/$id')({
  component: AdminAdvertisementEditPage,
})

function AdminAdvertisementEditPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const query = useAdvertisementQuery(Number(id))
  const mutation = useUpdateAdvertisementMutation()

  async function handleSubmit(values: AdvertisementUpdatePayload) {
    await mutation.mutateAsync({ id: Number(id), data: values })
    navigate({ to: '/admin/advertisements', replace: true })
  }

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-muted" />
          <div className="h-4 w-96 rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <p className="text-destructive font-medium">Failed to load advertisement</p>
          <p className="text-muted-foreground text-sm">
            {query.error?.message || 'Unknown error'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Advertisement</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Update advertisement details and assets
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <AdminAdvertisementForm
          advertisement={query.data}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          errorMessage={mutation.error instanceof Error ? mutation.error.message : null}
        />
      </div>
    </div>
  )
}
