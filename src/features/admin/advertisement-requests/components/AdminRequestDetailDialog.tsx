import { useForm } from '@tanstack/react-form'
import { FileText } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'

import type {
  AdminAdvertisementRequestItem,
  AdminAdvertisementRequestUpdatePayload,
} from '../schemas/admin-advertisement-request'

interface AdminRequestDetailDialogProps {
  request: AdminAdvertisementRequestItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: number, payload: AdminAdvertisementRequestUpdatePayload) => Promise<void>
  isSaving?: boolean
}

export function AdminRequestDetailDialog({
  request,
  open,
  onOpenChange,
  onSave,
  isSaving,
}: AdminRequestDetailDialogProps) {
  const [saveError, setSaveError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      status: request?.status || 'pending',
      admin_notes: request?.admin_notes ?? '',
      contacted_at: request?.contacted_at
        ? new Date(request.contacted_at).toISOString().split('T')[0]
        : '',
    },
    onSubmit: async ({ value }) => {
      if (!request) return
      setSaveError(null)
      try {
        await onSave(request.id, value)
        onOpenChange(false)
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : 'Failed to save changes')
      }
    },
  })

  if (!request) return null

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Advertisement Request #{request.id}</DialogTitle>
          <DialogDescription>View and manage advertisement request details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Details (Read-only) */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Request Information</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground text-xs">Full Name</Label>
                <p className="text-sm">{request.full_name}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Company Name</Label>
                <p className="text-sm">{request.company_name || '—'}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Phone Number</Label>
                <p className="text-sm">{request.phone_number}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Email</Label>
                <p className="text-sm">{request.email || '—'}</p>
              </div>

              <div className="sm:col-span-2">
                <Label className="text-muted-foreground text-xs">Description</Label>
                <p className="text-sm">{request.description}</p>
              </div>

              {request.file_url && (
                <div className="sm:col-span-2">
                  <Label className="text-muted-foreground text-xs">Attachment</Label>
                  <a
                    href={request.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary mt-1 flex items-center gap-2 text-sm hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    View Attachment
                  </a>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground text-xs">Created At</Label>
                <p className="text-sm">{formatDate(request.created_at)}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Updated At</Label>
                <p className="text-sm">{formatDate(request.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <form.Field name="status">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="border-input bg-background h-10 rounded-md border px-3 text-sm"
                    value={field.state.value}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      field.handleChange(
                        e.target.value as 'pending' | 'contacted' | 'approved' | 'rejected',
                      )
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}
            </form.Field>

            <form.Field name="contacted_at">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="contacted_at">Contacted At (optional)</Label>
                  <Input
                    id="contacted_at"
                    type="date"
                    value={field.state.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(e.target.value)
                    }
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="admin_notes">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="admin_notes">Admin Notes (optional)</Label>
                  <Textarea
                    id="admin_notes"
                    value={field.state.value}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      field.handleChange(e.target.value)
                    }
                    placeholder="Add internal notes about this request"
                    rows={4}
                  />
                  <p className="text-muted-foreground text-xs">
                    {field.state.value.length} / 5000 characters
                  </p>
                </div>
              )}
            </form.Field>

            {saveError && <p className="text-destructive text-sm">{saveError}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
