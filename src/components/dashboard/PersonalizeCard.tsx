'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PersonalizeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-[20px] p-5 card-copper-top',
        'bg-[--card]',
        'border border-[--border]',
        'shadow-card'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-copper-dim flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-5 w-5 text-copper" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold font-display text-[--cream] mb-1">
            Personalize your experience
          </div>
          <p className="text-xs font-body text-[--muted] mb-4">
            Tell us about your situation so we can surface the most relevant challenges and content for you.
          </p>
          <Link
            href="/onboarding/personalize"
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-ui',
              'bg-copper-dim text-copper border border-copper/30',
              'hover:bg-copper-glow transition-colors'
            )}
          >
            Get personalized →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
