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
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Video Demonstrations</h2>
          <p className="mt-2 text-neutral-600">
            Here is how you can check if your passport is ready or how you can get services provided by
            <span className="block font-semibold tracking-wide text-neutral-800 sm:inline"> Immigration &amp; Nationality Affairs</span>.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {TABS.map((t) => {
              const isActive = t.key === activeTab.key
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={[
                    'rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
                    'shadow-sm',
                    isActive
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm shadow-neutral-900/20'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50',
                  ].join(' ')}
                  type="button"
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </header>

        <Card className="mx-auto mt-10 w-full max-w-6xl rounded-[32px] border-neutral-200 bg-white/95 shadow-xl shadow-neutral-200/70">
          <div className="h-full rounded-[32px] bg-gradient-to-b from-neutral-50 via-white to-white px-4 py-6 sm:px-8 sm:py-10">
            <div className="grid gap-6">
             
              <motion.div
                key={activeTab.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: M.duration, ease: M.ease }}
                className="overflow-hidden rounded-2xl border border-neutral-100 shadow-lg"
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
