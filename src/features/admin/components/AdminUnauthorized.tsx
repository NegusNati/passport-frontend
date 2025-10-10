import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'

import { prefersReducedMotion } from '@/features/admin/lib/a11y'
import type { User } from '@/features/auth/schemas/user'
import { Button } from '@/shared/ui/button'

type AdminUnauthorizedProps = {
  user: User
  variant?: 'forbidden' | 'restricted'
}

const FLOAT_ITEMS = [
  { emoji: '🛂', delay: 0 },
  { emoji: '🛫', delay: 0.2 },
  { emoji: '🧳', delay: 0.4 },
  { emoji: '🌍', delay: 0.6 },
]

export function AdminUnauthorized({ user: _user, variant = 'forbidden' }: AdminUnauthorizedProps) {
  const reduceMotion = useReducedMotion() || prefersReducedMotion()

  const title =
    variant === 'restricted'
      ? "Hold up — this section needs admin clearance"
      : "Oops! You're not cleared for this hangar"

  const description =
    variant === 'restricted'
      ? 'Editors can craft stories, but system controls stay with admins. Head back to the dashboard to keep creating.'
      : 'Looks like your account is set for reader mode only. Reach out and we’ll get you upgraded to an editor so you can publish articles.'

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-12 h-40 w-40">
        {!reduceMotion && FLOAT_ITEMS.map((item, index) => (
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 text-3xl"
            style={{
              transform: `translate(-50%, -50%) rotate(${index * 90}deg)`
            }}
            animate={{
              y: [0, -12, 0],
              rotate: [index * 90, index * 90 + 6, index * 90],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.2,
              ease: 'easeInOut',
              delay: item.delay,
            }}
          >
            {item.emoji}
          </motion.span>
        ))}
        {reduceMotion && (
          <span className="absolute left-1/2 top-1/2 text-4xl" style={{ transform: 'translate(-50%, -50%)' }}>
            🚫
          </span>
        )}
        <motion.div
          className="bg-primary/5 text-primary absolute inset-6 rounded-full border border-primary/40"
          animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={reduceMotion ? undefined : { repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        />
      </div>

      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm sm:text-base">{description}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {variant === 'restricted' ? (
          <Button asChild>
            <Link to="/admin">Back to overview</Link>
          </Button>
        ) : (
          <Button asChild>
            <a href="mailto:support@passport.et?subject=Editor%20Role%20Request">Contact us for editor access</a>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link to="/">Return home</Link>
        </Button>
      </div>
    </div>
  )
}

export default AdminUnauthorized
