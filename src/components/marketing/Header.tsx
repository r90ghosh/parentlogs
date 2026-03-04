'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '/resources', label: 'Resources' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Non-blocking auth check with timeout
    const controller = new AbortController()
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!controller.signal.aborted) {
          setIsLoggedIn(!!user)
        }
      } catch {
        if (!controller.signal.aborted) {
          setIsLoggedIn(false)
        }
      }
    }

    // Small delay to not block initial render
    const timeout = setTimeout(checkAuth, 100)
    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setIsMobileMenuOpen(false)
      }
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[--bg]/88 backdrop-blur-[20px] border-b border-[--border] shadow-card'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="font-display font-bold text-[18px] tracking-tight text-[--cream]">
            <Logo size="md" variant="dark" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="relative font-ui text-[13px] font-medium text-[--muted] hover:text-[--cream] transition-colors after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[--cream] after:transition-[width] after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn === true ? (
              <Button asChild className="bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="font-ui text-[--muted] hover:text-[--cream] hover:bg-[--card]">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild className="bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[--muted] hover:text-[--cream]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-[--bg]/98 backdrop-blur-[20px] border-b border-[--border] transition-all duration-300 overflow-hidden',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="block py-3 font-ui text-[--muted] hover:text-[--cream] transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-[--border] space-y-3">
            {isLoggedIn ? (
              <Button asChild className="w-full bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full border-[--border] text-[--cream] hover:bg-[--card] font-ui">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild className="w-full bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
