import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, IdCardIcon, Users2Icon } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import LandingImageOne from '@/assets/landingImages/cardImages/Landing_img_1.webp'
import LandingImageTwo from '@/assets/landingImages/cardImages/Landing_img_2.webp'
import LandingImageThree from '@/assets/landingImages/cardImages/Landing_img_3.webp'
import { AnimatedBorderCard, Card } from '@/shared/components/common'
import { CardSwapLazy } from '@/shared/components/common/CardSwapLazy'
import { CardSwapShell } from '@/shared/components/common/CardSwapShell'
import { useAnalytics } from '@/shared/lib/analytics'
import { Button } from '@/shared/ui/button'

// Card keys for i18n
type HeroCardKey = 'search' | 'details' | 'community'

const HERO_CARD_KEYS: HeroCardKey[] = ['search', 'details', 'community']

const HERO_CARD_IMAGES: Record<HeroCardKey, string> = {
  search: LandingImageOne,
  details: LandingImageTwo,
  community: LandingImageThree,
}

const HERO_CARD_IDS: Record<HeroCardKey, string> = {
  search: 'hero-card-1',
  details: 'hero-card-2',
  community: 'hero-card-3',
}

const CARD_DIMENSIONS = {
  desktop: { width: 538, height: 560 },
  mobile: { width: 440, height: 580 },
} as const

const CARD_SOURCES: Record<
  'hero-card-1' | 'hero-card-2' | 'hero-card-3',
  {
    avif: string
    webp: string
  }
> = {
  'hero-card-1': {
    avif: '/media/landing/hero-card-1-320w.avif 320w, /media/landing/hero-card-1-480w.avif 480w, /media/landing/hero-card-1-768w.avif 768w, /media/landing/hero-card-1-1080w.avif 1080w',
    webp: '/media/landing/hero-card-1-320w.webp 320w, /media/landing/hero-card-1-480w.webp 480w, /media/landing/hero-card-1-768w.webp 768w, /media/landing/hero-card-1-1080w.webp 1080w',
  },
  'hero-card-2': {
    avif: '/media/landing/hero-card-2-320w.avif 320w, /media/landing/hero-card-2-480w.avif 480w, /media/landing/hero-card-2-768w.avif 768w, /media/landing/hero-card-2-1080w.avif 1080w',
    webp: '/media/landing/hero-card-2-320w.webp 320w, /media/landing/hero-card-2-480w.webp 480w, /media/landing/hero-card-2-768w.webp 768w, /media/landing/hero-card-2-1080w.webp 1080w',
  },
  'hero-card-3': {
    avif: '/media/landing/hero-card-3-320w.avif 320w, /media/landing/hero-card-3-480w.avif 480w, /media/landing/hero-card-3-768w.avif 768w, /media/landing/hero-card-3-1080w.avif 1080w',
    webp: '/media/landing/hero-card-3-320w.webp 320w, /media/landing/hero-card-3-480w.webp 480w, /media/landing/hero-card-3-768w.webp 768w, /media/landing/hero-card-3-1080w.webp 1080w',
  },
}

export const HERO_CARD_IMAGE_SOURCES = CARD_SOURCES

interface HeroCardData {
  id: string
  key: HeroCardKey
  title: string
  description: string
  image: string
  alt: string
}

interface HeroCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'desktop' | 'mobile'
  card: HeroCardData
  index: number
}

const HeroCard = forwardRef<HTMLDivElement, HeroCardProps>(
  ({ variant, card, index, style, ...props }, ref) => {
    const padding = variant === 'desktop' ? 'p-8' : 'p-4 sm:p-6'
    const headingSize = variant === 'desktop' ? 'text-xl' : 'text-base sm:text-lg'
    const descriptionSpacing = variant === 'desktop' ? 'mt-3' : 'mt-2'
    const isFirstCard = index === 0
    const { width, height } = CARD_DIMENSIONS[variant]

    const sizes =
      variant === 'desktop'
        ? '(min-width: 1024px) 538px, (min-width: 768px) 480px, 90vw'
        : '(max-width: 767px) 80vw, 440px'
    const sources = CARD_SOURCES[card.id as keyof typeof CARD_SOURCES]

    return (
      <Card
        ref={ref}
        key={`${variant}-${card.key}`}
        customClass="pointer-events-auto overflow-hidden border-0 bg-transparent rounded-xl p-0"
        style={{ width, height, ...style }}
        {...props}
      >
        <div className="relative h-full w-full">
          <picture>
            <source type="image/avif" srcSet={sources.avif} sizes={sizes} />
            <source type="image/webp" srcSet={sources.webp} sizes={sizes} />
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
          </picture>
          <div className="from-primary/50 via-primary/15 to-primary/5 absolute inset-0 bg-gradient-to-t" />
          <div className={`absolute inset-x-0 bottom-0 space-y-2 ${padding} `}>
            <h3 className={`${headingSize} font-semibold tracking-tight text-white`}>
              {card.title}
            </h3>
            <p className={`text-sm leading-relaxed text-white/90 ${descriptionSpacing}`}>
              {card.description}
            </p>
          </div>
        </div>
      </Card>
    )
  },
)
HeroCard.displayName = 'HeroCard'

