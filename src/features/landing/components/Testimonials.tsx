
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
    <li className=" hover:border hover:border-neutral-200  bg-neutral-50 hover:bg-white  px-3 py-3 md:px-4 md:py-4 shadow-xs ">
      <p className="text-[13px] leading-relaxed text-neutral-600 italic">“{q.quote}”</p>
      <p className="mt-2 text-[13px] font-medium text-neutral-900 hover:text-black">{q.name}</p>
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
    <div className="relative h-[36rem] overflow-hidden  p-2   ">
      
      {/* top/bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />

      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2 items-center">
        <ul
          aria-label="User testimonials column A"
          className="marquee marquee-pause relative grid gap-4 animate-marquee-y"
          style={{ ['--marquee-duration' as any]: `${durationA}s` }}
        >
          {a.map((q, i) => (
            <CardItem key={`a-${q.name}-${i}`} q={q} />
          ))}
        </ul>
        <ul
          aria-label="User testimonials column B"
          className="marquee marquee-pause relative grid gap-4 animate-marquee-y-reverse"
          style={{ ['--marquee-duration' as any]: `${durationB}s` }}
        >
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
    <div className="relative w-full overflow-hidden rounded-xl border border-neutral-200 bg-white p-2">
      {/* left/right fade */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />
      <div className="w-full overflow-hidden grid gap-3 items-center">
        <ul
          aria-label="User testimonials row A"
          className="marquee marquee-pause relative flex w-max gap-3 animate-marquee-x"
          style={{ ['--marquee-duration' as any]: `${durationA}s` }}
        >
          {a.map((q, i) => (
            <li key={`ha-${q.name}-${i}`} className="min-w-[200px] max-w-[280px] flex-shrink-0">
              <CardItem q={q} />
            </li>
          ))}
        </ul>
        <ul
          aria-label="User testimonials row B"
          className="marquee marquee-pause relative flex w-max gap-3 animate-marquee-x-reverse"
          style={{ ['--marquee-duration' as any]: `${durationB}s` }}
        >
          {b.map((q, i) => (
            <li key={`hb-${q.name}-${i}`} className="min-w-[200px] max-w-[280px] flex-shrink-0">
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
    <aside className="mt-6 md:mt-0 relative">
    {/* Mobile: horizontal marquee */}
    <div className="md:hidden relative">
      {/* left fade */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-10
                   bg-gradient-to-r from-white to-transparent dark:from-neutral-950"
        aria-hidden
      />
      <HorizontalMarqueeDual items={QUOTES} />
      {/* right fade */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-10
                   bg-gradient-to-l from-white to-transparent dark:from-neutral-950"
        aria-hidden
      />
    </div>
  
    {/* Desktop: vertical marquee */}
    <div className="hidden md:block relative">
      {/* top fade (fixed) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16
                   bg-gradient-to-b from-white to-transparent dark:from-neutral-950"
        aria-hidden
      />
      <VerticalMarqueeDual items={QUOTES} />
      {/* bottom fade (make direction consistent) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16
                   bg-gradient-to-t from-white to-transparent dark:from-neutral-950"
        aria-hidden
      />
    </div>
  </aside>
  
  )
}

export default Testimonials
