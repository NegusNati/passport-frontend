import { createFileRoute } from '@tanstack/react-router'
import { AnimatedBorderCardDemo } from '@/shared/components/common'

function TestRouteComponent() {
  console.log('🎯 TEST ROUTE CALLED!')

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">🎯 Animated Border Card Demo</h1>
          <p className="text-muted-foreground text-lg">
            Showcasing beautiful animated cards with glowing conic-gradient borders
          </p>
        </div>
        <AnimatedBorderCardDemo />
        <div className="mt-8 text-center">
          <a href="/passports" className="text-primary font-medium hover:underline">
            ← Go back to passports
          </a>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/test')({
  component: TestRouteComponent,
})
