'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  CheckSquare,
  Baby,
  BookOpen,
  DollarSign,
  ListChecks,
  Library,
  Bell,
  Search,
  Menu,
  Settings,
  CreditCard,
  Crown,
  HelpCircle,
  Users,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth/auth-context'
import { useUser } from '@/components/user-provider'
import { useUnreadNotificationCount } from '@/hooks/use-notifications'
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
import { GracePeriodBanner } from '@/components/shared/grace-period-banner'
import { BabySwitcher } from '@/components/layouts/baby-switcher'
import { ToggleTheme } from '@/components/ui/toggle-theme'
import { BrandLogo } from '@/components/digest/brand-logo'
import { TopbarProvider, useTopbar } from '@/components/layouts/topbar-context'

const mainNavItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/briefing', label: 'Briefing', icon: BookOpen },
  { href: '/tracker', label: 'Tracker', icon: Baby },
]

const toolItems = [
  { href: '/budget', label: 'Budget', icon: DollarSign },
  { href: '/checklists', label: 'Checklists', icon: ListChecks },
  { href: '/library', label: 'Library', icon: Library },
]

const familyItems = [{ href: '/settings/family', label: 'Family Settings', icon: Users }]
const accountItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/upgrade', label: 'Upgrade to Premium', icon: Crown },
  { href: '/help', label: 'Help & Support', icon: HelpCircle },
]

const routeTitles: Record<string, string> = {
  '/tasks': 'Tasks',
  '/briefing': 'Briefing',
  '/tracker': 'Tracker',
  '/budget': 'Budget',
  '/my-budget': 'Budget',
  '/checklists': 'Checklists',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/journey': 'Journey',
  '/calendar': 'Calendar',
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/')
}

function planLabel(tier: string | null | undefined) {
  if (tier === 'lifetime') return 'Lifetime'
  if (tier === 'premium') return 'Premium'
  return 'Free'
}

function NavItem({ href, label, icon: Icon, active }: { href: string; label: string; icon: typeof Home; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'mb-0.5 flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-[14.5px] font-semibold transition-colors',
        active ? 'bg-clay-soft text-clay-ink' : 'text-ink2 hover:bg-card2'
      )}
    >
      <Icon className="h-[19px] w-[19px] flex-none" />
      {label}
    </Link>
  )
}

function AccountMenuItems() {
  const { signOut } = useAuth()
  const { profile } = useUser()
  return (
    <>
      <DropdownMenuLabel>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-semibold text-ink">{profile.full_name}</p>
          <p className="text-xs text-mute">{profile.email}</p>
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
      <DropdownMenuItem onClick={() => signOut()} className="text-danger">
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </DropdownMenuItem>
    </>
  )
}

