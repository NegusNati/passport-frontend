type Props = {
  label?: string
  onClick?: () => void
  className?: string
}

export default function ConcentricCTA({
  label = 'Check My Passport Status Now',
  onClick,
  className = '',
}: Props) {
  return (
    <div className={`relative isolate inline-flex ${className}`}>
      {/* Concentric “pill” rings — they expand & fade gently */}
      <span
        aria-hidden
        className="bg-brand/15 animate-ripple-1 pointer-events-none absolute inset-[-14px] hidden rounded-full blur-md motion-safe:block"
      />
      <span
        aria-hidden
        className="bg-brand/12 animate-ripple-2 pointer-events-none absolute inset-[-32px] hidden rounded-full blur-lg motion-safe:block"
      />
      <span
        aria-hidden
        className="bg-brand/10 animate-ripple-3 pointer-events-none absolute inset-[-56px] hidden rounded-full blur-2xl motion-safe:block"
      />

      {/* Inner soft glow that “breathes” */}
      <span
        aria-hidden
        className="bg-brand/20 animate-breathe pointer-events-none absolute inset-0 hidden rounded-full blur-sm motion-safe:block"
      />

      {/* Actual button */}
      <button
        type="button"
        onClick={onClick}
        className="from-brand focus-visible:outline-brand relative inline-flex items-center justify-center rounded-full bg-gradient-to-b to-[#007a52] px-8 py-4 text-base font-semibold text-white shadow-lg transition-[filter,transform] duration-200 ease-out hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
      >
        {label}
      </button>
    </div>
  )
}
