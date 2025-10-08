import type { AdvertisementRequestCreate } from './advertisement-request'

// Payload with optional file
export type AdvertisementRequestCreatePayload = AdvertisementRequestCreate & {
  file?: File
}
