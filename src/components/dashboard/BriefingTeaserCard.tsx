'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@/components/user-provider'
import { useDashboardData } from '@/hooks/use-dashboard'
import { useFamily } from '@/hooks/use-family'
import { Skeleton } from '@/components/ui/skeleton'

export function BriefingTeaserCard() {
  const { profile } = useUser()
  const { data: family } = useFamily()
  const { data: dashboardData, isLoading } = useDashboardData(
    profile.family_id,
    family?.current_week || 1
  )

  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-[20px]" />
  }

  const briefing = dashboardData?.briefing

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-[20px] p-5',
        'bg-gradient-to-br from-indigo-900/40 to-zinc-900',
        'border border-indigo-500/20'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-4 w-4 text-indigo-400" />
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
          Week {family?.current_week || 1} Briefing
        </span>
        {briefing?.isNew && (
          <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300">
            New
          </span>
        )}
      </div>

      <h3 className="text-base font-bold text-white mb-2 leading-snug">
        {briefing?.title || `Week ${family?.current_week || 1}`}
      </h3>

      {briefing?.excerpt && (
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
          {briefing.excerpt}
        </p>
      )}

      <Link
        href="/briefing"
        className={cn(
          'inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400',
          'hover:text-indigo-300 transition-colors'
        )}
      >
        Read full briefing
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  )
}
