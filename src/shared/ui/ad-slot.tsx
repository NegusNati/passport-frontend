import React from 'react'

interface AdSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  orientation?: 'horizontal' | 'vertical'
}

const orientationClasses = {
  horizontal: 'min-h-[12rem] w-full',
  vertical: 'h-full min-h-[16rem] w-full',
} as const

export function AdSlot({
  label = 'Ad space',
  orientation = 'horizontal',
  className = '',
  ...props
}: AdSlotProps) {
  return (
    <div
      className={[
        'relative flex items-center justify-center  border border-dashed border-neutral-300 bg-neutral-100 text-sm font-medium text-neutral-400 shadow-inner',
        orientationClasses[orientation],
        className,
      ].join(' ')}
      {...props}
    >
      <span>{label}</span>
    </div>
  )
}

export default AdSlot
