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
        'bg-gradient-to-br from-amber-900/30 to-zinc-900',
        'border border-amber-500/20'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-amber-400" />
        <span className="text-sm font-semibold text-white">Welcome to Your Timeline</span>
      </div>

      <p className="text-xs text-zinc-400 mb-4">
        We sorted your task history so you start fresh — not overwhelmed.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-zinc-700/40 text-center">
          <div className="text-lg font-bold text-zinc-300">{autoHandledCount}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Auto-sorted</div>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
          <div className="text-lg font-bold text-amber-400">{catchUpCount}</div>
          <div className="text-[10px] text-amber-500/70 mt-0.5">Catch up</div>
        </div>
        <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-center">
          <div className="text-lg font-bold text-teal-400">{upcomingCount}</div>
          <div className="text-[10px] text-teal-500/70 mt-0.5">Upcoming</div>
        </div>
      </div>

      <Link
        href="/tasks"
        className={cn(
          'inline-flex items-center gap-2 text-sm font-medium text-amber-400',
          'hover:text-amber-300 transition-colors'
        )}
      >
        <CheckCircle className="h-4 w-4" />
        Review catch-up tasks
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  )
}
