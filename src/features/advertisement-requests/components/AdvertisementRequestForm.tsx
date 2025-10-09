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
      <div className="grid gap-4">
        {/* Full Name */}
        <form.Field name="full_name">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="full_name" className="sr-only">
                Full Name
              </Label>
              <Input
                id="full_name"
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                placeholder="Full name"
                required
              />
            </div>
          )}
        </form.Field>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Phone Number */}
          <form.Field name="phone_number">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="phone_number" className="sr-only">
                  Phone Number
                </Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                  placeholder="Phone number"
                  required
                />
              </div>
            )}
          </form.Field>

          {/* Email */}
          <form.Field name="email">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                  placeholder="Email"
                />
              </div>
            )}
          </form.Field>
        </div>

        {/* Company Name */}
        <form.Field name="company_name">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="company_name" className="sr-only">
                Company Name
              </Label>
              <Input
                id="company_name"
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                placeholder="Company name"
              />
            </div>
          )}
        </form.Field>

        {/* Description */}
        <form.Field name="description">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="description" className="sr-only">
                Advertisement Details
              </Label>
              <Textarea
                id="description"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  field.handleChange(e.target.value)
                }
                placeholder="Advertisement details"
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
          <Label htmlFor="file" className="sr-only">
            Attachment
          </Label>
          <div className="grid gap-2">
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              aria-invalid={!!fileError}
              aria-describedby="file-error file-help"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <p id="file-help">PDF, DOC, DOCX, JPG, or PNG (max 10MB)</p>
              {file ? (
                <p>
                  {file.name} · {(file.size / 1024 / 1024).toFixed(2)}MB
                </p>
              ) : null}
            </div>
            {fileError ? (
              <p id="file-error" className="text-destructive text-sm">
                {fileError}
              </p>
            ) : null}
          </div>
        </div>
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
              className="w-full rounded-full py-2 text-base font-semibold"
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
