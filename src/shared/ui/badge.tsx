import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-black text-white',
    secondary: 'bg-neutral-200 text-neutral-900',
    outline: 'border border-neutral-300 text-neutral-900',
  } as const
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        variants[variant],
        className,
      ].join(' ')}
      {...props}
    />
  )
}

export default Badge

