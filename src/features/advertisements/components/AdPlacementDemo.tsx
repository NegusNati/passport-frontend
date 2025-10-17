import { Card } from '@/shared/ui/card'

import { MockAdContent } from './MockAdContent'

interface AdPlacementDemoProps {
  label: string
  description?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function AdPlacementDemo({
  label,
  description,
  orientation = 'horizontal',
  className = '',
}: AdPlacementDemoProps) {
  const heightClass = orientation === 'vertical' ? 'min-h-[400px]' : 'min-h-[200px]'

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold tracking-tight">{label}</h3>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
      <Card className={`overflow-hidden ${heightClass}`}>
        <MockAdContent orientation={orientation} />
      </Card>
    </div>
  )
}
