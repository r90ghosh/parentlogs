'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { TypewriterGreeting } from '@/components/ui/animations/TypewriterGreeting'
import { CopperDivider } from '@/components/ui/animations/CopperDivider'

interface DashboardHeaderProps {
  userName: string
  overdueCount: number
}

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardHeader({ userName, overdueCount }: DashboardHeaderProps) {
  const [mounted, setMounted] = useState(false)
  const [today, setToday] = useState<Date | null>(null)
  const [typewriterDone, setTypewriterDone] = useState(false)
  const [showMeta, setShowMeta] = useState(false)

  useEffect(() => {
    setMounted(true)
    setToday(new Date())
  }, [])

  const greeting = mounted && today ? getGreeting(today.getHours()) : 'Hello'
  const greetingText = `${greeting}, ${userName}.`

  const onTypewriterComplete = useCallback(() => {
    setTypewriterDone(true)
    // Delay meta line to match mockup timing
    setTimeout(() => setShowMeta(true), 200)
  }, [])

  return (
    <header className="mb-8 px-0 pt-4 pb-0">
      <h1 className="text-[28px] font-display font-bold text-[--cream] leading-[1.2] mb-2">
        {mounted ? (
          <TypewriterGreeting
            text={greetingText}
            speed={50}
            onComplete={onTypewriterComplete}
          />
        ) : (
          greetingText
        )}
      </h1>

      <div
        className="flex items-center gap-4 text-[15px] text-[--muted] font-body font-light tracking-[0.01em]"
        style={{
          opacity: showMeta ? 1 : 0,
          transform: showMeta ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
      >
        <span suppressHydrationWarning>
          {today ? format(today, 'EEEE, MMMM d, yyyy') : ''}
        </span>
        {overdueCount > 0 && (
          <span className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium font-ui',
            'bg-coral-dim text-coral'
          )}>
            <span className="w-1.5 h-1.5 rounded-full bg-coral" />
            {overdueCount} {overdueCount === 1 ? 'task needs' : 'tasks need'} attention
          </span>
        )}
      </div>

      <CopperDivider
        className="mt-5"
        trigger={typewriterDone}
        delay={200}
      />
    </header>
  )
}
