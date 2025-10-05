import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon, IdCardIcon, Users2Icon } from 'lucide-react'

import CardSwap, { Card } from '@/shared/components/common/CardSwap'
import { M } from '@/shared/lib/motion'
import { Button } from '@/shared/ui/button'

export function Hero() {
  const reduce = useReducedMotion()
  return (
    <section className="relative isolate overflow-hidden">
      {/* Container to constrain width and center content */}
      <div className="container max-w-7xl px-4 md:px-6">
        {/* Two-column layout on md+; single column on mobile */}
        <div className="grid items-center gap-8 pt-10 md:mt-10 md:pt-24 md:grid-cols-2">
          {/* Left: copy / CTA */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: M.duration, ease: M.ease }}
            className="space-y-6 md:ml-6 md:mt-18"
          >
             {/* Stats row */}
             <div className="flex flex-wrap  items-center gap-2">
              <span className="bg-white/50 text-primary inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium">
                <Users2Icon className="text-primary h-4 w-4" /> Over 1.5 million users
              </span>
              <span className="bg-white/50 text-primary inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium">
                <IdCardIcon className="text-primary h-4 w-4" /> 800,000+ passports confirmed as issued
              </span>
            </div>

            <h1 className="text-foreground max-w-[30ch] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Tired of endless uncertainty? Instantly know if your Ethiopian passport is ready.
            </h1>
            <p className="text-muted-foreground max-w-[52ch] text-base leading-relaxed">
              Search with your reference number or name and get real-time updates—no more repeated
              trips to the office.
            </p>

            {/* CTA row */}
            <div className="mt-2 grid w-full gap-4 sm:w-auto sm:grid-cols-2 place-items-center">
              <div
                className="cta-glow relative mx-auto w-full h-[220px] grid place-items-center sm:max-w-[640px]"
              >
                {/* Outermost ring */}
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%]  md:w-[130%]  max-w-[520px] h-[150px] rounded-[9999px] bg-primary/25 blur-[3px] animate-pulse-slow"
                />

                {/* Middle ring */}
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%]  md:w-[110%]  max-w-[460px] h-[120px] rounded-[9999px] bg-primary/35 blur-[1.5px] animate-pulse-medium"
                />

                {/* Inner ring */}
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] md:w-[90%]  max-w-[380px] h-[70px] rounded-[9999px] bg-primary animate-pulse-fast"
                />

           
                {/* CTA (kept centered by the grid wrapper) */}
                <Button size="lg"   className="relative z-[1] py-5 rounded-full bg-transparent  ">
                  <Link to="/passports" className="inline-flex items-center semi-bold bg-transparent">
                    Check My Passport Status
                    <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center">
                <a
                  href="#telegram"
                  className="text-primary inline-flex items-center text-base font-semibold"
                >
                  Join Telegram Group
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: CardSwap (visible on md+) */}
          <div className="hidden md:block">
            <div className="relative md:h-[580px] md:w-[538px] justify-self-end">
              <CardSwap
                width={538}
                height={560}
                cardDistance={50}
                verticalDistance={60}
                delay={5000}
                pauseOnHover={false}
              >
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
        </div>

        {/* Mobile / small screens: CardSwap below below */}
        <div
          className="relative md:hidden translate-x-[-185px] translate-y-[-165px]"
          style={{ height: 410 }}
        >
          <CardSwap
            width={460}
            height={580}
            cardDistance={60}
            verticalDistance={70}
            delay={5000}
            pauseOnHover={true}
          >
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
    </section>
  )
}

export default Hero
