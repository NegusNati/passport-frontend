import { CheckCircleIcon,IdCardIcon, StarIcon, Users2Icon } from 'lucide-react'

import { AnimatedBorderCard } from './AnimatedBorderCard'

export function AnimatedBorderCardDemo() {
  return (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Animated Border Cards</h2>
        <p className="text-muted-foreground">
          Beautiful cards with glowing conic-gradient borders using modern CSS @property
        </p>
      </div>

      {/* Size variants */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Size Variants</h3>
        <div className="flex flex-wrap items-center gap-4">
          <AnimatedBorderCard variant="primary" size="sm">
            <StarIcon className="h-4 w-4" />
            Small Card
          </AnimatedBorderCard>
          <AnimatedBorderCard variant="primary" size="md">
            <StarIcon className="h-4 w-4" />
            Medium Card
          </AnimatedBorderCard>
          <AnimatedBorderCard variant="primary" size="lg">
            <StarIcon className="h-4 w-4" />
            Large Card
          </AnimatedBorderCard>
        </div>
      </div>

      {/* Color variants */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Color Variants</h3>
        <div className="flex flex-wrap items-center gap-4">
          <AnimatedBorderCard variant="primary" size="md">
            <Users2Icon className="h-4 w-4" />
            Primary Variant
          </AnimatedBorderCard>
          <AnimatedBorderCard variant="secondary" size="md">
            <IdCardIcon className="h-4 w-4" />
            Secondary Variant
          </AnimatedBorderCard>
          <AnimatedBorderCard variant="accent" size="md">
            <CheckCircleIcon className="h-4 w-4" />
            Accent Variant
          </AnimatedBorderCard>
        </div>
      </div>

      {/* Real-world examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Real-world Examples</h3>
        <div className="flex flex-wrap items-center gap-4">
          <AnimatedBorderCard variant="primary" size="sm">
            <Users2Icon className="h-4 w-4" />
            Over 1.5 million users
          </AnimatedBorderCard>
          <AnimatedBorderCard variant="secondary" size="sm">
            <IdCardIcon className="h-4 w-4" />
            1,278,980+ passports confirmed
          </AnimatedBorderCard>
          <AnimatedBorderCard variant="accent" size="sm">
            <StarIcon className="h-4 w-4" />
            99.9% accuracy rate
          </AnimatedBorderCard>
        </div>
      </div>

      {/* Interactive demo */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Interactive Demo</h3>
        <p className="text-sm text-muted-foreground">
          Hover over the cards to see enhanced glow effects
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <AnimatedBorderCard 
            variant="primary" 
            size="md"
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <StarIcon className="h-4 w-4" />
            Hover me!
          </AnimatedBorderCard>
          <AnimatedBorderCard 
            variant="secondary" 
            size="md"
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <CheckCircleIcon className="h-4 w-4" />
            Try this one!
          </AnimatedBorderCard>
        </div>
      </div>
    </div>
  )
}

export default AnimatedBorderCardDemo
