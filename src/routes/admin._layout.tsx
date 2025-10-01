import { createFileRoute,Outlet } from '@tanstack/react-router'

import { AdminShell } from '@/features/admin/layout/AdminShell'
import { loadAdminUser } from '@/features/admin/lib/guards'

export const Route = createFileRoute('/admin/_layout')({
  loader: () => loadAdminUser(),
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  )
}
