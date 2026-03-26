'use client'

import React, { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from 'framer-motion'

import type { MotionValue } from 'framer-motion'

const GridPattern = ({ offsetX, offsetY }: { offsetX: MotionValue<number>; offsetY: MotionValue<number> }) => (
  <svg className="w-full h-full">
    <defs>
      <motion.pattern
        id="grid-pattern"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
        x={offsetX}
        y={offsetY}
      >
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-muted-foreground"
        />
      </motion.pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
  </svg>
)

interface InfiniteGridProps {
  className?: string
  speedX?: number
  speedY?: number
  revealRadius?: number
}

export function InfiniteGrid({
  className,
  speedX = 0.5,
  speedY = 0.5,
  revealRadius = 300,
}: InfiniteGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const gridOffsetX = useMotionValue(0)
  const gridOffsetY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + speedX) % 40)
    gridOffsetY.set((gridOffsetY.get() + speedY) % 40)
  })

  const maskImage = useMotionTemplate`radial-gradient(${revealRadius}px circle at ${mouseX}px ${mouseY}px, black, transparent)`

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={className}
    >
      {/* Subtle static grid */}
      <div className="absolute inset-0 opacity-[0.05]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      {/* Mouse-reveal active grid */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>
    </div>
  )
}
