import { useForm } from '@tanstack/react-form'
import { useMemo, useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Textarea } from '@/shared/ui/textarea'

import { useAdSlotsQuery } from '../api/get-ad-slots'
import type { AdSlot } from '../schemas/ad-slot'
import type { AdStatus, Advertisement, PackageType, PaymentStatus } from '../schemas/advertisement'
import type { AdvertisementCreatePayload, AdvertisementUpdatePayload } from '../schemas/create'
import { MediaUploadPreview } from './MediaUploadPreview'

type FormValues = {
  slot_code: string
  ad_slot_number: string
  ad_title: string
  alt_text: string
  client_name: string
  target_url: string
  advertisement_request_id: string
  ad_desc: string
  ad_excerpt: string
  status: AdStatus
  package_type: PackageType
  ad_published_date: string
  ad_ending_date: string
  payment_status: PaymentStatus
  payment_amount: string
  priority: string
  admin_notes: string
  ad_desktop_asset_url: string
  ad_desktop_dark_asset_url: string
  ad_mobile_asset_url: string
  ad_mobile_dark_asset_url: string
  remove_ad_desktop_asset: boolean
  remove_ad_desktop_dark_asset: boolean
  remove_ad_mobile_asset: boolean
  remove_ad_mobile_dark_asset: boolean
}

type AdvertisementFormProps = {
  advertisement?: Advertisement
  onSubmit: (
    values: AdvertisementCreatePayload | AdvertisementUpdatePayload,
  ) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
}

function formatSlotDimensions(slot: AdSlot | undefined, type: 'desktop' | 'mobile') {
  if (!slot) return undefined
  const width = type === 'desktop' ? slot.desktop_width : slot.mobile_width
  const height = type === 'desktop' ? slot.desktop_height : slot.mobile_height
  return width && height ? `${width}x${height}px recommended` : undefined
}

function isPublishable(status: AdStatus) {
  return status === 'active' || status === 'scheduled'
}

