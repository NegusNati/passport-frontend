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
      <h2 id="advertise-heading" className="sr-only">
        Advertise With Passport.ET
      </h2>
      <div className="grid gap-5 overflow-hidden sm:grid-cols-2 lg:gap-6">
        {CARDS.map((card) => (
          <figure
            key={card.key}
            className="border-primary/35 bg-background/70 flex min-h-[220px] items-center justify-center overflow-hidden rounded-lg border p-5 sm:min-h-[280px] lg:min-h-[360px] lg:p-8"
          >
            <img
              src={card.image}
              alt={card.imageAlt}
              width={card.width}
              height={card.height}
              className={[
                'h-auto w-full object-contain',
                card.key === 'calendar-highlights'
                  ? 'max-w-[300px] sm:max-w-[360px] lg:max-w-[430px]'
                  : 'max-w-[260px] sm:max-w-[320px] lg:max-w-[390px]',
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
