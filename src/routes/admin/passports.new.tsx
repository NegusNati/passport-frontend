import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useCreateAdminPassportMutation } from '@/features/admin/passports/api/create-passport'
import { PassportCreateForm } from '@/features/admin/passports/components/PassportCreateForm'

export const Route = createFileRoute('/admin/passports/new')({
  component: AdminPassportCreatePage,
})

function AdminPassportCreatePage() {
  const navigate = useNavigate({ from: '/admin/passports/new' })
  const mutation = useCreateAdminPassportMutation()

  async function handleSubmit(values: Parameters<typeof mutation.mutateAsync>[0]) {
    await mutation.mutateAsync(values)
    navigate({ to: '/admin/passports', search: (prev) => prev, replace: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add passport entry</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Fill in details for the new passport record.
        </p>
      </div>

      <PassportCreateForm
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        errorMessage={mutation.error instanceof Error ? mutation.error.message : null}
      />
    </div>
  )
}
