import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeroProps {
  /** Uppercase kicker, e.g. "This week · Briefing". */
  kicker?: ReactNode
  title: ReactNode
  /** Body paragraph / one-liner. */
  children?: ReactNode
  /** Small meta line under the body. */
  meta?: ReactNode
  cta?: { label: string; href: string }
  className?: string
}

/** The primary left-accent hero card. (desktop-home.html .hero) */
export function Hero({ kicker, title, children, meta, cta, className }: HeroProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] border border-line border-l-[3px] border-l-clay bg-card p-[26px] shadow-[var(--shadow)]',
        className
      )}
    >
      {kicker != null && (
        <div className="text-[11px] font-extrabold uppercase tracking-[1.5px] text-clay-ink">{kicker}</div>
      )}
      <h2 className="mt-[11px] text-[27px] font-extrabold leading-[1.18] tracking-[-0.5px] text-ink">{title}</h2>
      {children != null && (
        <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.6] text-ink2">{children}</p>
      )}
      {meta != null && <div className="mt-3.5 text-[13px] font-semibold text-mute">{meta}</div>}
      {cta && (
        <Link
          href={cta.href}
          className="mt-[18px] inline-flex items-center gap-2 text-[14.5px] font-bold text-clay-ink transition-opacity hover:opacity-80"
        >
          {cta.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
