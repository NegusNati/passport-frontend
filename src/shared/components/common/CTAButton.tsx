
type Props = {
  label?: string;
  onClick?: () => void;
  className?: string;
};

export default function ConcentricCTA({
  label = 'Check My Passport Status Now',
  onClick,
  className = '',
}: Props) {
  return (
    <div className={`relative inline-flex isolate ${className}`}>
      {/* Concentric “pill” rings — they expand & fade gently */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-14px] rounded-full bg-brand/15 blur-md
                   hidden motion-safe:block animate-ripple-1"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-32px] rounded-full bg-brand/12 blur-lg
                   hidden motion-safe:block animate-ripple-2"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-56px] rounded-full bg-brand/10 blur-2xl
                   hidden motion-safe:block animate-ripple-3"
      />

      {/* Inner soft glow that “breathes” */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-brand/20 blur-sm
                   hidden motion-safe:block animate-breathe"
      />

      {/* Actual button */}
      <button
        type="button"
        onClick={onClick}
        className="relative inline-flex items-center justify-center rounded-full
                   px-8 py-4 text-base font-semibold text-white
                   bg-gradient-to-b from-brand to-[#007a52]
                   shadow-lg transition-[filter,transform] duration-200 ease-out
                   hover:brightness-105 active:scale-[0.98]
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-brand"
      >
        {label}
      </button>
    </div>
  );
}
