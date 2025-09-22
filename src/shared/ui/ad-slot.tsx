import React from 'react'
import { Button } from '@/shared/ui/button'

interface AdSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  orientation?: 'horizontal' | 'vertical'
  preset?: 'sponsored'
}

const orientationClasses = {
  horizontal: 'min-h-[12rem] w-full',
  vertical: 'min-h-[16rem] w-full h-full',
} as const

function SponsoredContent({ orientation }: { orientation: 'horizontal' | 'vertical' }) {
  const alignClasses = orientation === 'vertical' ? 'items-start text-left' : 'items-center text-center'
  const textWidth = orientation === 'vertical' ? 'max-w-xs sm:max-w-sm' : 'max-w-sm sm:max-w-md'

  return (
    <div className={['flex w-full flex-col gap-2 text-sm text-muted-foreground', alignClasses].join(' ')}>
      <span className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">Sponsored</span>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">Advertise with Passport Alerts</h3>
      <p className={[textWidth, 'text-sm text-muted-foreground'].join(' ')}>
        Reach thousands of travelers looking for passport updates and related services. Reserve this premium banner for your brand.
      </p>
      <Button size="sm" className="mt-1 w-full sm:w-auto">
        Promote Your Business
      </Button>
    </div>
  )
}

export function AdSlot({
  label = 'Ad space',
  orientation = 'horizontal',
  className = '',
  preset,
  children,
  ...props
}: AdSlotProps) {
  const isSponsored = preset === 'sponsored'

  const baseClasses = [
    'relative flex  border border-dashed border-border bg-muted text-sm font-medium text-muted-foreground shadow-inner',
    orientationClasses[orientation],
    isSponsored ? 'items-stretch justify-between px-6 py-6 sm:px-8 sm:py-8' : 'items-center justify-center',
    className,
  ]

  const content = isSponsored ? <SponsoredContent orientation={orientation} /> : children ?? <span>{label}</span>

  return (
    <div className={baseClasses.join(' ')} {...props}>
      {content}
    </div>
  )
}

export default AdSlot
