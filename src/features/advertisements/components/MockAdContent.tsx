import { ExternalLink } from 'lucide-react'

import { Button } from '@/shared/ui/button'

interface MockAdContentProps {
  orientation?: 'horizontal' | 'vertical'
}

export function MockAdContent({ orientation = 'horizontal' }: MockAdContentProps) {
  const isVertical = orientation === 'vertical'

  return (
    <div
      className={`flex h-full w-full bg-gradient-to-br from-emerald-50 to-teal-50 ${
        isVertical
          ? 'flex-col items-start justify-between p-6'
          : 'flex-row items-center justify-between gap-6 p-8'
      }`}
    >
      <div className={`flex-1 space-y-3 ${isVertical ? 'w-full' : ''}`}>
        <div className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
          Featured Service
        </div>
        <h3
          className={`font-bold tracking-tight text-gray-900 ${
            isVertical ? 'text-xl' : 'text-2xl'
          }`}
        >
          Dare Detailing Service
        </h3>
        <p className={`text-gray-700 ${isVertical ? 'text-sm' : 'text-base'}`}>
          Professional car detailing and cleaning services. Transform your vehicle with our expert
          care.
        </p>
        <Button
          size={isVertical ? 'sm' : 'md'}
          className="mt-2 bg-emerald-600 hover:bg-emerald-700"
          onClick={(e) => e.preventDefault()}
        >
          Learn More
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
      {!isVertical && (
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-lg bg-emerald-600">
          <div className="text-center text-white">
            <div className="text-4xl font-bold">🚗</div>
            <div className="mt-1 text-xs font-semibold">Your Logo</div>
          </div>
        </div>
      )}
    </div>
  )
}
