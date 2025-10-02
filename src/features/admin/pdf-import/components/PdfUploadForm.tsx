import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

import { type PdfUploadInput,PdfUploadSchema } from '../schemas/upload'

const defaultState = {
  date: '',
  location: '',
  linesToSkip: '',
}

type PdfUploadFormProps = {
  onSubmit: (values: PdfUploadInput) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
}

export function PdfUploadForm({ onSubmit, isSubmitting, errorMessage }: PdfUploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileKey, setFileKey] = useState(0)
  const [formValues, setFormValues] = useState(defaultState)
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
          linesToSkip: formValues.linesToSkip.trim(),
        })

        if (!parsed.success) {
          setFormError(parsed.error.issues[0]?.message ?? 'Invalid form data.')
          return
        }

        try {
          await onSubmit(parsed.data)
          setSuccessMessage('PDF uploaded successfully. Processing has started.')
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
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            key={fileKey}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground">Maximum size 10MB. Only PDF files are allowed.</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date (YYYY-MM-DD)</Label>
          <Input
            id="date"
            type="date"
            value={formValues.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formValues.location}
            onChange={handleChange}
            placeholder="ICS branch office, Jimma"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="linesToSkip">Lines to skip</Label>
          <Input
            id="linesToSkip"
            value={formValues.linesToSkip}
            onChange={handleChange}
            placeholder="HEADER"
            required
          />
          <p className="text-xs text-muted-foreground">
            Ingestion starts after the first line that matches this value.
          </p>
        </div>
      </div>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
      {successMessage ? <p className="text-sm text-primary">{successMessage}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading…' : 'Upload and process'}
      </Button>
    </form>
  )
}
