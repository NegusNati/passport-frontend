import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useCreateAdvertisementMutation } from '@/features/admin/advertisements/api/create-advertisement'
import { AdminAdvertisementForm } from '@/features/admin/advertisements/components/AdminAdvertisementForm'
import type { AdvertisementCreatePayload } from '@/features/admin/advertisements/schemas/create'

export const Route = createFileRoute('/admin/advertisements/new')({
  component: AdminAdvertisementCreatePage,
})

function AdminAdvertisementCreatePage() {
  const navigate = useNavigate({ from: '/admin/advertisements/new' })
  const mutation = useCreateAdvertisementMutation()

  async function handleSubmit(values: AdvertisementCreatePayload) {
    await mutation.mutateAsync(values)
    navigate({ to: '/admin/advertisements', replace: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create Advertisement</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Set up a new advertisement for your chosen placement
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <AdminAdvertisementForm
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          errorMessage={mutation.error instanceof Error ? mutation.error.message : null}
        />
      </div>
    </div>
  )
}
