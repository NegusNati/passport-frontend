import React from 'react'
import { Container } from '@/shared/ui/container'
import { Minus, Plus } from 'lucide-react'

const FAQS = [
  {
    q: 'How do I check if my passport is ready?',
    a: 'Use your reference number or full name search to get the latest readiness status pulled from official updates.',
  },
  {
    q: 'What information do I need to use this portal?',
    a: 'Either your reference number or your full legal name. Optionally, you can filter by city where available.',
  },
  {
    q: 'Is Passport.ET an official service?',
    a: 'Passport.ET is not an official government website. It’s a community tool focused on checking readiness and sharing insights.',
  },
  {
    q: 'How accurate is the passport status shown?',
    a: 'Statuses are based on the latest available sync. For time-sensitive travel, confirm with official channels before visiting in person.',
  },
  {
    q: 'Can I apply for a new passport through this portal?',
    a: 'No. The portal is built only for checking readiness and accessing insights. To apply, you must follow official application channels.',
  },
]

export function FAQsSection() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(0)

  function toggleIndex(index: number) {
    setActiveIndex((current) => (current === index ? null : index))
  }

  return (
    <section id="faqs" className="py-16 sm:py-20">
      <Container className='my-4'>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">FAQs</h2>
            <p className="max-w-sm text-sm text-neutral-600 sm:text-base">
              Find reliable information about how Passport.ET works and what to expect.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isActive = activeIndex === index
              return (
                <article
                  key={faq.q}
                  className={[
                    'rounded-lg  bg-white/90 shadow-sm transition-all duration-300 ease-in-out',
                    isActive ? 'shadow-lg ring-1 ring-neutral-900/10 bg-neutral-50' : 'hover:shadow-md',
                  ].join(' ')}
                >
                  <button
                    type="button"
                    onClick={() => toggleIndex(index)}
                    aria-expanded={isActive}
                    className="flex w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 bg-neutral-50"
                  >
                    <span className="text-sm font-medium text-neutral-900 sm:text-base">
                      {faq.q}
                    </span>
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      <Plus
                        className={`absolute h-4 w-4 text-neutral-700 transition-all duration-200 ${
                          isActive ? 'rotate-180 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'
                        }`}
                        aria-hidden="true"
                      />
                      <Minus
                        className={`absolute h-4 w-4 text-neutral-700 transition-all duration-200 ${
                          isActive ? 'rotate-0 opacity-100 scale-100' : '-rotate-180 opacity-0 scale-75'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                  <div
                    className={`border-t border-neutral-200 overflow-hidden transition-all duration-300 ease-in-out ${
                      isActive
                        ? 'max-h-96 opacity-100 pb-5'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-5 py-4 text-sm text-neutral-600 sm:text-base">
                      {faq.a}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default FAQsSection
