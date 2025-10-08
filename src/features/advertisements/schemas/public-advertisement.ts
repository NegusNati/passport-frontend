import { z } from 'zod'

// Public-facing ad schema (less data exposed)
export const PublicAdvertisement = z.object({
  id: z.number(),
  desktop_asset_url: z.string().url(),
  mobile_asset_url: z.string().url(),
  client_link: z.string().url(),
  placement: z.string(),
})

export type PublicAdvertisement = z.infer<typeof PublicAdvertisement>

// Response when fetching ad by placement
export const PublicAdvertisementResponse = z.object({
  data: PublicAdvertisement.nullable(),
})

export type PublicAdvertisementResponse = z.infer<typeof PublicAdvertisementResponse>

// Impression tracking payload
export const ImpressionPayload = z.object({
  ad_id: z.number(),
  placement: z.string(),
})

export type ImpressionPayload = z.infer<typeof ImpressionPayload>

// Click tracking payload
export const ClickPayload = z.object({
  ad_id: z.number(),
  placement: z.string(),
})

export type ClickPayload = z.infer<typeof ClickPayload>
