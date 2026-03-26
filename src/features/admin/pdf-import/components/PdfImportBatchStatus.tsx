import { cn } from '@/shared/lib/utils'

import type { PassportImportBatch } from '../schemas/upload'

type PdfImportBatchStatusProps = {
  batch?: PassportImportBatch
  isLoading: boolean
}

export function PdfImportBatchStatus({ batch, isLoading }: PdfImportBatchStatusProps) {
  if (!batch && !isLoading) {
    return null
  }

  const statusMeta = batch ? getStatusMeta(batch) : null

  return (
    <section className="bg-background grid gap-4 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold">Latest import batch</h2>
          <p className="text-muted-foreground truncate text-sm">
            {isLoading ? 'Checking batch progress…' : batch?.original_filename}
          </p>
          {statusMeta ? (
            <p aria-live="polite" className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {statusMeta.description}
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            'rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide uppercase',
            statusMeta?.badgeClassName ?? 'border-border text-muted-foreground',
          )}
        >
          {statusMeta?.label ?? 'Loading'}
        </span>
      </div>

      {batch ? (
        <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0">
            <dt className="text-muted-foreground">Batch ID</dt>
            <dd className="font-medium tabular-nums">{batch.id}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted-foreground">Format</dt>
            <dd className="font-medium">{formatBatchSource(batch.source_format)}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted-foreground">Publish date</dt>
            <dd className="font-medium tabular-nums">{formatDate(batch.date_of_publish)}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted-foreground">Location</dt>
            <dd className="font-medium break-words">{batch.location}</dd>
          </div>
          {batch.start_after_text ? (
            <div className="min-w-0">
              <dt className="text-muted-foreground">Start after text</dt>
              <dd className="font-mono text-xs break-words">{batch.start_after_text}</dd>
            </div>
          ) : null}
          {batch.created_at ? (
            <div className="min-w-0">
              <dt className="text-muted-foreground">Created</dt>
              <dd className="font-medium tabular-nums">{formatTimestamp(batch.created_at)}</dd>
            </div>
          ) : null}
          {batch.started_at ? (
            <div className="min-w-0">
              <dt className="text-muted-foreground">Started</dt>
              <dd className="font-medium tabular-nums">{formatTimestamp(batch.started_at)}</dd>
            </div>
          ) : null}
          {batch.finished_at ? (
            <div className="min-w-0">
              <dt className="text-muted-foreground">Finished</dt>
              <dd className="font-medium tabular-nums">{formatTimestamp(batch.finished_at)}</dd>
            </div>
          ) : null}
          <div className="min-w-0">
            <dt className="text-muted-foreground">Rows total</dt>
            <dd className="font-medium tabular-nums">{batch.rows_total}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted-foreground">Inserted</dt>
            <dd className="font-medium tabular-nums">{batch.rows_inserted}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted-foreground">Updated</dt>
            <dd className="font-medium tabular-nums">{batch.rows_updated}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted-foreground">Skipped</dt>
            <dd className="font-medium tabular-nums">{batch.rows_skipped}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted-foreground">Failed rows</dt>
            <dd className="font-medium tabular-nums">{batch.rows_failed}</dd>
          </div>
        </dl>
      ) : null}

      {batch?.error_message ? (
        <p role="alert" className="text-destructive text-sm">
          {batch.error_message}
        </p>
      ) : null}
    </section>
  )
}

function getStatusMeta(batch: PassportImportBatch) {
  const processedRows =
    batch.rows_inserted + batch.rows_updated + batch.rows_skipped + batch.rows_failed

  switch (batch.status) {
    case 'queued':
      return {
        label: 'Queued',
        description: 'Waiting for worker pickup.',
        badgeClassName: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      }
    case 'processing':
      return {
        label: 'Processing',
        description:
          batch.rows_total > 0
            ? `Processed ${processedRows} of ${batch.rows_total} rows so far.`
            : 'Actively parsing and importing rows.',
        badgeClassName: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
      }
    case 'completed': {
      const summary = [
        `${batch.rows_inserted} inserted`,
        `${batch.rows_updated} updated`,
        `${batch.rows_skipped} skipped`,
      ]
      if (batch.rows_failed > 0) {
        summary.push(`${batch.rows_failed} failed`)
      }
      return {
        label: 'Completed',
        description: `${summary.join(', ')}.`,
        badgeClassName:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      }
    }
    case 'failed':
      return {
        label: 'Failed',
        description:
          batch.rows_total > 0
            ? `Import failed after processing ${processedRows} of ${batch.rows_total} rows.`
            : 'Import failed before any rows were committed.',
        badgeClassName: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
      }
  }
}

function formatBatchSource(value: PassportImportBatch['source_format']) {
  switch (value) {
    case 'auto':
      return 'Auto detect'
    case 'legacy_5col':
      return 'Legacy 5-column'
    case 'application_4col':
      return 'Application 4-column'
  }
}

function formatDate(value: string) {
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return value

  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(dt)
}

function formatTimestamp(value: string) {
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return value

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(dt)
}
