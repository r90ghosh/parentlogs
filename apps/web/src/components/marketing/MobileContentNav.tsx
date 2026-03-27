'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const contentLinks = [
  { href: '/content', label: 'Content' },
  { href: '/budget-guide', label: 'Budget Guide' },
  { href: '/baby-checklists', label: 'Checklists' },
  { href: '/tips', label: 'Tips' },
]

export function MobileContentNav() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="fixed left-0 right-0 z-40 md:hidden"
      style={{
        top: isScrolled ? 48 : 64,
        transition: 'top 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="bg-[--surface]/95 backdrop-blur-[16px] border-b border-[--border]">
        <div
          className="mobile-content-nav flex gap-2 px-4 py-2 overflow-x-auto"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        >
          <style>{`.mobile-content-nav::-webkit-scrollbar { display: none; }`}</style>
          {contentLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + '/')

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-full text-sm font-ui font-medium whitespace-nowrap transition-colors min-h-[44px] flex items-center',
                  isActive
                    ? 'bg-copper text-[--bg]'
                    : 'bg-[--card]/50 text-[--muted] hover:text-[--cream]'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
