'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  rotation: number
}

const colors = [
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f97316', // orange-500
]

interface ConfettiProps {
  isActive: boolean
  onComplete?: () => void
}

export function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const newPieces: ConfettiPiece[] = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage across container
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.3,
        rotation: Math.random() * 360,
      }))
      setPieces(newPieces)

      // Clear after animation
      const timer = setTimeout(() => {
        setPieces([])
        onComplete?.()
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                left: `${piece.x}%`,
                top: '50%',
                backgroundColor: piece.color,
              }}
              initial={{
                y: 0,
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              animate={{
                y: [0, -80, 120],
                opacity: [1, 1, 0],
                rotate: [0, piece.rotation, piece.rotation * 2],
                scale: [1, 1.2, 0.8],
              }}
              transition={{
                duration: 1.2,
                delay: piece.delay,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

// Simpler checkmark burst animation
interface CheckBurstProps {
  isActive: boolean
}

export function CheckBurst({ isActive }: CheckBurstProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Expanding ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-500"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          {/* Second ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-400"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
