
const QUOTES = [
  {
    name: 'Abebe Kebede',
    quote:
      'The clear status tracker saved me repeated trips and hours of waiting.',
  },
  {
    name: 'Tigist Haile',
    quote: 'The SMS notification feature is fantastic. I knew the exact pickup time.',
  },
  {
    name: 'Yohannes Gebre',
    quote: 'Customer support was straightforward and helpful during the process.',
  },
  {
    name: 'Dawit Mengistu',
    quote: 'As a frequent traveler, it’s now easy to track and renew on time.',
  },
  {
    name: 'Mekdes Tadesse',
    quote: 'Impressed by the accuracy of the results—highly recommended!',
  },
  {
    name: 'Meron Alemu',
    quote: 'I used my name to check status and it matched instantly.',
  },
]

export function Testimonials() {
  return (
    <aside className="mt-10 grid gap-4 md:mt-0">
      <div className="max-h-[22rem] overflow-hidden rounded-xl border border-neutral-200 p-4">
        <ul className="grid gap-4" aria-label="User testimonials">
          {QUOTES.map((q) => (
            <li key={q.name} className="rounded-lg bg-neutral-50 p-3 text-sm">
              <p className="text-neutral-800">“{q.quote}”</p>
              <p className="mt-1 text-neutral-500">— {q.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default Testimonials
