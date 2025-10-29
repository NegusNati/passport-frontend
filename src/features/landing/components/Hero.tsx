import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon, IdCardIcon, Users2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'

import LandingImageOne from '@/assets/landingImages/cardImages/Landing_img_1.webp'
import LandingImageTwo from '@/assets/landingImages/cardImages/Landing_img_2.webp'
import LandingImageThree from '@/assets/landingImages/cardImages/Landing_img_3.webp'
import { AnimatedBorderCard, Card } from '@/shared/components/common'
import { CardSwapLazy } from '@/shared/components/common/CardSwapLazy'
import { useAnalytics } from '@/shared/lib/analytics'
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

const CARD_DIMENSIONS = {
  desktop: { width: 538, height: 560 },
  mobile: { width: 440, height: 580 },
} as const

function renderHeroCard(
  variant: 'desktop' | 'mobile',
  card: (typeof HERO_CARDS)[number],
  index: number,
) {
  const padding = variant === 'desktop' ? 'p-8' : 'p-4 sm:p-6'
  const headingSize = variant === 'desktop' ? 'text-xl' : 'text-base sm:text-lg'
  const descriptionSpacing = variant === 'desktop' ? 'mt-3' : 'mt-2'
  const isFirstCard = index === 0
  const { width, height } = CARD_DIMENSIONS[variant]

  const sizes =
    variant === 'desktop'
      ? '(min-width: 1024px) 538px, (min-width: 768px) 480px, 90vw'
      : '(max-width: 767px) 80vw, 440px'

  return (
    <Card
      key={`${variant}-${card.title}`}
      customClass="pointer-events-auto overflow-hidden border-0 bg-transparent rounded-xl p-0"
      style={{ width, height }}
    >
      <div className="relative h-full w-full">
        <img
          src={card.image}
          alt={card.alt}
          width={width}
          height={height}
          className="h-full w-full rounded-2xl object-cover"
          loading={isFirstCard ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={isFirstCard ? 'high' : undefined}
          sizes={sizes}
        />
        <div className="from-primary/50 via-primary/15 to-primary/5 absolute inset-0 bg-gradient-to-t" />
        <div className={`absolute inset-x-0 bottom-0 space-y-2 ${padding} `}>
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
  const { capture } = useAnalytics()
  const [enableCardSwap, setEnableCardSwap] = useState(false)

  const handleCTAClick = (surface: string, variant?: string) => {
    capture('cta_click_track_passport', {
      surface,
      variant: variant || 'primary',
    })
  }

  useEffect(() => {
    if (typeof document === 'undefined') return
    const heroImageUrl = HERO_CARDS[0]?.image
    if (!heroImageUrl) return

    const existing = document.head.querySelector(
      `link[rel="preload"][href="${heroImageUrl}"]`,
    ) as HTMLLinkElement | null
    if (existing) {
      existing.setAttribute('fetchpriority', 'high')
      return
    }

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = heroImageUrl
    link.setAttribute('fetchpriority', 'high')
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    if (reduce || enableCardSwap) return
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(min-width: 768px)')
    let timeoutId: number | undefined

    const scheduleEnable = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(() => setEnableCardSwap(true), 800)
    }

    if (mediaQuery.matches) {
      scheduleEnable()
    }

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        scheduleEnable()
      }
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange)
      } else if (typeof mediaQuery.removeListener === 'function') {
        mediaQuery.removeListener(handleChange)
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [reduce, enableCardSwap])

  return (
    <section className="relative overflow-hidden overscroll-none isolate min-h-[80svh] pb-0 md:min-h-[90svh] md:overflow-hidden md:pb-[120px] lg:pb-[80px]">
      {/* Container to constrain width and center content */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6 ">
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
              <AnimatedBorderCard variant="secondary" size="sm" className="border-amber-100/50">
                <IdCardIcon className="text-primary h-4 w-4" />
                1,300,173+ passports confirmed as issued
              </AnimatedBorderCard>
            </div>

            <h1 className="text-foreground max-w-[30ch] text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
              Tired of endless uncertainty? Instantly know if your Ethiopian passport is ready.
            </h1>
            <h2 className="text-muted-foreground max-w-[52ch] text-base leading-relaxed dark:text-white/70">
              Search with your reference number or name and get real-time updates—no more repeated
              trips to the office.
            </h2>

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

                <Button
                  size="lg"
                  className="relative z-[1] rounded-full bg-transparent py-5 text-sm md:text-base"
                  onClick={() => handleCTAClick('hero', 'primary-glowing')}
                >
                  <Link
                    to="/passports"
                    className="inline-flex items-center bg-transparent font-semibold text-white"
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
                  className="text-primary inline-flex items-center text-base font-semibold"
                  rel="noreferrer"
                  onClick={() => capture('telegram_group_click', { surface: 'hero' })}
                >
                  Join The Telegram Group
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: CardSwap (visible on md+) */}
          <div className="hidden translate-x-[-45px] translate-y-[-65px] md:block">
            <div className="relative justify-self-end md:h-[580px] md:w-[538px]">
              {enableCardSwap ? (
                <CardSwapLazy
                  width={CARD_DIMENSIONS.desktop.width}
                  height={CARD_DIMENSIONS.desktop.height}
                  cardDistance={50}
                  verticalDistance={60}
                  delay={5000}
                  pauseOnHover={false}
                >
                  {HERO_CARDS.map((card, index) => renderHeroCard('desktop', card, index))}
                </CardSwapLazy>
              ) : (
                <div
                  className="absolute top-1/2 left-1/2 origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.7] overflow-visible perspective-[900px] sm:scale-[0.85] md:top-auto md:right-0 md:bottom-0 md:left-auto md:origin-bottom-right md:translate-x-[5%] md:translate-y-[20%] md:scale-100 lg:translate-x-[2%] lg:translate-y-[10%]"
                  style={{
                    width: CARD_DIMENSIONS.desktop.width,
                    height: CARD_DIMENSIONS.desktop.height,
                  }}
                >
                  {renderHeroCard('desktop', HERO_CARDS[0], 0)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
