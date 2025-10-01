import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { type AdminPassportCreateInput,AdminPassportCreateSchema } from '../schemas/create'
import { AdminPassportsListResponseSchema } from '../schemas/passport'

export async function createAdminPassport(input: AdminPassportCreateInput) {
  const payload = AdminPassportCreateSchema.parse(input)
  const response = await api.post('/api/v1/passports', payload)
  return AdminPassportsListResponseSchema.pick({ data: true }).parse(response.data).data
}

export function useCreateAdminPassportMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAdminPassport,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.passports.all() })
    },
  })
}
