'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { TipTopic, IllustrationComponent } from '@tdc/shared/types/tips'
import { InfographicSection } from './InfographicSection'

interface InfographicViewProps {
  topic: TipTopic
  illustrations: Record<string, IllustrationComponent>
}

export function InfographicView({ topic, illustrations }: InfographicViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to top when topic changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [topic.id])

  return (
    <motion.div
      key={topic.id}
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-4"
    >
      {topic.sections.map((section, i) => (
        <InfographicSection
          key={section.number}
          section={section}
          illustration={illustrations[section.illustrationId]}
          isLast={i === topic.sections.length - 1}
        />
      ))}

      {/* Footer message */}
      <div className="text-center py-10">
        <p className="text-muted-foreground text-sm">
          You got this. 👊
        </p>
      </div>
    </motion.div>
  )
}
