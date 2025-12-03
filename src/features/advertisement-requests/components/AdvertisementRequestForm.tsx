import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('advertisements')
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
      setFileError(t('request.validation.fileTooLarge'))
      setFile(null)
      e.target.value = ''
      return
    }

    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
      setFileError(t('request.validation.invalidFileType'))
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
                {t('request.form.fullName.label')}
              </Label>
              <Input
                id="full_name"
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                placeholder={t('request.form.fullName.placeholder')}
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
                  {t('request.form.phoneNumber.label')}
                </Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                  placeholder={t('request.form.phoneNumber.placeholder')}
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
                  {t('request.form.email.label')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                  placeholder={t('request.form.email.placeholder')}
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
                {t('request.form.companyName.label')}
              </Label>
              <Input
                id="company_name"
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                placeholder={t('request.form.companyName.placeholder')}
              />
            </div>
          )}
        </form.Field>

        {/* Description */}
        <form.Field name="description">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="description" className="sr-only">
                {t('request.form.description.label')}
              </Label>
              <Textarea
                id="description"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  field.handleChange(e.target.value)
                }
                placeholder={t('request.form.description.placeholder')}
                rows={5}
                required
              />
              <p className="text-muted-foreground text-xs">
                {t('request.form.description.charCount', { count: field.state.value.length })}
              </p>
            </div>
          )}
        </form.Field>

        {/* File Upload */}
        <div className="grid gap-2">
          <Label htmlFor="file" className="sr-only">
            {t('request.form.file.label')}
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
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-xs">
              <p id="file-help">{t('request.form.file.help')}</p>
              {file ? (
                <p>
                  {t('request.form.file.selectedInfo', { name: file.name, size: (file.size / 1024 / 1024).toFixed(2) })}
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
        selector={(state) => [state.canSubmit, state.isSubmitting, state.isSubmitted] as const}
      >
        {([canSubmit, formIsSubmitting, isSubmitted]) => (
          <div className="space-y-2">
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting || formIsSubmitting || !!fileError}
              className="w-full rounded-full py-2 text-base font-semibold"
            >
              {isSubmitting || formIsSubmitting ? t('request.form.submitting') : t('request.form.submit')}
            </Button>
            {errorMessage ? (
              <p className="text-destructive text-sm">{errorMessage}</p>
            ) : isSubmitted && !errorMessage ? (
              <p className="text-muted-foreground text-sm">{t('request.form.processing')}</p>
            ) : null}
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}
