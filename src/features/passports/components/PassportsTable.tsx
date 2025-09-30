import { useRouter } from '@tanstack/react-router'
import { type ColumnDef, type PaginationState, type Table } from '@tanstack/react-table'
import * as React from 'react'

import { DataTable } from '@/features/table/DataTable'
import { DataTableColumnHeader } from '@/features/table/DataTableColumnHeader'
import { useLocationsQuery, usePassportsQuery } from '@/features/passports/lib/PassportsQuery'
import type { PassportApiItem } from '@/features/passports/lib/PassportsSchema'
import type { ListParams } from '@/features/passports/lib/PassportsApi'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { type PassportFilters, type PassportSearchFilters } from '../schemas/passport'

type PassportsTableProps = {
  searchFilters?: PassportSearchFilters
  searchMode?: 'number' | 'name'
}

type FilterOption = { value: string; label: string }

type PassportsTableToolbarProps<TData> = {
  title: string
  filters: PassportFilters
  onFilterChange: (key: keyof PassportFilters, value: string) => void
  dateOptions: FilterOption[]
  locationOptions: FilterOption[]
  isLoadingLocations: boolean
} & Pick<
  PassportsTableToolbarBaseProps<TData>,
  'table' | 'filterableColumns' | 'searchKey' | 'onAction' | 'actionTitle' | 'onExport'
>

type PassportsTableToolbarBaseProps<TData> = {
  table: Table<TData>
  filterableColumns: {
    id: string
    title: string
    options: FilterOption[]
  }[]
  searchKey?: string
  onAction?: () => void
  actionTitle?: string
  onExport?: () => void
}

const DATE_PRESETS: FilterOption[] = [
  { value: 'all', label: 'All dates' },
  { value: 'last_7', label: 'Last 7 days' },
  { value: 'last_30', label: 'Last 30 days' },
  { value: 'this_year', label: 'This year' },
]

const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
}

