import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'

import { DataTable } from '@/features/table/DataTable'
import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import type { AdminUser, AdminUsersMeta } from '../schemas/user'

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

type UsersTableProps = {
  data: AdminUser[]
  meta: AdminUsersMeta
  isLoading: boolean
  isError: boolean
  error: Error | null
  filters: {
    q?: string
    role?: string
    status?: string
  }
  onFilterChange: (updates: Partial<UsersTableProps['filters']>) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function UsersTable({
  data,
  meta,
  isLoading,
  isError,
  error,
  filters,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
}: UsersTableProps) {
  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: 'full_name',
        header: 'Name',
        cell: ({ row }) => {
          const name = `${row.original.first_name} ${row.original.last_name}`
          return <span className="font-medium text-foreground">{name.trim()}</span>
        },
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">{row.original.phone_number ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <span className="capitalize text-sm text-muted-foreground">{row.original.role ?? 'user'}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status ?? 'unknown'
          return (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                status === 'active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : status === 'inactive'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-600',
              )}
            >
              {status}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <a
            href={`/admin/users/${row.original.id}`}
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Edit
          </a>
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
      <UsersTableFilters filters={filters} onFilterChange={onFilterChange} />
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
        tableTitle="Users"
      />
    </div>
  )
}

type UsersTableFiltersProps = {
  filters: UsersTableProps['filters']
  onFilterChange: UsersTableProps['onFilterChange']
}

function UsersTableFilters({ filters, onFilterChange }: UsersTableFiltersProps) {
  return (
    <div className="grid gap-4 rounded-lg border bg-background p-4 md:grid-cols-3">
      <div className="grid gap-2">
        <Label htmlFor="user-search">Search</Label>
        <Input
          id="user-search"
          value={filters.q ?? ''}
          onChange={(event) => onFilterChange({ q: event.target.value || undefined })}
          placeholder="Search by name or phone"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="user-role">Role</Label>
        <Select
          value={filters.role ?? undefined}
          onValueChange={(value) => onFilterChange({ role: value || undefined })}
        >
          <SelectTrigger id="user-role">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__" disabled>
              All roles
            </SelectItem>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="user-status">Status</Label>
        <Select
          value={filters.status ?? undefined}
          onValueChange={(value) => onFilterChange({ status: value || undefined })}
        >
          <SelectTrigger id="user-status">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__" disabled>
              All statuses
            </SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
