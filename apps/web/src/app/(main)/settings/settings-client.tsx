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
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { CardEntrance } from '@/components/ui/animations/CardEntrance'

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

export default function SettingsClient() {
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
      <RevealOnScroll delay={0}>
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
        <p className="font-body text-[--muted]">Manage your account and preferences</p>
      </div>
      </RevealOnScroll>

      {/* Profile Card */}
      <CardEntrance delay={80}>
      <Card className="bg-[--surface] border-[--border]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />
              <AvatarFallback className="text-xl font-display">
                {profile.full_name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-semibold text-white truncate">
                  {profile.full_name || 'User'}
                </h2>
                {isPremium && (
                  <Badge className="bg-copper/20 text-copper border-copper/30">
                    <Crown className="h-3 w-3 mr-1" />
                    {tier === 'lifetime' ? 'Lifetime' : 'Premium'}
                  </Badge>
                )}
              </div>
              <p className="font-body text-sm text-[--muted] truncate">{profile.email}</p>
              <p className="font-ui text-xs text-[--dim] capitalize">{profile.role || 'Parent'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </CardEntrance>

      {/* Settings List */}
      <RevealOnScroll delay={160}>
      <div className="space-y-2">
        {settingsItems.map((item, index) => (
          <CardEntrance key={item.href} delay={index * 80}>
          <Link href={item.href}>
            <Card className="bg-[--surface] border-[--border] hover:bg-[--card] transition-colors cursor-pointer">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-[--card] flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-[--cream]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-white">{item.label}</p>
                    <p className="font-body text-sm text-[--muted]">{item.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[--dim]" />
                </div>
              </CardContent>
            </Card>
          </Link>
          </CardEntrance>
        ))}
      </div>
      </RevealOnScroll>

      {/* App Info */}
      <RevealOnScroll delay={240}>
      <div className="text-center font-body text-sm text-[--dim] pt-4">
        <p>The Dad Center v1.0.0</p>
        <p className="mt-1">
          <Link href="/terms" className="hover:text-[--cream]">Terms</Link>
          {' · '}
          <Link href="/privacy" className="hover:text-[--cream]">Privacy</Link>
          {' · '}
          <a href="mailto:info@thedadcenter.com" className="hover:text-[--cream]">Support</a>
        </p>
      </div>
      </RevealOnScroll>
    </div>
  )
}
