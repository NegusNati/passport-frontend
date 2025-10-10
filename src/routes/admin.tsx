import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { queryClient } from '@/api/queryClient'
import { AdminShell } from '@/features/admin/layout/AdminShell'
import { type AdminPrimaryRole,resolveAdminPrimaryRole } from '@/features/admin/lib/roles'
import { authKeys, fetchMe } from '@/features/auth/api'
import type { User } from '@/features/auth/schemas/user'

declare module '@tanstack/react-router' {
  interface Register {
    context: {
      adminUser?: User
      adminRole?: AdminPrimaryRole
    }
  }
}

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    try {
      const user = await queryClient.ensureQueryData({
        queryKey: authKeys.user(),
        queryFn: fetchMe,
      })

      const role = resolveAdminPrimaryRole(user as User)

      return {
        adminUser: user as User,
        adminRole: role,
      }
    } catch (error) {
      throw redirect({ to: '/login', search: { redirect: '/admin' } })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const { adminUser, adminRole } = Route.useRouteContext()

  if (!adminUser) {
    throw redirect({ to: '/login', search: { redirect: '/admin' } })
  }

  return (
    <AdminShell user={adminUser} role={adminRole ?? 'user'}>
      <Outlet />
    </AdminShell>
  )
}


