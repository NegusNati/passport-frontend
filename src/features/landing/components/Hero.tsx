import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon, IdCardIcon, Users2Icon } from 'lucide-react'

import CardSwap, { Card } from '@/shared/components/common/CardSwap'
import { M } from '@/shared/lib/motion'
import { Button } from '@/shared/ui/button'

export function Hero() {
  const reduce = useReducedMotion()
  return (
    <section className="relative isolate">
  
      <div className="relative grid max-w-2xl items-center  gap-8 pt-14 sm:pt-20  absolute left-7 top-28 hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: M.duration, ease: M.ease }}
          className="space-y-6"
        >
          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/50 text-foreground inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium">
              <Users2Icon className="text-primary h-4 w-4" /> Over 1.5 million users
            </span>
            <span className="bg-white/50 text-foreground inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium">
              <IdCardIcon className="text-primary h-4 w-4" /> 800,000+ passports confirmed as issued
            </span>
          </div>

          <h1 className="text-foreground max-w-3xl text-3xl font-bold sm:text-4xl">
            Tired of endless uncertainty? Instantly know if your Ethiopian passport is ready.
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base">
            Search with your reference number or name and get real-time updates—no more repeated
            trips to the office.
          </p>

          {/* CTA row */}
          <div className="mt-2 flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row">
            <div className="cta-glow relative">
              <Button size="lg" className="relative z-[1] px-5 py-5">
                <Link to="/passports">
                  Check My Passport Status Now
                  <ArrowRightIcon className="ml-2 inline h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2">
              <a
                href="#telegram"
                className="text-primary inline-flex items-center text-sm font-medium"
              >
                Join Telegram Group
              </a>
            </div>
          </div>
        </motion.div>

        {/* Mobile / small screens: CardSwap below content */}
        <div className="relative mt-8 block md:hidden" style={{ height: 420 }}>
          <CardSwap width={360} height={360} cardDistance={60} verticalDistance={70} delay={5000} pauseOnHover={false}>
            <Card customClass="border-border/60 bg-card/80 text-card-foreground shadow-sm p-6">
              <h3 className="text-lg font-semibold tracking-tight">Real-time updates</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Track readiness without repeated trips. Status changes appear as soon as they’re available.
              </p>
            </Card>
            <Card customClass="border-border/60 bg-card/80 text-card-foreground shadow-sm p-6">
              <h3 className="text-lg font-semibold tracking-tight">Simple search</h3>
              <p className="text-muted-foreground mt-2 text-sm">Use your reference number or full name with intelligent matching.</p>
            </Card>
            <Card customClass="border-border/60 bg-card/80 text-card-foreground shadow-sm p-6">
              <h3 className="text-lg font-semibold tracking-tight">Community tips</h3>
              <p className="text-muted-foreground mt-2 text-sm">Join the Telegram group to learn from others’ experiences.</p>
            </Card>
          </CardSwap>
        </div>
      </div>

      {/* Desktop / md+: CardSwap on the right side */}
      <div className="pointer-events-none absolute right-7 top-28 hidden md:block" style={{ width: 538, height: 580 }}>
        <div className="relative h-full w-full">
          <CardSwap width={538} height={560} cardDistance={50} verticalDistance={60} delay={5000} pauseOnHover={false}>
            <Card customClass="pointer-events-auto border-border/60 bg-card/80 text-card-foreground shadow-sm p-8">
              <h3 className="text-xl font-semibold tracking-tight">Real-time updates</h3>
              <p className="text-muted-foreground mt-3 text-sm">
                Track readiness without repeated trips. Status changes appear as soon as they’re available.
              </p>
            </Card>
            <Card customClass="pointer-events-auto border-border/60 bg-card/80 text-card-foreground shadow-sm p-8">
              <h3 className="text-xl font-semibold tracking-tight">Simple search</h3>
              <p className="text-muted-foreground mt-3 text-sm">Use your reference number or full name with intelligent matching.</p>
            </Card>
            <Card customClass="pointer-events-auto border-border/60 bg-card/80 text-card-foreground shadow-sm p-8">
              <h3 className="text-xl font-semibold tracking-tight">Community tips</h3>
              <p className="text-muted-foreground mt-3 text-sm">Join the Telegram group to learn from others’ experiences.</p>
            </Card>
          </CardSwap>
        </div>
      </div>
    </section>
  )
}

export default Hero
