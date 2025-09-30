import { SlidersHorizontal } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/shared/ui/button';

import type { Table, Column } from '@tanstack/react-table';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

type ColumnMeta = { label?: string };

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleClick);
    return () => window.removeEventListener('pointerdown', handleClick);
  }, [open]);

  const getLabel = (col: Column<TData, unknown>) => {
    // 1) Prefer explicit, localized label you put in meta
    const meta = (col.columnDef?.meta ?? {}) as ColumnMeta;
    if (meta.label) return meta.label;

    // 2) If header is a plain string, use it
    if (typeof col.columnDef?.header === 'string') {
      return col.columnDef.header;
    }

    // 3) Fallback to id
    return col.id;
  };

  const toggleableColumns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide());

  if (!toggleableColumns.length) {
    return null;
  }

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="outline"
        size="sm"
        className="ml-auto h-10 flex rounded-none"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        View
      </Button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-border bg-background p-2 shadow-lg">
          <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Toggle columns
          </p>
          <div className="space-y-1">
            {toggleableColumns.map((column) => {
              const id = `toggle-${column.id}`;
              return (
                <label
                  key={column.id}
                  htmlFor={id}
                  className="flex items-center gap-2 rounded-sm px-2 py-1 text-sm hover:bg-muted cursor-pointer"
                >
                  <input
                    id={id}
                    type="checkbox"
                    className="h-3.5 w-3.5"
                    checked={column.getIsVisible()}
                    onChange={(event) => column.toggleVisibility(event.target.checked)}
                  />
                  <span className="truncate">{getLabel(column)}</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
