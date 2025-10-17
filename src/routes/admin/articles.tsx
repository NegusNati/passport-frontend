import { createFileRoute, Outlet } from '@tanstack/react-router'

import { ArticlesSearchSchema } from '@/features/admin/articles/schemas/filters'

export const Route = createFileRoute('/admin/articles')({
  beforeLoad: async () => {
    const { loadAdminUser } = await import('@/features/admin/lib/guards')
    await loadAdminUser({ 
      requiredPermission: 'manage-articles',
      redirectTo: '/admin'
    })
  },
  validateSearch: ArticlesSearchSchema.parse,
  component: AdminArticlesLayout,
})

function AdminArticlesLayout() {
  // Pure layout route to render children (index, new, edit) without fetching
  return <Outlet />
}
