import {
  Children,
  cloneElement,
  type CSSProperties,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'

import { cn } from '@/shared/lib/utils'

export interface CardSwapShellProps {
  width?: number | string
  height?: number | string
  cardDistance?: number
  verticalDistance?: number
  skewAmount?: number
  children: ReactNode
  className?: string
}

interface CardSwapSlot {
  x: number
  y: number
  z: number
  zIndex: number
}

type CardLikeElement = ReactElement<{ style?: CSSProperties }>

export const CARD_SWAP_FRAME_CLASSNAME =
  'absolute top-1/2 left-1/2 overflow-visible perspective-[900px] origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.7] sm:scale-[0.85] md:top-auto md:right-0 md:bottom-0 md:left-auto md:origin-bottom-right md:translate-x-[5%] md:translate-y-[20%] md:scale-100 lg:translate-x-[2%] lg:translate-y-[10%]'

export const makeCardSwapSlot = (
  index: number,
  cardDistance: number,
  verticalDistance: number,
  total: number,
): CardSwapSlot => ({
  x: index * cardDistance,
  y: -index * verticalDistance,
  z: -index * cardDistance * 1.5,
  zIndex: total - index,
})

export const getCardSwapItemStyle = ({
  width,
  height,
  slot,
  skewAmount,
}: {
  width: number | string
  height: number | string
  slot: CardSwapSlot
  skewAmount: number
}): CSSProperties => ({
  width,
  height,
  transform: `translate(-50%, -50%) translate3d(${slot.x}px, ${slot.y}px, ${slot.z}px) skewY(${skewAmount}deg)`,
  transformOrigin: 'center center',
  zIndex: slot.zIndex,
})

export function CardSwapShell({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  skewAmount = 6,
  children,
  className,
}: CardSwapShellProps) {
  const cardChildren = Children.toArray(children) as CardLikeElement[]

  return (
    <div className={cn(CARD_SWAP_FRAME_CLASSNAME, className)} style={{ width, height }}>
      {cardChildren.map((child, index) => {
        if (!isValidElement(child)) {
          return child
        }

        const slot = makeCardSwapSlot(index, cardDistance, verticalDistance, cardChildren.length)

        return cloneElement(child, {
          key: child.key ?? index,
          style: {
            ...(child.props.style ?? {}),
            ...getCardSwapItemStyle({
              width,
              height,
              slot,
              skewAmount,
            }),
          },
        })
      })}
    </div>
  )
}
