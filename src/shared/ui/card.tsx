import { type HTMLAttributes } from 'react'

export type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'border-border bg-card text-card-foreground rounded-xl border shadow-sm',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

export function CardHeader({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['p-4 sm:p-6', className].join(' ')} {...props} />
}

export function CardContent({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['p-4 pt-0 sm:p-6', className].join(' ')} {...props} />
}

export function CardFooter({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['flex items-center gap-2 p-4 pt-0 sm:p-6', className].join(' ')} {...props} />
  )
}

export default Card
