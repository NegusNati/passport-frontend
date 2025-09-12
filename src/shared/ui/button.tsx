import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

function baseClasses(variant: ButtonVariant, disabled?: boolean) {
  const common =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none'
  const ring = ' focus-visible:ring-black/30 ring-offset-background'
  const v = {
    primary: 'bg-black text-white hover:bg-black/90',
    secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300',
    outline:
      'border border-neutral-300 text-neutral-900 hover:bg-neutral-100 bg-transparent',
    ghost: 'text-neutral-900 hover:bg-neutral-100',
  } as const
  return [common, ring, v[variant], disabled ? 'opacity-60' : ''].join(' ')
}

function sizeClasses(size: ButtonSize) {
  const s = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  } as const
  return s[size]
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button ref={ref} className={[baseClasses(variant, props.disabled), sizeClasses(size), className].join(' ')} {...props}>
        {leftIcon ? <span className="-ml-1">{leftIcon}</span> : null}
        <span>{children}</span>
        {rightIcon ? <span className="-mr-1">{rightIcon}</span> : null}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button

