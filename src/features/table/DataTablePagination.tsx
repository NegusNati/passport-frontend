import type { Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/shared/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  onPageChange?: (pageIndex: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export function DataTablePagination<TData>({
  table,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  // Handle page index change
  const handlePageIndexChange = (pageIndex: number) => {
    if (onPageChange) {
      onPageChange(pageIndex)
    } else {
      table.setPageIndex(pageIndex)
    }
  }

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const pageSize = Number(value)
    if (onPageSizeChange) {
      onPageSizeChange(pageSize)
    } else {
      table.setPageSize(pageSize)
    }
  }
  const pageSize = table.getState().pagination.pageSize
  const pageSizeOptions = React.useMemo(() => {
    const defaults = [10, 20, 30, 40, 50]
    if (defaults.includes(pageSize)) return defaults
    return [...defaults, pageSize].sort((a, b) => a - b)
  }, [pageSize])
  return (
    <div className="flex flex-col-reverse items-center justify-end gap-4 rounded-none px-2 sm:flex-row">
      <div className="flex items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px] rounded-none">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="rounded-none">
              {pageSizeOptions.map((sizeOption) => (
                <SelectItem key={sizeOption} value={`${sizeOption}`} className="rounded-none">
                  {sizeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 rounded-none p-0 lg:flex"
            onClick={() => handlePageIndexChange(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-none p-0"
            onClick={() => {
              if (onPageChange) {
                handlePageIndexChange(table.getState().pagination.pageIndex - 1)
              } else {
                table.previousPage()
              }
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-none p-0"
            onClick={() => {
              if (onPageChange) {
                handlePageIndexChange(table.getState().pagination.pageIndex + 1)
              } else {
                table.nextPage()
              }
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 rounded-none p-0 lg:flex"
            onClick={() => handlePageIndexChange(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
