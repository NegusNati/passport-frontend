import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'

import type {
  AdStatus,
  Advertisement,
  PackageType,
  PaymentStatus,
} from '../schemas/advertisement'
import type {
  AdvertisementCreatePayload,
  AdvertisementUpdatePayload,
} from '../schemas/create'
import { MediaUploadPreview } from './MediaUploadPreview'

type FormValues = {
  ad_slot_number: string
  ad_title: string
  client_name: string
  ad_client_link: string
  advertisement_request_id: string
  ad_desc: string
  ad_excerpt: string
  status: AdStatus
  package_type: PackageType
  ad_published_date: string
  ad_ending_date: string
  payment_status: PaymentStatus
  payment_amount: string
  ad_desktop_asset_url: string
  ad_mobile_asset_url: string
  remove_ad_desktop_asset: boolean
  remove_ad_mobile_asset: boolean
}

type AdvertisementFormProps = {
  advertisement?: Advertisement
  onSubmit: (values: AdvertisementCreatePayload | AdvertisementUpdatePayload) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
}

export function AdminAdvertisementForm({
  advertisement,
  onSubmit,
  isSubmitting,
  errorMessage,
}: AdvertisementFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [desktopFile, setDesktopFile] = useState<File | null>(null)
  const [mobileFile, setMobileFile] = useState<File | null>(null)

  const form = useForm({
    defaultValues: {
      ad_slot_number: advertisement?.ad_slot_number ?? '',
      ad_title: advertisement?.ad_title ?? '',
      client_name: advertisement?.client_name ?? '',
      ad_client_link: advertisement?.ad_client_link ?? '',
      advertisement_request_id: advertisement?.advertisement_request_id
        ? String(advertisement.advertisement_request_id)
        : '',
      ad_desc: advertisement?.ad_desc ?? '',
      ad_excerpt: advertisement?.ad_excerpt ?? '',
      status: advertisement?.status ?? 'active',
      package_type: advertisement?.package_type ?? 'weekly',
      ad_published_date: advertisement?.ad_published_date ?? '',
      ad_ending_date: advertisement?.ad_ending_date ?? '',
      payment_status: advertisement?.payment_status ?? 'pending',
      payment_amount: advertisement?.payment_amount ?? '0',
      ad_desktop_asset_url: advertisement?.ad_desktop_asset ?? '',
      ad_mobile_asset_url: advertisement?.ad_mobile_asset ?? '',
      remove_ad_desktop_asset: false as boolean,
      remove_ad_mobile_asset: false as boolean,
    } satisfies FormValues,
    onSubmit: async ({ value }) => {
      setFormError(null)

      // Validation
      if (!value.ad_slot_number.trim()) {
        setFormError('Ad slot number is required')
        return
      }
      if (!value.ad_title.trim()) {
        setFormError('Ad title is required')
        return
      }
      if (!value.client_name.trim()) {
        setFormError('Client name is required')
        return
      }
      if (!value.ad_published_date) {
        setFormError('Published date is required')
        return
      }
      if (!value.ad_excerpt.trim()) {
        setFormError('Ad excerpt is required')
        return
      }

      const advertisementRequestIdInput = value.advertisement_request_id.trim()
      let advertisement_request_id: number | undefined
      if (advertisementRequestIdInput) {
        const parsedId = Number(advertisementRequestIdInput)
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
          setFormError('Advertisement request ID must be a positive number')
          return
        }
        advertisement_request_id = parsedId
      }

      const adDesc = value.ad_desc.trim()
      const adExcerpt = value.ad_excerpt.trim()

      const payload: AdvertisementCreatePayload | AdvertisementUpdatePayload = {
        ad_slot_number: value.ad_slot_number.trim(),
        ad_title: value.ad_title.trim(),
        client_name: value.client_name.trim(),
        ad_client_link: value.ad_client_link.trim() || undefined,
        advertisement_request_id,
        ad_desc: adDesc || undefined,
        ad_excerpt: adExcerpt,
        status: value.status,
        package_type: value.package_type,
        ad_published_date: value.ad_published_date,
        ad_ending_date: value.ad_ending_date || null,
        payment_status: value.payment_status,
        payment_amount: value.payment_amount, // Send as string
        ad_desktop_asset: desktopFile ?? undefined,
        ad_mobile_asset: mobileFile ?? undefined,
        remove_ad_desktop_asset: value.remove_ad_desktop_asset,
        remove_ad_mobile_asset: value.remove_ad_mobile_asset,
      }

      try {
        await onSubmit(payload)
      } catch (error) {
        setFormError(error instanceof Error ? error.message : 'Submission failed')
      }
    },
  })

  const displayError = formError || errorMessage

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Client Name */}
          <form.Field name="client_name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="client_name">
                  Client Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="client_name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Acme Corporation"
                  required
                />
              </div>
            )}
          </form.Field>

          {/* Client Link */}
          <form.Field name="ad_client_link">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="ad_client_link">
                  Client Link (Optional)
                </Label>
                <Input
                  id="ad_client_link"
                  type="url"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Advertisement Request ID */}
          <form.Field name="advertisement_request_id">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="advertisement_request_id">Advertisement Request ID (Optional)</Label>
                <Input
                  id="advertisement_request_id"
                  type="number"
                  min="1"
                  step="1"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter request ID"
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Ad Slot Number */}
          <form.Field name="ad_slot_number">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="ad_slot_number">
                  Ad Slot Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ad_slot_number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., SLOT-001"
                  required
                />
              </div>
            )}
          </form.Field>

          {/* Ad Title */}
          <form.Field name="ad_title">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="ad_title">
                  Ad Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ad_title"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Summer Promotion 2024"
                  required
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="space-y-4">
          {/* Ad Excerpt */}
          <form.Field name="ad_excerpt">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="ad_excerpt">
                  Ad Excerpt <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="ad_excerpt"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Short summary shown with the ad"
                  required
                />
              </div>
            )}
          </form.Field>

          {/* Ad Description */}
          <form.Field name="ad_desc">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="ad_desc">Ad Description (Optional)</Label>
                <Textarea
                  id="ad_desc"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Detailed description for internal reference"
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Package Type */}
          <form.Field name="package_type">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="package_type">
                  Package Type <span className="text-destructive">*</span>
                </Label>
                <select
                  id="package_type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as PackageType)}
                  required
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
          </form.Field>

          {/* Payment Status */}
          <form.Field name="payment_status">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="payment_status">
                  Payment Status <span className="text-destructive">*</span>
                </Label>
                <select
                  id="payment_status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as PaymentStatus)}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Payment Amount */}
          <form.Field name="payment_amount">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="payment_amount">
                  Payment Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="payment_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            )}
          </form.Field>

          {/* Published Date */}
          <form.Field name="ad_published_date">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="ad_published_date">
                  Published Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ad_published_date"
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Ending Date */}
          <form.Field name="ad_ending_date">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="ad_ending_date">Ending Date (Optional)</Label>
                <Input
                  id="ad_ending_date"
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <p className="text-muted-foreground text-xs">Leave empty for no end date</p>
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Status */}
          <form.Field name="status">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-destructive">*</span>
                </Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as AdStatus)}
                  required
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            )}
          </form.Field>
        </div>



        {/* Media Uploads */}
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="ad_desktop_asset_url">
            {(field) => (
              <MediaUploadPreview
                id="ad_desktop_asset"
                label="Desktop Asset (Optional)"
                file={desktopFile}
                existingUrl={field.state.value}
                onFileChange={setDesktopFile}
                onRemoveExisting={() => {
                  field.handleChange('')
                  form.setFieldValue('remove_ad_desktop_asset', true)
                }}
                accept="image/*"
              />
            )}
          </form.Field>

          <form.Field name="ad_mobile_asset_url">
            {(field) => (
              <MediaUploadPreview
                id="ad_mobile_asset"
                label="Mobile Asset (Optional)"
                file={mobileFile}
                existingUrl={field.state.value}
                onFileChange={setMobileFile}
                onRemoveExisting={() => {
                  field.handleChange('')
                  form.setFieldValue('remove_ad_mobile_asset', true)
                }}
                accept="image/*"
              />
            )}
          </form.Field>
        </div>
      </div>

      {displayError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-destructive text-sm font-medium">{displayError}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : advertisement ? 'Update Advertisement' : 'Create Advertisement'}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
