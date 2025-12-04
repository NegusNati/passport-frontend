import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { M } from '@/shared/lib/motion'
import { Container } from '@/shared/ui/container'

interface FaqItem {
  q: string
  a: string
}

export function FAQsSection() {
  const { t } = useTranslation('landing')
  const [activeIndex, setActiveIndex] = useState<number | null>(0)
  const shouldReduceMotion = useReducedMotion()

  // Get FAQ items from translations
  const faqs = t('faqs.items', { returnObjects: true }) as FaqItem[]

  // Memoized toggle handler
  const toggleIndex = useCallback((index: number) => {
    setActiveIndex((current) => (current === index ? null : index))
  }, [])

  return (
    <section id="faqs" className="py-16 sm:py-20">
      <Container className="my-4">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t('faqs.title')}</h2>
            <p className="text-muted-foreground max-w-sm text-sm sm:text-base">
              {t('faqs.subtitle')}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isActive = activeIndex === index
              return (
                <motion.article
                  key={index}
                  layout={!shouldReduceMotion}
                  className={[
                    'bg-card/90 text-card-foreground rounded-none transition-shadow',
                  ].join(' ')}
                  animate={{ scale: isActive ? 1.01 : 1 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : M.duration,
                    ease: M.ease,
                  }}
                  whileHover={!shouldReduceMotion ? { scale: 1.01 } : {}}
                >
                  <button
                    type="button"
                    onClick={() => toggleIndex(index)}
                    aria-expanded={isActive}
                    className="bg-muted flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-foreground text-sm font-medium sm:text-base">
                      {faq.q}
                    </span>
                    <motion.div
                      className="relative flex h-4 w-4 items-center justify-center"
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : M.duration,
                        ease: M.ease,
                      }}
                    >
                      <Plus className="text-muted-foreground h-4 w-4" aria-hidden="true" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : M.duration * 1.5,
                          ease: M.ease,
                          opacity: { duration: shouldReduceMotion ? 0 : M.duration },
                        }}
                        className="border-border overflow-hidden border-t"
                      >
                        <motion.div
                          className="text-muted-foreground px-5 py-4 text-sm sm:text-base"
                          initial={{ y: shouldReduceMotion ? 0 : -10 }}
                          animate={{ y: 0 }}
                          transition={{
                            duration: shouldReduceMotion ? 0 : M.duration,
                            delay: shouldReduceMotion ? 0 : M.duration * 0.3,
                            ease: M.ease,
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
