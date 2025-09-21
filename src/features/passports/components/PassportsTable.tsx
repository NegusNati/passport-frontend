import * as React from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table'
import { Button } from '@/shared/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { Container } from '@/shared/ui/container'
import { type Passport, type PassportFilters } from '../schemas/passport'
import { DUMMY_PASSPORTS, DATE_OPTIONS, CITY_OPTIONS } from '../lib/dummy-data'

const columnHelper = createColumnHelper<Passport>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => (
      <div className="font-medium text-foreground">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => (
      <div className="text-muted-foreground">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('requestNumber', {
    header: 'Request Number',
    cell: (info) => (
      <div className="font-mono text-sm">{info.getValue()}</div>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          // TODO: Implement detail view
          console.log('View details for:', row.original)
        }}
        className="text-primary hover:text-primary/90"
      >
        Detail
      </Button>
    ),
  }),
]

interface PassportsTableProps {
  searchQuery?: string
  searchMode?: 'number' | 'name'
}

export function PassportsTable({ searchQuery, searchMode }: PassportsTableProps) {
  const [filters, setFilters] = React.useState<PassportFilters>({
    date: 'all',
    city: 'all',
  })
  
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5, // Matching the Figma design showing 5 rows per page
  })

  // Filter data based on search query and filters
  const filteredData = React.useMemo(() => {
    let data = DUMMY_PASSPORTS

    // Apply search filter
    if (searchQuery && searchQuery.trim() !== '') {
      if (searchMode === 'number') {
        data = data.filter(passport =>
          passport.requestNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )
      } else if (searchMode === 'name') {
        data = data.filter(passport =>
          passport.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
    }

    // Apply date filter
    if (filters.date && filters.date !== 'all') {
      data = data.filter(passport => passport.date.includes(filters.date!))
    }

    // Apply city filter
    if (filters.city && filters.city !== 'all') {
      data = data.filter(passport => passport.city === filters.city)
    }

    return data
  }, [searchQuery, searchMode, filters])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    manualPagination: false,
  })

  const handleFilterChange = (key: keyof PassportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  return (
    <section className="bg-muted/30 py-12">
      <Container>
        <div className="space-y-6">
          {/* Header and Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Latest Passports</h2>
            
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="text-sm text-muted-foreground">Filter by</span>
              <div className="flex gap-2">
                <Select
                  value={filters.date}
                  onValueChange={(value) => handleFilterChange('date', value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.city}
                  onValueChange={(value) => handleFilterChange('city', value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border bg-background shadow-sm">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                filteredData.length
              )}{' '}
              of {filteredData.length} entries
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: table.getPageCount() }, (_, i) => (
                  <Button
                    key={i}
                    variant={i === table.getState().pagination.pageIndex ? "primary" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(i)}
                    className="w-8 h-8 p-0"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
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
