import { forwardRef, type TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        className={[
          'border-input bg-background flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm',
          'placeholder:text-muted-foreground',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ].join(' ')}
        ref={ref}
        {...props}
      />
    )
  },
)

Textarea.displayName = 'Textarea'

export default Textarea
