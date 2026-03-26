import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { z } from 'zod'

import { queryClient } from '@/api/queryClient'
import { loadAdminUser } from '@/features/admin/lib/guards'
import { adminKeys } from '@/features/admin/lib/keys'
import { usePassportImportBatchQuery } from '@/features/admin/pdf-import/api/get-batch'
import { fetchPdfImportInfo, usePdfImportInfoQuery } from '@/features/admin/pdf-import/api/get-info'
import { usePdfUploadMutation } from '@/features/admin/pdf-import/api/upload'
import { PdfImportBatchStatus } from '@/features/admin/pdf-import/components/PdfImportBatchStatus'
import { PdfImportPanel } from '@/features/admin/pdf-import/components/PdfImportPanel'
import { PdfUploadForm } from '@/features/admin/pdf-import/components/PdfUploadForm'

export const AdminPdfImportSearchSchema = z.object({
  batch: z.coerce.number().int().positive().optional(),
})

export const Route = createFileRoute('/admin/pdf-import')({
  validateSearch: AdminPdfImportSearchSchema.parse,
  loader: async () => {
    await loadAdminUser({ requiredPermission: 'upload-files', redirectTo: '/' })
    await queryClient.ensureQueryData({
      queryKey: [...adminKeys.all, 'pdf-import', 'info'],
      queryFn: fetchPdfImportInfo,
    })
  },
  component: AdminPdfImportPage,
})

export function AdminPdfImportPage() {
  const navigate = useNavigate({ from: '/admin/pdf-import' })
  const search = Route.useSearch()
  const infoQuery = usePdfImportInfoQuery()
  const uploadMutation = usePdfUploadMutation()
  const batchQuery = usePassportImportBatchQuery(search.batch ?? null)

  useEffect(() => {
    if (batchQuery.data?.status === 'completed') {
      void queryClient.invalidateQueries({ queryKey: adminKeys.passports.all() })
    }
  }, [batchQuery.data?.status])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">PDF to SQLite import</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Upload PDF batches, queue the import job, and track progress from the latest batch.
        </p>
      </div>

      <PdfImportPanel info={infoQuery.data} isLoading={infoQuery.isLoading} />

      <div className="bg-background rounded-lg border p-4">
        <h2 className="text-lg font-semibold">Upload batch</h2>
        <p className="text-muted-foreground text-sm">
          Provide the PDF and metadata required to queue the ingestion job.
        </p>
        <div className="mt-4">
          <PdfUploadForm
            onSubmit={async (values) => {
              const result = await uploadMutation.mutateAsync(values)
              navigate({
                search: { batch: result.data.batch_id },
                replace: false,
              })
            }}
            isSubmitting={uploadMutation.isPending}
            errorMessage={
              uploadMutation.error instanceof Error ? uploadMutation.error.message : null
            }
          />
        </div>
      </div>

      <PdfImportBatchStatus batch={batchQuery.data} isLoading={batchQuery.isLoading} />
    </div>
  )
}
