const FAQS = [
  {
    q: 'How do I check if my passport is ready?',
    a: 'Use your reference number or full name search to get the latest readiness status pulled from official updates.',
  },
  {
    q: 'What information do I need to use this portal?',
    a: 'Either your reference number or your full legal name. Optionally, you can filter by city where available.',
  },
  {
    q: 'Is Passport.ET an official service?',
    a: 'Passport.ET is not an official government website. It’s a community tool focused on checking readiness and sharing insights.',
  },
  {
    q: 'How accurate is the passport status shown?',
    a: 'Statuses are based on the latest available sync. For time-sensitive travel, confirm with official channels before visiting in person.',
  },
  {
    q: 'Can I apply for a new passport through this portal?',
    a: 'No. Application and renewals must be done through official channels. Passport.ET focuses on readiness checks only.',
  },
]

export function FAQsSection() {
  return (
    <section id="faqs" className="py-14 sm:py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">FAQs</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Find reliable information about how Passport.ET works and what to expect.
          </p>
        </header>
        <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
          {FAQS.map((f, i) => (
            <details key={i} className="group open:bg-neutral-50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <span className="text-sm font-medium text-neutral-900">{f.q}</span>
                <svg
                  className="size-4 text-neutral-700 transition-transform group-open:rotate-45"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <div className="px-4 pb-4 text-sm text-neutral-600 sm:px-6">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQsSection

