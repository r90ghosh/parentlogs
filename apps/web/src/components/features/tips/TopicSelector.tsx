'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { TipTopic } from '@tdc/shared/types/tips'

interface TopicSelectorProps {
  topics: TipTopic[]
  activeId: string
  onSelect: (id: string) => void
}

export function TopicSelector({ topics, activeId, onSelect }: TopicSelectorProps) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [activeId])

  return (
    <div
      className="flex gap-2 px-4 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden"
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        scrollSnapType: 'x mandatory',
      }}
    >
      {topics.map((topic) => {
        const isActive = topic.id === activeId
        return (
          <button
            key={topic.id}
            ref={isActive ? activeRef : undefined}
            onClick={() => onSelect(topic.id)}
            className={`
              relative flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium
              whitespace-nowrap min-h-[44px] transition-colors shrink-0
              ${isActive ? 'text-zinc-950' : 'text-muted-foreground hover:text-foreground'}
            `}
            style={{ scrollSnapAlign: 'center' }}
          >
            {isActive && (
              <motion.span
                layoutId="topic-pill"
                className="absolute inset-0 bg-teal-500 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {!isActive && (
              <span className="absolute inset-0 bg-card border border-border rounded-full" />
            )}
            <span className="relative z-10">{topic.emoji}</span>
            <span className="relative z-10">{topic.name}</span>
          </button>
        )
      })}
    </div>
  )
}
