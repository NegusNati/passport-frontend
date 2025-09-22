import React from 'react'
import { Container } from '@/shared/ui/container'
import { Card } from '@/shared/ui/card'
import { motion } from 'framer-motion'
import { M } from '@/shared/lib/motion'

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
  const [tab, setTab] = React.useState<(typeof TABS)[number]['key']>(TABS[0]?.key)
  const activeTab = React.useMemo(() => TABS.find((t) => t.key === tab) ?? TABS[0], [tab])
  const embedUrl = React.useMemo(() => toEmbedUrl(activeTab?.youtubeLink), [activeTab?.youtubeLink])

  return (
    <section className="py-12 sm:py-16" id="videos">
      <Container>
        <header className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Video Demonstrations</h2>
          <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
            Here is how you can check if your passport is ready or how you can get services provided by
            <span className="block font-semibold tracking-wide text-neutral-800 sm:inline"> Immigration &amp; Nationality Affairs</span>.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <div className="flex gap-1 overflow-x-auto  scrollbar-thumb-muted scrollbar-track-transparent sm:overflow-visible scrollbar-hide px-1 w-full max-w-full sm:justify-center">
              {TABS.map((t) => {
                const isActive = t.key === activeTab.key
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={[
                      'rounded-full border px-4 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
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
          <div className="h-full rounded-[32px] bg-gradient-to-b from-muted via-card to-card  sm:px-3 sm:py-4">
            <div className="grid gap-6">
             
              <motion.div
                key={activeTab.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: M.duration, ease: M.ease }}
                className="overflow-hidden rounded-xl border border-border shadow-lg"
              >
                {embedUrl ? (
                  <div className="relative aspect-video w-full bg-black">
                    <iframe
                      title={activeTab.label}
                      src={embedUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-neutral-100">
                    <div className="text-center text-sm text-neutral-500">
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
