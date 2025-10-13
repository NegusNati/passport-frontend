import LandingImageOne from '@/assets/landingImages/cardImages/Landing_img_1.webp'
import LandingImageTwo from '@/assets/landingImages/cardImages/Landing_img_2.webp'
import LandingImageThree from '@/assets/landingImages/cardImages/Landing_img_3.webp'
import { Card, CardSwap } from '@/shared/components/common'

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
    description: "Join the Telegram group to learn from others' experiences.",
    image: LandingImageThree,
    alt: 'Collage of community members sharing travel tips',
  },
] as const

export function HeroCardsMobile() {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-2 md:hidden translate-y-[-40px]">
      <div className="relative mx-auto h-[400px] w-full">
        <CardSwap
          width={440}
          height={580}
          cardDistance={60}
          verticalDistance={70}
          delay={5000}
          pauseOnHover={true}
        >
          {HERO_CARDS.map((card) => (
            <Card
              key={card.title}
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
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/15 to-primary/5" />
                <div className="absolute inset-x-0 bottom-0 space-y-2 p-4 sm:p-6">
                  <h3 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/90">{card.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </CardSwap>
      </div>
    </section>
  )
}
