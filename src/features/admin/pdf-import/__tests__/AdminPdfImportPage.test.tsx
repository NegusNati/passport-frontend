import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  useSearchMock: vi.fn(),
  navigateMock: vi.fn(),
  mutateAsyncMock: vi.fn(),
  usePdfImportInfoQueryMock: vi.fn(),
  usePdfUploadMutationMock: vi.fn(),
  usePassportImportBatchQueryMock: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => () => ({
    useSearch: mocks.useSearchMock,
  }),
  useNavigate: () => mocks.navigateMock,
}))

vi.mock('@/features/admin/pdf-import/api/get-info', () => ({
  fetchPdfImportInfo: vi.fn(),
  usePdfImportInfoQuery: () => mocks.usePdfImportInfoQueryMock(),
}))

vi.mock('@/features/admin/pdf-import/api/upload', () => ({
  usePdfUploadMutation: () => mocks.usePdfUploadMutationMock(),
}))

vi.mock('@/features/admin/pdf-import/api/get-batch', () => ({
  usePassportImportBatchQuery: (batchId: number | null) =>
    mocks.usePassportImportBatchQueryMock(batchId),
}))

vi.mock('@/features/admin/pdf-import/components/PdfImportPanel', () => ({
  PdfImportPanel: () => <div>Import Panel</div>,
}))

vi.mock('@/features/admin/pdf-import/components/PdfImportBatchStatus', () => ({
  PdfImportBatchStatus: () => <div>Batch Status</div>,
}))

vi.mock('@/features/admin/pdf-import/components/PdfUploadForm', () => ({
  PdfUploadForm: ({ onSubmit }: { onSubmit: (values: unknown) => Promise<void> | void }) => (
    <button
      type="button"
      onClick={() =>
        onSubmit({
          pdf_file: new File(['pdf'], 'batch.pdf', { type: 'application/pdf' }),
          date: '2026-03-26',
          location: 'Addis Ababa',
          start_after_text: 'REQUEST_No.',
          format: 'auto',
        })
      }
    >
      Submit Upload
    </button>
  ),
}))

vi.mock('@/features/admin/lib/guards', () => ({
  loadAdminUser: vi.fn(),
}))

vi.mock('@/api/queryClient', () => ({
  queryClient: {
    ensureQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
  },
}))

vi.mock('@/features/admin/lib/keys', () => ({
  adminKeys: {
    all: ['admin'],
    passports: {
      all: () => ['admin', 'passports'],
    },
  },
}))

import { AdminPdfImportPage, AdminPdfImportSearchSchema } from '@/routes/admin/pdf-import'

describe('AdminPdfImportPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useSearchMock.mockReturnValue({ batch: 123 })
    mocks.usePdfImportInfoQueryMock.mockReturnValue({ data: undefined, isLoading: false })
    mocks.usePdfUploadMutationMock.mockReturnValue({
      mutateAsync: mocks.mutateAsyncMock,
      isPending: false,
      error: null,
    })
    mocks.usePassportImportBatchQueryMock.mockImplementation((batchId: number | null) => ({
      data:
        batchId === null
          ? undefined
          : {
              id: batchId,
              status: 'queued',
            },
      isLoading: false,
    }))
  })

  it('parses the batch id from route search params', () => {
    expect(AdminPdfImportSearchSchema.parse({ batch: '123' }).batch).toBe(123)
    expect(AdminPdfImportSearchSchema.parse({}).batch).toBeUndefined()
  })

  it('uses the route batch id to load the active batch', () => {
    render(<AdminPdfImportPage />)

    expect(mocks.usePassportImportBatchQueryMock).toHaveBeenCalledWith(123)
  })

  it('replaces the route search batch after a successful upload', async () => {
    mocks.mutateAsyncMock.mockResolvedValue({
      status: 'success',
      message: 'queued',
      data: {
        batch_id: 456,
        status: 'queued',
        status_url: '/api/v1/admin/passport-imports/456',
      },
    })

    render(<AdminPdfImportPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Submit Upload' }))

    await waitFor(() => {
      expect(mocks.navigateMock).toHaveBeenCalledWith({
        search: { batch: 456 },
        replace: false,
      })
    })
  })
})
