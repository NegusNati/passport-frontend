import { createFileRoute, Outlet } from '@tanstack/react-router'

import { ArticlesSearchSchema } from '@/features/admin/articles/schemas/filters'

export const Route = createFileRoute('/admin/articles')({
  validateSearch: ArticlesSearchSchema.parse,
  component: AdminArticlesLayout,
})

function AdminArticlesLayout() {
  // Pure layout route to render children (index, new, edit) without fetching
  return <Outlet />
}
