import { cn } from '@/lib/utils'

interface BrandLogoProps {
  /** Pixel size of the mark. */
  size?: number
  /** Show the "The Dad Center" Playfair wordmark next to the mark. */
  showWordmark?: boolean
  className?: string
}

/**
 * The Dad Center brandmark (parent/child, copper→gold gradient) + optional
 * Playfair wordmark. Mirrors apps/mobile/docs/desktop-*.html #brandmark and
 * public/images/logo-icon.svg. The mark is the only place copper/gold survives
 * in the v2 digest system; the wordmark is the only Playfair text in-app.
 */
export function BrandLogo({ size = 30, showWordmark = true, className }: BrandLogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg width={size} height={size} viewBox="0 0 512 512" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="tdc-parent" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#D4A853" />
            <stop offset="50%" stopColor="#C0673D" />
            <stop offset="100%" stopColor="#A85A2A" />
          </linearGradient>
          <linearGradient id="tdc-child" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4A853" />
            <stop offset="100%" stopColor="#C0673D" />
          </linearGradient>
        </defs>
        <g transform="translate(256,230)">
          <circle cx="-28" cy="-100" r="52" fill="none" stroke="url(#tdc-parent)" strokeWidth="16" />
          <path
            d="M-76 -38 Q-100 80 -52 164 Q-4 240 88 228"
            fill="none"
            stroke="url(#tdc-parent)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <circle cx="52" cy="48" r="34" fill="none" stroke="url(#tdc-child)" strokeWidth="13" opacity="0.85" />
          <path
            d="M24 -52 Q76 -12 64 52"
            fill="none"
            stroke="url(#tdc-parent)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.45"
          />
          <circle cx="12" cy="-4" r="8" fill="#D4A853" opacity="0.55" />
        </g>
      </svg>
      {showWordmark && (
        <span className="font-display text-[19px] font-bold tracking-[-0.4px] text-ink">The Dad Center</span>
      )}
    </div>
  )
}