function isValidUrl(value: string) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function AdminAdvertisementForm({
  advertisement,
  onSubmit,
  isSubmitting,
  errorMessage,
}: AdvertisementFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [desktopFile, setDesktopFile] = useState<File | null>(null)
  const [desktopDarkFile, setDesktopDarkFile] = useState<File | null>(null)
  const [mobileFile, setMobileFile] = useState<File | null>(null)
  const [mobileDarkFile, setMobileDarkFile] = useState<File | null>(null)
  const { data: slots = [], isLoading: slotsLoading, isError: slotsError } = useAdSlotsQuery()

  const initialSlotCode = advertisement?.slot_code ?? advertisement?.ad_slot_number ?? ''
  const selectedSlotByCode = useMemo(() => {
    return new Map(slots.map((slot) => [slot.code, slot]))
  }, [slots])

  const form = useForm({
    defaultValues: {
      slot_code: initialSlotCode,
      ad_slot_number: advertisement?.ad_slot_number ?? '',
      ad_title: advertisement?.ad_title ?? '',
      alt_text: advertisement?.alt_text ?? advertisement?.ad_title ?? '',
      client_name: advertisement?.client_name ?? '',
      target_url: advertisement?.target_url ?? advertisement?.ad_client_link ?? '',
      advertisement_request_id: advertisement?.advertisement_request_id
        ? String(advertisement.advertisement_request_id)
        : '',
      ad_desc: advertisement?.ad_desc ?? '',
      ad_excerpt: advertisement?.ad_excerpt ?? '',
      status: advertisement?.status ?? 'draft',
      package_type: advertisement?.package_type ?? 'weekly',
      ad_published_date: advertisement?.ad_published_date ?? '',
      ad_ending_date: advertisement?.ad_ending_date ?? '',
      payment_status: advertisement?.payment_status ?? 'pending',
      payment_amount: advertisement?.payment_amount ?? '0',
      priority: String(advertisement?.priority ?? 0),
      admin_notes: advertisement?.admin_notes ?? '',
      ad_desktop_asset_url: advertisement?.ad_desktop_asset ?? '',
      ad_desktop_dark_asset_url: advertisement?.ad_desktop_dark_asset ?? '',
      ad_mobile_asset_url: advertisement?.ad_mobile_asset ?? '',
      ad_mobile_dark_asset_url: advertisement?.ad_mobile_dark_asset ?? '',
      remove_ad_desktop_asset: false as boolean,
      remove_ad_desktop_dark_asset: false as boolean,
      remove_ad_mobile_asset: false as boolean,
      remove_ad_mobile_dark_asset: false as boolean,
    } satisfies FormValues,
    onSubmit: async ({ value }) => {
      setFormError(null)

      if (!value.slot_code.trim()) {
        setFormError('Ad slot is required')
        return
      }
      if (!value.ad_title.trim()) {
        setFormError('Ad title is required')
        return
      }
      if (!value.alt_text.trim()) {
        setFormError('Alt text is required')
        return
      }
      if (!value.client_name.trim()) {
        setFormError('Client name is required')
        return
      }
      if (!value.target_url.trim() || !isValidUrl(value.target_url.trim())) {
        setFormError('A valid target URL is required')
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

      const hasDesktopAsset = Boolean(
        desktopFile || (value.ad_desktop_asset_url && !value.remove_ad_desktop_asset),
      )
      const hasMobileAsset = Boolean(
        mobileFile || (value.ad_mobile_asset_url && !value.remove_ad_mobile_asset),
      )

      if (isPublishable(value.status) && (!hasDesktopAsset || !hasMobileAsset)) {
        setFormError('Active and scheduled ads require both desktop and mobile assets')
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

      const priority = Number(value.priority || 0)
      if (!Number.isInteger(priority) || priority < 0 || priority > 100) {
        setFormError('Priority must be a whole number between 0 and 100')
        return
      }

      const targetUrl = value.target_url.trim()
      const payload: AdvertisementCreatePayload | AdvertisementUpdatePayload = {
        slot_code: value.slot_code.trim(),
        ad_slot_number: value.ad_slot_number.trim() || undefined,
        ad_title: value.ad_title.trim(),
        alt_text: value.alt_text.trim(),
        client_name: value.client_name.trim(),
        target_url: targetUrl,
        ad_client_link: targetUrl,
        advertisement_request_id,
        ad_desc: value.ad_desc.trim() || undefined,
        ad_excerpt: value.ad_excerpt.trim(),
        status: value.status,
        package_type: value.package_type,
        ad_published_date: value.ad_published_date,
        ad_ending_date: value.ad_ending_date || null,
        payment_status: value.payment_status,
        payment_amount: value.payment_amount,
        priority,
        admin_notes: value.admin_notes.trim() || undefined,
        ad_desktop_asset: desktopFile ?? undefined,
        ad_desktop_dark_asset: desktopDarkFile ?? undefined,
        ad_mobile_asset: mobileFile ?? undefined,
        ad_mobile_dark_asset: mobileDarkFile ?? undefined,
        remove_ad_desktop_asset: value.remove_ad_desktop_asset,
        remove_ad_desktop_dark_asset: value.remove_ad_desktop_dark_asset,
        remove_ad_mobile_asset: value.remove_ad_mobile_asset,
        remove_ad_mobile_dark_asset: value.remove_ad_mobile_dark_asset,
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
      noValidate
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="slot_code">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="slot_code">
                  Ad Slot <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                  disabled={slotsLoading || slotsError}
                >
                  <SelectTrigger id="slot_code">
                    <SelectValue placeholder={slotsLoading ? 'Loading slots...' : 'Select slot'} />
                  </SelectTrigger>
                  <SelectContent>
                    {slots.map((slot) => (
                      <SelectItem key={slot.code} value={slot.code}>
                        {slot.name} ({slot.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {slotsError ? (
                  <p className="text-destructive text-xs">Could not load ad slots.</p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field name="ad_slot_number">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="ad_slot_number">Campaign Code</Label>
                <Input
                  id="ad_slot_number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Auto-generated if empty"
                />
                <p className="text-muted-foreground text-xs">
                  Internal unique code for this campaign.
                </p>
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => state.values.slot_code}>
          {(slotCode) => {
            const selectedSlot = selectedSlotByCode.get(slotCode)
            return selectedSlot ? (
              <div className="text-muted-foreground rounded-md border px-3 py-2 text-xs">
                {selectedSlot.page_context ? `${selectedSlot.page_context} · ` : ''}
                {selectedSlot.format ?? 'ad'} · Desktop{' '}
                {formatSlotDimensions(selectedSlot, 'desktop') ?? 'flexible'} · Mobile{' '}
                {formatSlotDimensions(selectedSlot, 'mobile') ?? 'flexible'}
              </div>
            ) : null
          }}
        </form.Subscribe>

        <div className="grid gap-4 sm:grid-cols-2">
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
                  placeholder="e.g., Passport Alerts"
                  required
                />
              </div>
            )}
          </form.Field>

          <form.Field name="target_url">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="target_url">
                  Target URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="target_url"
                  type="url"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://passport.et/alerts"
                  required
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
                  placeholder="e.g., Download the Passport.ET App"
                  required
                />
              </div>
            )}
          </form.Field>

          <form.Field name="alt_text">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="alt_text">
                  Alt Text <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="alt_text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Describe the ad image"
                  required
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="space-y-4">
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
                  placeholder="Short summary for admin reference"
                  required
                />
              </div>
            )}
          </form.Field>

          <form.Field name="ad_desc">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="ad_desc">Ad Description</Label>
                <Textarea
                  id="ad_desc"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Detailed internal description"
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <form.Field name="package_type">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="package_type">
                  Package Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as PackageType)}
                >
                  <SelectTrigger id="package_type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="payment_status">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="payment_status">
                  Payment Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as PaymentStatus)}
                >
                  <SelectTrigger id="payment_status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

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
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
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

          <form.Field name="ad_ending_date">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="ad_ending_date">Ending Date</Label>
                <Input
                  id="ad_ending_date"
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="priority">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="status">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as AdStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="advertisement_request_id">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="advertisement_request_id">Advertisement Request ID</Label>
                <Input
                  id="advertisement_request_id"
                  type="number"
                  min="1"
                  step="1"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Optional request ID"
                />
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="admin_notes">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="admin_notes">Admin Notes</Label>
              <Textarea
                id="admin_notes"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Internal notes for scheduling, creative, or renewal"
              />
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.slot_code}>
          {(slotCode) => {
            const selectedSlot = selectedSlotByCode.get(slotCode)
            return (
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="ad_desktop_asset_url">
                  {(field) => (
                    <MediaUploadPreview
                      id="ad_desktop_asset"
                      label="Desktop Asset"
                      file={desktopFile}
                      existingUrl={field.state.value}
                      onFileChange={(file) => {
                        setDesktopFile(file)
                        if (file) form.setFieldValue('remove_ad_desktop_asset', false)
                      }}
                      onRemoveExisting={() => {
                        field.handleChange('')
                        form.setFieldValue('remove_ad_desktop_asset', true)
                      }}
                      accept="image/*"
                      helperText={formatSlotDimensions(selectedSlot, 'desktop')}
                    />
                  )}
                </form.Field>

                <form.Field name="ad_desktop_dark_asset_url">
                  {(field) => (
                    <MediaUploadPreview
                      id="ad_desktop_dark_asset"
                      label="Desktop Dark Asset"
                      file={desktopDarkFile}
                      existingUrl={field.state.value}
                      onFileChange={(file) => {
                        setDesktopDarkFile(file)
                        if (file) form.setFieldValue('remove_ad_desktop_dark_asset', false)
                      }}
                      onRemoveExisting={() => {
                        field.handleChange('')
                        form.setFieldValue('remove_ad_desktop_dark_asset', true)
                      }}
                      accept="image/*"
                      helperText={formatSlotDimensions(selectedSlot, 'desktop')}
                    />
                  )}
                </form.Field>

                <form.Field name="ad_mobile_asset_url">
                  {(field) => (
                    <MediaUploadPreview
                      id="ad_mobile_asset"
                      label="Mobile Asset"
                      file={mobileFile}
                      existingUrl={field.state.value}
                      onFileChange={(file) => {
                        setMobileFile(file)
                        if (file) form.setFieldValue('remove_ad_mobile_asset', false)
                      }}
                      onRemoveExisting={() => {
                        field.handleChange('')
                        form.setFieldValue('remove_ad_mobile_asset', true)
                      }}
                      accept="image/*"
                      helperText={formatSlotDimensions(selectedSlot, 'mobile')}
                    />
                  )}
                </form.Field>

                <form.Field name="ad_mobile_dark_asset_url">
                  {(field) => (
                    <MediaUploadPreview
                      id="ad_mobile_dark_asset"
                      label="Mobile Dark Asset"
                      file={mobileDarkFile}
                      existingUrl={field.state.value}
                      onFileChange={(file) => {
                        setMobileDarkFile(file)
                        if (file) form.setFieldValue('remove_ad_mobile_dark_asset', false)
                      }}
                      onRemoveExisting={() => {
                        field.handleChange('')
                        form.setFieldValue('remove_ad_mobile_dark_asset', true)
                      }}
                      accept="image/*"
                      helperText={formatSlotDimensions(selectedSlot, 'mobile')}
                    />
                  )}
                </form.Field>
              </div>
            )
          }}
        </form.Subscribe>
      </div>

      {displayError && (
        <div className="border-destructive/50 bg-destructive/10 rounded-md border p-4">
          <p className="text-destructive text-sm font-medium">{displayError}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting || slotsLoading}>
          {isSubmitting
            ? 'Saving...'
            : advertisement
              ? 'Update Advertisement'
              : 'Create Advertisement'}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
