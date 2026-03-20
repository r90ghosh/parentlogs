'use client'

import { Lightbulb } from 'lucide-react'
import type { TipSection, IllustrationComponent } from '@/types/tips'

interface InfographicSectionProps {
  section: TipSection
  illustration?: IllustrationComponent
  isLast: boolean
}

export function InfographicSection({ section, illustration: Illustration, isLast }: InfographicSectionProps) {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-teal-400 text-sm font-medium tracking-wide">
          {section.number}
        </span>
        <h3 className="text-foreground text-xl font-semibold">
          {section.title}
        </h3>
      </div>

      {/* Illustration */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden aspect-[16/10] flex items-center justify-center mb-4">
        {Illustration ? (
          <Illustration className="w-full h-full" />
        ) : (
          <div className="text-muted-foreground text-sm">Illustration</div>
        )}
      </div>

      {/* Bullet points */}
      <ul className="space-y-2 mb-3">
        {section.points.map((point, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {/* Pro tip */}
      {section.proTip && (
        <div className="flex gap-2 items-start">
          <Lightbulb className="h-3.5 w-3.5 text-teal-400 mt-0.5 shrink-0" />
          <p className="text-teal-400/80 text-xs leading-relaxed">
            {section.proTip}
          </p>
        </div>
      )}

      {/* Divider between sections */}
      {!isLast && (
        <div className="border-t border-dashed border-zinc-800 my-8" />
      )}
    </div>
  )
}
