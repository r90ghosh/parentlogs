import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  href?: string
  /**
   * 'dark' (default): Use logo with white background - for dark UI backgrounds
   * 'light': Use transparent logo - for light/white UI backgrounds
   */
  variant?: 'dark' | 'light'
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
}

const textSizeClasses = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
}

// Logo with white background for dark UI backgrounds
const LOGO_FOR_DARK_BG = '/images/logo.png'
// Transparent logo for light UI backgrounds
const LOGO_FOR_LIGHT_BG = '/images/logo-transparent.svg'

export function Logo({
  className,
  size = 'md',
  showText = true,
  href = '/',
  variant = 'dark',
}: LogoProps) {
  // Select logo based on background - dark bg needs logo with white background
  const logoSrc = variant === 'light' ? LOGO_FOR_LIGHT_BG : LOGO_FOR_DARK_BG

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('relative flex-shrink-0 rounded-lg overflow-hidden', sizeClasses[size])}>
        <Image
          src={logoSrc}
          alt="ParentLogs"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span
          className={cn(
            'font-bold transition-colors',
            textSizeClasses[size],
            variant === 'light' ? 'text-slate-900' : 'text-white',
            href && 'group-hover:text-amber-400'
          )}
        >
          ParentLogs
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="group">
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
  const logoSrc = variant === 'light' ? LOGO_FOR_LIGHT_BG : LOGO_FOR_DARK_BG

  return (
    <div className={cn('relative flex-shrink-0 rounded-lg overflow-hidden', sizeClasses[size], className)}>
      <Image
        src={logoSrc}
        alt="ParentLogs"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}
