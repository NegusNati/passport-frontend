import type { ColumnDef } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'

import { useLocationsQuery } from '@/features/passports/lib/PassportsQuery'
import { DataTable } from '@/features/table/DataTable'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

import type { AdminPassport, AdminPassportsMeta } from '../schemas/passport'

type PassportsAdminTableProps = {
  data: AdminPassport[]
  meta: AdminPassportsMeta
  isLoading: boolean
  isError: boolean
  error: Error | null
  filters: {
    request_number?: string
    location?: string
    first_name?: string
    middle_name?: string
    last_name?: string
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
  // Local state for debounced request number input
  const [requestInput, setRequestInput] = useState<string>(filters.request_number ?? '')
  const debounced = useDebouncedValue(requestInput, 300)

  // Keep local input in sync with URL/search param updates
  useEffect(() => {
    setRequestInput(filters.request_number ?? '')
  }, [filters.request_number])

  const sanitizeRequestNumber = (value: string) =>
    value
      .replace(/[^0-9A-Za-z]/g, '')
      .trim()
      .toUpperCase()

  // Debounced propagation to parent (URL state)
  useEffect(() => {
    const sanitized = sanitizeRequestNumber(debounced)
    const current = filters.request_number ?? ''

    // Only propagate meaningful changes
    if (sanitized === current) return

    if (sanitized.length >= 3) {
      onFilterChange({ request_number: sanitized })
    } else if (filters.request_number !== undefined) {
      // Clear filter when fewer than 3 chars
      onFilterChange({ request_number: undefined })
    }
    // We intentionally omit onFilterChange/filters from deps to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  // Local state for debounced name inputs
  const [firstInput, setFirstInput] = useState<string>(filters.first_name ?? '')
  const [middleInput, setMiddleInput] = useState<string>(filters.middle_name ?? '')
  const [lastInput, setLastInput] = useState<string>(filters.last_name ?? '')
  const nameQueryRaw = [firstInput, middleInput, lastInput].filter(Boolean).join(' ').trim()
  const debouncedName = useDebouncedValue(nameQueryRaw, 300)

  useEffect(() => {
    setFirstInput(filters.first_name ?? '')
  }, [filters.first_name])
  useEffect(() => {
    setMiddleInput(filters.middle_name ?? '')
  }, [filters.middle_name])
  useEffect(() => {
    setLastInput(filters.last_name ?? '')
  }, [filters.last_name])

  const sanitizeNameSegment = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return ''
    return trimmed
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ')
  }

  useEffect(() => {
    const updates: Partial<FilterProps['filters']> = {}
    const f = sanitizeNameSegment(firstInput)
    const m = sanitizeNameSegment(middleInput)
    const l = sanitizeNameSegment(lastInput)

    if (f.length >= 3) updates.first_name = f
    else if (filters.first_name !== undefined) updates.first_name = undefined

    if (m.length >= 3) updates.middle_name = m
    else if (filters.middle_name !== undefined) updates.middle_name = undefined

    if (l.length >= 3) updates.last_name = l
    else if (filters.last_name !== undefined) updates.last_name = undefined

    // Only send if something changed
    const changed = Object.keys(updates).some(
      (key) => (updates as any)[key] !== (filters as any)[key],
    )
    if (changed) {
      onFilterChange(updates)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName])

  // Dynamic locations
  const locationsQuery = useLocationsQuery()
  const locationOptions = (locationsQuery.data?.data ?? []).filter(Boolean)

  return (
    <div className="flex flex-col rounded-lg border bg-background p-4 md:grid-cols-5">
      <div className="flex flex-row gap-4">
      <div className="grid gap-2">
        <Label htmlFor="passport-request">Request number</Label>
        <Input
          id="passport-request"
          value={requestInput}
          onChange={(event) => setRequestInput(event.target.value)}
          placeholder="Search by request number"
          aria-describedby="passport-request-help"
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
          {locationsQuery.isLoading ? (
            <option value="__loading" disabled>
              Loading locations…
            </option>
          ) : locationOptions.length === 0 ? (
            <option value="__empty" disabled>
              No locations available
            </option>
          ) : (
            locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))
          )}
        </select>
      </div>
      </div>
      
      <div className="flex flex-row gap-4 align-center py-2" >
      <div className="grid gap-2">
        <Label htmlFor="first-name">First name</Label>
        <Input
          id="first-name"
          value={firstInput}
          onChange={(e) => setFirstInput(e.target.value)}
          placeholder="e.g., John"
          aria-describedby="passport-name-help"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="middle-name">Middle name</Label>
        <Input
          id="middle-name"
          value={middleInput}
          onChange={(e) => setMiddleInput(e.target.value)}
          placeholder="optional"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="last-name">Last name</Label>
        <Input
          id="last-name"
          value={lastInput}
          onChange={(e) => setLastInput(e.target.value)}
          placeholder="e.g., Doe"
        />
      
      </div>
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
