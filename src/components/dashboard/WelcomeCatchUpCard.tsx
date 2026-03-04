'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WelcomeCatchUpCardProps {
  autoHandledCount: number
  catchUpCount: number
  upcomingCount: number
}

export function WelcomeCatchUpCard({
  autoHandledCount,
  catchUpCount,
  upcomingCount,
}: WelcomeCatchUpCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-[20px] p-5',
        'bg-gradient-to-br from-gold/10 to-[--surface]',
        'border border-gold/20'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-gold" />
        <span className="text-sm font-semibold text-white">Welcome to Your Timeline</span>
      </div>

      <p className="text-xs text-[--muted] mb-4">
        We sorted your task history so you start fresh — not overwhelmed.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-[--card] text-center">
          <div className="text-lg font-bold text-[--cream]">{autoHandledCount}</div>
          <div className="text-[10px] text-[--dim] mt-0.5">Auto-sorted</div>
        </div>
        <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 text-center">
          <div className="text-lg font-bold text-gold">{catchUpCount}</div>
          <div className="text-[10px] text-gold/70 mt-0.5">Catch up</div>
        </div>
        <div className="p-3 rounded-xl bg-sage/10 border border-sage/20 text-center">
          <div className="text-lg font-bold text-sage">{upcomingCount}</div>
          <div className="text-[10px] text-sage/70 mt-0.5">Upcoming</div>
        </div>
      </div>

      <Link
        href="/tasks"
        className={cn(
          'inline-flex items-center gap-2 text-sm font-medium text-gold',
          'hover:text-gold/80 transition-colors'
        )}
      >
        <CheckCircle className="h-4 w-4" />
        Review catch-up tasks
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  )
}
