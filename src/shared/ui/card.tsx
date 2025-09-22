import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', ...props }: CardProps) {
  return <div className={["rounded-xl border border-border bg-card text-card-foreground shadow-sm", className].join(' ')} {...props} />
}

export function CardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-4 sm:p-6", className].join(' ')} {...props} />
}

export function CardContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-4 sm:p-6 pt-0", className].join(' ')} {...props} />
}

export function CardFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-4 sm:p-6 pt-0 flex items-center gap-2", className].join(' ')} {...props} />
}

export default Card

