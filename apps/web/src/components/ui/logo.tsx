import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  href?: string
  /**
   * 'dark' (default): Copper/gold logo on dark backgrounds
   * 'light': Darker copper tones for light backgrounds
   */
  variant?: 'dark' | 'light'
}

const sizeMap = {
  sm: { icon: 24, text: 'text-base' },
  md: { icon: 32, text: 'text-xl' },
  lg: { icon: 40, text: 'text-2xl' },
  xl: { icon: 48, text: 'text-3xl' },
}

function LogoSvg({ size, variant = 'dark' }: { size: number; variant?: 'dark' | 'light' }) {
  const parentStops = variant === 'dark'
    ? { s0: '#d4a853', s50: '#c4703f', s100: '#a85a2a' }
    : { s0: '#b8922e', s50: '#a85a2a', s100: '#8b4513' }
  const childStops = variant === 'dark'
    ? { s0: '#d4a853', s100: '#c4703f' }
    : { s0: '#b8922e', s100: '#a85a2a' }
  const dotFill = variant === 'dark' ? '#d4a853' : '#a85a2a'

  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`logo-parent-${variant}`} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={parentStops.s0}/>
          <stop offset="50%" stopColor={parentStops.s50}/>
          <stop offset="100%" stopColor={parentStops.s100}/>
        </linearGradient>
        <linearGradient id={`logo-child-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={childStops.s0}/>
          <stop offset="100%" stopColor={childStops.s100}/>
        </linearGradient>
      </defs>
      <g transform="translate(256, 230)">
        <circle cx="-28" cy="-100" r="52" fill="none" stroke={`url(#logo-parent-${variant})`} strokeWidth="16"/>
        <path d="M-76 -38 Q-100 80 -52 164 Q-4 240 88 228" fill="none" stroke={`url(#logo-parent-${variant})`} strokeWidth="16" strokeLinecap="round"/>
        <circle cx="52" cy="48" r="34" fill="none" stroke={`url(#logo-child-${variant})`} strokeWidth="13" opacity="0.85"/>
        <path d="M24 -52 Q76 -12 64 52" fill="none" stroke={`url(#logo-parent-${variant})`} strokeWidth="10" strokeLinecap="round" opacity="0.45"/>
        <circle cx="12" cy="-4" r="8" fill={dotFill} opacity="0.55"/>
      </g>
    </svg>
  )
}

export function Logo({
  className,
  size = 'md',
  showText = true,
  href = '/',
  variant = 'dark',
}: LogoProps) {
  const { icon, text } = sizeMap[size]

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-shrink-0">
        <LogoSvg size={icon} variant={variant} />
      </div>
      {showText && (
        <span
          className={cn(
            'font-display font-bold tracking-tight transition-colors',
            text,
            variant === 'light' ? 'text-[--bg]' : 'text-[--cream]',
            href && 'group-hover:text-copper'
          )}
        >
          Rooftop Crest
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="group inline-flex">
        {content}
      </Link>
    )
  }

  return content
}

// Icon-only version for favicons and small spaces
export function LogoIcon({
  className,
  size = 'md',
  variant = 'dark'
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'dark' | 'light'
}) {
  const { icon } = sizeMap[size]

  return (
    <div className={cn('flex-shrink-0', className)}>
      <LogoSvg size={icon} variant={variant} />
    </div>
  )
}
