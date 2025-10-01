import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { type PdfUploadInput,PdfUploadSchema } from '../schemas/upload'

export async function uploadPdfToSqlite(input: PdfUploadInput) {
  const payload = PdfUploadSchema.parse(input)
  const formData = new FormData()
  formData.append('pdf_file', payload.pdf_file)
  formData.append('date', payload.date)
  formData.append('location', payload.location)
  formData.append('linesToSkip', payload.linesToSkip)

  const response = await api.post('/api/v1/admin/pdf-to-sqlite', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data as { status: string; message: string; data?: unknown }
}

export function usePdfUploadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadPdfToSqlite,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.passports.all() })
    },
  })
}
