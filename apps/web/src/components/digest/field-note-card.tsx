import { cn } from '@/lib/utils'

interface FieldNoteCardProps {
  quote: string
  label?: string
  attribution?: string
  className?: string
}

/** Soft accent-tint block for a "field note" quote. (§1.3) */
export function FieldNoteCard({ quote, label = 'Field note', attribution, className }: FieldNoteCardProps) {
  return (
    <div className={cn('rounded-2xl bg-clay-soft px-[18px] py-4', className)}>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-clay" />
        <span className="text-[11px] font-bold uppercase tracking-[1.2px] text-clay-ink">{label}</span>
      </div>
      <p className="mt-[9px] text-[15px] italic leading-[23px] text-ink2">{`“${quote}”`}</p>
      {attribution && <p className="mt-2 text-[12.5px] text-mute">{attribution}</p>}
    </div>
  )
}
