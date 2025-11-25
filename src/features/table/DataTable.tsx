import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import * as React from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'

import { DataTableError } from './DataTableError'
import { DataTableLoadingSkeleton } from './DataTableLoadingSkeleton'
import { DataTablePagination } from './DataTablePagination'
import { DataTableToolbar } from './DataTableToolbar'

interface PaginationProps {
  pageCount: number
  pageIndex: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

interface DataTableProps<TData, TValue> {
  tableTitle?: string
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  pagination?: PaginationProps
  searchKey?: string
  filterableColumns?: {
    id: string
    title: string
    options: {
      label: string
      value: string
    }[]
  }[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolbar?: React.ComponentType<any>
  onExport?: () => void
  onAction?: () => void
  actionTitle?: string
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  tableTitle,
  columns,
  data,
  isLoading,
  isError,
  error,
  pagination,
  searchKey,
  filterableColumns = [],
  toolbar: CustomToolbar,
  onExport,
  onAction,
  actionTitle,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,

      rowSelection,
      columnFilters,
      ...(pagination && {
        pagination: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      }),
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    ...(pagination && {
      manualPagination: true, // Enable manual pagination
      pageCount: pagination.pageCount,
    }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(pagination
      ? {}
      : {
          // Only apply client-side pagination when not using server-side/manual pagination
          getPaginationRowModel: getPaginationRowModel(),
        }),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...(pagination
      ? {}
      : {
          initialState: {
            pagination: {
              pageSize: 10,
            },
          },
        }),
  })
  const ToolbarComponent = CustomToolbar || DataTableToolbar

  // Force table section to re-render when server data size or controlled pagination changes.
  // This guards against cases where upstream keeps previous data during fetches
  // and React Table's internal memoization could retain the old row model briefly.
  const renderKey = React.useMemo(() => {
    const pageIndex = pagination ? pagination.pageIndex : table.getState().pagination.pageIndex
    const pageSize = pagination ? pagination.pageSize : table.getState().pagination.pageSize
    return `${data.length}-${pageIndex}-${pageSize}`
  }, [data.length, pagination, table])

  const handlePaginationChange = (pageIndex: number) => {
    // Always update the table state immediately so the UI reflects the change
    table.setPageIndex(pageIndex)
    if (pagination) {
      // Convert 0-based to 1-based for the API
      pagination.onPageChange(pageIndex + 1)
    }
  }

  const handlePageSizeChange = (pageSize: number) => {
    // Always update the table state immediately so the UI reflects the change
    table.setPageSize(pageSize)
    if (pagination) {
      pagination.onPageSizeChange(pageSize)
    }
  }

  return (
    <div className="space-y-4">
      {CustomToolbar ? (
        <ToolbarComponent
          table={table}
          filterableColumns={filterableColumns}
          searchKey={searchKey}
          onAction={onAction}
          actionTitle={actionTitle}
          onExport={onExport}
        />
      ) : (
        <DataTableToolbar
          tableTitle={tableTitle}
          table={table}
          filterableColumns={filterableColumns}
          searchKey={searchKey}
          onAction={onAction}
          actionTitle={actionTitle}
        />
      )}
      <div className="rounded-none border" key={renderKey} role="region" aria-live="polite">
        <Table>
          <TableHeader className="bg-accent rounded-none border-none">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="rounded-none px-4 py-2 whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          {isLoading ? (
            <DataTableLoadingSkeleton columns={columns} />
          ) : isError && error ? (
            <DataTableError error={error} columns={columns.length} />
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={`odd:bg-muted/30 ${
                      onRowClick
                        ? 'active:bg-muted/60 cursor-pointer md:cursor-auto md:active:bg-transparent'
                        : ''
                    }`}
                    onClick={
                      onRowClick
                        ? (e) => {
                            // Only trigger on mobile (when Detail button is hidden)
                            const target = e.target as HTMLElement
                            if (target.closest('button, a')) return
                            if (window.innerWidth < 768) {
                              onRowClick(row.original)
                            }
                          }
                        : undefined
                    }
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              const target = e.target as HTMLElement
                              if (target.closest('button, a')) return
                              if (window.innerWidth < 768) {
                                e.preventDefault()
                                onRowClick(row.original)
                              }
                            }
                          }
                        : undefined
                    }
                    tabIndex={onRowClick && window.innerWidth < 768 ? 0 : undefined}
                    role={onRowClick && window.innerWidth < 768 ? 'button' : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center font-semibold leading-relaxed"
                  >
                    <span role="img" aria-label="sad" className="mr-2">😔</span>
                    Your passport is not ready yet. Our team is still processing it—please check back
                    tomorrow for an update.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      {!isError && table.getRowModel().rows.length > 0 && (
        <DataTablePagination
          table={table}
          onPageChange={handlePaginationChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}
