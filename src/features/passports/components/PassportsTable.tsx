import { useRouter } from '@tanstack/react-router'
import { type ColumnDef, type PaginationState, type Table } from '@tanstack/react-table'
import * as React from 'react'

import type { ListParams } from '@/features/passports/lib/PassportsApi'
import { useLocationsQuery, usePassportsQuery } from '@/features/passports/lib/PassportsQuery'
import type { PassportApiItem } from '@/features/passports/lib/PassportsSchema'
import { DataTable } from '@/features/table/DataTable'
import { DataTableColumnHeader } from '@/features/table/DataTableColumnHeader'
import { useAnalytics } from '@/shared/lib/analytics'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import { type PassportFilters, type PassportSearchFilters } from '../schemas/passport'

type PassportsTableProps = {
  searchFilters?: PassportSearchFilters
  searchMode?: 'number' | 'name'
  defaultCity?: string
  tableTitle?: string
  lockCity?: boolean
}

type FilterOption = { value: string; label: string }

type PassportsTableToolbarProps<TData> = {
  title: string
  filters: PassportFilters
  onFilterChange: (key: keyof PassportFilters, value: string) => void
  dateOptions: FilterOption[]
  locationOptions: FilterOption[]
  isLoadingLocations: boolean
  isCitySelectDisabled?: boolean
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

export const PassportsTable = React.forwardRef<HTMLDivElement, PassportsTableProps>(
  ({ searchFilters = {}, searchMode, defaultCity, tableTitle, lockCity = false }, ref) => {
    const router = useRouter()
    const { capture } = useAnalytics()
    const [filters, setFilters] = React.useState<PassportFilters>(() => ({
      date: 'all',
      city: defaultCity ?? 'all',
    }))
    const [pagination, setPagination] = React.useState<PaginationState>(DEFAULT_PAGINATION)
    const searchStartTimeRef = React.useRef<number>(Date.now())

    const locationsQuery = useLocationsQuery()
    const locationOptions = React.useMemo<FilterOption[]>(() => {
      const items = locationsQuery.data?.data ?? []
      const options = items.map((value) => ({ value, label: value }))
      if (defaultCity && defaultCity !== 'all' && !items.includes(defaultCity)) {
        options.unshift({ value: defaultCity, label: defaultCity })
      }
      return options
    }, [defaultCity, locationsQuery.data])

    const lastDefaultCityRef = React.useRef<string | undefined>(defaultCity)

    React.useEffect(() => {
      if (defaultCity !== undefined) {
        setFilters((prev) => (prev.city === defaultCity ? prev : { ...prev, city: defaultCity }))
      } else if (lastDefaultCityRef.current !== undefined) {
        setFilters((prev) => (prev.city === 'all' ? prev : { ...prev, city: 'all' }))
      }
      lastDefaultCityRef.current = defaultCity
    }, [defaultCity])

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

    // Track search results
    React.useEffect(() => {
      if (isLoading) {
        searchStartTimeRef.current = Date.now()
        return
      }

      const hasSearchFilters = Object.keys(searchFilters).length > 0
      if (!hasSearchFilters) return

      const latency = Date.now() - searchStartTimeRef.current

      if (isError) {
        // Track error
        capture('passport_status_result_error', {
          'error-code': error instanceof Error ? error.message : 'unknown',
          'latency-ms': latency,
          retryable: true,
          'search-mode': searchMode || 'unknown',
        })
      } else if (data) {
        // Track success
        const resultCount = data.data?.length || 0
        const resultType = resultCount > 0 ? 'found' : 'not-found'

        capture('passport_status_result_success', {
          'latency-ms': latency,
          'result-type': resultType,
          'result-count': resultCount,
          retries: 0,
          'search-mode': searchMode || 'unknown',
          'total-available': data.meta?.total || 0,
        })
      }
    }, [isLoading, isError, error, data, searchFilters, searchMode, capture])

    const meta = data?.meta
    const total = meta?.total ?? 0
    const currentPage = meta?.current_page ?? pagination.pageIndex + 1
    const pageCount = meta?.last_page ?? 1
    const pageSizeFromMeta = meta?.page_size ?? meta?.per_page
    const effectivePageSize = pageSizeFromMeta ?? pagination.pageSize
    const from = total ? (currentPage - 1) * effectivePageSize + 1 : 0
    const to = Math.min(currentPage * effectivePageSize, total)

    const handlePageChange = React.useCallback((pageNumber: number) => {
      setPagination((prev) => ({ ...prev, pageIndex: Math.max(0, pageNumber - 1) }))
    }, [])

    const handlePageSizeChange = React.useCallback((size: number) => {
      setPagination({ pageIndex: 0, pageSize: size })
    }, [])

    const handleFilterChange = React.useCallback(
      (key: keyof PassportFilters, value: string) => {
        if (lockCity && key === 'city') return
        setFilters((prev) => ({ ...prev, [key]: value }))
        setPagination((prev) => ({ ...prev, pageIndex: 0 }))
      },
      [lockCity],
    )

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
          cell: ({ row }) => (
            <span className="text-muted-foreground text-sm">{row.original.location}</span>
          ),
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
            <span className="font-mono text-xs tracking-tight uppercase">
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
              className="hidden md:inline-flex"
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
            title={tableTitle ?? 'Latest Passports'}
            filters={filters}
            onFilterChange={handleFilterChange}
            dateOptions={DATE_PRESETS}
            locationOptions={locationOptions}
            isLoadingLocations={locationsQuery.isLoading}
            isCitySelectDisabled={lockCity}
          />
        )
      }
    }, [
      filters,
      handleFilterChange,
      locationOptions,
      locationsQuery.isLoading,
      lockCity,
      tableTitle,
    ])

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
      [
        pagination.pageIndex,
        pagination.pageSize,
        rows.length,
        passportsQuery.dataUpdatedAt,
        searchFilters,
      ],
    )

    return (
      <section ref={ref} className="py-12">
        <Container>
          <div className="space-y-6">
            <div className="rounded-lg border bg-transparent/80 p-6 shadow-sm backdrop-blur">
              <DataTable
                key={tableKey}
                tableTitle={tableTitle ?? 'Latest Passports'}
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
                onRowClick={(passport) =>
                  router.navigate({
                    to: '/passports/$passportId',
                    params: { passportId: String(passport.id) },
                  })
                }
              />
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              {isLoading ? (
                <span>Loading summary…</span>
              ) : total > 0 ? (
                <span>
                  Showing {from} to {to} of {total} entries
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </Container>
      </section>
    )
  },
)

PassportsTable.displayName = 'PassportsTable'

function PassportsTableToolbar<TData>(props: PassportsTableToolbarProps<TData>) {
  const {
    title,
    filters,
    onFilterChange,
    dateOptions,
    locationOptions,
    isLoadingLocations,
    isCitySelectDisabled,
  } = props

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <h3 className="text-muted-foreground mt-1 text-sm">
          Track passport processing updates with quick filters and smart search.
        </h3>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <span className="text-muted-foreground text-xs tracking-wide uppercase">Filter by</span>
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

          <Select
            value={filters.city}
            onValueChange={(value) => onFilterChange('city', value)}
            disabled={isCitySelectDisabled}
          >
            <SelectTrigger className="w-48" disabled={isCitySelectDisabled}>
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
