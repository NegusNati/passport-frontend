import { Slot } from '@radix-ui/react-slot'
import { type ButtonHTMLAttributes, forwardRef, type ReactNode, type Ref } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  asChild?: boolean
}

function baseClasses(variant: ButtonVariant, disabled?: boolean) {
  const common =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none'
  const ring = ' focus-visible:ring-ring ring-offset-background'
  const v = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
    outline:
      'border border-input text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent',
    ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      children,
      asChild = false,
      type,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'button'

    return (
      <Component
        ref={ref as unknown as Ref<HTMLButtonElement>}
        className={[baseClasses(variant!, props.disabled), sizeClasses(size!), className].join(' ')}
        {...(asChild ? props : { ...props, type: type ?? 'button' })}
      >
        {leftIcon ? <span className="-ml-1">{leftIcon}</span> : null}
        <span>{children}</span>
        {rightIcon ? <span className="-mr-1">{rightIcon}</span> : null}
      </Component>
    )
  },
)

Button.displayName = 'Button'

export default Button
