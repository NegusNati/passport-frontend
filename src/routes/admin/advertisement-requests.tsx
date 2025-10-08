import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/advertisement-requests')({
  component: AdminAdvertisementRequestsLayout,
})

function AdminAdvertisementRequestsLayout() {
  return <Outlet />
}
