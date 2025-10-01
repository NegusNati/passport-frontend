import { createFileRoute, Outlet } from '@tanstack/react-router'

import { AdminShell } from '@/features/admin/layout/AdminShell'

export const Route = createFileRoute('/admin')({
  component: () => (
    <AdminShell>
      <Outlet />
    </AdminShell>
  ),
})


