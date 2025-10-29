import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import AmharicLetters from '@/assets/landingImages/amharic_letters.svg'
import AmharicCallander from '@/assets/landingImages/AmharicCallander.svg'
import LookingGuyImage from '@/assets/landingImages/dude.png'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'

const CARDS = [
  {
    key: 'creative-support',
    image: LookingGuyImage,
    imageAlt: 'Illustration of a person projecting a message through a megaphone.',
    title: 'Creative Included',
    copy: 'Custom illustrations and animations designed for your campaign.',
    callout: null,
  },
  {
    key: 'calendar-highlights',
    image: AmharicCallander,
    imageAlt: 'Ethiopian calendar illustration showcasing highlighted campaign slots.',
    title: 'Schedule Around Key Dates',
    copy: 'Anchor your ads to national events and travel seasons for maximized reach.',
    callout: null,
  },
  {
    key: 'reporting',
    image: AmharicLetters,
    imageAlt: 'Amharic letters',
    title: 'Insightful Reporting',
    copy: 'Get shareable performance snapshots for every placement—impressions, clicks, and conversion-ready leads.',
    callout: 'Performance dashboards delivered with every buy.',
  },
]

export function AdvertiseSection() {
  return (
    <section id="advertise" className="py-10 sm:py-14">
      <Container>
        <div className="grid gap-6 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => {
            switch (card.key) {
              case 'creative-support':
                return (
                  <div
                    key={card.key}
                    className="bg-primary/10 border-primary flex items-center justify-end rounded-lg border px-0 py-4"
                  >
                    <img
                      src={card.image as string}
                      alt={card.imageAlt as string}
                      className="h-auto w-full max-w-[220px] translate-x-2 object-contain drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>
                )

              case 'calendar-highlights':
                return (
                  <div
                    key={card.key}
                    className="bg-primary/10 border-primary flex items-center justify-center overflow-hidden rounded-md border px-0 py-4"
                  >
                    <img
                      src={card.image as string}
                      alt={card.imageAlt as string}
                      className="h-auto w-full max-w-[260px] translate-y-12 scale-115 object-fill"
                      loading="lazy"
                      style={{ maxHeight: '180px', width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )

              case 'reporting':
                return (
                  <div
                    key={card.key}
                    className="bg-primary/10 border-primary flex items-center justify-center rounded-md border px-0 py-4"
                  >
                    <img
                      src={card.image as string}
                      alt={card.imageAlt as string}
                      className="h-auto w-full max-w-[260px] scale-115 object-contain"
                      loading="lazy"
                    />
                  </div>
                )

              default:
                return (
                  <article
                    key={card.key}
                    className="bg-muted border-primary flex h-full flex-col justify-between rounded-lg border p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg"
                  >
                    <div className="space-y-4">
                      {card.image ? (
                        <div className="flex items-center justify-center">
                          <img
                            src={card.image}
                            alt={card.imageAlt}
                            className="h-auto w-full max-w-[220px] object-contain drop-shadow-sm"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="bg-muted flex h-full w-full items-center justify-center rounded-lg text-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                      <div className="space-y-2 text-center">
                        <h3 className="text-foreground text-lg font-semibold">{card.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{card.copy}</p>
                      </div>
                    </div>
                  </article>
                )
            }
          })}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-5 text-center lg:text-left">
            <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
              Advertise with Passport.ET
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm sm:text-base">
              Reach millions of Ethiopian citizens and travelers through the official passport
              readiness portal. Campaigns include strategic placement, platform-wide promotion, and
              creative tailored to your brand voice.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
              <Button
                asChild
                size="md"
                rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                <Link to="/advertisment">Contact Us Now</Link>
              </Button>
              <p className="text-muted-foreground text-xs font-medium tracking-[0.3em] uppercase">
                Limited slots available
              </p>
            </div>
          </div>

          <div className="text-muted-foreground space-y-6 text-sm sm:text-base">
            <p>
              Our advertising package delivers top-of-page visibility across Passport.ET with
              premium placements on the homepage, insights hub, and passport status results pages.
            </p>
            <div className="space-y-2">
              <p className="text-foreground text-xl font-semibold">Ad Graphics Design Included</p>
              <p>
                Collaborate with our in-house designers for static or animated creatives complete
                with copy, CTA, and localization for Amharic- and English-speaking audiences.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default AdvertiseSection
