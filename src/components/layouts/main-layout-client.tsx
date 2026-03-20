'use client'

import { ReactNode, useRef, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/auth-context'
import { useUser } from '@/components/user-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Home,
  CheckSquare,
  Baby,
  Menu,
  Settings,
  LogOut,
  CreditCard,
  DollarSign,
  ClipboardList,
  Bell,
  BookOpen,
  UserPlus,
  Users,
  Crown,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { WarmBackground } from '@/components/ui/animations/WarmBackground'
import { useUnreadNotificationCount } from '@/hooks/use-notifications'
import { GracePeriodBanner } from '@/components/shared/grace-period-banner'
import { BabySwitcher } from '@/components/layouts/baby-switcher'

const mainNavItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/briefing', label: 'Briefing', icon: BookOpen },
  { href: '/tracker', label: 'Tracker', icon: Baby },
]

const moreToolItems = [
  { href: '/checklists', label: 'Checklists', icon: ClipboardList },
  { href: '/budget', label: 'Budget', icon: DollarSign },
]

const moreFamilyItems = [
  { href: '/settings/family', label: 'Invite Partner', icon: UserPlus },
  { href: '/settings/family', label: 'Family Settings', icon: Users },
]

const moreAccountItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/upgrade', label: 'Upgrade to Premium', icon: Crown },
  { href: '/help', label: 'Help & Support', icon: HelpCircle },
]

function NavIndicator({ activeIndex }: { activeIndex: number }) {
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (indicatorRef.current && activeIndex >= 0) {
      // 5 items total (4 nav + 1 More), each takes 20% width
      const itemWidth = 100 / 5
      const left = activeIndex * itemWidth + itemWidth / 2
      indicatorRef.current.style.left = `calc(${left}% - 10px)`
    }
  }, [activeIndex])

  if (activeIndex < 0) return null

  return (
    <div
      ref={indicatorRef}
      className="absolute top-0 w-5 h-[2px] bg-copper transition-[left] duration-350"
      style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
    />
  )
}

function SectionItems({
  items,
  pathname,
}: {
  items: typeof moreToolItems
  pathname: string
}) {
  return (
    <>
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-ui transition-colors w-full',
              isActive
                ? 'bg-copper-dim text-copper border-l-2 border-l-copper'
                : 'text-[--cream] hover:bg-[--card] active:bg-[--card-hover]'
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </>
  )
}

export function MainLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const { profile } = useUser()

  const { data: unreadCount } = useUnreadNotificationCount()

  // Find active nav index for sliding indicator
  const activeIndex = mainNavItems.findIndex(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  )

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[--bg]">
      <WarmBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[--surface]/95 backdrop-blur-[16px] border-b border-[--border]" style={{ height: 'var(--header-h)' }}>
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-baseline gap-3">
            <Link href="/dashboard" className="font-display font-bold text-[15px] text-[--cream] tracking-[0.08em] hover:text-copper transition-colors leading-none">
              The Dad Center
            </Link>
            <BabySwitcher />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/notifications" aria-label={`Notifications${(unreadCount ?? 0) > 0 ? `, ${unreadCount} unread` : ''}`}>
                <Bell className="h-[22px] w-[22px] text-copper" />
                {(unreadCount ?? 0) > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-copper text-[10px] font-ui font-bold text-white flex items-center justify-center px-1">
                    {unreadCount! > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-[34px] w-[34px] rounded-full p-0">
                  <Avatar className="h-[34px] w-[34px]">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />
                    <AvatarFallback
                      className="font-ui font-semibold text-xs"
                      style={{ background: 'linear-gradient(135deg, var(--copper), var(--gold))' }}
                    >
                      {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium font-body text-[--cream]">{profile.full_name}</p>
                    <p className="text-xs text-[--muted]">{profile.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/subscription">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscription
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-coral">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-[2] pb-24 md:pb-4 md:ml-64">
        <GracePeriodBanner />
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-[--surface]/95 backdrop-blur-[16px] border-t border-[--border] md:hidden" style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom))' }}>
        <div className="relative flex items-center justify-around pt-2 pb-1" style={{ height: 'var(--nav-h)' }}>
          <NavIndicator activeIndex={activeIndex} />

          {mainNavItems.map((item, index) => {
            const isActive = activeIndex === index
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                  isActive ? 'text-copper' : 'text-[--muted]'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 transition-transform duration-300',
                    isActive && 'scale-[1.08]'
                  )}
                  style={isActive ? { transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' } : undefined}
                />
                <span className="font-ui text-[9px] font-medium uppercase tracking-[0.08em]">{item.label}</span>
              </Link>
            )
          })}

          {/* More menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-[--muted] active:text-copper transition-colors">
                <Menu className="h-5 w-5" />
                <span className="font-ui text-[9px] font-medium uppercase tracking-[0.08em]">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-[--surface] border-t border-[--border] rounded-t-2xl max-h-[70vh] overflow-y-auto">
              <div className="w-12 h-1 bg-[--dim] rounded-full mx-auto mb-4" />

              <div className="pb-6 safe-area-bottom space-y-1">
                {/* Tools Section */}
                <p className="font-ui font-semibold text-[10px] uppercase tracking-[0.12em] text-[--muted] px-3 py-2">
                  Tools
                </p>
                <SectionItems items={moreToolItems} pathname={pathname} />

                <div className="border-t border-[--border] my-2" />

                {/* Family Section */}
                <p className="font-ui font-semibold text-[10px] uppercase tracking-[0.12em] text-[--muted] px-3 py-2">
                  Family
                </p>
                <SectionItems items={moreFamilyItems} pathname={pathname} />

                <div className="border-t border-[--border] my-2" />

                {/* Account Section */}
                <p className="font-ui font-semibold text-[10px] uppercase tracking-[0.12em] text-[--muted] px-3 py-2">
                  Account
                </p>
                <SectionItems items={moreAccountItems} pathname={pathname} />
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-ui transition-colors w-full text-coral hover:bg-[--card] active:bg-[--card-hover]"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden md:flex fixed left-0 bottom-0 w-64 bg-[--surface] border-r border-[--border] flex-col p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ top: 'var(--header-h)' }}>
        <nav aria-label="Sidebar navigation" className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-ui font-medium transition-colors',
                  isActive
                    ? 'bg-copper-dim text-copper border-l-2 border-l-copper'
                    : 'text-[--cream] hover:bg-[--card]'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[--border] my-3" />

        <div className="space-y-1">
          <p className="font-ui font-semibold text-[10px] uppercase tracking-[0.12em] text-[--muted] px-3 py-2">
            Tools
          </p>
          <SectionItems items={moreToolItems} pathname={pathname} />
        </div>

        <div className="border-t border-[--border] my-3" />

        <div className="space-y-1">
          <p className="font-ui font-semibold text-[10px] uppercase tracking-[0.12em] text-[--muted] px-3 py-2">
            Family
          </p>
          <SectionItems items={moreFamilyItems} pathname={pathname} />
        </div>

        <div className="border-t border-[--border] my-3" />

        <div className="space-y-1">
          <p className="font-ui font-semibold text-[10px] uppercase tracking-[0.12em] text-[--muted] px-3 py-2">
            Account
          </p>
          <SectionItems items={moreAccountItems} pathname={pathname} />
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-ui transition-colors w-full text-coral hover:bg-[--card]"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </div>
  )
}