export function PassportsTable({ searchFilters = {}, searchMode }: PassportsTableProps) {
  const router = useRouter()
  const [filters, setFilters] = React.useState<PassportFilters>({ date: 'all', city: 'all' })
  const [pagination, setPagination] = React.useState<PaginationState>(DEFAULT_PAGINATION)

  const locationsQuery = useLocationsQuery()
  const locationOptions = React.useMemo<FilterOption[]>(() => {
    const items = locationsQuery.data?.data ?? []
    return items.map((value) => ({ value, label: value }))
  }, [locationsQuery.data])

  React.useEffect(() => {
    setPagination((prev) => (prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }))
  }, [searchFilters, searchMode])

  const listParams = React.useMemo<Partial<ListParams>>(
    () =>
      buildListParams({
        searchFilters,
        filters,
        pagination,
      }),
    [searchFilters, filters, pagination],
  )

  const passportsQuery = usePassportsQuery(listParams)
  const { data, isLoading, isError, error } = passportsQuery

  const rows = React.useMemo<PassportApiItem[]>(() => {
    if (!data?.data) return []
    return [...data.data]
  }, [data?.data])

  const meta = data?.meta
  const total = meta?.total ?? 0
  const currentPage = meta?.current_page ?? pagination.pageIndex + 1
  const pageCount = meta?.last_page ?? 1
  const pageSizeFromMeta = meta?.page_size ?? meta?.per_page
  const effectivePageSize = pageSizeFromMeta ?? pagination.pageSize
  const from = total ? (currentPage - 1) * effectivePageSize + 1 : 0
  const to = Math.min(currentPage * effectivePageSize, total)

  React.useEffect(() => {
    if (pageSizeFromMeta && pageSizeFromMeta !== pagination.pageSize) {
      setPagination((prev) => ({ ...prev, pageSize: pageSizeFromMeta }))
    }
  }, [pageSizeFromMeta, pagination.pageSize])

  const handlePageChange = React.useCallback(
    (pageNumber: number) => {
      setPagination((prev) => ({ ...prev, pageIndex: Math.max(0, pageNumber - 1) }))
    },
    [],
  )

  const handlePageSizeChange = React.useCallback((size: number) => {
    setPagination({ pageIndex: 0, pageSize: size })
  }, [])

  const handleFilterChange = React.useCallback((key: keyof PassportFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const columns = React.useMemo<ColumnDef<PassportApiItem>[]>(() => {
    return [
      {
        accessorKey: 'full_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
          <span className="text-foreground font-medium">{row.original.full_name}</span>
        ),
        enableSorting: false,
        meta: { label: 'Name' },
      },
      {
        accessorKey: 'location',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.location}</span>,
        enableSorting: false,
        meta: { label: 'Location' },
      },
      {
        accessorKey: 'date_of_publish',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Published" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatDisplayDate(row.original.date_of_publish)}
          </span>
        ),
        enableSorting: false,
        meta: { label: 'Published date' },
      },
      {
        accessorKey: 'request_number',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Request number" />,
        cell: ({ row }) => (
          <span className="font-mono text-xs uppercase tracking-tight">
            {row.original.request_number}
          </span>
        ),
        enableSorting: false,
        meta: { label: 'Request number' },
      },
      {
        id: 'actions',
        header: '',
        enableHiding: false,
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.navigate({
                to: '/passports/$passportId',
                params: { passportId: String(row.original.id) },
              })
            }
          >
            Detail
          </Button>
        ),
      },
    ]
  }, [router])

  const toolbarComponent = React.useMemo(() => {
    return function Toolbar<TData>(props: PassportsTableToolbarProps<TData>) {
      return (
        <PassportsTableToolbar
          {...props}
          title="Latest Passports"
          filters={filters}
          onFilterChange={handleFilterChange}
          dateOptions={DATE_PRESETS}
          locationOptions={locationOptions}
          isLoadingLocations={locationsQuery.isLoading}
        />
      )
    }
  }, [filters, handleFilterChange, locationOptions, locationsQuery.isLoading])

  const derivedError = isError
    ? error instanceof Error
      ? error
      : new Error('Failed to load passports.')
    : null

  const tableKey = React.useMemo(
    () =>
      `${pagination.pageIndex}-${pagination.pageSize}-${rows.length}-${passportsQuery.dataUpdatedAt ?? 0}-${JSON.stringify(
        searchFilters,
      )}`,
    [pagination.pageIndex, pagination.pageSize, rows.length, passportsQuery.dataUpdatedAt, searchFilters],
  )

  return (
    <section className="bg-muted/30 py-12">
      <Container>
        <div className="space-y-6">
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <DataTable
              key={tableKey}
              tableTitle="Latest Passports"
              columns={columns}
              data={rows}
              isLoading={isLoading}
              isError={isError}
              error={derivedError}
              pagination={{
                pageCount,
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                onPageChange: handlePageChange,
                onPageSizeChange: handlePageSizeChange,
              }}
              toolbar={toolbarComponent}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {isLoading ? (
              <span>Loading summary…</span>
            ) : total > 0 ? (
              <span>
                Showing {from} to {to} of {total} entries
              </span>
            ) : (
              <span>No entries</span>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

function PassportsTableToolbar<TData>(props: PassportsTableToolbarProps<TData>) {
  const {
    title,
    filters,
    onFilterChange,
    dateOptions,
    locationOptions,
    isLoadingLocations,
  } = props

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Track passport processing updates with quick filters and smart search.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <span className="text-muted-foreground text-xs uppercase tracking-wide">Filter by</span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={filters.date} onValueChange={(value) => onFilterChange('date', value)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.city} onValueChange={(value) => onFilterChange('city', value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {isLoadingLocations ? (
                <SelectItem value="__loading" disabled>
                  Loading locations…
                </SelectItem>
              ) : (
                locationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

type BuildParamsArgs = {
  searchFilters?: PassportSearchFilters
  filters: PassportFilters
  pagination: PaginationState
}

function buildListParams({ searchFilters = {}, filters, pagination }: BuildParamsArgs) {
  const params: Partial<ListParams> = {
    page_size: pagination.pageSize,
    page: pagination.pageIndex + 1,
    sort: 'dateOfPublish',
    sort_dir: 'desc',
  }

  for (const [key, value] of Object.entries(searchFilters)) {
    if (value && typeof value === 'string' && value.trim().length > 0) {
      ;(params as Record<string, string>)[key] = value.trim()
    }
  }

  if (filters.city && filters.city !== 'all') {
    params.location = filters.city
  }

  const now = new Date()
  switch (filters.date) {
    case 'last_7': {
      const start = new Date(now)
      start.setDate(now.getDate() - 7)
      params.published_after = toYmd(start)
      params.published_before = toYmd(now)
      break
    }
    case 'last_30': {
      const start = new Date(now)
      start.setDate(now.getDate() - 30)
      params.published_after = toYmd(start)
      params.published_before = toYmd(now)
      break
    }
    case 'this_year': {
      const start = new Date(now.getFullYear(), 0, 1)
      params.published_after = toYmd(start)
      params.published_before = toYmd(now)
      break
    }
    default: {
      if (filters.date && filters.date !== 'all' && /^\d{4}-\d{2}-\d{2}$/.test(filters.date)) {
        params.published_after = filters.date
        params.published_before = filters.date
      }
    }
  }

  return params
}

function formatDisplayDate(value: string) {
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dt)
}

function toYmd(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
