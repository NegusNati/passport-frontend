import { Container } from '@/shared/ui/container'
import { Button } from '@/shared/ui/button'
import { ArrowRight } from 'lucide-react'
import LookingGuyImage from '@/assets/landingImages/looking_guy.png'
import CalendarImage from '@/assets/landingImages/calander_image.png'

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
    image: CalendarImage,
    imageAlt: 'Ethiopian calendar illustration showcasing highlighted campaign slots.',
    title: 'Schedule Around Key Dates',
    copy: 'Anchor your ads to national events and travel seasons for maximized reach.',
    callout: null,
  },
  {
    key: 'reporting',
    image: null,
    imageAlt: null,
    title: 'Insightful Reporting',
    copy: 'Get shareable performance snapshots for every placement—impressions, clicks, and conversion-ready leads.',
    callout: 'Performance dashboards delivered with every buy.',
  },
]

export function AdvertiseSection() {
  return (
    <section id="advertise" className="py-10 sm:py-14">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3  ">
          {CARDS.map((card) => {
            switch (card.key) {
              case 'creative-support':
                return (
                  
                    <div className="flex items-center justify-end bg-[#CDCDCD1A] rounded-lg py-4 px-0">
                      <img
                        src={card.image as string}
                        alt={card.imageAlt as string}
                        className="h-auto w-full max-w-[220px] object-contain drop-shadow-sm translate-x-2"
                        loading="lazy"
                      />
                    </div>
  
  
                );

              case 'calendar-highlights':
                return (
                  <div className="flex items-center justify-center bg-[#CDCDCD1A] rounded-lg py-4 px-0">
                  <img
                    src={card.image as string}
                    alt={card.imageAlt as string}
                    className="h-auto w-full max-w-[220px] object-contain scale-105 "
                    loading="lazy"
                  />
                </div>
                );

              case 'reporting':
                return (
                  <div className="flex items-center justify-center bg-[#CDCDCD1A] rounded-lg">
                  
                </div>
                );

              default:
                return (
                  <article
                    key={card.key}
                    className="flex h-full flex-col justify-between rounded-lg bg-neutral-50 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg"
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
                        <div className="flex w-full h-full items-center justify-center rounded-lg bg-neutral-200 text-center">
                          <span className="text-neutral-500">No image</span>
                        </div>
                      )}
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold text-neutral-900">{card.title}</h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">{card.copy}</p>
                      </div>
                    </div>
                  </article>
                );
            }
          })}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-5 text-center lg:text-left">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Advertise with Passport.ET</h2>
            <p className="text-sm text-neutral-600 sm:text-base max-w-sm">
              Reach millions of Ethiopian citizens and travelers through the official passport readiness portal. Campaigns include
              strategic placement, platform-wide promotion, and creative tailored to your brand voice.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
              <Button size="md" rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>Contact Us Now</Button>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-400">Limited slots available</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-neutral-600 sm:text-base">
            <p>
              Our advertising package delivers top-of-page visibility across Passport.ET with premium placements on the homepage,
              insights hub, and passport status results pages.
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-neutral-900 text-xl">Ad Graphics Design Included</p>
              <p>
                Collaborate with our in-house designers for static or animated creatives complete with copy, CTA, and localization
                for Amharic- and English-speaking audiences.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default AdvertiseSection
