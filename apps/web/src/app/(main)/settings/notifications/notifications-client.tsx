'use client'

import {
  useNotificationPermission,
  usePushSubscription,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useLocalNotification,
} from '@/hooks/use-notifications'
import { Panel } from '@/components/digest'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Bell, BellOff, CheckCircle, AlertTriangle, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { cn } from '@/lib/utils'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn('relative h-7 w-[46px] flex-none rounded-full transition-colors', checked ? 'bg-clay' : 'bg-line')}
    >
      <span
        className={cn('absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow transition-[left]', checked ? 'left-[21px]' : 'left-[3px]')}
      />
    </button>
  )
}

function PrefRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-4 border-b border-line2 px-[18px] py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-ink">{title}</p>
        <p className="text-[12.5px] text-mute">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

export default function NotificationsClient() {
  const { toast } = useToast()
  const { isSupported, requestPermission, isGranted, isDenied } = useNotificationPermission()
  const { isSubscribed, isLoading: subscriptionLoading, subscribe, unsubscribe } = usePushSubscription()
  const { data: preferences, isLoading: preferencesLoading } = useNotificationPreferences()
  const updatePreferences = useUpdateNotificationPreferences()
  const { show: showTestNotification } = useLocalNotification()

  usePageHeader({ title: 'Notifications', subtitle: 'Push, email, and reminders' }, [])

  const handleEnableNotifications = async () => {
    const result = await requestPermission()
    if (result === 'granted') {
      await subscribe()
      toast({ title: 'Notifications enabled!' })
    } else if (result === 'denied') {
      toast({
        title: 'Permission denied',
        description: 'Please enable notifications in your browser settings',
        variant: 'destructive',
      })
    }
  }

  const handleDisableNotifications = async () => {
    await unsubscribe()
    toast({ title: 'Notifications disabled' })
  }

  const handleTogglePreference = async (key: string, value: boolean) => {
    await updatePreferences.mutateAsync({ [key]: value })
  }

  const handleQuietHoursChange = async (key: 'quiet_hours_start' | 'quiet_hours_end', value: string) => {
    await updatePreferences.mutateAsync({ [key]: value })
  }

  const handleTestNotification = () => {
    showTestNotification('Test Notification', {
      body: 'This is a test notification from The Dad Center!',
      tag: 'test',
    })
  }

  if (!isSupported) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link href="/settings" className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80">
          <ArrowLeft className="h-4 w-4" /> Settings
        </Link>

        <div className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-[13.5px] text-danger">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
          <span>
            Your browser doesn&apos;t support push notifications. Try using a modern browser like Chrome, Firefox, or Edge.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/settings" className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80">
        <ArrowLeft className="h-4 w-4" /> Settings
      </Link>

      {/* Permission Status */}
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
        {isGranted ? <Bell className="h-3.5 w-3.5 text-clay-ink" /> : <BellOff className="h-3.5 w-3.5" />}
        Push Notifications
      </div>
      <Panel className="p-[18px]">
        <p className="mb-4 text-[13px] text-mute">
          {isGranted
            ? 'You will receive push notifications on this device'
            : 'Enable push notifications to stay updated'}
        </p>
        <div className="space-y-4">
          {isDenied ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-line bg-card2 px-4 py-3 text-[13.5px] text-ink2">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-mute" />
              <span>
                Notifications are blocked. Please enable them in your browser settings, then refresh this page.
              </span>
            </div>
          ) : isGranted && isSubscribed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-clay-ink">
                <CheckCircle className="h-4 w-4" />
                <span className="text-[14px] font-semibold">Notifications enabled</span>
              </div>
              <button
                onClick={handleDisableNotifications}
                disabled={subscriptionLoading}
                className="inline-flex items-center justify-center rounded-xl border border-line bg-card px-4 py-2.5 text-[14px] font-bold text-ink2 hover:bg-card-hover disabled:opacity-50"
              >
                {subscriptionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Disable'}
              </button>
            </div>
          ) : (
            <button
              onClick={handleEnableNotifications}
              disabled={subscriptionLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              {subscriptionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
              Enable Notifications
            </button>
          )}

          {isGranted && isSubscribed && (
            <button
              onClick={handleTestNotification}
              className="inline-flex items-center justify-center rounded-xl border border-line bg-card px-4 py-2.5 text-[14px] font-bold text-ink2 hover:bg-card-hover"
            >
              Send Test Notification
            </button>
          )}
        </div>
      </Panel>

      {/* Notification Preferences */}
      {preferencesLoading ? (
        <Panel className="mt-7 space-y-4 p-[18px]">
          <div className="h-8 w-full animate-pulse rounded-lg bg-card2" />
          <div className="h-8 w-full animate-pulse rounded-lg bg-card2" />
          <div className="h-8 w-full animate-pulse rounded-lg bg-card2" />
        </Panel>
      ) : (
        <>
          {/* Task Notifications */}
          <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Task Reminders</div>
          <Panel>
            <PrefRow
              title="7-day reminder"
              description="Get a heads up a week before tasks are due"
              checked={preferences?.task_reminders_7_day ?? true}
              onChange={(checked) => handleTogglePreference('task_reminders_7_day', checked)}
            />
            <PrefRow
              title="3-day reminder"
              description="Remind me 3 days before tasks are due"
              checked={preferences?.task_reminders_3_day ?? true}
              onChange={(checked) => handleTogglePreference('task_reminders_3_day', checked)}
            />
            <PrefRow
              title="1-day reminder"
              description="Last chance reminder the day before"
              checked={preferences?.task_reminders_1_day ?? true}
              onChange={(checked) => handleTogglePreference('task_reminders_1_day', checked)}
            />
          </Panel>

          {/* Partner Notifications */}
          <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Partner Activity</div>
          <Panel>
            <PrefRow
              title="Partner activity"
              description="Notify when partner completes tasks or logs"
              checked={preferences?.partner_activity ?? true}
              onChange={(checked) => handleTogglePreference('partner_activity', checked)}
            />
          </Panel>

          {/* Briefing Notifications */}
          <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Weekly Briefings</div>
          <Panel>
            <PrefRow
              title="New briefing alert"
              description="Notify when a new weekly briefing is available"
              checked={preferences?.weekly_briefing ?? true}
              onChange={(checked) => handleTogglePreference('weekly_briefing', checked)}
            />
          </Panel>

          {/* Email Notifications */}
          <div className="mb-3 mt-7 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
            <Mail className="h-3.5 w-3.5 text-clay-ink" />
            Email Notifications
          </div>
          <Panel>
            <PrefRow
              title="Weekly briefing email"
              description="Get your briefing summary delivered to your inbox"
              checked={preferences?.email_weekly_briefing ?? true}
              onChange={(checked) => handleTogglePreference('email_weekly_briefing', checked)}
            />
            <PrefRow
              title="Overdue task digest"
              description="Email when must-do tasks are overdue"
              checked={preferences?.email_task_digest ?? false}
              onChange={(checked) => handleTogglePreference('email_task_digest', checked)}
            />
            <PrefRow
              title="Milestone emails"
              description="Baby development milestones and celebrations"
              checked={preferences?.email_milestones ?? true}
              onChange={(checked) => handleTogglePreference('email_milestones', checked)}
            />
            <PrefRow
              title="Lifecycle emails"
              description="Onboarding tips and getting-started guides"
              checked={preferences?.email_lifecycle ?? true}
              onChange={(checked) => handleTogglePreference('email_lifecycle', checked)}
            />
            <PrefRow
              title="Re-engagement emails"
              description="Updates when you haven't logged in for a while"
              checked={preferences?.re_engagement_emails ?? true}
              onChange={(checked) => handleTogglePreference('re_engagement_emails', checked)}
            />
          </Panel>

          {/* Quiet Hours */}
          <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Quiet Hours</div>
          <Panel className="p-[18px]">
            <p className="mb-4 text-[13px] text-mute">
              Pause notifications during these hours
            </p>
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold text-ink">Enable quiet hours</p>
              <Toggle
                checked={!!preferences?.quiet_hours_start}
                onChange={(checked) => {
                  if (checked) {
                    handleQuietHoursChange('quiet_hours_start', '22:00')
                    handleQuietHoursChange('quiet_hours_end', '07:00')
                  } else {
                    updatePreferences.mutateAsync({ quiet_hours_start: null as unknown as string, quiet_hours_end: null as unknown as string })
                  }
                }}
              />
            </div>

            {!!preferences?.quiet_hours_start && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-ink2">Start time</label>
                  <Select
                    value={preferences?.quiet_hours_start || '22:00'}
                    onValueChange={(value) => handleQuietHoursChange('quiet_hours_start', value)}
                  >
                    <SelectTrigger className="rounded-xl border-line bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-ink2">End time</label>
                  <Select
                    value={preferences?.quiet_hours_end || '07:00'}
                    onValueChange={(value) => handleQuietHoursChange('quiet_hours_end', value)}
                  >
                    <SelectTrigger className="rounded-xl border-line bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  )
}
