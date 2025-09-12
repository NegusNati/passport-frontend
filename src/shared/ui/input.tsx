import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={[
          'flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900',
          'placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30',
          className,
        ].join(' ')}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export default Input

