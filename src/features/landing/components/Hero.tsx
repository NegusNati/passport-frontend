import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon, IdCardIcon, Users2Icon } from 'lucide-react'

import LandingImageOne from '@/assets/landingImages/cardImages/Landing_img_1.png'
import LandingImageTwo from '@/assets/landingImages/cardImages/Landing_img_2.png'
import { AnimatedBorderCard, Card, CardSwap } from '@/shared/components/common'
import { M } from '@/shared/lib/motion'
import { Button } from '@/shared/ui/button'

const HERO_CARDS = [
  {
    title: 'Passport Search',
    description: 'Use your reference number or full name with intelligent matching. from 1.2 million passports',
    image: LandingImageOne,
    alt: 'Illustration showing a person searching on a phone',
  },
  {
    title: 'Get Detailed Answer',
    description: 'when to pick up the passport, location, time, ...',
    image: LandingImageTwo,
    alt: 'Collage of community members sharing travel tips',
  },
  {
    title: 'Get Detailed',
    description: 'Join the Telegram group to learn from others’ experiences.',
    image: LandingImageOne,
    alt: 'Collage of community members sharing travel tips',
  },
] as const

function renderHeroCard(
  variant: 'desktop' | 'mobile',
  card: (typeof HERO_CARDS)[number],
) {
  const padding = variant === 'desktop' ? 'p-8' : 'p-6'
  const headingSize = variant === 'desktop' ? 'text-xl' : 'text-lg'
  const descriptionSpacing = variant === 'desktop' ? 'mt-3' : 'mt-2'

  return (
    <Card
      key={`${variant}-${card.title}`}
      customClass="pointer-events-auto overflow-hidden border-0 bg-transparent  p-0"
    >
      <div className="relative h-full w-full">
        <img
          src={card.image}
          alt={card.alt}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
        <div className={`absolute inset-x-0 bottom-0 space-y-2 ${padding}`}>
          <h3 className={`${headingSize} font-semibold tracking-tight text-white`}>{card.title}</h3>
          <p className={`text-sm leading-relaxed text-white/80 ${descriptionSpacing}`}>
            {card.description}
          </p>
        </div>
      </div>
    </Card>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  return (
    <section className="relative isolate overflow-hidden ">
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
            <div className="flex flex-wrap items-center gap-3">
              <AnimatedBorderCard variant="primary" size="sm">
                <Users2Icon className="text-primary h-4 w-4" />
                Over 1.5 million users
              </AnimatedBorderCard>
              <AnimatedBorderCard variant="secondary" size="sm">
                <IdCardIcon className="text-primary h-4 w-4" />
                1,278,980+ passports confirmed as issued
              </AnimatedBorderCard>
            </div>

            <h1 className="text-foreground max-w-[30ch] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Tired of endless uncertainty? Instantly know if your Ethiopian passport is ready.
            </h1>
            <p className="text-muted-foreground dark:text-white/70 max-w-[52ch] text-base leading-relaxed">
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


                <Button size="lg" className="relative z-[1] py-5 rounded-full bg-transparent  ">
                  <Link to="/passports" className="inline-flex items-center font-semibold bg-transparent text-white">
                    Check My Passport Status
                    <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>

              </div>

              <div className="flex items-center justify-center">
                <a
                  href="https://t.me/passportdotet_group"
                  target="_blank"
                  className="text-primary inline-flex items-center text-base font-semibold" rel="noreferrer"
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
                {HERO_CARDS.map((card) => renderHeroCard('desktop', card))}
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
            {HERO_CARDS.map((card) => renderHeroCard('mobile', card))}
          </CardSwap>
        </div>
      </div>
    </section>
  )
}

export default Hero
