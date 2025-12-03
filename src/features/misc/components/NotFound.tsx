import { Link, useNavigate } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { Compass, Home, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/button'
import { Seo } from '@/shared/ui/Seo'

export function NotFound() {
  const { t } = useTranslation('errors')
  const navigate = useNavigate()
  const reduce = useReducedMotion()

  return (
    <main className="relative isolate">
      <Seo
        title={t('notFound.seo.title')}
        description={t('notFound.seo.description')}
        noindex
      />

      {/* Ambient gradient blobs */}
      <div
        aria-hidden
        className="from-primary/20 via-secondary/10 dark:from-primary/15 dark:via-secondary/10 pointer-events-none absolute inset-x-0 -top-24 -z-10 h-72 bg-gradient-to-tr to-transparent blur-2xl"
      />

      <section className="container mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        {/* Icon backdrop */}
        <motion.div
          aria-hidden
          initial={{ rotate: 0, opacity: 0.12, y: reduce ? 0 : -6 }}
          animate={{ rotate: 360, opacity: 0.12, y: 0 }}
          transition={{ duration: reduce ? 0 : 24, repeat: Infinity, ease: 'linear' }}
          className="bg-primary/10 text-primary mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl sm:h-28 sm:w-28"
        >
          <Compass className="h-12 w-12 sm:h-14 sm:w-14" />
        </motion.div>

        {/* 404 headline */}
        <p className="text-muted-foreground mb-2 text-sm tracking-widest">
          {t('notFound.errorCode')}
        </p>
        <h1 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          {t('notFound.title')}
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-prose text-base text-balance sm:text-lg">
          {t('notFound.description')}
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto" leftIcon={<Home size={18} />}>
              {t('notFound.goHome')}
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                window.history.back()
              } else {
                navigate({ to: '/' })
              }
            }}
            leftIcon={<RotateCcw size={18} />}
          >
            {t('notFound.goBack')}
          </Button>
        </div>

        {/* Helpful tips */}
        <div className="text-muted-foreground mx-auto mt-6 max-w-prose text-xs sm:text-sm">
          <p>{t('notFound.hint')}</p>
        </div>
      </section>
    </main>
  )
}

export default NotFound
