import { Container } from '@/shared/ui/container'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import CalendarImage from '@/assets/landingImages/calander_image.png'
import { Link } from '@tanstack/react-router'


const POSTS = [
  { id: 1, title: 'How to Collect Your Ethiopian Passport Once It’s Ready', date: 'Aug 24, 2025', image: CalendarImage },
  { id: 2, title: 'Urgent Service: What You Need to Know', date: 'Aug 24, 2025', image: CalendarImage },
  { id: 3, title: 'Avoiding Common Application Mistakes', date: 'Aug 24, 2025', image: CalendarImage },
]

export function BlogSection() {
  return (
    <section id="blogs" className="py-14 sm:py-16">
      <Container>
        <div className="mb-6 flex flex-col justify-center items-center">
          <div>
              <h2 className="text-2xl font-bold tracking-tight max-w-2xl text-center">Articles</h2>
            <p className="mt-1 text-sm text-neutral-600 text-center max-w-sm">Your reliable source for passport articles, tips, and travel information.</p>
          </div>
        
        </div>  
        <div
          className="
            flex gap-6 overflow-x-auto p-1 m-0
            sm:grid sm:grid-cols-2 sm:overflow-x-visible sm:p-0
            lg:grid-cols-3
            scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent
          "
          tabIndex={0}
          aria-label="Articles"
        >
          {POSTS.map((p) => (
            <Card
              key={p.id}
              className="
                min-w-[85vw] max-w-xs flex-shrink-0 overflow-hidden rounded-sm p-0 m-0
                sm:min-w-0 sm:max-w-none sm:flex-shrink
              "
            >
              <CardContent className="flex h-full flex-col justify-between p-1">
                <div className="space-y-2">
                  <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />
                  <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                  <p className="text-sm text-neutral-600">
                    {p.date}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex sm:justify-center my-4 md:my-8">
          <Button size="sm" className="  sm:w-auto bg-black text-white font-semibold">
            <Link to="/articles"> View All</Link>
            </Button>
        </div>
      </Container>
    </section>
  )
}

export default BlogSection
