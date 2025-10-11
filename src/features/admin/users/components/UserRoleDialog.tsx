import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
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

type UserRoleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUser | null
  onSubmit: (role: AdminRole) => Promise<void> | void
  isSubmitting: boolean
  errorMessage?: string | null
}

export function UserRoleDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  isSubmitting,
  errorMessage,
}: UserRoleDialogProps) {
  const [role, setRole] = useState<AdminRole>('user')
  const fullName = useMemo(() => {
    if (!user) return ''
    return [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')
  }, [user])

  useEffect(() => {
    if (!user) return
    const nextRole = (user.roles?.[0] ?? (user.is_admin ? 'admin' : 'user')) as AdminRole
    setRole(nextRole)
  }, [user])

  const handleSubmit = async () => {
    if (!user) return
    await onSubmit(role)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit user role</DialogTitle>
          <DialogDescription>Update access level for {fullName || 'this user'}.</DialogDescription>
        </DialogHeader>

        {user ? (
          <div className="space-y-4">
            <div className="grid gap-1">
              <Label>Full name</Label>
              <p className="text-foreground text-sm font-medium">{fullName || '—'}</p>
            </div>

            <div className="grid gap-1">
              <Label>Email</Label>
              <p className="text-muted-foreground text-sm">{user.email ?? '—'}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="user-role-select">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as AdminRole)}>
                <SelectTrigger id="user-role-select">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-muted-foreground text-xs">
              Admin grants full control, editor limits access to article management, and user keeps
              standard access only.
            </p>

            {errorMessage ? <p className="text-destructive text-sm">{errorMessage}</p> : null}
          </div>
        ) : null}

        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={!user || isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
