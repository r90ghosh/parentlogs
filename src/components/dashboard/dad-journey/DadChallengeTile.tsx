'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PaywallOverlay } from '@/components/shared/paywall-overlay'
import { DadChallengeContent, PillarConfig } from '@/types/dad-journey'

interface DadChallengeTileProps {
  content: DadChallengeContent
  config: PillarConfig
  defaultExpanded?: boolean
}

export function DadChallengeTile({
  content,
  config,
  defaultExpanded = false,
}: DadChallengeTileProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div
      className={cn(
        'relative rounded-xl border-l-4 overflow-hidden',
        'bg-gradient-to-br',
        config.gradient,
        config.borderColor,
        'border border-surface-800/50'
      )}
    >
      {/* Collapsed / Header row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-4 p-4 text-left"
        aria-expanded={isExpanded}
      >
        <span className="text-2xl flex-shrink-0 leading-none mt-0.5">{content.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white leading-snug">{content.headline}</p>
          {!isExpanded && (
            <p className="mt-1 text-sm text-surface-400 line-clamp-2">{content.preview}</p>
          )}
        </div>
        <div className="flex-shrink-0 text-surface-400 mt-0.5">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 space-y-6">
              {/* Narrative */}
              {content.narrative && (
                <div className="space-y-3">
                  {content.narrative.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-sm text-surface-300 leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              )}

              {/* Action Items */}
              {content.action_items && content.action_items.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                    Things you can do right now
                  </p>
                  <div className="space-y-3">
                    {content.action_items.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-3 bg-surface-800/50 rounded-lg"
                      >
                        <CheckCircle className="h-5 w-5 text-accent-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-white text-sm">{item.title}</p>
                          <p className="text-sm text-surface-400 mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dad Quotes */}
              {content.dad_quotes && content.dad_quotes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                    What other dads say
                  </p>
                  <div className="space-y-3">
                    {content.dad_quotes.map((quote, i) => (
                      <blockquote
                        key={i}
                        className="border-l-2 border-surface-600 pl-4 py-1"
                      >
                        <p className="text-surface-200 italic text-sm">
                          &ldquo;{quote.quote}&rdquo;
                        </p>
                        <cite className="text-sm text-surface-500 not-italic mt-1 block">
                          — {quote.attribution}
                        </cite>
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paywall overlay for premium content */}
      {content.is_premium && (
        <PaywallOverlay
          feature="future_phases"
          message="Upgrade to Premium to unlock content for all phases"
        />
      )}
    </div>
  )
}
