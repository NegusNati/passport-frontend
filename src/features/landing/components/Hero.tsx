import { Container } from '@/shared/ui/container'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { motion, useReducedMotion } from 'framer-motion'
import { M } from '@/shared/lib/motion'

export function Hero() {
  const reduce = useReducedMotion()
  return (
    <section className="relative overflow-hidden pt-10 sm:pt-14">
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <motion.div initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: M.duration, ease: M.ease }}>
            <Badge className="mb-4">Over 1.5M users, 800k passports issued</Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Tired of endless uncertainty? Instantly know if your Ethiopian passport is ready.
            </h1>
            <p className="mt-3 text-neutral-600">
              Search with your reference number or name and get real-time updates—no more repeated trips to the office.
            </p>
            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row">
              <Button size="lg">Check My Passport Status Now</Button>
              <a href="#telegram" className="inline-flex items-center text-sm font-medium text-neutral-900 underline-offset-4 hover:underline">
                Join Telegram Group
              </a>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: M.duration + 0.05, ease: M.ease }}
          className=""
        >
          <div className="h-64 rounded-2xl bg-neutral-100 shadow-inner sm:h-80">
            <div className="h-full w-full rounded-2xl border border-dashed border-neutral-300" aria-hidden />
          </div>
          <p className="mt-3 text-center text-sm text-neutral-500">Live results preview • Placeholder</p>
        </motion.div>
      </Container>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" aria-hidden />
    </section>
  )
}

export default Hero
