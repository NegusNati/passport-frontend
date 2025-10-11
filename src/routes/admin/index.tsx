import { createFileRoute, Link } from '@tanstack/react-router'

import { useAdminShellContext } from '@/features/admin/layout/AdminShell'

const quickActions = [
  { label: 'Review articles', to: '/admin/articles', description: 'Edit and publish content.' },
  { label: 'Manage users', to: '/admin/users', description: 'Invite and update account roles.' },
  {
    label: 'Check passport records',
    to: '/admin/passports',
    description: 'Browse passport submissions.',
  },
  {
    label: 'Upload passport PDFs',
    to: '/admin/pdf-import',
    description: 'Import batches for review.',
  },
]

export const Route = createFileRoute('/admin/')({
  component: AdminOverview,
})

function AdminOverview() {
  const { isPathAllowed } = useAdminShellContext()

  const visibleActions = quickActions.filter((action) => isPathAllowed(action.to))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Welcome to the admin area. Use the shortcuts below to jump into common workflows.
        </p>
      </div>
      <div className="bg-card grid gap-4 rounded-lg border p-6 shadow-sm md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Quick actions</h2>
          <p className="text-muted-foreground text-sm">Choose a task to get started.</p>
        </div>
        <ul className="text-muted-foreground grid gap-3 text-sm">
          {visibleActions.map((action) => (
            <li key={action.to}>
              <Link
                to={action.to}
                preload="intent"
                className="group border-input text-foreground hover:bg-accent hover:text-accent-foreground block rounded-md border px-3 py-2 font-medium transition-colors"
              >
                <span>{action.label}</span>
                <span className="text-muted-foreground block text-xs font-normal opacity-0 transition-opacity group-hover:opacity-100">
                  {action.description}
                </span>
              </Link>
            </li>
          ))}
          {visibleActions.length === 0 ? (
            <li className="border-border text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs">
              No shortcuts available for your role yet.
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  )
}
