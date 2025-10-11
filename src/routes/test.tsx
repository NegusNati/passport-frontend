import { createFileRoute } from '@tanstack/react-router'
import { AnimatedBorderCardDemo } from '@/shared/components/common'

function TestRouteComponent() {
  console.log('🎯 TEST ROUTE CALLED!')

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🎯 Animated Border Card Demo</h1>
          <p className="text-muted-foreground text-lg">
            Showcasing beautiful animated cards with glowing conic-gradient borders
          </p>
        </div>
        <AnimatedBorderCardDemo />
        <div className="text-center mt-8">
          <a 
            href="/passports" 
            className="text-primary hover:underline font-medium"
          >
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
