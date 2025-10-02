import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import { M } from '@/shared/lib/motion'
import { Card } from '@/shared/ui/card'
import { Container } from '@/shared/ui/container'

const TABS = [
  {
    key: 'check',
    label: 'How to Check Passport',
    youtubeLink: 'https://youtu.be/bLhnw4hYZZU?si=JxYxrbj3-_y5xLy_',
  },
  {
    key: 'apply',
    label: 'How to Apply for Passport',
    youtubeLink: 'https://youtu.be/0tnp8F5xx9Q',
  },
  {
    key: 'renew',
    label: 'How to Renew Passport',
    youtubeLink: 'https://youtu.be/76YxXwvDtX0',
  },
  {
    key: 'urgent',
    label: 'How to Apply for Urgent Passport',
    youtubeLink: 'https://youtu.be/bLhnw4hYZZU?si=JxYxrbj3-_y5xLy_',
  },
] as const

function toEmbedUrl(url?: string) {
  if (!url) return null

  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v') ?? parsed.pathname.split('/').pop()
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null
    }
  } catch (error) {
    console.warn('Invalid YouTube URL provided for VideoTabs:', url, error)
  }

  return null
}

export function VideoTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>(TABS[0]?.key)
  const activeTab = useMemo(() => TABS.find((t) => t.key === tab) ?? TABS[0], [tab])
  const embedUrl = useMemo(() => toEmbedUrl(activeTab?.youtubeLink), [activeTab?.youtubeLink])

  return (
    <section className="py-12 sm:py-16" id="videos">
      <Container>
        <header className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Video Demonstrations
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-3xl">
            Here is how you can check if your passport is ready or how you can get services provided
            by
            <span className="block font-semibold tracking-wide text-foreground sm:inline">
              {' '}
              Immigration &amp; Nationality Affairs
            </span>
            .
          </p>
          <div className="mt-6 flex items-center justify-center">
            <div className="scrollbar-thumb-muted scrollbar-track-transparent scrollbar-hide flex w-full max-w-full gap-1 overflow-x-auto px-1 sm:justify-center sm:overflow-visible">
              {TABS.map((t) => {
                const isActive = t.key === activeTab.key
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={[
                      'focus-visible:ring-ring rounded-full border px-4 py-1 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      'shadow-sm',
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
                      'whitespace-nowrap',
                    ].join(' ')}
                    type="button"
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>
        </header>

        <Card className="mx-auto mt-10 w-full max-w-6xl rounded-[32px]">
          <div className="from-muted via-card to-card h-full rounded-[32px] bg-gradient-to-b sm:px-3 sm:py-4">
            <div className="grid gap-6">
              <motion.div
                key={activeTab.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: M.duration, ease: M.ease }}
                className="border-border overflow-hidden rounded-xl border shadow-lg"
              >
                {embedUrl ? (
                  <div className="relative aspect-video w-full bg-card">
                    <iframe
                      title={activeTab.label}
                      src={embedUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                ) : (
                  <div className="bg-muted flex aspect-video w-full items-center justify-center">
                    <div className="text-muted-foreground text-center text-sm">
                      <p>No video available for this topic yet.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  )
}

export default VideoTabs
