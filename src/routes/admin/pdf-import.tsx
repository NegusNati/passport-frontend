import { createFileRoute } from '@tanstack/react-router'

import { queryClient } from '@/api/queryClient'
import { adminKeys } from '@/features/admin/lib/keys'
import { loadAdminUser } from '@/features/admin/lib/guards'
import { fetchPdfImportInfo, usePdfImportInfoQuery } from '@/features/admin/pdf-import/api/get-info'
import { usePdfUploadMutation } from '@/features/admin/pdf-import/api/upload'
import { PdfImportPanel } from '@/features/admin/pdf-import/components/PdfImportPanel'
import { PdfUploadForm } from '@/features/admin/pdf-import/components/PdfUploadForm'

export const Route = createFileRoute('/admin/pdf-import')({
  loader: async () => {
    await loadAdminUser({ requiredPermission: 'upload-files', redirectTo: '/' })
    await queryClient.ensureQueryData({
      queryKey: [...adminKeys.all, 'pdf-import', 'info'],
      queryFn: fetchPdfImportInfo,
    })
  },
  component: AdminPdfImportPage,
})

function AdminPdfImportPage() {
  const infoQuery = usePdfImportInfoQuery()
  const uploadMutation = usePdfUploadMutation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">PDF to SQLite import</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Upload PDF batches to ingest passport records asynchronously.
        </p>
      </div>

      <PdfImportPanel info={infoQuery.data} isLoading={infoQuery.isLoading} />

      <div className="rounded-lg border bg-background p-4">
        <h2 className="text-lg font-semibold">Upload batch</h2>
        <p className="text-muted-foreground text-sm">
          Provide the PDF and metadata required to trigger the ingestion job.
        </p>
        <div className="mt-4">
          <PdfUploadForm
            onSubmit={async (values) => {
              await uploadMutation.mutateAsync(values)
            }}
            isSubmitting={uploadMutation.isPending}
            errorMessage={uploadMutation.error instanceof Error ? uploadMutation.error.message : null}
          />
        </div>
      </div>
    </div>
  )
}
