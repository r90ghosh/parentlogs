'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { ToggleTheme } from '@/components/ui/toggle-theme'

type NavLink = {
  href?: string
  label: string
  children?: { href: string; label: string }[]
}

const navLinks: NavLink[] = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  {
    label: 'Resources',
    children: [
      { href: '/content', label: 'Content' },
      { href: '/budget-guide', label: 'Budget Guide' },
      { href: '/baby-checklists', label: 'Checklists' },
      { href: '/tips', label: 'Tips' },
    ],
  },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

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
      if (pathname === '/') {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
          setIsMobileMenuOpen(false)
        }
      } else {
        router.push('/' + href)
        setIsMobileMenuOpen(false)
      }
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        isScrolled
          ? 'bg-[--surface]/95 backdrop-blur-[16px] border-b border-[--border] shadow-card'
          : 'bg-transparent'
      )}
      style={{ transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'flex items-center justify-between',
            isScrolled ? 'h-12 md:h-14' : 'h-16 md:h-20'
          )}
          style={{ transition: 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* Logo */}
          <div className="font-display font-bold text-[18px] tracking-tight text-[--cream]">
            <Logo size="md" variant="dark" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-baseline gap-8">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button
                    type="button"
                    className="nav-underline-flip font-ui text-base font-medium text-[--cream]/70 hover:text-[--cream] transition-colors cursor-pointer appearance-none bg-transparent border-0 p-0 m-0"
                    style={{ font: 'inherit', lineHeight: 'inherit' }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    {link.label}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                      <div className="bg-[--surface] border border-[--border] rounded-xl shadow-lg py-2 min-w-[180px]">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 font-ui text-sm text-[--cream]/70 hover:text-copper hover:bg-[--card] transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href!)}
                  className="nav-underline-flip font-ui text-base font-medium text-[--cream]/70 hover:text-[--cream] transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <ToggleTheme />
            {isLoggedIn === true ? (
              <Button asChild className="bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="font-ui text-base text-[--cream]/70 hover:text-[--cream] hover:bg-[--card]">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild className="bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Auth + Menu */}
          <div className="flex md:hidden items-center gap-2">
            <ToggleTheme />
            {isLoggedIn === true ? (
              <Button asChild size="sm" className="bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold text-xs">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : isLoggedIn === false ? (
              <Button asChild variant="ghost" size="sm" className="font-ui text-sm text-[--cream]/70 hover:text-[--cream]">
                <Link href="/login">Log In</Link>
              </Button>
            ) : null}
            <button
              className="p-2 text-[--muted] hover:text-[--cream]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
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
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <span className="block py-3 font-ui text-[--muted] font-medium">
                  {link.label}
                </span>
                <div className="pl-4 space-y-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 font-ui text-sm text-[--muted] hover:text-copper transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href!)}
                className="block py-3 font-ui text-[--muted] hover:text-[--cream] transition-colors font-medium"
              >
                {link.label}
              </a>
            )
          )}
          <div className="pt-4 border-t border-[--border] space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="font-ui text-sm text-[--muted]">Theme</span>
              <ToggleTheme />
            </div>
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
