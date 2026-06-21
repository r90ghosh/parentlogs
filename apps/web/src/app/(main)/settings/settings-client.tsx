'use client'

import Link from 'next/link'
import { User, Users, Bell, Palette, CreditCard, ChevronRight, Crown, HelpCircle } from 'lucide-react'
import { useUser } from '@/components/user-provider'
import { useIsPremium } from '@/hooks/use-subscription'
import { Panel, Badge } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'

const groups = [
  {
    label: 'Account',
    items: [
      { href: '/settings/profile', icon: User, label: 'Profile', description: 'Name, avatar, and role' },
      { href: '/settings/family', icon: Users, label: 'Family', description: 'Due date, baby name, partner' },
      { href: '/settings/subscription', icon: CreditCard, label: 'Subscription', description: 'Plan and billing' },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { href: '/settings/notifications', icon: Bell, label: 'Notifications', description: 'Push, email, and reminders' },
      { href: '/settings/appearance', icon: Palette, label: 'Appearance', description: 'Theme and display' },
    ],
  },
  {
    label: 'Support',
    items: [{ href: '/help', icon: HelpCircle, label: 'Help & Support', description: 'FAQ and contact' }],
  },
]

export default function SettingsClient() {
  const { profile } = useUser()
  const { isPremium, tier } = useIsPremium()

  usePageHeader({ title: 'Settings', subtitle: 'Manage your account and preferences' }, [])

  return (
    <div className="mx-auto max-w-2xl">
      {/* Profile summary */}
      <Panel className="flex items-center gap-4 p-5">
        <span className="grid h-16 w-16 flex-none place-items-center overflow-hidden rounded-full bg-clay-soft text-xl font-extrabold text-clay-ink">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            profile.full_name?.charAt(0).toUpperCase() || 'U'
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-[18px] font-extrabold text-ink">{profile.full_name || 'User'}</h2>
            {isPremium && (
              <Badge tone="gold">
                <Crown className="mr-1 h-3 w-3" />
                {tier === 'lifetime' ? 'Lifetime' : 'Premium'}
              </Badge>
            )}
          </div>
          <p className="truncate text-[13.5px] text-mute">{profile.email}</p>
          <p className="text-[12px] capitalize text-faint">{profile.role || 'Parent'}</p>
        </div>
      </Panel>

      {groups.map((g) => (
        <div key={g.label}>
          <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">{g.label}</div>
          <Panel>
            {g.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 border-b border-line2 px-[18px] py-4 transition-colors last:border-b-0 hover:bg-card-hover"
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-card2">
                  <item.icon className="h-5 w-5 text-ink2" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-ink">{item.label}</p>
                  <p className="text-[12.5px] text-mute">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 flex-none text-faint" />
              </Link>
            ))}
          </Panel>
        </div>
      ))}

      <div className="pt-8 text-center text-[12.5px] text-faint">
        <p>The Dad Center v1.0.0</p>
        <p className="mt-1">
          <Link href="/terms" className="hover:text-clay-ink">Terms</Link>
          {' · '}
          <Link href="/privacy" className="hover:text-clay-ink">Privacy</Link>
          {' · '}
          <a href="mailto:info@thedadcenter.com" className="hover:text-clay-ink">Support</a>
        </p>
      </div>
    </div>
  )
}
