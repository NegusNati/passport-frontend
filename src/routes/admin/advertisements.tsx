import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/advertisements')({
  component: AdminAdvertisementsLayout,
})

function AdminAdvertisementsLayout() {
  return <Outlet />
}
