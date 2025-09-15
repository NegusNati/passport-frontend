import * as React from 'react'

type Props = {
  href?: string
  className?: string
}

/*
  Floating overlay for supporting the project. The text spins as the user scrolls
  (rotation derived from scroll delta) and naturally stops when scrolling stops.
*/
export function BuyMeCoffee({ href = 'https://buymeacoffee.com', className = '' }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const lastY = React.useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0)
  const angle = React.useRef(0)
  const raf = React.useRef<number | null>(null)

  React.useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      const dy = y - lastY.current
      lastY.current = y
      // scale delta -> degrees; clamp to avoid wild jumps
      const delta = Math.max(-40, Math.min(40, dy))
      angle.current = (angle.current + delta * 2) % 360

      if (raf.current == null) {
        raf.current = requestAnimationFrame(() => {
          raf.current = null
          if (ref.current) {
            ref.current.style.setProperty('--rotate', `${angle.current}deg`)
          }
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={ref}
      className={[
        'fixed bottom-4 right-4 z-50 flex items-center gap-3 select-none',
        className,
      ].join(' ')}
      aria-label="Support: Buy me a coffee"
    >
      {/* Vertical label that rotates with scroll */}
      <div
        className="hidden md:block origin-center text-[12px] tracking-wider text-neutral-600"
        style={{ transform: 'rotate(var(--rotate, 0deg))' }}
      >
        Buy me a coffee
      </div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-neutral-300 transition"
      >
        <span role="img" aria-label="coffee" className="text-xl">☕️</span>
      </a>
    </div>
  )
}

export default BuyMeCoffee

