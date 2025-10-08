import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'

import type { AdvertisementRequestCreate as AdvertisementRequestCreateType } from '../schemas/advertisement-request'
import type { AdvertisementRequestCreatePayload } from '../schemas/create'

interface AdvertisementRequestFormProps {
  onSubmit: (values: AdvertisementRequestCreatePayload) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
]

export function AdvertisementRequestForm({
  onSubmit,
  isSubmitting,
  errorMessage,
}: AdvertisementRequestFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      phone_number: '',
      email: '',
      full_name: '',
      company_name: '',
      description: '',
    } as AdvertisementRequestCreateType,
    onSubmit: async ({ value }) => {
      setFileError(null)
      await onSubmit({ ...value, file: file ?? undefined })
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setFileError(null)

    if (!selectedFile) {
      setFile(null)
      return
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError('File size must be less than 10MB')
      setFile(null)
      e.target.value = ''
      return
    }

    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
      setFileError('Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG files.')
      setFile(null)
      e.target.value = ''
      return
    }

    setFile(selectedFile)
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      noValidate
    >
      {/* Full Name */}
      <form.Field name="full_name">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="full_name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full_name"
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
        )}
      </form.Field>

      {/* Phone Number */}
      <form.Field name="phone_number">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="phone_number">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone_number"
              type="tel"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
              placeholder="+251912345678"
              required
            />
          </div>
        )}
      </form.Field>

      {/* Email */}
      <form.Field name="email">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>
        )}
      </form.Field>

      {/* Company Name */}
      <form.Field name="company_name">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="company_name">Company Name (optional)</Label>
            <Input
              id="company_name"
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
              placeholder="Your company or business name"
            />
          </div>
        )}
      </form.Field>

      {/* Description */}
      <form.Field name="description">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="description">
              Advertisement Details <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => field.handleChange(e.target.value)}
              placeholder="Describe your advertisement needs (minimum 10 characters)"
              rows={5}
              required
            />
            <p className="text-muted-foreground text-xs">
              {field.state.value.length} / 5000 characters
            </p>
          </div>
        )}
      </form.Field>

      {/* File Upload */}
      <div className="grid gap-2">
        <Label htmlFor="file">Attachment (optional)</Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          aria-invalid={!!fileError}
          aria-describedby="file-error file-help"
        />
        <p id="file-help" className="text-muted-foreground text-xs">
          PDF, DOC, DOCX, JPG, or PNG (max 10MB)
        </p>
        {fileError ? (
          <p id="file-error" className="text-destructive text-sm">
            {fileError}
          </p>
        ) : null}
        {file ? (
          <p className="text-muted-foreground text-xs">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
          </p>
        ) : null}
      </div>

      {/* Submit Button */}
      <form.Subscribe
        selector={(state) =>
          [state.canSubmit, state.isSubmitting, state.isSubmitted] as const
        }
      >
        {([canSubmit, formIsSubmitting, isSubmitted]) => (
          <div className="space-y-2">
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting || formIsSubmitting || !!fileError}
              className="w-full"
            >
              {isSubmitting || formIsSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
            {errorMessage ? (
              <p className="text-destructive text-sm">{errorMessage}</p>
            ) : isSubmitted && !errorMessage ? (
              <p className="text-muted-foreground text-sm">Processing your request...</p>
            ) : null}
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}