export function Hero() {
  const { t } = useTranslation('landing')
  const { capture } = useAnalytics()

  // Check reduced motion preference via CSS media query
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const pulseEnabled = !reduceMotion

  // Build translated hero cards
  const heroCards: HeroCardData[] = HERO_CARD_KEYS.map((key) => ({
    id: HERO_CARD_IDS[key],
    key,
    title: t(`hero.cards.${key}.title`),
    description: t(`hero.cards.${key}.description`),
    image: HERO_CARD_IMAGES[key],
    alt: t(`hero.cards.${key}.alt`),
  }))

  const handleCTAClick = (surface: string, variant?: string) => {
    capture('cta_click_track_passport', {
      surface,
      variant: variant || 'primary',
    })
  }

  // Note: LCP image preload is now handled statically in index.html
  // for better performance (no JS execution needed)

  return (
    <section className="relative isolate min-h-[80svh] pb-0 md:min-h-[90svh] md:pb-[120px] lg:pb-[80px]">
      {/* Container to constrain width and center content */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Two-column layout on md+; single column on mobile */}
        <div className="grid items-center gap-8 pt-10 md:mt-10 md:grid-cols-2 md:pt-24">
          {/* Left: copy / CTA - CSS animation instead of Framer Motion */}
          <div
            className={`space-y-6 md:mt-18 md:ml-6 ${reduceMotion ? '' : 'animate-hero-fade-in'}`}
          >
            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-3">
              <AnimatedBorderCard variant="primary" size="sm">
                <Users2Icon className="text-primary h-4 w-4" />
                {t('hero.stats.users')}
              </AnimatedBorderCard>
              <AnimatedBorderCard variant="secondary" size="sm" className="border-amber-100/50">
                <IdCardIcon className="text-primary h-4 w-4" />
                {t('hero.stats.passportsConfirmed', { count: 1499143 })}
              </AnimatedBorderCard>
            </div>

            <h1 className="text-foreground max-w-[30ch] text-balance text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
              {t('hero.headline')}
            </h1>
            <h2 className="text-muted-foreground max-w-[52ch] text-base leading-relaxed dark:text-white/70">
              {t('hero.subheadline')}
            </h2>

            {/* CTA row */}
            <div className="mt-2 grid w-full place-items-center gap-4 sm:w-auto sm:grid-cols-2">
              <div className="cta-glow relative mx-auto grid h-[220px] w-full place-items-center sm:max-w-[640px]">
                {/* Outermost ring */}
                <div
                  className={`bg-primary/25 pointer-events-none absolute top-1/2 left-1/2 h-[150px] w-[95%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[9999px] blur-[3px] md:w-[130%] ${
                    pulseEnabled ? 'animate-pulse-slow' : ''
                  }`}
                  aria-hidden
                />

                {/* Middle ring */}
                <div
                  className={`bg-primary/35 pointer-events-none absolute top-1/2 left-1/2 h-[120px] w-[85%] max-w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-[9999px] blur-[1.5px] md:w-[110%] ${
                    pulseEnabled ? 'animate-pulse-medium' : ''
                  }`}
                  aria-hidden
                />

                {/* Inner ring */}
                <div
                  className={`bg-primary pointer-events-none absolute top-1/2 left-1/2 h-[70px] w-[70%] max-w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-[9999px] md:w-[90%] ${
                    pulseEnabled ? 'animate-pulse-fast' : ''
                  }`}
                  aria-hidden
                />

                {/* CTA (kept centered by the grid wrapper) */}

                <Button
                  asChild
                  size="lg"
                  className="relative z-[1] rounded-full bg-transparent py-5 text-sm md:text-base"
                  onClick={() => handleCTAClick('hero', 'primary-glowing')}
                >
                  <Link to="/passports" className="bg-transparent font-semibold text-white">
                    {t('hero.cta')}
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
                  {t('hero.telegramCta')}
                </a>
              </div>
            </div>
          </div>

          {/* Right: CardSwap (visible on md+) */}
          <div className="hidden translate-x-[-45px] translate-y-[-65px] md:block">
            <div className="relative justify-self-end md:h-[580px] md:w-[538px]">
              {reduceMotion ? (
                <CardSwapShell
                  width={CARD_DIMENSIONS.desktop.width}
                  height={CARD_DIMENSIONS.desktop.height}
                  cardDistance={50}
                  verticalDistance={60}
                >
                  {heroCards.map((card, index) => (
                    <HeroCard key={card.key} variant="desktop" card={card} index={index} />
                  ))}
                </CardSwapShell>
              ) : (
                <CardSwapLazy
                  width={CARD_DIMENSIONS.desktop.width}
                  height={CARD_DIMENSIONS.desktop.height}
                  cardDistance={50}
                  verticalDistance={60}
                  delay={5000}
                  easing="linear"
                  pauseOnHover={false}
                >
                  {heroCards.map((card, index) => (
                    <HeroCard key={card.key} variant="desktop" card={card} index={index} />
                  ))}
                </CardSwapLazy>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
