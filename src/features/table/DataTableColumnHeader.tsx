import type { Column } from '@tanstack/react-table'
import { ChevronsUpDown, EyeOff, SortAsc, SortDesc } from 'lucide-react'
import type { HTMLAttributes } from 'react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'

interface DataTableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 h-8 px-2"
        type="button"
        onClick={() => {
          const isAsc = column.getIsSorted() === 'asc'
          column.toggleSorting(isAsc)
        }}
      >
        <span>{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <SortDesc className="ml-1 h-4 w-4" />
        ) : column.getIsSorted() === 'asc' ? (
          <SortAsc className="ml-1 h-4 w-4" />
        ) : (
          <ChevronsUpDown className="ml-1 h-4 w-4" />
        )}
      </Button>
      {column.getCanHide() ? (
        <button
          type="button"
          aria-label={`Hide ${title} column`}
          onClick={() => column.toggleVisibility(false)}
          className="text-muted-foreground hover:bg-muted inline-flex h-8 w-8 items-center justify-center rounded-md transition"
        >
          <EyeOff className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  )
}
