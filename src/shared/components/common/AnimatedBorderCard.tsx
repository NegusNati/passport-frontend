import './AnimatedBorderCard.css'

import { motion, useReducedMotion } from 'framer-motion'

interface AnimatedBorderCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
}

export function AnimatedBorderCard({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md' 
}: AnimatedBorderCardProps) {
  const reduce = useReducedMotion()
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const variantClasses = {
    primary: 'border-primary/50',
    secondary: 'border-blue-500/50',
    accent: 'border-purple-500/50'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        animated-border-card
        relative inline-flex items-center gap-2 rounded-lg
        bg-white/70 dark:bg-white/80 text-primary
        ${sizeClasses[size]}
        font-medium
        ${variantClasses[variant]}
        ${className}
      `}
      style={{
        '--animation-duration': reduce ? '0s' : '3s',
        '--animation-delay': '0s'
      } as React.CSSProperties}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedBorderCard
