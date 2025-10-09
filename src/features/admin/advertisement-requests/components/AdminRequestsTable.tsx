import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { DataTable } from '@/features/table/DataTable'
import { Button } from '@/shared/ui/button'

import type {
  AdminAdvertisementRequestItem,
  AdminAdvertisementRequestUpdatePayload,
} from '../schemas/admin-advertisement-request'
import type { AdminAdvertisementRequestsSearch } from '../schemas/filters'
import { AdminRequestDetailDialog } from './AdminRequestDetailDialog'
import { AdminRequestsFilters } from './AdminRequestsFilters'
import { AdminRequestStatusBadge } from './AdminRequestStatusBadge'

interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
  has_more: boolean
  from?: number
  to?: number
}

type FilterState = Pick<
  AdminAdvertisementRequestsSearch,
  'status' | 'full_name' | 'company_name' | 'phone_number'
>

type AdminRequestsTableProps = {
  data: AdminAdvertisementRequestItem[]
  meta: PaginationMeta
  isLoading: boolean
  isError: boolean
  error: Error | null
  filters: FilterState
  onFilterChange: (updates: Partial<FilterState>) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onUpdate: (id: number, payload: AdminAdvertisementRequestUpdatePayload) => Promise<void>
  onDelete: (id: number) => Promise<void>
  isSaving?: boolean
}

export function AdminRequestsTable({
  data,
  meta,
  isLoading,
  isError,
  error,
  filters,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
  onUpdate,
  onDelete,
  isSaving,
}: AdminRequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<AdminAdvertisementRequestItem | null>(
    null,
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleView = useCallback((request: AdminAdvertisementRequestItem) => {
    setSelectedRequest(request)
    setDialogOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: number, fullName: string) => {
      if (!confirm(`Delete advertisement request from "${fullName}"?`)) return

      setDeletingId(id)
      try {
        await onDelete(id)
      } catch (error) {
        console.error('Failed to delete request:', error)
        alert('Failed to delete request. Please try again.')
      } finally {
        setDeletingId(null)
      }
    },
    [onDelete],
  )

  const formatDate = useCallback((dateString: string) => {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
      new Date(dateString),
    )
  }, [])

  const columns = useMemo<ColumnDef<AdminAdvertisementRequestItem>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
      },
      {
        accessorKey: 'full_name',
        header: 'Full Name',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-foreground">{row.original.full_name}</div>
            {row.original.email && (
              <div className="text-muted-foreground text-xs">{row.original.email}</div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'company_name',
        header: 'Company',
        cell: ({ row }) => (
          <span className="text-sm">{row.original.company_name || '—'}</span>
        ),
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone',
        cell: ({ row }) => <span className="text-sm">{row.original.phone_number}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <AdminRequestStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.created_at)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleView(row.original)}
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original.id, row.original.full_name)}
              disabled={deletingId === row.original.id}
              title="Delete request"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [deletingId, formatDate, handleDelete, handleView],
  )

  const fallbackPageSize = data.length > 0 ? data.length : 20
  const pageSize = meta.per_page ?? fallbackPageSize
  const pageIndex = (meta.current_page ?? 1) - 1
  const pageCount = meta.last_page ?? 1

  return (
    <div className="space-y-4">
      <AdminRequestsFilters filters={filters} onFilterChange={onFilterChange} />
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        pagination={{
          pageCount,
          pageIndex,
          pageSize,
          onPageChange,
          onPageSizeChange,
        }}
        tableTitle="Advertisement Requests"
      />

      {/* Detail Dialog */}
      <AdminRequestDetailDialog
        request={selectedRequest}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={onUpdate}
        isSaving={isSaving}
      />
    </div>
  )
}
