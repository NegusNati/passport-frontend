
import * as React from 'react'

type Quote = { name: string; quote: string }

const QUOTES: Quote[] = [
  { name: 'Abebe Kebede', quote: 'The online status check saved me so much time. I knew exactly when my passport was ready for collection!' },
  { name: 'Tigist Haile', quote: 'The process was straightforward and the site was very easy to use. I got my passport faster than I expected.' },
  { name: 'Yohannes Gebre', quote: "The SMS notification feature is fantastic. I didn’t have to keep checking the website for updates." },
  { name: 'Dawit Mengistu', quote: 'As a frequent traveler, I appreciate how efficient the process has become and how easy it is to get informed here.' },
  { name: 'Meron Alemu', quote: 'The customer support team on Telegram was incredibly helpful when I had questions about my application.' },
  { name: 'Freiwhot Tadesse', quote: 'I was impressed by the user‑friendly interface. It made checking my passport status a breeze.' },
  { name: 'Natnael Tadesse', quote: "I loved how easy it was to check my passport status. I appreciate the team’s help and support." },
  { name: 'Bereket Tadesse', quote: 'I appreciate the transparency in the process. The timeline provided was accurate and helpful.' },
]

function CardItem({ q }: { q: Quote }) {
  return (
    <li className="rounded-lg border border-neutral-200 bg-white px-3 py-3 md:px-4 md:py-4 shadow-sm">
      <p className="text-[13px] leading-relaxed text-neutral-600 italic">“{q.quote}”</p>
      <p className="mt-2 text-[13px] font-medium text-neutral-900">{q.name}</p>
    </li>
  )
}

function VerticalMarqueeDual({ items, durationA = 28, durationB = 32 }: { items: Quote[]; durationA?: number; durationB?: number }) {
  const half = Math.ceil(items.length / 2)
  const colA = items.slice(0, half)
  const colB = items.slice(half)
  const a = React.useMemo(() => [...colA, ...colA], [colA])
  const b = React.useMemo(() => [...(colB.length ? colB : colA), ...(colB.length ? colB : colA)], [colA, colB])

  return (
    <div className="relative h-[26rem] overflow-hidden rounded-xl border border-neutral-200 bg-white p-2">
      {/* top/bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />

      <div className="grid h-full grid-cols-1 gap-3 md:grid-cols-2">
        <ul aria-label="User testimonials column A" className="relative grid gap-2 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
          style={{ animation: `marqueeY ${durationA}s linear infinite` }}>
          {a.map((q, i) => (
            <CardItem key={`a-${q.name}-${i}`} q={q} />
          ))}
        </ul>
        <ul aria-label="User testimonials column B" className="relative grid gap-2 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
          style={{ animation: `marqueeYReverse ${durationB}s linear infinite` }}>
          {b.map((q, i) => (
            <CardItem key={`b-${q.name}-${i}`} q={q} />
          ))}
        </ul>
      </div>
    </div>
  )
}

function HorizontalMarqueeDual({ items, durationA = 22, durationB = 26 }: { items: Quote[]; durationA?: number; durationB?: number }) {
  const half = Math.ceil(items.length / 2)
  const rowA = items.slice(0, half)
  const rowB = items.slice(half)
  const a = React.useMemo(() => [...rowA, ...rowA], [rowA])
  const b = React.useMemo(() => [...(rowB.length ? rowB : rowA), ...(rowB.length ? rowB : rowA)], [rowA, rowB])

  return (
    <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-2">
      {/* left/right fade */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />
      <div className="grid gap-3">
        <ul aria-label="User testimonials row A" className="relative flex w-max gap-3 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
          style={{ animation: `marqueeX ${durationA}s linear infinite` }}>
          {a.map((q, i) => (
            <li key={`ha-${q.name}-${i}`} className="min-w-[240px] max-w-[320px]">
              <CardItem q={q} />
            </li>
          ))}
        </ul>
        <ul aria-label="User testimonials row B" className="relative flex w-max gap-3 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
          style={{ animation: `marqueeXReverse ${durationB}s linear infinite` }}>
          {b.map((q, i) => (
            <li key={`hb-${q.name}-${i}`} className="min-w-[240px] max-w-[320px]">
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
    <aside className="mt-6 md:mt-0">
      {/* Mobile: horizontal marquee */}
      <div className="md:hidden">
        <HorizontalMarqueeDual items={QUOTES} />
      </div>
      {/* Desktop: vertical marquee */}
      <div className="hidden md:block">
        <VerticalMarqueeDual items={QUOTES} />
      </div>
    </aside>
  )
}

export default Testimonials
