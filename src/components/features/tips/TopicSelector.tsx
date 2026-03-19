'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { TipTopic } from '@/types/tips'

interface TopicSelectorProps {
  topics: TipTopic[]
  activeId: string
  onSelect: (id: string) => void
}

export function TopicSelector({ topics, activeId, onSelect }: TopicSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current
      const pill = activeRef.current
      const scrollLeft = pill.offsetLeft - container.offsetWidth / 2 + pill.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [activeId])

  return (
    <div
      ref={scrollRef}
      className="flex gap-2.5 overflow-x-auto px-4 py-3"
      style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      {topics.map((topic) => {
        const isActive = topic.id === activeId
        return (
          <button
            key={topic.id}
            ref={isActive ? activeRef : undefined}
            onClick={() => onSelect(topic.id)}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap rounded-full px-4 font-ui text-sm font-medium transition-all duration-200 shrink-0',
              'min-h-[44px] min-w-[44px]',
              isActive
                ? 'bg-copper text-[--bg] shadow-copper'
                : 'bg-[--card] text-[--muted] border border-[--border] hover:border-[--border-hover] hover:text-[--cream]'
            )}
            style={{ scrollSnapAlign: 'center' }}
          >
            <span className="text-base leading-none">{topic.emoji}</span>
            <span>{topic.name}</span>
          </button>
        )
      })}
    </div>
  )
}
