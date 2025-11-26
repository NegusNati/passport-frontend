import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  color: string
  delay: number
  rotation: number
  scale: number
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = [
      '#EF4444', // red
      '#F59E0B', // amber
      '#10B981', // emerald
      '#3B82F6', // blue
      '#8B5CF6', // violet
      '#FCD34D', // yellow
    ]

    const newPieces = Array.from({ length: 75 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percent
      y: -20 - Math.random() * 50, // start above screen
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1,
    }))
    setPieces(newPieces)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            y: `${p.y}vh`,
            x: `${p.x}vw`,
            rotate: p.rotation,
            opacity: 1,
          }}
          animate={{
            y: '110vh',
            rotate: p.rotation + 360 + Math.random() * 360,
            x: `${p.x + (Math.random() - 0.5) * 10}vw`, // Drift slightly
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: p.delay,
            ease: 'linear',
            repeat: 0,
          }}
          style={{
            position: 'absolute',
            width: `${10 * p.scale}px`,
            height: `${10 * p.scale}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}
