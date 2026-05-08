import { z } from 'zod'

export const AdSlot = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1),
  name: z.string().min(1),
  page_context: z.string().nullable().optional(),
  format: z.string().nullable().optional(),
  desktop_width: z.number().int().positive().nullable(),
  desktop_height: z.number().int().positive().nullable(),
  mobile_width: z.number().int().positive().nullable(),
  mobile_height: z.number().int().positive().nullable(),
  is_active: z.boolean(),
})

export type AdSlot = z.infer<typeof AdSlot>

export const AdSlotListResponse = z.object({
  data: z.array(AdSlot),
})

export type AdSlotListResponse = z.infer<typeof AdSlotListResponse>
