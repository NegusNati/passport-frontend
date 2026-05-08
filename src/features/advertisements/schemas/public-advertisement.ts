import { z } from 'zod'

const PublicAdAsset = z.object({
  url: z.string().url().nullable(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
})

// Public-facing ad schema (less data exposed)
export const PublicAdvertisement = z
  .object({
    id: z.number(),
    slot_code: z.string().optional(),
    placement: z.string().optional(),
    title: z.string().optional(),
    alt_text: z.string().optional(),
    target_url: z.string().url().optional().nullable(),
    client_link: z.string().url().optional().nullable(),
    desktop_asset: PublicAdAsset.optional(),
    mobile_asset: PublicAdAsset.optional(),
    desktop_asset_url: z.string().url().optional(),
    mobile_asset_url: z.string().url().optional(),
    impression_url: z.string().optional(),
    click_url: z.string().optional(),
  })
  .transform((ad) => {
    const desktopAsset = ad.desktop_asset ?? {
      url: ad.desktop_asset_url ?? null,
      width: 1200,
      height: 300,
    }
    const mobileAsset = ad.mobile_asset ?? {
      url: ad.mobile_asset_url ?? desktopAsset.url,
      width: 640,
      height: 360,
    }
    const targetUrl = ad.target_url ?? ad.client_link ?? ''

    return {
      ...ad,
      slot_code: ad.slot_code ?? ad.placement ?? '',
      placement: ad.placement ?? ad.slot_code ?? '',
      title: ad.title ?? '',
      alt_text: ad.alt_text ?? ad.title ?? 'Advertisement',
      target_url: targetUrl,
      client_link: targetUrl,
      desktop_asset: desktopAsset,
      mobile_asset: mobileAsset,
      desktop_asset_url: desktopAsset.url ?? '',
      mobile_asset_url: mobileAsset.url ?? desktopAsset.url ?? '',
    }
  })

export type PublicAdvertisement = z.infer<typeof PublicAdvertisement>

// Response when fetching ad by placement
export const PublicAdvertisementResponse = z.object({
  data: PublicAdvertisement.nullable(),
})

export type PublicAdvertisementResponse = z.infer<typeof PublicAdvertisementResponse>

export const PublicAdvertisementsBySlotResponse = z.object({
  data: z.record(z.string(), PublicAdvertisement.nullable()),
})

export type PublicAdvertisementsBySlotResponse = z.infer<typeof PublicAdvertisementsBySlotResponse>

// Impression tracking payload
export const ImpressionPayload = z.object({
  ad_id: z.number(),
  placement: z.string().optional(),
  slot_code: z.string().optional(),
  session_id: z.string().optional(),
  pathname: z.string().optional(),
  viewport: z.enum(['mobile', 'desktop']).optional(),
  language: z.string().optional(),
})

export type ImpressionPayload = z.infer<typeof ImpressionPayload>

// Click tracking payload
export const ClickPayload = z.object({
  ad_id: z.number(),
  placement: z.string().optional(),
  slot_code: z.string().optional(),
  session_id: z.string().optional(),
  pathname: z.string().optional(),
  viewport: z.enum(['mobile', 'desktop']).optional(),
  language: z.string().optional(),
})

export type ClickPayload = z.infer<typeof ClickPayload>
