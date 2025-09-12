import React from 'react'
import { Container } from '@/shared/ui/container'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { motion } from 'framer-motion'
import { M } from '@/shared/lib/motion'

const TABS = [
  { key: 'check', label: 'How to Check Passport' },
  { key: 'apply', label: 'How to Apply for Passport' },
  { key: 'renew', label: 'How to Renew Passport' },
  { key: 'urgent', label: 'How to Apply for Urgent Passport' },
]

export function VideoTabs() {
  const [tab, setTab] = React.useState(TABS[0].key)
  return (
    <section className="py-12 sm:py-16" id="videos">
      <Container>
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Video Demonstrations</h2>
          <p className="mt-2 text-neutral-600">
            Learn how to check if your passport is ready and how to get services provided by Immigration & Nationality Affairs.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={[
                  'rounded-full border px-3 py-1 text-sm',
                  tab === t.key
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 text-neutral-800 hover:bg-neutral-100',
                ].join(' ')}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>

        <Card className="mx-auto mt-8 max-w-5xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{TABS.find((t) => t.key === tab)?.label}</h3>
              <span className="text-sm text-neutral-500">Sample</span>
            </div>
          </CardHeader>
          <CardContent>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: M.duration, ease: M.ease }}
              className="aspect-video w-full overflow-hidden rounded-lg bg-neutral-100"
            >
              <div className="flex h-full w-full items-center justify-center">
                <button className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-neutral-900"><path d="M8 5v14l11-7z"/></svg>
                  <span className="sr-only">Play video</span>
                </button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </Container>
    </section>
  )
}

export default VideoTabs

