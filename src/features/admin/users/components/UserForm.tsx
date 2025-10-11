import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import type { AdminRole, AdminUser } from '../schemas/user'
import { AdminRoleOptions } from '../schemas/user'

const roleLabels: Record<AdminRole, string> = {
  admin: 'Admin',
  editor: 'Editor',
  user: 'User',
}
const roleOptions = AdminRoleOptions.map((value) => ({ value, label: roleLabels[value] }))

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

type UserFormProps = {
  user: AdminUser
  onSubmit: (values: UpdateAdminUserFormValues) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
}

export type UpdateAdminUserFormValues = {
  role: AdminRole
  status: string
  is_admin: boolean
}

export function UserForm({ user, onSubmit, isSubmitting, errorMessage }: UserFormProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      role: (user.roles?.[0] ?? (user.is_admin ? 'admin' : 'user')) as AdminRole,
      status: (user.email_verified_at ? 'active' : 'inactive') as string,
      is_admin: Boolean(user.is_admin ?? (user.roles ?? []).includes('admin')),
    } satisfies UpdateAdminUserFormValues,
    onSubmit: async ({ value }) => {
      setFormError(null)
      try {
        await onSubmit(value)
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : 'Failed to update user. Please try again.',
        )
      }
    },
  })

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <form.Field name="role">
            {(field) => (
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as AdminRole)}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </form.Field>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <form.Field name="status">
            {(field) => (
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </form.Field>
        </div>

        <div className="col-span-1 grid gap-2">
          <Label htmlFor="is_admin">Admin access</Label>
          <form.Field name="is_admin">
            {(field) => (
              <label className="bg-muted/40 text-muted-foreground flex items-center gap-3 rounded-lg border px-3 py-2 text-sm">
                <input
                  id="is_admin"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={field.state.value}
                  onChange={(event) => field.handleChange(event.target.checked)}
                />
                <span>Grant elevated permissions for all admin modules.</span>
              </label>
            )}
          </form.Field>
        </div>

        <div className="col-span-1 grid gap-2">
          <Label>Email</Label>
          <Input value={user.email ?? ''} disabled readOnly className="bg-muted/60" />
        </div>
        <div className="col-span-1 grid gap-2">
          <Label>Phone number</Label>
          <Input value={user.phone_number ?? ''} disabled readOnly className="bg-muted/60" />
        </div>
      </div>

      {formError ? <p className="text-destructive text-sm">{formError}</p> : null}
      {errorMessage ? <p className="text-destructive text-sm">{errorMessage}</p> : null}

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
