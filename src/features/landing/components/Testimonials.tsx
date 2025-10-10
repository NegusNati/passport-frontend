import * as React from 'react'

type Quote = { name: string; quote: string }

const QUOTES: Quote[] = [
  {
    name: 'Abebe Kebede',
    quote:
      'The online status check saved me so much time. I knew exactly when my passport was ready for collection!',
  },
  {
    name: 'Tigist Haile',
    quote:
      'The process was straightforward and the site was very easy to use. I got my passport faster than I expected.',
  },
  {
    name: 'Yohannes Gebre',
    quote:
      'The SMS notification feature is fantastic. I didn’t have to keep checking the website for updates.',
  },
  {
    name: 'Dawit Mengistu',
    quote:
      'As a frequent traveler, I appreciate how efficient the process has become and how easy it is to get informed here.',
  },
  {
    name: 'Meron Alemu',
    quote:
      'The customer support team on Telegram was incredibly helpful when I had questions about my application.',
  },
  {
    name: 'Freiwhot Tadesse',
    quote:
      'I was impressed by the user‑friendly interface. It made checking my passport status a breeze.',
  },
  {
    name: 'Natnael Tadesse',
    quote:
      'I loved how easy it was to check my passport status. I appreciate the team’s help and support.',
  },
  {
    name: 'Bereket Tadesse',
    quote:
      'I appreciate the transparency in the process. The timeline provided was accurate and helpful.',
  },
]

function CardItem({ q }: { q: Quote }) {
  return (
    <div className="bg-primary/10 hover:bg-primary border border-primary hover:border-brand-8/30 rounded-xl px-3 py-4 shadow-sm transition-colors md:px-4 md:py-4 text-forground hover:text-background">
      <p className="text-[13px] leading-relaxed italic">“{q.quote}”</p>
      <p className="mt-2 text-[13px] font-medium">{q.name}</p>
    </div>
  )
}

// Vertical marquee variant kept in history; re‑enable if needed for md+ layouts.

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
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-10 bg-gradient-to-l from-background to-transparent" />

      
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
  return (
    <aside className="relative mt-4 md:mt-0 py-4">
      {/* Mobile: horizontal marquee */}
      <div className="relative ">
        {/* left fade */}
        <div
          className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r to-transparent"
          aria-hidden
        />
        <HorizontalMarqueeDual items={QUOTES} />
        {/* right fade */}
        <div
          className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l to-transparent"
          aria-hidden
        />
      </div>

      {/* Desktop: vertical marquee */}
      {/* <div className="relative hidden md:block"> */}
        {/* top fade (fixed) */}
        {/* <div
          className="from-background pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b to-transparent"
          aria-hidden
        /> */}
        {/* <VerticalMarqueeDual items={QUOTES} /> */}
        {/* bottom fade (make direction consistent) */}
        {/* <div
          className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent"
          aria-hidden
        />
      </div> */}
    </aside>
  )
}

export default Testimonials
