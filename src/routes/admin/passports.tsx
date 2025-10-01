import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { SectionError, SectionLoading } from '@/features/admin/components/SectionFallback'
import { useAdminPassportsQuery } from '@/features/admin/passports/api/get-passports'
import { PassportsAdminTable } from '@/features/admin/passports/components/PassportsAdminTable'

export const Route = createFileRoute('/admin/passports')({
  validateSearch: (search: Record<string, unknown>) => {
    const page = Number(search.page ?? 1) || 1
    const page_size = Number(search.page_size ?? 20) || 20
    const request_number = typeof search.request_number === 'string' ? search.request_number : undefined
    const location = typeof search.location === 'string' ? search.location : undefined
    return { page, page_size, request_number, location }
  },
  component: AdminPassportsPage,
})

function AdminPassportsPage() {
  const navigate = useNavigate({ from: '/admin/passports' })
  const search = Route.useSearch()

  const passportsQuery = useAdminPassportsQuery(search)
  const data = passportsQuery.data?.data ?? []
  const meta = passportsQuery.data?.meta ?? {
    current_page: search.page,
    last_page: 1,
    page_size: search.page_size,
    total: data.length,
  }

  const isLoading = passportsQuery.isLoading && data.length === 0
  const isRefetching = passportsQuery.isFetching && data.length > 0
  const error = passportsQuery.error instanceof Error ? passportsQuery.error : null

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Passport management</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Review and curate passport entries imported from PDF batches or manual entry.
        </p>
      </div>

      <SectionLoading loading={isLoading} />
      <SectionError error={error} />

      {data.length > 0 ? (
        <PassportsAdminTable
          data={data}
          meta={meta}
          isLoading={isRefetching}
          isError={Boolean(error)}
          error={error}
          filters={{
            request_number: search.request_number,
            location: search.location,
          }}
          onFilterChange={(updates) =>
            navigate({
              search: {
                ...search,
                ...updates,
                page: 1,
              },
              replace: false,
            })
          }
          onPageChange={(page) => navigate({ search: { ...search, page } })}
          onPageSizeChange={(page_size) => navigate({ search: { ...search, page: 1, page_size } })}
        />
      ) : null}
    </div>
  )
}
