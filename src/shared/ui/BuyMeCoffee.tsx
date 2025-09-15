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
        'fixed bottom-3 right-3 z-[1000] select-none sm:bottom-4 sm:right-4',
        className,
      ].join(' ')}
      aria-label="Support: Buy me a coffee"
    >
      <div className="relative h-14 w-14 sm:h-16 sm:w-16">
        {/* Rotating text ring */}
        <div
          aria-hidden
          className="absolute inset-0 grid place-items-center"
          style={{ transform: 'rotate(var(--rotate, 0deg))' }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <defs>
              <path id="bmc-circle" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
            </defs>
            <text className="fill-neutral-600 text-[8px] sm:text-[10px] tracking-[0.2em] uppercase">
              <textPath href="#bmc-circle" startOffset="0">
                Buy me a coffee • Buy me a coffee •
              </textPath>
            </text>
          </svg>
        </div>
        {/* Button in the center */}
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="absolute left-1/2 top-1/2 grid h-10 w-10 sm:h-12 sm:w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-neutral-300 transition"
        >
          <span role="img" aria-label="coffee" className="text-lg sm:text-xl">☕️</span>
        </a>
      </div>
    </div>
  )
}

export default BuyMeCoffee
