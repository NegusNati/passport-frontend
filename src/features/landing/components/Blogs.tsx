import { Container } from '@/shared/ui/container'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'

const POSTS = [
  { id: 1, title: 'How to Collect Your Ethiopian Passport Once It’s Ready', date: 'Aug 24, 2025' },
  { id: 2, title: 'Urgent Service: What You Need to Know', date: 'Aug 24, 2025' },
  { id: 3, title: 'Avoiding Common Application Mistakes', date: 'Aug 24, 2025' },
]

export function BlogSection() {
  return (
    <section id="blogs" className="py-14 sm:py-16">
      <Container>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Blog Posts</h2>
            <p className="mt-1 text-sm text-neutral-600">Your reliable source for passport news, tips, and travel information.</p>
          </div>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className="h-40 w-full bg-neutral-100" />
              <CardContent className="p-4">
                <h3 className="line-clamp-2 text-base font-medium">{p.title}</h3>
                <p className="mt-1 text-sm text-neutral-500">{p.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default BlogSection
