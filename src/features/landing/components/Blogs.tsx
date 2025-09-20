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
        <div className="mb-6 flex flex-col justify-center items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight max-w-2xl text-center">Blog Posts</h2>
            <p className="mt-1 text-sm text-neutral-600 text-center max-w-sm">Your reliable source for passport news, tips, and travel information.</p>
          </div>
        
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-0 m-0">
          {POSTS.map((p) => (
                <Card key={p.id} className="overflow-hidden rounded-sm p-0 m-0 ">
                <CardContent className="flex h-full flex-col justify-between p-1  pt-0">
                  <div className="space-y-2">
                    <div className="h-40 w-full rounded-sm bg-neutral-100" />
                    <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                    <p className="text-sm text-neutral-600">
                      {p.date}
                    </p>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>
        <div className="flex justify-center my-4 md:my-8">
        <Button size="sm"  className="w-full sm:w-auto bg-black text-white font-semibold">View All</Button>
        </div>
      </Container>
    </section>
  )
}

export default BlogSection
