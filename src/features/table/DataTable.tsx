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
} from '@tanstack/react-table';
import * as React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';

import { DataTableError } from './DataTableError';
import { DataTableLoadingSkeleton } from './DataTableLoadingSkeleton';
import { DataTablePagination } from './DataTablePagination';
import { DataTableToolbar } from './DataTableToolbar';

interface PaginationProps {
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

interface DataTableProps<TData, TValue> {
  tableTitle?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  pagination?: PaginationProps;
  searchKey?: string;
  filterableColumns?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolbar?: React.ComponentType<any>;
  onExport?: () => void;
  onAction?: () => void;
  actionTitle?: string;
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
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

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
    getPaginationRowModel: getPaginationRowModel(),
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
  });
  const ToolbarComponent = CustomToolbar || DataTableToolbar;

  // Force table section to re-render when server data size or controlled pagination changes.
  // This guards against cases where upstream keeps previous data during fetches
  // and React Table's internal memoization could retain the old row model briefly.
  const renderKey = React.useMemo(() => {
    const pageIndex = pagination ? pagination.pageIndex : table.getState().pagination.pageIndex;
    const pageSize = pagination ? pagination.pageSize : table.getState().pagination.pageSize;
    return `${data.length}-${pageIndex}-${pageSize}`;
  }, [data.length, pagination, table]);

  const handlePaginationChange = (pageIndex: number) => {
    if (pagination) {
      pagination.onPageChange(pageIndex + 1); // Convert 0-based to 1-based for the API
    } else {
      table.setPageIndex(pageIndex);
    }
  };

  const handlePageSizeChange = (pageSize: number) => {
    if (pagination) {
      pagination.onPageSizeChange(pageSize);
    } else {
      table.setPageSize(pageSize);
    }
  };

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
      <div className="rounded-none border" key={renderKey}>
        <Table>
          <TableHeader className="rounded-none border-none  bg-accent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap py-2 px-4 rounded-none"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                    } hover:bg-gray-50 border-b border-gray-200`}
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
  );
}
