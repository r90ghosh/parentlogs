'use client'

import { type ReactNode } from 'react'

interface MoodEmojiPopProps {
  children: ReactNode
  selected?: boolean
  onSelect?: () => void
  className?: string
}

export function MoodEmojiPop({ children, selected = false, onSelect, className = '' }: MoodEmojiPopProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        relative flex items-center justify-center
        w-12 h-12 rounded-full
        transition-all duration-300
        ${selected
          ? 'bg-copper-dim border-2 border-copper scale-110 shadow-copper'
          : 'border-2 border-transparent hover:border-copper/50 hover:scale-[1.12]'
        }
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        transitionTimingFunction: selected
          ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'ease-out',
      }}
    >
      <span className="text-2xl">{children}</span>
      {selected && (
        <span
          className="absolute inset-0 rounded-full animate-ripple-out pointer-events-none"
          style={{ border: '2px solid var(--copper)', opacity: 0 }}
        />
      )}
    </button>
  )
}
