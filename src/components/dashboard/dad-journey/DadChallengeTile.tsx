'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PaywallOverlay } from '@/components/shared/paywall-overlay'
import { DadChallengeContent, PillarConfig } from '@/types/dad-journey'

function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h4 className="font-display text-base font-semibold text-white mt-4 mb-2 first:mt-0">{children}</h4>
        ),
        h3: ({ children }) => (
          <h5 className="font-display text-sm font-semibold text-white mt-3 mb-1">{children}</h5>
        ),
        p: ({ children }) => (
          <p className="text-sm font-body text-[--cream] leading-relaxed mb-3 last:mb-0">{children}</p>
        ),
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-sm font-body text-[--cream]">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-sm font-body text-[--cream]">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-copper/40 pl-3 my-2 italic text-sm font-body text-[--cream]">{children}</blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-copper hover:text-copper/80 underline underline-offset-2">{children}</a>
        ),
        hr: () => <hr className="my-3 border-[--border]/60" />,
        // Downgrade h1 to h4 since this is inside a tile
        h1: ({ children }) => (
          <h4 className="font-display text-base font-semibold text-white mt-4 mb-2 first:mt-0">{children}</h4>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

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
        'border border-[--border] shadow-card'
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
          <p className="font-semibold font-display text-[--cream] leading-snug">{content.headline}</p>
          {!isExpanded && (
            <p className="mt-1 text-sm font-body text-[--muted] line-clamp-2">{content.preview}</p>
          )}
        </div>
        <div className="flex-shrink-0 text-[--muted] mt-0.5">
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
                <Markdown>{content.narrative}</Markdown>
              )}

              {/* Action Items */}
              {content.action_items && content.action_items.length > 0 && (
                <div>
                  <p className="text-xs font-semibold font-ui text-[--muted] uppercase tracking-wider mb-3">
                    Things you can do right now
                  </p>
                  <div className="space-y-3">
                    {content.action_items.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-3 bg-[--card]/50 rounded-lg border border-[--border]"
                      >
                        <CheckCircle className="h-5 w-5 text-copper flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium font-ui text-[--cream] text-sm">{item.title}</p>
                          <div className="text-sm font-body text-[--muted] mt-0.5">
                            <Markdown>{item.description}</Markdown>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dad Quotes */}
              {content.dad_quotes && content.dad_quotes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold font-ui text-[--muted] uppercase tracking-wider mb-3">
                    What other dads say
                  </p>
                  <div className="space-y-3">
                    {content.dad_quotes.map((quote, i) => (
                      <blockquote
                        key={i}
                        className="border-l-2 border-copper/40 pl-4 py-1"
                      >
                        <p className="text-[--cream] italic font-body text-sm">
                          &ldquo;{quote.quote}&rdquo;
                        </p>
                        <cite className="text-sm font-ui text-[--muted] not-italic mt-1 block">
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
