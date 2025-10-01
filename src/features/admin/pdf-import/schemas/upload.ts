import { z } from 'zod'

export const PdfImportInfoSchema = z.object({
  message: z.string(),
  constraints: z.object({
    pdf_file: z.string().optional(),
    date: z.string().optional(),
    location: z.string().optional(),
    linesToSkip: z.string().optional(),
  }),
})

export const PdfUploadSchema = z.object({
  pdf_file: z
    .instanceof(File)
    .refine((file) => file.type === 'application/pdf', 'File must be a PDF.')
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be 10MB or smaller.'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().min(2),
  linesToSkip: z.string().min(1),
})

export type PdfUploadInput = z.infer<typeof PdfUploadSchema>
export type PdfImportInfo = z.infer<typeof PdfImportInfoSchema>
