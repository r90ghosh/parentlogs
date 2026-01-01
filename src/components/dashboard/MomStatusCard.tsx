'use client'

import { cn } from '@/lib/utils'
import { MomSymptom } from '@/types/dashboard'

interface MomStatusCardProps {
  partnerName: string
  symptoms: MomSymptom[]
  dadTip: string
}

export function MomStatusCard({ partnerName, symptoms, dadTip }: MomStatusCardProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] p-7',
        'bg-gradient-to-br from-pink-500/10 to-rose-500/5',
        'border border-pink-500/20'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
            'bg-gradient-to-br from-pink-500 to-rose-500'
          )}
        >
          💜
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            How {partnerName} Might Feel
          </h2>
          <p className="text-[13px] text-pink-400">Common this week</p>
        </div>
      </div>

      {/* Symptoms */}
      <div className="flex flex-wrap gap-2 mb-5">
        {symptoms.map((symptom, index) => (
          <span
            key={index}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs',
              symptom.isCommon
                ? 'bg-pink-500/15 text-pink-400'
                : 'bg-white/[0.06] text-zinc-400'
            )}
          >
            {symptom.name}
          </span>
        ))}
      </div>

      {/* Dad tip */}
      <div className="bg-black/20 rounded-xl p-4">
        <div className="text-[11px] font-semibold text-pink-400 uppercase tracking-wide mb-1.5">
          💡 Dad Tip
        </div>
        <div className="text-sm text-zinc-200 leading-relaxed">
          {dadTip}
        </div>
      </div>
    </div>
  )
}
