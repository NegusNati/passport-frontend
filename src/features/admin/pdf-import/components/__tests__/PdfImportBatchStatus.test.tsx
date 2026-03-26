import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { PassportImportBatch } from '../../schemas/upload'
import { PdfImportBatchStatus } from '../PdfImportBatchStatus'

const baseBatch: PassportImportBatch = {
  id: 123,
  status: 'queued',
  source_format: 'legacy_5col',
  original_filename: 'legacy.pdf',
  file_path: 'pdfs/legacy.pdf',
  date_of_publish: '2026-03-26',
  location: 'Addis Ababa',
  start_after_text: 'REQUEST_No.',
  rows_total: 10,
  rows_inserted: 8,
  rows_updated: 1,
  rows_skipped: 1,
  rows_failed: 0,
  error_message: null,
  started_at: '2026-03-26T10:00:00+00:00',
  finished_at: '2026-03-26T10:05:00+00:00',
  created_at: '2026-03-26T09:59:58+00:00',
  updated_at: '2026-03-26T10:05:00+00:00',
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('PdfImportBatchStatus', () => {
  it('renders queued batches with a friendly status description', () => {
    render(<PdfImportBatchStatus batch={baseBatch} isLoading={false} />)

    expect(screen.getByText('Queued')).toBeTruthy()
    expect(screen.getByText('Waiting for worker pickup.')).toBeTruthy()
    expect(screen.getByText('Legacy 5-column')).toBeTruthy()
    expect(screen.getByText('REQUEST_No.')).toBeTruthy()
  })

  it('renders completed summaries and formatted timestamps', () => {
    const formatterSpy = vi
      .spyOn(Intl, 'DateTimeFormat')
      .mockImplementation(() => ({ format: () => 'Formatted timestamp' }) as Intl.DateTimeFormat)

    render(<PdfImportBatchStatus batch={{ ...baseBatch, status: 'completed' }} isLoading={false} />)

    expect(screen.getByText('Completed')).toBeTruthy()
    expect(screen.getByText('8 inserted, 1 updated, 1 skipped.')).toBeTruthy()
    expect(screen.getAllByText('Formatted timestamp').length).toBeGreaterThan(0)
    expect(formatterSpy).toHaveBeenCalled()
  })

  it('renders failed batches with the error message', () => {
    render(
      <PdfImportBatchStatus
        batch={{
          ...baseBatch,
          status: 'failed',
          rows_failed: 2,
          error_message: 'The import worker crashed.',
        }}
        isLoading={false}
      />,
    )

    expect(screen.getByText('Failed')).toBeTruthy()
    expect(screen.getByText('The import worker crashed.')).toBeTruthy()
  })
})
