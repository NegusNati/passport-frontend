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
    const first_name = typeof search.first_name === 'string' ? search.first_name : undefined
    const middle_name = typeof search.middle_name === 'string' ? search.middle_name : undefined
    const last_name = typeof search.last_name === 'string' ? search.last_name : undefined
    return { page, page_size, request_number, location, first_name, middle_name, last_name }
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

  const sanitizeRequestNumber = (value: string) =>
    value
      .replace(/[^0-9A-Za-z]/g, '')
      .trim()
      .toUpperCase()

  const sanitizeNameSegment = (value: string) => {
    const trimmed = String(value ?? '').trim()
    if (!trimmed) return ''
    return trimmed
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ')
  }

  const handleFilterChange = (updates: Partial<typeof search>) => {
    const next = { ...search, ...updates, page: 1 }
    if (Object.prototype.hasOwnProperty.call(updates, 'request_number')) {
      next.request_number = updates.request_number
        ? sanitizeRequestNumber(String(updates.request_number))
        : undefined
    }
    if (Object.prototype.hasOwnProperty.call(updates, 'first_name')) {
      const v = sanitizeNameSegment(String(updates.first_name))
      next.first_name = v && v.length >= 3 ? v : undefined
    }
    if (Object.prototype.hasOwnProperty.call(updates, 'middle_name')) {
      const v = sanitizeNameSegment(String(updates.middle_name))
      next.middle_name = v && v.length >= 3 ? v : undefined
    }
    if (Object.prototype.hasOwnProperty.call(updates, 'last_name')) {
      const v = sanitizeNameSegment(String(updates.last_name))
      next.last_name = v && v.length >= 3 ? v : undefined
    }
    navigate({ search: next, replace: false })
  }

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
            first_name: search.first_name,
            middle_name: search.middle_name,
            last_name: search.last_name,
          }}
          onFilterChange={handleFilterChange}
          onPageChange={(page) => navigate({ search: { ...search, page } })}
          onPageSizeChange={(page_size) => navigate({ search: { ...search, page: 1, page_size } })}
        />
      ) : null}
    </div>
  )
}
