import { Plus, X } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import { DataTableFacetedFilter } from './DataTableFacetedFilter';
import { DataTableViewOptions } from './DataTableViewOptions';

import type { Table } from '@tanstack/react-table';

interface DataTableToolbarProps<TData> {
  tableTitle?: string;
  table: Table<TData>;
  filterableColumns: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  searchKey?: string;
  onAction?: () => void;
  actionTitle?: string;
}

export function DataTableToolbar<TData>({
  tableTitle,
  table,
  searchKey,
  filterableColumns = [],
  onAction,
  actionTitle,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-4 items-start justify-start md:flex-row md:items-center md:justify-between rounded-none">
      <div className="flex flex-1 items-center space-x-2 rounded-none">
        {tableTitle && (
          <h2 className="text-xl bg-muted-foreground text-background px-4 py-1.5 font-bold">
            {tableTitle}
          </h2>
        )}
        {searchKey && (
          <Input
            placeholder="Search..."
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="rounded-none h-10 w-full md:max-w-sm"
          />
        )}
        <div className="flex flex-wrap gap-2 rounded-none">
          {filterableColumns.map((column) => {
            const columnFilter = table.getColumn(column.id);
            if (!columnFilter) return null;

            return (
              <DataTableFacetedFilter
                key={column.id}
                column={columnFilter}
                title={column.title}
                options={column.options}
              />
            );
          })}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-10 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <DataTableViewOptions table={table} />
        {onAction && (
          <Button className="rounded-none px-6 gap-2" onClick={onAction}>
            <Plus size={16} /> {actionTitle ?? 'Add New'}
          </Button>
        )}
      </div>
    </div>
  );
}
