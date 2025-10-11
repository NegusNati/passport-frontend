import type { Table as TanStackTable } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { DataTableFacetedFilter } from '@/features/table/DataTableFacetedFilter'
import { DataTableViewOptions } from '@/features/table/DataTableViewOptions'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

type ToolbarProps<TData> = {
  table: TanStackTable<TData>
  searchValue: string
  onSearchChange: (value: string) => void
  filterableColumns: {
    id: string
    title: string
    options: {
      label: string
      value: string
    }[]
  }[]
}

export function AdvertisementsToolbar<TData>({
  table,
  searchValue,
  onSearchChange,
  filterableColumns,
}: ToolbarProps<TData>) {
  const [localSearch, setLocalSearch] = useState(searchValue)
  const debouncedSearch = useDebouncedValue(localSearch, 350)

  // Sync debounced value with parent
  useEffect(() => {
    onSearchChange(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  // Sync external changes back to local state
  useEffect(() => {
    setLocalSearch(searchValue)
  }, [searchValue])

  const isFiltered = table.getState().columnFilters.length > 0 || searchValue !== ''

  return (
    <div className="flex flex-col items-start justify-start gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search by title or client name..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="h-10 w-full md:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {filterableColumns.map((column) => {
            const columnFilter = table.getColumn(column.id)
            if (!columnFilter) return null

            return (
              <DataTableFacetedFilter
                key={column.id}
                column={columnFilter}
                title={column.title}
                options={column.options}
              />
            )
          })}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters()
                setLocalSearch('')
                onSearchChange('')
              }}
              className="h-10 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
