import { Link } from '@tanstack/react-router'

import CalendarImage from '@/assets/landingImages/calander_image.png'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Container } from '@/shared/ui/container'

const POSTS = [
  {
    id: 1,
    title: 'How to Collect Your Ethiopian Passport Once It’s Ready',
    excerpt: "You Collect is by, How to Collect Your Ethiopian Passport Once It’s Ready ",
    date: 'Aug 24, 2025',
    image: CalendarImage,
  },
  {
    id: 2,
    title: 'Urgent Service: What You Need to Know',
    excerpt: "You Collect is by, How to Collect Your Ethiopian Passport Once It’s Ready ",
    date: 'Aug 24, 2025',
    image: CalendarImage,
  },
  {
    id: 3,
    title: 'Avoiding Common Application Mistakes',
    excerpt: "You Collect is by, How to Collect Your Ethiopian Passport Once It’s Ready ", 
    date: 'Aug 24, 2025',
    image: CalendarImage,
  },
]

export function ArticleSection() {
  return (
    <section id="blogs" className="py-14 sm:py-16">
      <Container>
        <div className="mb-6 flex flex-col items-center justify-center">
          <div>
            <h2 className="max-w-2xl text-center text-2xl font-bold tracking-tight">Articles</h2>
            <p className="text-muted-foreground mt-1 max-w-sm text-center text-sm">
              Your reliable source for passport articles, tips, and travel information.
            </p>
          </div>
        </div>
        <div
          className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent m-0 flex gap-6 overflow-x-auto p-1 sm:grid sm:grid-cols-2 sm:overflow-x-visible sm:p-0 lg:grid-cols-3"
          aria-label="Articles"
        >
          {POSTS.map((p) => (
            <Card
              key={p.id}
              className="m-0 max-w-xs min-w-[85vw] flex-shrink-0 overflow-hidden rounded-sm p-0 sm:max-w-none sm:min-w-0 sm:flex-shrink"
            >
              <CardContent className="flex h-full flex-col justify-between p-1">
                <div className="space-y-2">
                  <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />
                  <p className="text-muted-foreground text-xs">{p.date}</p>
                  <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{ p.excerpt}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="my-4 flex sm:justify-center md:my-8">
          <Button size="sm" className="font-semibold sm:w-auto px-4">
            <Link to="/articles"> View All</Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}

export default ArticleSection
