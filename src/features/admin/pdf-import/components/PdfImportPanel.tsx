import { AlertTriangle } from 'lucide-react'

import type { PdfImportInfo } from '../schemas/upload'

type PdfImportPanelProps = {
  info?: PdfImportInfo
  isLoading: boolean
}

export function PdfImportPanel({ info, isLoading }: PdfImportPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-background rounded-lg border p-4">
        <p className="text-muted-foreground text-sm">Loading import instructions…</p>
      </div>
    )
  }

  return (
    <div className="bg-background grid gap-3 rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
        <div className="space-y-1">
          <h2 className="text-base font-semibold">Import guidelines</h2>
          <p className="text-muted-foreground text-sm">
            {info?.message ?? 'Upload a PDF export to start the ingestion job.'}
          </p>
        </div>
      </div>
      {info?.constraints ? (
        <dl className="text-muted-foreground grid gap-2 text-sm">
          {Object.entries(info.constraints).map(([key, value]) => (
            <div key={key} className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium capitalize">{formatKey(key)}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  )
}

function formatKey(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase())
}
