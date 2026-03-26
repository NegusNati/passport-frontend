import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import { PdfImportFormatSchema, type PdfUploadInput, PdfUploadSchema } from '../schemas/upload'

type PdfUploadFormState = {
  date: string
  location: string
  start_after_text: string
  format: PdfUploadInput['format']
}

const defaultState: PdfUploadFormState = {
  date: '',
  location: '',
  start_after_text: '',
  format: PdfImportFormatSchema.enum.auto,
}

type PdfUploadFormProps = {
  onSubmit: (values: PdfUploadInput) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
}

export function PdfUploadForm({ onSubmit, isSubmitting, errorMessage }: PdfUploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileKey, setFileKey] = useState(0)
  const [formValues, setFormValues] = useState<PdfUploadFormState>(defaultState)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target
    setFormValues((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null
    setFile(selectedFile)
  }

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault()
        setFormError(null)
        setSuccessMessage(null)

        const parsed = PdfUploadSchema.safeParse({
          pdf_file: file,
          date: formValues.date,
          location: formValues.location.trim(),
          start_after_text: formValues.start_after_text.trim(),
          format: formValues.format,
        })

        if (!parsed.success) {
          setFormError(parsed.error.issues[0]?.message ?? 'Invalid form data.')
          return
        }

        try {
          await onSubmit(parsed.data)
          setSuccessMessage('Upload accepted. Import batch queued; progress is shown below.')
          setFormValues(defaultState)
          setFile(null)
          setFileKey((key) => key + 1)
        } catch (error) {
          setFormError(
            error instanceof Error ? error.message : 'Failed to upload PDF. Please try again.',
          )
        }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="pdf_file">PDF file</Label>
          <input
            id="pdf_file"
            name="pdf_file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            key={fileKey}
            className="text-sm"
          />
          <p className="text-muted-foreground text-xs">
            Maximum size 10MB. Only PDF files are allowed.
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date (YYYY-MM-DD)</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formValues.date}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formValues.location}
            onChange={handleChange}
            placeholder="Addis Ababa…"
            autoComplete="off"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="start_after_text">Start after text</Label>
          <Input
            id="start_after_text"
            name="start_after_text"
            value={formValues.start_after_text}
            onChange={handleChange}
            placeholder="Application Number…"
            autoComplete="off"
            aria-describedby="start_after_text_hint"
            required
          />
          <p id="start_after_text_hint" className="text-muted-foreground text-xs leading-relaxed">
            The importer starts after the first line that contains this text. Use{' '}
            <span className="font-mono">REQUEST_No.</span> for legacy 5-column PDFs or{' '}
            <span className="font-mono">Application Number</span> for application 4-column PDFs.
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="format">Format</Label>
          <Select
            value={formValues.format}
            onValueChange={(value) =>
              setFormValues((prev) => ({
                ...prev,
                format: value as PdfUploadInput['format'],
              }))
            }
          >
            <SelectTrigger id="format" aria-describedby="format_hint" className="w-full">
              <SelectValue placeholder="Select import format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PdfImportFormatSchema.enum.auto}>Auto detect</SelectItem>
              <SelectItem value={PdfImportFormatSchema.enum.legacy_5col}>
                Legacy 5-column
              </SelectItem>
              <SelectItem value={PdfImportFormatSchema.enum.application_4col}>
                Application 4-column
              </SelectItem>
            </SelectContent>
          </Select>
          <p id="format_hint" className="text-muted-foreground text-xs leading-relaxed">
            Auto detect is the safest default unless you already know which PDF layout you are
            importing.
          </p>
        </div>
      </div>

      {formError ? (
        <p role="alert" className="text-destructive text-sm">
          {formError}
        </p>
      ) : null}
      {errorMessage ? (
        <p role="alert" className="text-destructive text-sm">
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p aria-live="polite" className="text-primary text-sm">
          {successMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading…' : 'Upload & Queue Batch'}
      </Button>
    </form>
  )
}
