import { describe, expect, it } from 'vitest'

import {
  PdfImportFormatSchema,
  PdfUploadResponseSchema,
  PdfUploadSchema,
} from '../../schemas/upload'
import { buildPdfUploadFormData } from '../upload'

function createPdfFile() {
  return new File(['pdf'], 'batch.pdf', { type: 'application/pdf' })
}

describe('PdfUploadSchema', () => {
  it('accepts automatic uploads without a start marker', () => {
    const parsed = PdfUploadSchema.parse({
      pdf_file: createPdfFile(),
      date: '2026-03-26',
      location: 'Addis Ababa',
    })

    expect(parsed.start_after_text).toBeUndefined()
    expect(parsed.format).toBe(PdfImportFormatSchema.enum.auto)
    expect(parsed.linesToSkip).toBeUndefined()
  })

  it('accepts the application format with an ignored Remark column', () => {
    const parsed = PdfUploadSchema.parse({
      pdf_file: createPdfFile(),
      date: '2026-08-15',
      location: 'Hosaena',
      format: PdfImportFormatSchema.enum.application_5col_remark,
    })

    expect(parsed.format).toBe(PdfImportFormatSchema.enum.application_5col_remark)
  })

  it('rejects an invalid format', () => {
    expect(() =>
      PdfUploadSchema.parse({
        pdf_file: createPdfFile(),
        date: '2026-03-26',
        location: 'Addis Ababa',
        start_after_text: 'Application Number',
        format: 'wrong-format',
      }),
    ).toThrow()
  })
})

describe('buildPdfUploadFormData', () => {
  it('serializes the new fields and the legacy alias', () => {
    const formData = buildPdfUploadFormData({
      pdf_file: createPdfFile(),
      date: '2026-03-26',
      location: 'Addis Ababa',
      start_after_text: 'Application Number',
      format: PdfImportFormatSchema.enum.application_4col,
    })

    expect(formData.get('date')).toBe('2026-03-26')
    expect(formData.get('location')).toBe('Addis Ababa')
    expect(formData.get('start_after_text')).toBe('Application Number')
    expect(formData.get('format')).toBe(PdfImportFormatSchema.enum.application_4col)
    expect(formData.get('linesToSkip')).toBe('Application Number')
    expect(formData.get('pdf_file')).toBeInstanceOf(File)
  })

  it('omits parser hints for automatic uploads', () => {
    const formData = buildPdfUploadFormData({
      pdf_file: createPdfFile(),
      date: '2026-08-15',
      location: 'Hosaena',
      format: PdfImportFormatSchema.enum.auto,
    })

    expect(formData.get('format')).toBe(PdfImportFormatSchema.enum.auto)
    expect(formData.has('start_after_text')).toBe(false)
    expect(formData.has('linesToSkip')).toBe(false)
  })
})

describe('PdfUploadResponseSchema', () => {
  it('requires batch metadata on successful uploads', () => {
    expect(() =>
      PdfUploadResponseSchema.parse({
        status: 'success',
        message: 'queued',
      }),
    ).toThrow()
  })
})
