import { type ColumnDef } from '@tanstack/react-table';

import { Skeleton } from '@/shared/ui/skeleton';
import { TableBody, TableCell, TableRow } from '@/shared/ui/table';

interface DataTableLoadingSkeletonProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  rows?: number;
}

export function DataTableLoadingSkeleton<TData, TValue>({
  columns,
  rows = 5,
}: DataTableLoadingSkeletonProps<TData, TValue>) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow
          key={rowIndex}
          className={
            'h-12 py-4 ' +
            `${
              rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'
            } hover:bg-gray-50 border-b border-gray-200`
          }
        >
          {columns.map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-4 w-[80%] bg-gray-300" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
