import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/advertisements')({
  beforeLoad: async () => {
    const { loadAdminUser } = await import('@/features/admin/lib/guards')
    await loadAdminUser({
      requiredPermission: 'manage-advertisements',
      redirectTo: '/admin',
    })
  },
  component: AdminAdvertisementsLayout,
})

function AdminAdvertisementsLayout() {
  return <Outlet />
}
