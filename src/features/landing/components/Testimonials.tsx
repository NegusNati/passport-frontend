import * as React from 'react'
import { useTranslation } from 'react-i18next'

type Quote = { name: string; quote: string }

function CardItem({ q }: { q: Quote }) {
  return (
    <div className="bg-primary/10 hover:bg-primary border-primary hover:border-brand-8/30 text-forground hover:text-background rounded-xl border px-3 py-4 shadow-sm transition-colors md:px-4 md:py-4">
      <p className="text-[13px] leading-relaxed italic">“{q.quote}”</p>
      <p className="mt-2 text-[13px] font-medium">{q.name}</p>
    </div>
  )
}

// Vertical marquee variant kept in history; re-enable if needed for md+ layouts.

function HorizontalMarqueeDual({
  items,
  durationA = 22,
  durationB = 26,
}: {
  items: Quote[]
  durationA?: number
  durationB?: number
}) {
  const half = Math.ceil(items.length / 2)
  const rowA = items.slice(0, half)
  const rowB = items.slice(half)
  const a = React.useMemo(() => [...rowA, ...rowA], [rowA])
  const b = React.useMemo(
    () => [...(rowB.length ? rowB : rowA), ...(rowB.length ? rowB : rowA)],
    [rowA, rowB],
  )

  return (
    <div className="relative w-full overflow-hidden rounded-xl p-2">
      {/* left/right fade (theme-aware, over content) */}
      <div className="from-background pointer-events-none absolute top-0 left-0 z-10 h-full w-10 bg-gradient-to-r to-transparent" />
      <div className="from-background pointer-events-none absolute top-0 right-0 z-10 h-full w-10 bg-gradient-to-l to-transparent" />

      <div className="grid w-full items-center gap-3 overflow-hidden">
        <ul
          aria-label="User testimonials row A"
          className="marquee marquee-pause animate-marquee-x relative flex w-max gap-3"
          style={{ '--marquee-duration': `${durationA}s` } as React.CSSProperties}
        >
          {a.map((q, i) => (
            <li key={`ha-${q.name}-${i}`} className="max-w-[280px] min-w-[200px] flex-shrink-0">
              <CardItem q={q} />
            </li>
          ))}
        </ul>
        <ul
          aria-label="User testimonials row B"
          className="marquee marquee-pause animate-marquee-x-reverse relative flex w-max gap-3"
          style={{ '--marquee-duration': `${durationB}s` } as React.CSSProperties}
        >
          {b.map((q, i) => (
            <li key={`hb-${q.name}-${i}`} className="max-w-[280px] min-w-[200px] flex-shrink-0">
              <CardItem q={q} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Testimonials() {
  const { t } = useTranslation('landing')
  
  // Get quotes from translations
  const quotes = t('testimonials.quotes', { returnObjects: true }) as Quote[]

  return (
    <aside className="relative mt-4 py-4 md:mt-0">
      {/* Mobile: horizontal marquee */}
      <div className="relative">
        {/* left fade */}
        <div
          className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r to-transparent"
          aria-hidden
        />
        <HorizontalMarqueeDual items={quotes} />
        {/* right fade */}
        <div
          className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l to-transparent"
          aria-hidden
        />
      </div>
    </aside>
  )
}

export default Testimonials
