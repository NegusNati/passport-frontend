import { AlertCircle } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { TableBody, TableCell, TableRow } from '@/shared/ui/table';

interface DataTableErrorProps {
  error: Error;
  columns: number;
}

export function DataTableError({ error, columns }: DataTableErrorProps) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={columns} className="h-24 py-14">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-500">
                Failed to Load Data
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                There was a problem loading the data. Please try again later.
              </p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
