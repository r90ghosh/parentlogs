'use client'

import { ReactNode } from 'react'
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
import { Logo } from '@/components/ui/logo'

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

export function MainLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const { profile, family } = useUser()

  const weekDisplay = family ? `Week ${family.current_week}` : ''

  return (
    <div className="min-h-screen min-h-[100dvh] bg-surface-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface-900 border-b border-surface-800">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Logo size="sm" href="/dashboard" variant="dark" />
            {weekDisplay && (
              <span className="text-xs bg-accent-600/20 text-accent-400 px-2 py-1 rounded-full">
                {weekDisplay}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />
                    <AvatarFallback>
                      {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile.full_name}</p>
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
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
                <DropdownMenuItem onClick={() => signOut()} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24 md:pb-4 md:ml-64">
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-900/95 backdrop-blur-sm border-t border-surface-800 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full gap-1 text-xs',
                  isActive ? 'text-accent-500' : 'text-surface-400'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {/* More menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-xs text-surface-400 active:text-accent-400 transition-colors">
                <Menu className="h-5 w-5" />
                <span>More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-surface-900 border-surface-800 rounded-t-2xl max-h-[70vh] overflow-y-auto">
              <div className="w-12 h-1 bg-surface-700 rounded-full mx-auto mb-4" />

              <div className="pb-6 safe-area-bottom space-y-1">
                {/* Tools Section */}
                <p className="text-xs uppercase tracking-wider text-surface-500 px-3 py-2">
                  Tools
                </p>
                {moreToolItems.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors w-full',
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'bg-accent-600/20 text-accent-400'
                        : 'text-surface-300 hover:bg-surface-800 active:bg-surface-700'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                ))}

                <div className="border-t border-surface-800 my-2" />

                {/* Family Section */}
                <p className="text-xs uppercase tracking-wider text-surface-500 px-3 py-2">
                  Family
                </p>
                {moreFamilyItems.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors w-full',
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'bg-accent-600/20 text-accent-400'
                        : 'text-surface-300 hover:bg-surface-800 active:bg-surface-700'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                ))}

                <div className="border-t border-surface-800 my-2" />

                {/* Account Section */}
                <p className="text-xs uppercase tracking-wider text-surface-500 px-3 py-2">
                  Account
                </p>
                {moreAccountItems.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors w-full',
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'bg-accent-600/20 text-accent-400'
                        : 'text-surface-300 hover:bg-surface-800 active:bg-surface-700'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors w-full text-red-400 hover:bg-surface-800 active:bg-surface-700"
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
      <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-64 bg-surface-900 border-r border-surface-800 flex-col p-4 overflow-y-auto">
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-accent-600/20 text-accent-400'
                    : 'text-surface-300 hover:bg-surface-800'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-surface-800 my-3" />

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-surface-500 px-3 py-2">
            Tools
          </p>
          {moreToolItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-accent-600/20 text-accent-400'
                    : 'text-surface-300 hover:bg-surface-800'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="border-t border-surface-800 my-3" />

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-surface-500 px-3 py-2">
            Family
          </p>
          {moreFamilyItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-accent-600/20 text-accent-400'
                    : 'text-surface-300 hover:bg-surface-800'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="border-t border-surface-800 my-3" />

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-surface-500 px-3 py-2">
            Account
          </p>
          {moreAccountItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-accent-600/20 text-accent-400'
                    : 'text-surface-300 hover:bg-surface-800'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-red-400 hover:bg-surface-800"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </div>
  )
}
