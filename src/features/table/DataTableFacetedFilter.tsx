import type { Column } from '@tanstack/react-table';
import { Check, PlusCircle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
  }[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const triggerRef = React.useRef<HTMLDivElement | null>(null);
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  React.useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current && !triggerRef.current.contains(target)) {
        setOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleClick);
    return () => window.removeEventListener('pointerdown', handleClick);
  }, [open]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative" ref={triggerRef}>
      <Button
        variant="outline"
        size="sm"
        className="h-10 border-dashed rounded-none"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        {title}
        {selectedValues?.size > 0 && (
          <>
            <span className="mx-2 h-4 border-l border-border" aria-hidden />
            <Badge variant="secondary" className="rounded-none px-1 font-normal lg:hidden">
              {selectedValues.size}
            </Badge>
            <div className="hidden space-x-1 lg:flex">
              {selectedValues.size > 2
                ? (
                    <Badge variant="secondary" className="rounded-none px-1 font-normal">
                      {selectedValues.size} selected
                    </Badge>
                  )
                : options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-none px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))}
            </div>
          </>
        )}
      </Button>
      {open ? (
        <div
          className="absolute left-0 z-20 mt-2 w-56 rounded-md border border-border bg-background p-2 shadow-lg"
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${title?.toLowerCase() ?? ''}`}
            className="mb-2 w-full rounded-md border border-input px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="max-h-56 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">No results found.</p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.has(option.value);
                const id = `${String(title)}-${option.value}`;
                return (
                  <label
                    key={option.value}
                    htmlFor={id}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-sm hover:bg-muted',
                      isSelected ? 'font-medium text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    <span
                      className={cn(
                        'mr-1 flex h-4 w-4 items-center justify-center rounded border border-primary',
                        isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50',
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    <input
                      id={id}
                      type="checkbox"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => {
                        if (isSelected) {
                          selectedValues.delete(option.value);
                        } else {
                          selectedValues.add(option.value);
                        }
                        const filterValues = Array.from(selectedValues);
                        column?.setFilterValue(filterValues.length ? filterValues : undefined);
                      }}
                    />
                    <span className="flex-1 truncate">{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </label>
                );
              })
            )}
          </div>
          {selectedValues.size > 0 ? (
            <Button
              type="button"
              variant="ghost"
              className="mt-2 w-full justify-center text-sm"
              onClick={() => {
                column?.setFilterValue(undefined);
                setSearch('');
              }}
            >
              Clear filters
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
