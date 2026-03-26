import { z } from 'zod'

export const PdfImportFormatSchema = z.enum(['auto', 'legacy_5col', 'application_4col'])

export const PassportImportBatchStatusSchema = z.enum([
  'queued',
  'processing',
  'completed',
  'failed',
])

export const PdfImportInfoSchema = z.object({
  message: z.string(),
  constraints: z.object({
    pdf_file: z.string().optional(),
    date: z.string().optional(),
    location: z.string().optional(),
    start_after_text: z.string().optional(),
    linesToSkip: z.string().optional(),
    format: z.string().optional(),
  }),
})

export const PdfUploadResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    path: z.string().optional(),
    batch_id: z.number().int(),
    status: PassportImportBatchStatusSchema,
    status_url: z.string(),
  }),
})

export const PassportImportBatchSchema = z.object({
  data: z.object({
    id: z.number().int(),
    status: PassportImportBatchStatusSchema,
    source_format: PdfImportFormatSchema,
    original_filename: z.string(),
    file_path: z.string(),
    date_of_publish: z.string(),
    location: z.string(),
    start_after_text: z.string().nullable().optional(),
    rows_total: z.number().int().nonnegative(),
    rows_inserted: z.number().int().nonnegative(),
    rows_updated: z.number().int().nonnegative(),
    rows_skipped: z.number().int().nonnegative(),
    rows_failed: z.number().int().nonnegative(),
    error_message: z.string().nullable().optional(),
    started_at: z.string().nullable().optional(),
    finished_at: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
  }),
})

export const PdfUploadSchema = z.object({
  pdf_file: z
    .instanceof(File)
    .refine((file) => file.type === 'application/pdf', 'File must be a PDF.')
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be 10MB or smaller.'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must match YYYY-MM-DD.'),
  location: z.string().trim().min(2, 'Location must be at least 2 characters.'),
  start_after_text: z.string().trim().min(1, 'Start after text is required.'),
  format: PdfImportFormatSchema.default('auto'),
  linesToSkip: z.string().trim().min(1).optional(),
})

export type PdfUploadInput = z.infer<typeof PdfUploadSchema>
export type PdfImportInfo = z.infer<typeof PdfImportInfoSchema>
export type PdfUploadResponse = z.infer<typeof PdfUploadResponseSchema>
export type PassportImportBatch = z.infer<typeof PassportImportBatchSchema>['data']
