import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { DataTable } from '@/features/table/DataTable'
import { Button } from '@/shared/ui/button'

import type { Advertisement } from '../schemas/advertisement'
import { AdminAdvertisementStatusBadge } from './AdminAdvertisementStatusBadge'
import { AdvertisementsToolbar } from './AdminAdvertisementsTableWrapper'

type AdminAdvertisementsTableProps = {
  data: Advertisement[]
  pageIndex: number
  pageSize: number
  pageCount: number
  isLoading: boolean
  isError: boolean
  error: Error | null
  searchValue: string
  onSearchChange: (value: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onDelete: (id: number) => Promise<void>
}

export function AdminAdvertisementsTable({
  data,
  pageIndex,
  pageSize,
  pageCount,
  isLoading,
  isError,
  error,
  searchValue,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onDelete,
}: AdminAdvertisementsTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete advertisement "${title}"? This action cannot be undone.`)) return

    setDeletingId(id)
    try {
      await onDelete(id)
    } catch (error) {
      console.error('Failed to delete advertisement:', error)
      alert('Failed to delete advertisement. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
      new Date(dateString),
    )
  }

  const columns = useMemo<ColumnDef<Advertisement>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <span className="font-medium">#{row.original.id}</span>,
        enableSorting: false,
      },
      {
        accessorKey: 'ad_title',
        header: 'Title',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-foreground">{row.original.ad_title}</div>
            <div className="text-muted-foreground text-xs">{row.original.client_name}</div>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <AdminAdvertisementStatusBadge status={row.original.status} />,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'package_type',
        header: 'Package & Payment',
        cell: ({ row }) => (
          <div className="text-sm">
            <div className="font-medium capitalize">{row.original.package_type}</div>
            <div className="text-muted-foreground text-xs">
              ${parseFloat(row.original.payment_amount).toFixed(2)} · {' '}
              <span className="capitalize">{row.original.payment_status}</span>
            </div>
          </div>
        ),
        enableSorting: false,
      },
      {
        id: 'performance',
        header: 'Performance',
        cell: ({ row }) => (
          <div className="text-sm">
            <div>
              <span className="text-muted-foreground">CTR:</span>{' '}
              <span className="font-medium">{row.original.ctr.toFixed(2)}%</span>
            </div>
            <div className="text-muted-foreground text-xs">
              {row.original.impressions.toLocaleString()} imp · {row.original.clicks.toLocaleString()}{' '}
              clicks
            </div>
          </div>
        ),
        enableSorting: false,
      },
      {
        id: 'date_range',
        header: 'Date Range',
        cell: ({ row }) => (
          <div className="text-sm">
            <div>{formatDate(row.original.ad_published_date)}</div>
            {row.original.ad_ending_date ? (
              <div className="text-muted-foreground text-xs">to {formatDate(row.original.ad_ending_date)}</div>
            ) : (
              <div className="text-muted-foreground text-xs">No end date</div>
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <a
              href={`/admin/advertisements/${row.original.id}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original.id, row.original.ad_title)}
              disabled={deletingId === row.original.id}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [deletingId],
  )

  // Status filter options for the DataTable toolbar
  const filterableColumns = [
    {
      id: 'status',
      title: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Expired', value: 'expired' },
      ],
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isError={isError}
      error={error}
      toolbar={(props) => (
        <AdvertisementsToolbar
          {...props}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          filterableColumns={filterableColumns}
        />
      )}
      pagination={{
        pageIndex,
        pageSize,
        pageCount,
        onPageChange,
        onPageSizeChange,
      }}
    />
  )
}
