import { Outlet, createFileRoute } from '@tanstack/react-router'

// Parent route for /passports. It must render an Outlet for child routes
export const Route = createFileRoute('/passports')({
  component: () => <Outlet />,
})
