'use client'

import { Stethoscope } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MedicalDisclaimerProps {
  className?: string
}

export function MedicalDisclaimer({ className }: MedicalDisclaimerProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 bg-[--card] border border-[--border] rounded-xl',
        className
      )}
    >
      <Stethoscope className="h-4 w-4 text-[--coral] flex-shrink-0 mt-0.5" />
      <p className="font-body text-xs text-[--muted]">
        <span className="font-ui font-medium text-[--coral]">Medical Disclaimer:</span>{' '}
        Content is for informational purposes only and does not replace professional medical
        advice. Always consult your healthcare provider.
      </p>
    </div>
  )
}

export function MedicalDisclaimerFooter({ className }: MedicalDisclaimerProps) {
  return (
    <p
      className={cn(
        'text-center font-body text-[10px] text-[--dim]',
        className
      )}
    >
      Content is for informational purposes only and does not replace professional medical
      advice. Always consult your healthcare provider.
    </p>
  )
}
