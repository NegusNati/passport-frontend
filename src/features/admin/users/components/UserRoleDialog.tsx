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

import type { AdminUser } from '../schemas/user'

const roleOptions = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
]

type UserRoleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUser | null
  onSubmit: (role: 'admin' | 'user') => Promise<void> | void
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
  const [role, setRole] = useState<'admin' | 'user'>('user')
  const fullName = useMemo(() => {
    if (!user) return ''
    return [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')
  }, [user])

  useEffect(() => {
    if (!user) return
    const nextRole = (user.roles?.[0] ?? (user.is_admin ? 'admin' : 'user')) as 'admin' | 'user'
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
          <DialogDescription>
            Update access level for {fullName || 'this user'}.
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <div className="space-y-4">
            <div className="grid gap-1">
              <Label>Full name</Label>
              <p className="text-sm font-medium text-foreground">{fullName || '—'}</p>
            </div>

            <div className="grid gap-1">
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{user.email ?? '—'}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="user-role-select">Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as 'admin' | 'user')}
              >
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

            <p className="text-xs text-muted-foreground">
              Granting the admin role provides access to all administration modules. Revert to user to
              remove elevated privileges.
            </p>

            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </div>
        ) : null}

        <DialogFooter className="pt-4">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
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
