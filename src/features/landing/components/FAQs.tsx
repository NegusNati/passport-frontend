import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Container } from '@/shared/ui/container'
import { Plus } from 'lucide-react'
import { M } from '@/shared/lib/motion'

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
    a: "Passport.ET is not an official government website. It's a community tool focused on checking readiness and sharing insights.",
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
  const shouldReduceMotion = useReducedMotion()

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
                <motion.article
                  key={faq.q}
                  layout={!shouldReduceMotion}
                  className="rounded-lg bg-white/90 shadow-sm"
                  animate={{
                    backgroundColor: isActive ? 'rgb(249 250 251 / 0.9)' : 'rgb(255 255 255 / 0.9)',
                    boxShadow: isActive 
                      ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' 
                      : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    scale: isActive ? 1.01 : 1
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : M.duration,
                    ease: M.ease
                  }}
                  whileHover={!shouldReduceMotion ? {
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                  } : {}}
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
                    <motion.div 
                      className="relative w-4 h-4 flex items-center justify-center"
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{ 
                        duration: shouldReduceMotion ? 0 : M.duration,
                        ease: M.ease 
                      }}
                    >
                      <Plus
                        className="h-4 w-4 text-neutral-700"
                        aria-hidden="true"
                      />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: 'auto', 
                          opacity: 1 
                        }}
                        exit={{ 
                          height: 0, 
                          opacity: 0 
                        }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : M.duration * 1.5,
                          ease: M.ease,
                          opacity: { duration: shouldReduceMotion ? 0 : M.duration }
                        }}
                        className="overflow-hidden border-t border-neutral-200"
                      >
                        <motion.div 
                          className="px-5 py-4 text-sm text-neutral-600 sm:text-base"
                          initial={{ y: shouldReduceMotion ? 0 : -10 }}
                          animate={{ y: 0 }}
                          transition={{ 
                            duration: shouldReduceMotion ? 0 : M.duration,
                            delay: shouldReduceMotion ? 0 : M.duration * 0.3,
                            ease: M.ease
                          }}
                        >
                          {faq.a}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default FAQsSection
