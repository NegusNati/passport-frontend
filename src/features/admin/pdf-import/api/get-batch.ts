import { useQuery } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { type PassportImportBatch, PassportImportBatchSchema } from '../schemas/upload'

export function getPassportImportBatchRefetchInterval(status?: PassportImportBatch['status']) {
  return status === 'completed' || status === 'failed' ? false : 2_500
}

export async function fetchPassportImportBatch(batchId: number) {
  const response = await api.get(`/api/v1/admin/passport-imports/${batchId}`)
  return PassportImportBatchSchema.parse(response.data).data
}

export function usePassportImportBatchQuery(batchId: number | null) {
  return useQuery<PassportImportBatch>({
    queryKey: [...adminKeys.all, 'pdf-import', 'batch', batchId],
    queryFn: () => fetchPassportImportBatch(batchId as number),
    enabled: batchId !== null,
    refetchInterval: (query) => getPassportImportBatchRefetchInterval(query.state.data?.status),
  })
}
