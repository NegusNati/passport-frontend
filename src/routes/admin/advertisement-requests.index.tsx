import { createFileRoute, useNavigate } from '@tanstack/react-router'

import {
  useAdminAdvertisementRequestsQuery,
  useDeleteAdminAdvertisementRequestMutation,
  useUpdateAdminAdvertisementRequestMutation,
} from '@/features/admin/advertisement-requests'
import { AdminRequestsTable } from '@/features/admin/advertisement-requests/components/AdminRequestsTable'
import {
  AdminAdvertisementRequestsSearch,
  type AdminAdvertisementRequestsSearch as AdminAdvertisementRequestsSearchType,
} from '@/features/admin/advertisement-requests/schemas/filters'

export const Route = createFileRoute('/admin/advertisement-requests/')({
  validateSearch: (search): AdminAdvertisementRequestsSearchType => {
    const result = AdminAdvertisementRequestsSearch.safeParse(search)
    return result.success ? result.data : AdminAdvertisementRequestsSearch.parse({})
  },
  component: AdminAdvertisementRequestsIndexPage,
})

function AdminAdvertisementRequestsIndexPage() {
  const navigate = useNavigate({ from: '/admin/advertisement-requests/' })
  const search = Route.useSearch()

  const requestsQuery = useAdminAdvertisementRequestsQuery(search)
  const updateMutation = useUpdateAdminAdvertisementRequestMutation()
  const deleteMutation = useDeleteAdminAdvertisementRequestMutation()

  const data = requestsQuery.data?.data ?? []
  const meta = requestsQuery.data?.meta ?? {
    current_page: search.page,
    last_page: 1,
    per_page: search.per_page,
    total: data.length,
    has_more: false,
  }

  const error = requestsQuery.error instanceof Error ? requestsQuery.error : null

  const handleFilterChange = (
    updates: Partial<
      Pick<
        AdminAdvertisementRequestsSearchType,
        'status' | 'full_name' | 'company_name' | 'phone_number'
      >
    >,
  ) => {
    const next = {
      ...search,
      ...updates,
      page: 1,
    }
    navigate({ search: next })
  }

  const handlePageChange = (page: number) => {
    navigate({ search: { ...search, page } })
  }

  const handlePageSizeChange = (per_page: number) => {
    navigate({ search: { ...search, per_page, page: 1 } })
  }

  const handleUpdate = async (id: number, payload: any) => {
    await updateMutation.mutateAsync({ id, payload })
  }

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Advertisement Requests</h1>
          <p className="text-muted-foreground text-sm">
            Manage advertisement requests from potential clients
          </p>
        </div>
      </div>

      <AdminRequestsTable
        data={data}
        meta={meta}
        isLoading={requestsQuery.isLoading}
        isError={!!error}
        error={error}
        filters={{
          status: search.status,
          full_name: search.full_name,
          company_name: search.company_name,
          phone_number: search.phone_number,
        }}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isSaving={updateMutation.isPending}
      />
    </div>
  )
}
