import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { SectionError, SectionLoading } from '@/features/admin/components/SectionFallback'
import { useAdminUsersQuery } from '@/features/admin/users/api/get-users'
import { UsersTable } from '@/features/admin/users/components/UsersTable'
import { UsersSearchSchema } from '@/features/admin/users/schemas/filters'

export const Route = createFileRoute('/admin/users')({
  validateSearch: UsersSearchSchema.parse,
  component: AdminUsersPage,
})

function AdminUsersPage() {
  const navigate = useNavigate({ from: '/admin/users' })
  const search = Route.useSearch()

  const usersQuery = useAdminUsersQuery(search)

  const data = usersQuery.data?.data ?? []
  const meta = usersQuery.data?.meta ?? {
    current_page: search.page,
    last_page: 1,
    page_size: search.page_size,
    total: data.length,
  }

  const handleFilterChange = (updates: Partial<typeof search>) => {
    const next = { ...search, ...updates, page: 1 }
    navigate({ search: next, replace: false })
  }

  const isLoading = usersQuery.isLoading && data.length === 0
  const isRefetching = usersQuery.isFetching && data.length > 0
  const error = usersQuery.error instanceof Error ? usersQuery.error : null

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">User management</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage user roles and statuses across the platform.
        </p>
      </div>

      <SectionLoading loading={isLoading} />
      <SectionError error={error} />

      {data.length > 0 ? (
        <UsersTable
          data={data}
          meta={meta}
          isLoading={isRefetching}
          isError={Boolean(error)}
          error={error}
          filters={{ search: search.search, role: search.role, is_admin: search.is_admin, email_verified: search.email_verified }}
          onFilterChange={handleFilterChange}
          onPageChange={(page) => navigate({ search: { ...search, page } })}
          onPageSizeChange={(page_size) => navigate({ search: { ...search, page: 1, page_size } })}
        />
      ) : null}
    </div>
  )
}
