import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { DataTable } from '@/features/table/DataTable'
import type { AdminPassport, AdminPassportsMeta } from '../schemas/passport'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

const locationOptions = ['ICS branch office, Jimma', 'Addis Ababa', 'Dire Dawa']

type PassportsAdminTableProps = {
  data: AdminPassport[]
  meta: AdminPassportsMeta
  isLoading: boolean
  isError: boolean
  error: Error | null
  filters: {
    request_number?: string
    location?: string
  }
  onFilterChange: (updates: Partial<PassportsAdminTableProps['filters']>) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function PassportsAdminTable({
  data,
  meta,
  isLoading,
  isError,
  error,
  filters,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
}: PassportsAdminTableProps) {
  const columns = useMemo<ColumnDef<AdminPassport>[]>(
    () => [
      {
        accessorKey: 'full_name',
        header: 'Name',
        cell: ({ row }) => (
          <span className="text-sm font-medium text-foreground">{row.original.full_name}</span>
        ),
      },
      {
        accessorKey: 'request_number',
        header: 'Request #',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">{row.original.request_number}</span>
        ),
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.location}</span>,
      },
      {
        accessorKey: 'date_of_publish',
        header: 'Published',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{formatDate(row.original.date_of_publish)}</span>
        ),
      },
    ],
    [],
  )

  const fallbackPageSize = data.length > 0 ? data.length : 10
  const pageSize = meta.page_size ?? meta.per_page ?? fallbackPageSize
  const pageIndex = (meta.current_page ?? 1) - 1
  const pageCount = meta.last_page ?? 1

  return (
    <div className="space-y-4">
      <PassportsFilters filters={filters} onFilterChange={onFilterChange} />
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
        tableTitle="Passports"
      />
    </div>
  )
}

type FilterProps = {
  filters: PassportsAdminTableProps['filters']
  onFilterChange: PassportsAdminTableProps['onFilterChange']
}

function PassportsFilters({ filters, onFilterChange }: FilterProps) {
  return (
    <div className="grid gap-4 rounded-lg border bg-background p-4 md:grid-cols-3">
      <div className="grid gap-2">
        <Label htmlFor="passport-request">Request number</Label>
        <Input
          id="passport-request"
          value={filters.request_number ?? ''}
          onChange={(event) => onFilterChange({ request_number: event.target.value || undefined })}
          placeholder="Search by request number"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="passport-location">Location</Label>
        <select
          id="passport-location"
          value={filters.location ?? ''}
          onChange={(event) => onFilterChange({ location: event.target.value || undefined })}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All locations</option>
          {locationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

function formatDate(value: string) {
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dt)
}
