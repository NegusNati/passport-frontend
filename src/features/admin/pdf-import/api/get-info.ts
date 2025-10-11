import { useQuery } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { type PdfImportInfo, PdfImportInfoSchema } from '../schemas/upload'

export async function fetchPdfImportInfo() {
  const response = await api.get('/api/v1/admin/pdf-to-sqlite')
  return PdfImportInfoSchema.parse(response.data)
}

export function usePdfImportInfoQuery() {
  return useQuery<PdfImportInfo>({
    queryKey: [...adminKeys.all, 'pdf-import', 'info'],
    queryFn: fetchPdfImportInfo,
    staleTime: 30_000,
  })
}
