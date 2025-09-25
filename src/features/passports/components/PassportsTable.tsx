import { useRouter } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'

import type { ListParams } from '@/features/passports/lib/PassportsApi'
import { useLocationsQuery, usePassportsQuery } from '@/features/passports/lib/PassportsQuery'
import type { PassportApiItem } from '@/features/passports/lib/PassportsSchema'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'

import { type PassportFilters } from '../schemas/passport'

const columnHelper = createColumnHelper<PassportApiItem>()

const createColumns = (router: ReturnType<typeof useRouter>) => [
  columnHelper.accessor('full_name', {
    header: 'Name',
    cell: (info) => <div className="text-foreground font-medium">{info.getValue()}</div>,
  }),
  columnHelper.accessor('date_of_publish', {
    header: 'Date',
    cell: (info) => (
      <div className="text-muted-foreground">{formatDisplayDate(info.getValue())}</div>
    ),
  }),
  columnHelper.accessor('request_number', {
    header: 'Request Number',
    cell: (info) => <div className="font-mono text-sm">{info.getValue()}</div>,
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const id = String(row.original.id)
          router.navigate({ to: '/passports/$passportId', params: { passportId: id } })
        }}
        className="text-primary hover:text-primary/90"
      >
        Detail
      </Button>
    ),
  }),
]

function formatDisplayDate(value: string) {
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dt)
}

interface PassportsTableProps {
  searchQuery?: string
  searchMode?: 'number' | 'name'
}

export function PassportsTable({ searchQuery, searchMode }: PassportsTableProps) {
  const router = useRouter()

  const [filters, setFilters] = React.useState<PassportFilters>({ date: 'all', city: 'all' })
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 5 })

  // Build API params from UI state
  const params = React.useMemo((): Partial<ListParams> => {
    const p: Partial<ListParams> = {
      per_page: pagination.pageSize,
      page: pagination.pageIndex + 1,
      sort: 'dateOfPublish',
      sort_dir: 'desc',
    }

    // Search
    const q = (searchQuery ?? '').trim()
    if (q) {
      if (searchMode === 'number') {
        p.request_number = q
      } else {
        const parts = q.split(/\s+/).filter(Boolean)
        if (parts[0]) p.first_name = parts[0]
        if (parts.length === 2) p.last_name = parts[1]
        if (parts.length >= 3) {
          p.middle_name = parts.slice(1, parts.length - 1).join(' ')
          p.last_name = parts[parts.length - 1]
        }
      }
    }

    // Location filter
    if (filters.city && filters.city !== 'all') {
      p.location = filters.city
    }

    // Date presets → published_after/published_before
    const now = new Date()
    if (filters.date && filters.date !== 'all') {
      if (filters.date === 'last_7') {
        const d = new Date(now)
        d.setDate(now.getDate() - 7)
        p.published_after = toYmd(d)
        p.published_before = toYmd(now)
      } else if (filters.date === 'last_30') {
        const d = new Date(now)
        d.setDate(now.getDate() - 30)
        p.published_after = toYmd(d)
        p.published_before = toYmd(now)
      } else if (filters.date === 'this_year') {
        const start = new Date(now.getFullYear(), 0, 1)
        p.published_after = toYmd(start)
        p.published_before = toYmd(now)
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(filters.date)) {
        // Exact day
        p.published_after = filters.date
        p.published_before = filters.date
      }
    }

    return p
  }, [searchQuery, searchMode, filters, pagination])

  const { data, isLoading, isError } = usePassportsQuery(params as ListParams)
  const locationsQuery = useLocationsQuery()

  const rows: PassportApiItem[] = data?.data ?? []
  const pageCount = data?.meta?.last_page ?? 1
  const total = data?.meta?.total ?? 0
  const currentPage = data?.meta?.current_page ?? pagination.pageIndex + 1
  const perPage = data?.meta?.per_page ?? pagination.pageSize
  const from = total ? (currentPage - 1) * perPage + 1 : 0
  const to = Math.min(currentPage * perPage, total)

  const columns = React.useMemo(() => createColumns(router), [router])

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    manualPagination: true,
    pageCount,
  })

  const handleFilterChange = (key: keyof PassportFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const DATE_PRESETS = [
    { value: 'all', label: 'All Dates' },
    { value: 'last_7', label: 'Last 7 days' },
    { value: 'last_30', label: 'Last 30 days' },
    { value: 'this_year', label: 'This year' },
  ]

  return (
    <section className="bg-muted/30 py-12">
      <Container>
        <div className="space-y-6">
          {/* Header and Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Latest Passports</h2>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="text-muted-foreground text-sm">Filter by</span>
              <div className="flex gap-2">
                <Select value={filters.date} onValueChange={(v) => handleFilterChange('date', v)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_PRESETS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.city} onValueChange={(v) => handleFilterChange('city', v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {(locationsQuery.data?.data ?? []).map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-background rounded-lg border shadow-sm">
            {isLoading ? (
              <div className="text-muted-foreground p-6 text-sm">Loading…</div>
            ) : isError ? (
              <div className="text-destructive p-6 text-sm">Failed to load passports.</div>
            ) : (
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="font-semibold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {total > 0 ? (
                <>
                  Showing {from} to {to} of {total} entries
                </>
              ) : (
                <>No entries</>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={pagination.pageIndex === 0}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pageCount }, (_, i) => (
                  <Button
                    key={i}
                    variant={i === pagination.pageIndex ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => table.setPageIndex(i)}
                    className="h-8 w-8 p-0"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={pagination.pageIndex + 1 >= pageCount}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function toYmd(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
