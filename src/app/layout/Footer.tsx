import { motion, useReducedMotion } from 'framer-motion'
import { SendIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import subaTag from '@/assets/logos/suba/suba_tag.webp'
import { ComingSoonDialog } from '@/shared/ui/coming-soon-dialog'

const footerEase = [0.23, 1, 0.32, 1] as const

const Footer = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()

  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true)
  }, [])

  const currentYear = useMemo(
    () => new Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date()),
    [],
  )

  const reveal = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translate3d(0, 44px, 0)' },
    visible: {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
      transition: {
        duration: reduceMotion ? 0.18 : 0.56,
        ease: footerEase,
        staggerChildren: reduceMotion ? 0 : 0.06,
      },
    },
  }

  const itemReveal = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translate3d(0, 18px, 0)' },
    visible: {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
      transition: { duration: reduceMotion ? 0.16 : 0.34, ease: footerEase },
    },
  }

  const brandReveal = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translate3d(0, 30px, 0)' },
    visible: {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
      transition: { duration: reduceMotion ? 0.16 : 0.62, ease: footerEase },
    },
  }

  return (
    <motion.footer
      aria-labelledby="site-footer-title"
      className="bg-background relative overflow-hidden pt-10 sm:pt-14 md:pt-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.28, margin: '0px 0px -120px 0px' }}
    >
      <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-8">
        <motion.h2
          id="site-footer-title"
          variants={brandReveal}
          className="text-primary translate-y-[0.08em] text-center text-[clamp(3.65rem,15vw,15rem)] leading-[0.78] font-black tracking-normal text-balance select-none"
          translate="no"
        >
          Passport.ET
        </motion.h2>
      </div>

      <motion.div
        variants={reveal}
        className="bg-primary text-primary-foreground relative z-10 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/35"
        />

        <div className="mx-auto flex min-h-[28rem] max-w-[100rem] flex-col px-4 py-16 sm:px-6 sm:py-20 md:min-h-[30rem] lg:px-8">
          <motion.div
            variants={itemReveal}
            className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center text-center"
          >
            <p className="max-w-7xl text-2xl leading-tight font-medium text-pretty sm:text-3xl md:text-[2.25rem]">
              {t('footer.tagline')}
            </p>

            <a
              href="https://t.me/passportdotet_group"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:bg-brand-2 focus-visible:ring-ring focus-visible:ring-offset-primary mt-8 inline-flex h-14 min-w-0 items-center justify-center gap-3 rounded-full bg-white px-8 text-base font-bold shadow-[0_1px_0_hsl(0_0%_100%_/_0.38)_inset,0_18px_42px_hsl(160_100%_18%_/_0.24)] transition-[transform,background-color,box-shadow] duration-150 ease-out hover:shadow-[0_1px_0_hsl(0_0%_100%_/_0.42)_inset,0_22px_48px_hsl(160_100%_16%_/_0.28)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
              aria-label={`${t('footer.joinTelegram')} (opens in a new tab)`}
            >
              <SendIcon className="size-6 shrink-0" aria-hidden="true" strokeWidth={2.2} />
              <span className="truncate">{t('footer.joinTelegram')}</span>
            </a>
          </motion.div>

          <motion.div variants={itemReveal} className="mt-16 border-t border-white/35 pt-6">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <p className="text-base leading-none font-medium text-white/95 sm:text-lg">
                ©{currentYear} Passport.ET. All rights reserved.
              </p>

              <div className="flex items-center justify-center gap-5 text-sm leading-none font-medium text-white/80 sm:justify-end">
                <button
                  type="button"
                  onClick={handleOpenDialog}
                  className="focus-visible:ring-offset-primary rounded-sm underline-offset-4 transition-colors duration-150 ease-out hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
                >
                  {t('footer.terms')}
                </button>
                <button
                  type="button"
                  onClick={handleOpenDialog}
                  className="focus-visible:ring-offset-primary rounded-sm underline-offset-4 transition-colors duration-150 ease-out hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
                >
                  {t('footer.privacy')}
                </button>
              </div>
            </div>

            <a
              href="https://suba.et/"
              target="_blank"
              rel="noreferrer"
              className="group focus-visible:ring-ring focus-visible:ring-offset-primary mx-auto mt-7 flex h-14 w-fit max-w-full items-center overflow-hidden transition-[transform,background-color,box-shadow] duration-150 ease-out"
              aria-label="A Suba Software Product (opens in a new tab)"
            >
              <img
                src={subaTag}
                alt=""
                width="220"
                height="32"
                loading="lazy"
                decoding="async"
                className="h-10 w-auto shrink-0"
                aria-hidden="true"
              />
            </a>
          </motion.div>
        </div>
      </motion.div>

      <div aria-hidden="true" className="bg-brand-5 h-11 md:h-12" />
      <div aria-hidden="true" className="bg-brand-2 h-10 md:h-11" />

      <ComingSoonDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </motion.footer>
  )
}

export default Footer
