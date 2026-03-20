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
  const { profile, activeBaby } = useUser()
  const { data: family } = useFamily()
  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 1
  const { data: dashboardData, isLoading } = useDashboardData(
    profile.family_id,
    currentWeek
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
        'rounded-[20px] p-5 card-gold-top',
        'bg-[--card]',
        'border border-[--border]',
        'shadow-card'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-4 w-4 text-gold" />
        <span className="text-xs font-semibold font-ui text-gold uppercase tracking-wide">
          Week {currentWeek} Briefing
        </span>
        {briefing?.isNew && (
          <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold font-ui bg-gold-dim text-gold">
            New
          </span>
        )}
      </div>

      <h3 className="text-base font-display font-bold text-[--cream] mb-2 leading-snug">
        {briefing?.title || `Week ${currentWeek}`}
      </h3>

      {briefing?.excerpt && (
        <p className="text-sm font-body text-[--muted] line-clamp-2 mb-4">
          {briefing.excerpt}
        </p>
      )}

      <Link
        href="/briefing"
        className={cn(
          'inline-flex items-center gap-1.5 text-sm font-medium font-ui text-copper',
          'hover:text-copper-hover transition-colors'
        )}
      >
        Read full briefing
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  )
}
