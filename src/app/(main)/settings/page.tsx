'use client'

import { useUser } from '@/components/user-provider'
import { useIsPremium } from '@/hooks/use-subscription'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  User,
  Users,
  Bell,
  Palette,
  CreditCard,
  ChevronRight,
  Crown,
} from 'lucide-react'
import Link from 'next/link'

const settingsItems = [
  {
    href: '/settings/profile',
    icon: User,
    label: 'Profile',
    description: 'Name, avatar, and role',
  },
  {
    href: '/settings/family',
    icon: Users,
    label: 'Family',
    description: 'Due date, baby name, partner',
  },
  {
    href: '/settings/notifications',
    icon: Bell,
    label: 'Notifications',
    description: 'Push, email, and reminders',
  },
  {
    href: '/settings/appearance',
    icon: Palette,
    label: 'Appearance',
    description: 'Theme and display',
  },
  {
    href: '/settings/subscription',
    icon: CreditCard,
    label: 'Subscription',
    description: 'Plan and billing',
  },
]

export default function SettingsPage() {
  const { profile } = useUser()
  const { isPremium, tier, isLoading: premiumLoading } = useIsPremium()

  if (premiumLoading) {
    return (
      <div className="p-4 space-y-6 max-w-2xl">
        <Skeleton className="h-24 w-full" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-surface-400">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <Card className="bg-surface-900 border-surface-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />
              <AvatarFallback className="text-xl">
                {profile.full_name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white truncate">
                  {profile.full_name || 'User'}
                </h2>
                {isPremium && (
                  <Badge className="bg-accent-500/20 text-accent-400 border-accent-500/30">
                    <Crown className="h-3 w-3 mr-1" />
                    {tier === 'lifetime' ? 'Lifetime' : 'Premium'}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-surface-400 truncate">{profile.email}</p>
              <p className="text-xs text-surface-500 capitalize">{profile.role || 'Parent'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings List */}
      <div className="space-y-2">
        {settingsItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="bg-surface-900 border-surface-800 hover:bg-surface-800/50 transition-colors cursor-pointer">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-surface-800 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-surface-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{item.label}</p>
                    <p className="text-sm text-surface-400">{item.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-surface-500" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* App Info */}
      <div className="text-center text-sm text-surface-500 pt-4">
        <p>ParentLogs v1.0.0</p>
        <p className="mt-1">
          <Link href="/terms" className="hover:text-surface-300">Terms</Link>
          {' · '}
          <Link href="/privacy" className="hover:text-surface-300">Privacy</Link>
          {' · '}
          <a href="mailto:support@parentlogs.com" className="hover:text-surface-300">Support</a>
        </p>
      </div>
    </div>
  )
}
