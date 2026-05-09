import { ArrowUpRight } from 'lucide-react'

import AmharicLetters from '@/assets/landingImages/amharic_letters.svg'
import AmharicCallander from '@/assets/landingImages/AmharicCallander.svg'

const CARDS = [
  {
    key: 'reporting',
    image: AmharicLetters,
    imageAlt: 'Circular arrangement of Amharic letters.',
    width: 351,
    height: 351,
  },
  {
    key: 'calendar-highlights',
    image: AmharicCallander,
    imageAlt: 'Ethiopian calendar illustration showcasing highlighted campaign slots.',
    width: 339,
    height: 319,
  },
]

export function AdvertiseSection() {
  return (
    <section id="advertise" className="py-10 sm:py-14" aria-labelledby="advertise-heading">
      <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,0.58fr)_minmax(0,0.58fr)] lg:items-center lg:gap-5 xl:gap-6">
        <div className="max-w-xl space-y-5 py-2 text-left sm:space-y-6 lg:pr-8">
          <h2
            id="advertise-heading"
            className="text-foreground max-w-[11ch] text-3xl leading-tight font-semibold tracking-normal sm:max-w-[14ch] sm:text-4xl lg:text-[2.4rem]"
          >
            Ethiopian Calendar and Ge’ez Numerals
          </h2>
          <p className="text-muted-foreground max-w-[31rem] text-lg leading-snug sm:text-xl lg:text-[1.38rem]">
            A simple Ethiopian calendar that helps you check dates, holidays, Wengel readings, and
            navigate months in both Ethiopian and Ge’ez numerals.
          </p>
          <a
            href="https://calendar.passport.et/"
            target="_blank"
            rel="noreferrer"
            className="text-primary focus-visible:ring-ring inline-flex w-fit items-center gap-2 rounded-md text-xl font-medium transition-colors hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Visit Site
            <ArrowUpRight className="h-6 w-6" aria-hidden="true" strokeWidth={1.8} />
          </a>
        </div>

        {CARDS.map((card) => (
          <figure
            key={card.key}
            className="border-primary/35 bg-background/70 flex min-h-[220px] items-center justify-center overflow-hidden rounded-lg border p-5 sm:min-h-[280px] lg:min-h-[330px] xl:min-h-[360px] xl:p-8"
          >
            <img
              src={card.image}
              alt={card.imageAlt}
              width={card.width}
              height={card.height}
              className={[
                'h-auto w-full object-contain',
                card.key === 'calendar-highlights'
                  ? 'max-w-[300px] sm:max-w-[360px] lg:max-w-[350px] xl:max-w-[430px]'
                  : 'max-w-[260px] sm:max-w-[320px] lg:max-w-[310px] xl:max-w-[390px]',
              ].join(' ')}
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </section>
  )
}

export default AdvertiseSection