function Sidebar({ pathname }: { pathname: string }) {
  const { profile } = useUser()
  const initial = profile.full_name?.charAt(0).toUpperCase() || 'U'

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-line bg-[--surface] px-3.5 pb-4 pt-5 md:flex">
      <Link href="/dashboard" className="px-2.5 pb-5">
        <BrandLogo size={30} />
      </Link>

      <nav aria-label="Sidebar navigation" className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {mainNavItems.map((item) => (
          <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />
        ))}

        <div className="px-3 pb-[7px] pt-4 text-[10.5px] font-bold uppercase tracking-[1.2px] text-faint">Tools</div>
        {toolItems.map((item) => (
          <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 rounded-xl border border-line px-2.5 py-2.5 text-left transition-colors hover:bg-card2">
            <span className="grid h-[34px] w-[34px] flex-none place-items-center overflow-hidden rounded-full bg-clay-soft text-sm font-extrabold text-clay-ink">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-bold text-ink">{profile.full_name}</span>
              <span className="block text-[11.5px] font-semibold text-mute">
                {profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Parent'} ·{' '}
                {planLabel(profile.subscription_tier)}
              </span>
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" side="top">
          <AccountMenuItems />
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  )
}

function Topbar() {
  const pathname = usePathname()
  const { profile } = useUser()
  const config = useTopbar()
  const { data: unreadCount } = useUnreadNotificationCount()
  const initial = profile.full_name?.charAt(0).toUpperCase() || 'U'

  const fallbackTitle =
    Object.entries(routeTitles).find(([href]) => isActive(pathname, href))?.[1] ?? 'The Dad Center'
  const title = config.title ?? fallbackTitle
  const subtitle = config.subtitle

  return (
    <header className="digest-topbar sticky top-0 z-20 flex items-end justify-between border-b border-line px-4 py-4 md:px-10 md:py-5">
      <div className="min-w-0">
        <h1 className="truncate text-[22px] font-extrabold tracking-[-0.4px] text-ink">{title}</h1>
        {subtitle != null && <p className="mt-[3px] truncate text-[13px] font-semibold text-mute">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5">
        {config.actions}
        <ToggleTheme />
        <button
          type="button"
          aria-label="Search"
          className="grid h-[38px] w-[38px] place-items-center rounded-[11px] border border-line bg-card text-ink2 transition-colors hover:bg-card2"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
        <Link
          href="/notifications"
          aria-label={`Notifications${(unreadCount ?? 0) > 0 ? `, ${unreadCount} unread` : ''}`}
          className="relative grid h-[38px] w-[38px] place-items-center rounded-[11px] border border-line bg-card text-ink2 transition-colors hover:bg-card2"
        >
          <Bell className="h-[18px] w-[18px]" />
          {(unreadCount ?? 0) > 0 && (
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-clay px-1 text-[10px] font-bold text-white">
              {unreadCount! > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-[11px] bg-clay-soft text-sm font-extrabold text-clay-ink">
              <Avatar className="h-[38px] w-[38px] rounded-[11px]">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />
                <AvatarFallback className="rounded-[11px] bg-clay-soft text-clay-ink">{initial}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <AccountMenuItems />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function MobileNav({ pathname }: { pathname: string }) {
  const { signOut } = useAuth()
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  const activeIndex = mainNavItems.findIndex((item) => isActive(pathname, item.href))

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-line md:hidden"
      style={{ paddingBottom: 'calc(6px + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-stretch justify-around pt-2">
        {mainNavItems.map((item, index) => {
          const active = activeIndex === index
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex w-full flex-col items-center justify-center gap-1 py-1 transition-colors',
                active ? 'text-clay-ink' : 'text-mute'
              )}
            >
              <item.icon className={cn('h-5 w-5', active && 'scale-[1.08]')} />
              <span className="text-[9px] font-bold uppercase tracking-[0.08em]">{item.label}</span>
            </Link>
          )
        })}

        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button className="flex w-full flex-col items-center justify-center gap-1 py-1 text-mute transition-colors active:text-clay-ink">
              <Menu className="h-5 w-5" />
              <span className="text-[9px] font-bold uppercase tracking-[0.08em]">More</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-line bg-[--surface] text-ink"
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-line" />
            <div className="safe-area-bottom space-y-1 pb-6">
              <div className="px-1 pb-2">
                <BabySwitcher />
              </div>
              <div className="my-2 border-t border-line" />
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Tools</p>
              {toolItems.map((item) => (
                <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />
              ))}
              <div className="my-2 border-t border-line" />
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Family</p>
              {familyItems.map((item) => (
                <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />
              ))}
              <div className="my-2 border-t border-line" />
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Account</p>
              {accountItems.map((item) => (
                <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />
              ))}
              <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-[14.5px] font-semibold text-danger transition-colors hover:bg-card2"
              >
                <LogOut className="h-[19px] w-[19px] flex-none" />
                Sign Out
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

export function MainLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="digest-app">
      <TopbarProvider>
        <Sidebar pathname={pathname} />

        <div className="flex min-h-screen flex-col md:pl-64">
          <Topbar />
          <GracePeriodBanner />
          <main className="mx-auto w-full max-w-[1160px] flex-1 px-4 pb-24 pt-5 md:px-10 md:pb-[70px] md:pt-[30px]">
            {children}
          </main>
        </div>

        <MobileNav pathname={pathname} />
      </TopbarProvider>
    </div>
  )
}
