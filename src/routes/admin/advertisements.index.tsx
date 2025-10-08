import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState } from 'react'

import {
  type AdvertisementsSearch,
  useAdvertisementsQuery,
  useDeleteAdvertisementMutation,
} from '@/features/admin/advertisements'
import { AdminAdvertisementsTable } from '@/features/admin/advertisements/components/AdminAdvertisementsTable'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'

export const Route = createFileRoute('/admin/advertisements/')({
  component: AdminAdvertisementsPage,
})

function AdminAdvertisementsPage() {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 350)

  const [filters, setFilters] = useState<AdvertisementsSearch>({
    page: 1,
    page_size: 20,
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  // Merge filters with debounced search
  const queryFilters = {
    ...filters,
    search: debouncedSearch || undefined,
  }

  const query = useAdvertisementsQuery(queryFilters)
  const deleteMutation = useDeleteAdvertisementMutation()

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    // Reset to page 1 when search changes
    if (value !== searchInput) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }

  const handlePageChange = (pageIndex: number) => {
    setFilters((prev) => ({ ...prev, page: pageIndex + 1 })) // Convert 0-based to 1-based
  }

  const handlePageSizeChange = (page_size: number) => {
    setFilters((prev) => ({ ...prev, page_size, page: 1 }))
  }

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id)
  }

  const meta = query.data?.meta ?? {
    current_page: 1,
    per_page: 20,
    last_page: 1,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Advertisements</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage advertisement placements and track performance
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/advertisements/stats"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View Stats
          </a>
          <a
            href="/admin/advertisements/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Create Advertisement
          </a>
        </div>
      </div>

      <AdminAdvertisementsTable
        data={query.data?.data ?? []}
        pageIndex={meta.current_page - 1} // 0-based for DataTable
        pageSize={meta.per_page}
        pageCount={meta.last_page}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onDelete={handleDelete}
      />
    </div>
  )
}
