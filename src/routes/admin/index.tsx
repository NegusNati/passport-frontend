import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: AdminOverview,
})

function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Welcome to the admin area. Use the shortcuts below to jump into common workflows.
        </p>
      </div>
      <div className="grid gap-4 rounded-lg border bg-card p-6 shadow-sm md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Quick actions</h2>
          <p className="text-sm text-muted-foreground">
            Choose a task to get started.
          </p>
        </div>
        <ul className="grid gap-3 text-sm text-muted-foreground">
          <li>
            <a
              href="/admin/articles"
              className="rounded-md border border-input px-3 py-2 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Review articles
            </a>
          </li>
          <li>
            <a
              href="/admin/users"
              className="rounded-md border border-input px-3 py-2 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Manage users
            </a>
          </li>
          <li>
            <a
              href="/admin/passports"
              className="rounded-md border border-input px-3 py-2 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Check passport records
            </a>
          </li>
          <li>
            <a
              href="/admin/pdf-import"
              className="rounded-md border border-input px-3 py-2 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Upload passport PDFs
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
