import * as React from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={[
          'border-input bg-background text-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm',
          'placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
          className,
        ].join(' ')}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export default Input
