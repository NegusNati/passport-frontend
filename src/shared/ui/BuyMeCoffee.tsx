import * as React from 'react'

type Props = {
  href?: string
  className?: string
}

/*
  Floating overlay for supporting the project. The text spins as the user scrolls
  (rotation derived from scroll delta) and naturally stops when scrolling stops.
*/
export function BuyMeCoffee({ href = 'https://ye-buna.com/PassportET', className = '' }: Props) {
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
        'fixed right-3 bottom-3 z-[1000] select-none sm:right-4 sm:bottom-4',
        className,
      ].join(' ')}
      aria-label="Support: Buy me a coffee"
    >
      <div className="relative h-22 w-22 sm:h-28 sm:w-28">
        {/* Rotating text ring */}
        <div
          aria-hidden
          className="bg-primary absolute inset-0 grid place-items-center rounded-full"
          style={{ transform: 'rotate(var(--rotate, 0deg))' }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <defs>
              {/* Reduce radius from -40 to -35 or -36 to add padding */}
              <path id="bmc-circle" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
            </defs>
            <text className="fill-white text-[10px] font-semibold tracking-[0.2em] uppercase sm:text-[12px]">
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
          className="border-input bg-primary hover:border-border absolute top-1/2 left-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white shadow-sm transition hover:shadow-md sm:h-16 sm:w-16"
        >
          <span role="img" aria-label="coffee" className="text-xl sm:text-2xl">
            ☕️
          </span>
        </a>
      </div>
    </div>
  )
}

export default BuyMeCoffee
