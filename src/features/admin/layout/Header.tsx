import { Menu } from 'lucide-react'

import { ThemeToggle } from '@/shared/components/theme-toggle'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'

type AdminHeaderProps = {
  onMenuClick: () => void
  className?: string
}

export function AdminHeader({ onMenuClick, className }: AdminHeaderProps) {
  return (
    <header
      className={cn(
        'bg-background/80 flex h-16 items-center justify-between border-b px-4 backdrop-blur',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open admin navigation"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </Button>
        <span className="text-muted-foreground text-sm font-medium">Admin console</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
