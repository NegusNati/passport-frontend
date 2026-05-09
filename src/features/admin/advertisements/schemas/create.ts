import { z } from 'zod'

import { AdStatus, PackageType, PaymentStatus } from './advertisement'

// Base schema for text fields - using API field names
const BaseAdvertisementSchema = z.object({
  ad_slot_number: z.string().min(1, 'Campaign code is required').optional(),
  slot_code: z.string().min(1, 'Ad slot is required'),
  ad_title: z.string().min(1, 'Ad title is required').max(255, 'Ad title too long'),
  alt_text: z.string().min(1, 'Alt text is required').max(255, 'Alt text too long'),
  client_name: z.string().min(1, 'Client name is required').max(255, 'Client name too long'),
  ad_client_link: z.string().url('Must be a valid URL').optional(),
  target_url: z.string().url('Target URL must be valid').max(255, 'Target URL too long'),
  status: AdStatus,
  package_type: PackageType,
  ad_published_date: z.string().min(1, 'Published date is required'),
  ad_ending_date: z.string().nullable().optional(),
  payment_status: PaymentStatus,
  payment_amount: z.string(), // Send as string to match API expectation
  // Optional fields
  advertisement_request_id: z.number().int().positive().optional(),
  ad_desc: z.string().optional(),
  ad_excerpt: z.string().min(1, 'Ad excerpt is required'),
  priority: z.number().int().min(0).max(100).optional(),
  admin_notes: z.string().optional(),
})

// Create payload (includes files)
export const AdvertisementCreatePayload = BaseAdvertisementSchema.extend({
  ad_desktop_asset: z.instanceof(File).optional(),
  ad_desktop_dark_asset: z.instanceof(File).optional(),
  ad_mobile_asset: z.instanceof(File).optional(),
  ad_mobile_dark_asset: z.instanceof(File).optional(),
})

export type AdvertisementCreatePayload = z.infer<typeof AdvertisementCreatePayload>

// Update payload (same as create, but for updates)
export const AdvertisementUpdatePayload = BaseAdvertisementSchema.extend({
  ad_desktop_asset: z.instanceof(File).optional(),
  ad_desktop_dark_asset: z.instanceof(File).optional(),
  ad_mobile_asset: z.instanceof(File).optional(),
  ad_mobile_dark_asset: z.instanceof(File).optional(),
  remove_ad_desktop_asset: z.boolean().optional(),
  remove_ad_desktop_dark_asset: z.boolean().optional(),
  remove_ad_mobile_asset: z.boolean().optional(),
  remove_ad_mobile_dark_asset: z.boolean().optional(),
})

export type AdvertisementUpdatePayload = z.infer<typeof AdvertisementUpdatePayload>

// Schema for API (without File objects)
export const AdvertisementCreateSchema = BaseAdvertisementSchema

export type AdvertisementCreate = z.infer<typeof AdvertisementCreateSchema>
