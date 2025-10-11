import { createFileRoute } from '@tanstack/react-router'

import { queryClient } from '@/api/queryClient'
import { adminKeys } from '@/features/admin/lib/keys'
import { fetchAdminUser, useAdminUserQuery } from '@/features/admin/users/api/get-user'
import { useUpdateAdminUserMutation } from '@/features/admin/users/api/update-user'
import {
  type UpdateAdminUserFormValues,
  UserForm,
} from '@/features/admin/users/components/UserForm'

export const Route = createFileRoute('/admin/users/$userId')({
  loader: async ({ params }) => {
    await queryClient.ensureQueryData({
      queryKey: adminKeys.users.detail(params.userId),
      queryFn: () => fetchAdminUser(params.userId),
    })
    return { userId: params.userId }
  },
  component: AdminUserDetailPage,
})

function AdminUserDetailPage() {
  const { userId } = Route.useParams()
  const userQuery = useAdminUserQuery(userId)
  const mutation = useUpdateAdminUserMutation(userId)

  const user = userQuery.data?.data

  if (userQuery.isLoading || !user) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit user</h1>
        <p className="text-muted-foreground text-sm">Loading user data…</p>
      </div>
    )
  }

  async function handleSubmit(values: UpdateAdminUserFormValues) {
    await mutation.mutateAsync({
      role: values.role,
      status: values.status,
      is_admin: values.is_admin,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {user.first_name} {user.last_name}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Update account status and permissions.</p>
      </div>

      <UserForm
        user={user}
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        errorMessage={mutation.error instanceof Error ? mutation.error.message : null}
      />
    </div>
  )
}
