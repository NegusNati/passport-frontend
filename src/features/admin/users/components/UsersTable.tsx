import type { ColumnDef } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'

import { useUpdateUserRoleMutation } from '@/features/admin/users/api/update-user-role'
import { DataTable } from '@/features/table/DataTable'
import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { toast } from '@/shared/ui/sonner'

import type { AdminRole, AdminUser, AdminUsersMeta } from '../schemas/user'
import { AdminRoleOptions } from '../schemas/user'
import { UserRoleDialog } from './UserRoleDialog'
const roleLabels: Record<AdminRole, string> = {
  admin: 'Admin',
  editor: 'Editor',
  user: 'User',
}
const roleOptions = AdminRoleOptions.map((value) => ({ value, label: roleLabels[value] }))

// status options removed; backend provides email_verified instead

type UsersTableProps = {
  data: AdminUser[]
  meta: AdminUsersMeta
  isLoading: boolean
  isError: boolean
  error: Error | null
  filters: {
    search?: string
    role?: string
    is_admin?: boolean
    email_verified?: boolean
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
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const mutation = useUpdateUserRoleMutation()

  const handleEditClick = useCallback((user: AdminUser) => {
    setEditingUser(user)
    setDialogOpen(true)
  }, [])

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setDialogOpen(open)
      if (!open) {
        setEditingUser(null)
        mutation.reset()
      }
    },
    [mutation],
  )

  const handleRoleSubmit = useCallback(
    async (role: AdminRole) => {
      if (!editingUser) return
      try {
        await mutation.mutateAsync({ userId: editingUser.id, role })
        toast.success('User role updated')
        setDialogOpen(false)
        setEditingUser(null)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update user role'
        toast.error(message)
      }
    },
    [editingUser, mutation],
  )

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: 'full_name',
        header: 'Name',
        cell: ({ row }) => {
          const name = `${row.original.first_name} ${row.original.last_name}`
          return <span className="text-foreground font-medium">{name.trim()}</span>
        },
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone',
        cell: ({ row }) => (
          <span className="text-muted-foreground font-mono text-xs">
            {row.original.phone_number ?? '—'}
          </span>
        ),
      },
      {
        id: 'role',
        header: 'Role',
        cell: ({ row }) => {
          const fallback = row.original.is_admin ? 'admin' : 'user'
          const role = row.original.roles?.[0] ?? fallback
          return <span className="text-muted-foreground text-sm capitalize">{role}</span>
        },
      },
      {
        id: 'verified',
        header: 'Verified',
        cell: ({ row }) => {
          const verified = Boolean(row.original.email_verified_at)
          return (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                verified ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
              )}
            >
              {verified ? 'verified' : 'unverified'}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleEditClick(row.original)}
            className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors"
          >
            Edit
          </button>
        ),
      },
    ],
    [handleEditClick],
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
      <UserRoleDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        user={editingUser}
        onSubmit={handleRoleSubmit}
        isSubmitting={mutation.isPending}
        errorMessage={mutation.error instanceof Error ? mutation.error.message : null}
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
    <div className="bg-background grid gap-4 rounded-lg border p-4 md:grid-cols-4">
      <div className="grid gap-2">
        <Label htmlFor="user-search">Search</Label>
        <Input
          id="user-search"
          value={filters.search ?? ''}
          onChange={(event) => onFilterChange({ search: event.target.value || undefined })}
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
        <Label htmlFor="user-admin">Admin</Label>
        <Select
          value={typeof filters.is_admin === 'boolean' ? String(filters.is_admin) : undefined}
          onValueChange={(value) =>
            onFilterChange({ is_admin: value ? value === 'true' : undefined })
          }
        >
          <SelectTrigger id="user-admin">
            <SelectValue placeholder="All users" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__" disabled>
              All users
            </SelectItem>
            <SelectItem value="true">Admins</SelectItem>
            <SelectItem value="false">Non-admins</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="user-verified">Email verified</Label>
        <Select
          value={
            typeof filters.email_verified === 'boolean' ? String(filters.email_verified) : undefined
          }
          onValueChange={(value) =>
            onFilterChange({ email_verified: value ? value === 'true' : undefined })
          }
        >
          <SelectTrigger id="user-verified">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__" disabled>
              All
            </SelectItem>
            <SelectItem value="true">Verified</SelectItem>
            <SelectItem value="false">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
