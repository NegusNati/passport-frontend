import { useMutation } from '@tanstack/react-query'

import { submitAdvertisementRequest } from './api'

export function useSubmitAdvertisementRequestMutation() {
  return useMutation({
    mutationFn: submitAdvertisementRequest,
  })
}
