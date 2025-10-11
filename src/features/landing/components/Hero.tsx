import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon, IdCardIcon, Users2Icon } from 'lucide-react'

import LandingImageOne from '@/assets/landingImages/cardImages/Landing_img_1.png'
import LandingImageTwo from '@/assets/landingImages/cardImages/Landing_img_2.png'
import LandingImageThree from '@/assets/landingImages/cardImages/Landing_img_3.png'
import { AnimatedBorderCard, Card, CardSwap } from '@/shared/components/common'
import { M } from '@/shared/lib/motion'
import { Button } from '@/shared/ui/button'

const HERO_CARDS = [
  {
    title: 'Passport Search',
    description:
      'Use your reference number or full name with intelligent matching. from 1.2 million passports',
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
    title: 'Join Our Community',
    description: 'Join the Telegram group to learn from others’ experiences.',
    image: LandingImageThree,
    alt: 'Collage of community members sharing travel tips',
  },
] as const

function renderHeroCard(variant: 'desktop' | 'mobile', card: (typeof HERO_CARDS)[number]) {
  const padding = variant === 'desktop' ? 'p-8' : 'p-4 sm:p-6'
  const headingSize = variant === 'desktop' ? 'text-xl' : 'text-base sm:text-lg'
  const descriptionSpacing = variant === 'desktop' ? 'mt-3' : 'mt-2'

  return (
    <Card
      key={`${variant}-${card.title}`}
      customClass="pointer-events-auto overflow-hidden border-0 bg-transparent rounded-xl p-0"
    >
      <div className="relative h-full w-full">
        <img
          src={card.image}
          alt={card.alt}
          className="h-full w-full rounded-2xl object-fill"
          loading="lazy"
          decoding="async"
        />
        <div className=" absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/15 to-primary/5" />
        <div className={`absolute inset-x-0 bottom-0 space-y-2 ${padding} ` }>
          <h3 className={`${headingSize} font-semibold tracking-tight text-white`}>{card.title}</h3>
          <p className={`text-sm leading-relaxed text-white/90 ${descriptionSpacing}`}>
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
    <section className="relative isolate overflow-hidden">
      {/* Container to constrain width and center content */}
      <div className="container max-w-7xl px-4 md:px-6">
        {/* Two-column layout on md+; single column on mobile */}
        <div className="grid items-center gap-8 pt-10 md:mt-10 md:grid-cols-2 md:pt-24">
          {/* Left: copy / CTA */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: M.duration, ease: M.ease }}
            className="space-y-6 md:mt-18 md:ml-6"
          >
            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-3">
              <AnimatedBorderCard variant="primary" size="sm">
                <Users2Icon className="text-primary h-4 w-4" />
                Over 1.5 million users
              </AnimatedBorderCard>
              <AnimatedBorderCard variant="secondary" size="sm" className=' border-amber-100/50' >
                <IdCardIcon className="text-primary h-4 w-4" />
                1,278,980+ passports confirmed as issued
              </AnimatedBorderCard>
            </div>

            <h1 className="text-foreground max-w-[30ch] text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
              Tired of endless uncertainty? Instantly know if your Ethiopian passport is ready.
            </h1>
            <p className="text-muted-foreground max-w-[52ch] text-base leading-relaxed dark:text-white/70">
              Search with your reference number or name and get real-time updates—no more repeated
              trips to the office.
            </p>

            {/* CTA row */}
            <div className="mt-2 grid w-full place-items-center gap-4 sm:w-auto sm:grid-cols-2">
              <div className="cta-glow relative mx-auto grid h-[220px] w-full place-items-center sm:max-w-[640px]">
                {/* Outermost ring */}
                <div className="bg-primary/25 animate-pulse-slow pointer-events-none absolute top-1/2 left-1/2 h-[150px] w-[95%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[9999px] blur-[3px] md:w-[130%]" />

                {/* Middle ring */}
                <div className="bg-primary/35 animate-pulse-medium pointer-events-none absolute top-1/2 left-1/2 h-[120px] w-[85%] max-w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-[9999px] blur-[1.5px] md:w-[110%]" />

                {/* Inner ring */}
                <div className="bg-primary animate-pulse-fast pointer-events-none absolute top-1/2 left-1/2 h-[70px] w-[70%] max-w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-[9999px] md:w-[90%]" />

                {/* CTA (kept centered by the grid wrapper) */}

                <Button size="lg" className="relative z-[1] rounded-full bg-transparent py-5  text-sm md:text-base ">
                  <Link 
                    to="/passports"
                    className="inline-flex items-center bg-transparent font-semibold text-white " 
                  >
                    Check My Passport Status
                    <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center">
                <a
                  href="https://t.me/passportdotet_group"
                  target="_blank"
                  className="text-primary inline-flex items-center text-base font-semibold "
                  rel="noreferrer"
                >
                  Join The Telegram Group
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: CardSwap (visible on md+) */}
          <div className="hidden md:block translate-y-[-65px] translate-x-[-45px]">
            <div className="relative justify-self-end md:h-[580px] md:w-[538px]">
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
      </div>
    </section>
  )
}

export default Hero
