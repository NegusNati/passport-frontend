import { useMutation } from '@tanstack/react-query'

import { api } from '@/api/client'

import {
  type PdfUploadInput,
  type PdfUploadResponse,
  PdfUploadResponseSchema,
  PdfUploadSchema,
} from '../schemas/upload'

export function buildPdfUploadFormData(input: PdfUploadInput) {
  const payload = PdfUploadSchema.parse(input)
  const formData = new FormData()

  formData.append('pdf_file', payload.pdf_file)
  formData.append('date', payload.date)
  formData.append('location', payload.location)
  formData.append('format', payload.format)

  const startAfterText = payload.start_after_text ?? payload.linesToSkip
  if (startAfterText) {
    formData.append('start_after_text', startAfterText)
    formData.append('linesToSkip', startAfterText)
  }

  return formData
}

export async function uploadPdfToSqlite(input: PdfUploadInput): Promise<PdfUploadResponse> {
  const formData = buildPdfUploadFormData(input)

  const response = await api.post('/api/v1/admin/pdf-to-sqlite', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return PdfUploadResponseSchema.parse(response.data)
}

export function usePdfUploadMutation() {
  return useMutation({
    mutationFn: uploadPdfToSqlite,
  })
}
