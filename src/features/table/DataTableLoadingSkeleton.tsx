import { type ColumnDef } from '@tanstack/react-table'

import { Skeleton } from '@/shared/ui/skeleton'
import { TableBody, TableCell, TableRow } from '@/shared/ui/table'

interface DataTableLoadingSkeletonProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  rows?: number
}

export function DataTableLoadingSkeleton<TData, TValue>({
  columns,
  rows = 5,
}: DataTableLoadingSkeletonProps<TData, TValue>) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className={'odd:bg-muted/30 h-12 py-4'}>
          {columns.map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-4 w-[80%]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}
