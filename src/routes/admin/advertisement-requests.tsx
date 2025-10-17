import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/advertisement-requests')({
  beforeLoad: async () => {
    const { loadAdminUser } = await import('@/features/admin/lib/guards')
    await loadAdminUser({
      requiredPermission: 'manage-advertisements',
      redirectTo: '/admin',
    })
  },
  component: AdminAdvertisementRequestsLayout,
})

function AdminAdvertisementRequestsLayout() {
  return <Outlet />
}
