'use client'

import {
  useNotificationPermission,
  usePushSubscription,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useLocalNotification,
} from '@/hooks/use-notifications'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Bell, BellOff, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function NotificationsClient() {
  const { toast } = useToast()
  const { isSupported, requestPermission, isGranted, isDenied } = useNotificationPermission()
  const { isSubscribed, isLoading: subscriptionLoading, subscribe, unsubscribe } = usePushSubscription()
  const { data: preferences, isLoading: preferencesLoading } = useNotificationPreferences()
  const updatePreferences = useUpdateNotificationPreferences()
  const { show: showTestNotification } = useLocalNotification()

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
      <div className="p-4 space-y-4 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-display text-xl font-bold text-white">Notifications</h1>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-body">
            Your browser doesn&apos;t support push notifications. Try using a modern browser like Chrome, Firefox, or Edge.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="font-display text-xl font-bold text-white">Notifications</h1>
      </div>

      {/* Permission Status */}
      <Card className="bg-[--surface] border-[--border]">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            {isGranted ? (
              <Bell className="h-5 w-5 text-copper" />
            ) : (
              <BellOff className="h-5 w-5 text-[--dim]" />
            )}
            Push Notifications
          </CardTitle>
          <CardDescription className="font-body">
            {isGranted
              ? 'You will receive push notifications on this device'
              : 'Enable push notifications to stay updated'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDenied ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-body">
                Notifications are blocked. Please enable them in your browser settings, then refresh this page.
              </AlertDescription>
            </Alert>
          ) : isGranted && isSubscribed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-copper">
                <CheckCircle className="h-4 w-4" />
                <span className="font-body text-sm">Notifications enabled</span>
              </div>
              <Button
                variant="outline"
                onClick={handleDisableNotifications}
                disabled={subscriptionLoading}
                className="font-ui font-semibold"
              >
                {subscriptionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Disable'}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleEnableNotifications}
              disabled={subscriptionLoading}
              className="w-full font-ui font-semibold"
            >
              {subscriptionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Bell className="h-4 w-4 mr-2" />
              )}
              Enable Notifications
            </Button>
          )}

          {isGranted && isSubscribed && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestNotification}
              className="font-ui"
            >
              Send Test Notification
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      {preferencesLoading ? (
        <Card className="bg-[--surface] border-[--border]">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Task Notifications */}
          <Card className="bg-[--surface] border-[--border]">
            <CardHeader>
              <CardTitle className="font-display text-lg">Task Reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-ui font-medium">7-day reminder</Label>
                  <p className="font-body text-xs text-[--muted]">Get a heads up a week before tasks are due</p>
                </div>
                <Switch
                  checked={preferences?.task_reminders_7_day ?? true}
                  onCheckedChange={(checked) => handleTogglePreference('task_reminders_7_day', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-ui font-medium">3-day reminder</Label>
                  <p className="font-body text-xs text-[--muted]">Remind me 3 days before tasks are due</p>
                </div>
                <Switch
                  checked={preferences?.task_reminders_3_day ?? true}
                  onCheckedChange={(checked) => handleTogglePreference('task_reminders_3_day', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-ui font-medium">1-day reminder</Label>
                  <p className="font-body text-xs text-[--muted]">Last chance reminder the day before</p>
                </div>
                <Switch
                  checked={preferences?.task_reminders_1_day ?? true}
                  onCheckedChange={(checked) => handleTogglePreference('task_reminders_1_day', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Partner Notifications */}
          <Card className="bg-[--surface] border-[--border]">
            <CardHeader>
              <CardTitle className="font-display text-lg">Partner Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-ui font-medium">Partner activity</Label>
                  <p className="font-body text-xs text-[--muted]">Notify when partner completes tasks or logs</p>
                </div>
                <Switch
                  checked={preferences?.partner_activity ?? true}
                  onCheckedChange={(checked) => handleTogglePreference('partner_activity', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Briefing Notifications */}
          <Card className="bg-[--surface] border-[--border]">
            <CardHeader>
              <CardTitle className="font-display text-lg">Weekly Briefings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-ui font-medium">New briefing alert</Label>
                  <p className="font-body text-xs text-[--muted]">Notify when a new weekly briefing is available</p>
                </div>
                <Switch
                  checked={preferences?.weekly_briefing ?? true}
                  onCheckedChange={(checked) => handleTogglePreference('weekly_briefing', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card className="bg-[--surface] border-[--border]">
            <CardHeader>
              <CardTitle className="font-display text-lg">Quiet Hours</CardTitle>
              <CardDescription className="font-body">
                Pause notifications during these hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-ui font-medium">Enable quiet hours</Label>
                </div>
                <Switch
                  checked={!!preferences?.quiet_hours_start}
                  onCheckedChange={(checked) => {
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-ui font-medium">Start time</Label>
                    <Select
                      value={preferences?.quiet_hours_start || '22:00'}
                      onValueChange={(value) => handleQuietHoursChange('quiet_hours_start', value)}
                    >
                      <SelectTrigger className="bg-[--card] border-[--border]">
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
                  <div className="space-y-2">
                    <Label className="font-ui font-medium">End time</Label>
                    <Select
                      value={preferences?.quiet_hours_end || '07:00'}
                      onValueChange={(value) => handleQuietHoursChange('quiet_hours_end', value)}
                    >
                      <SelectTrigger className="bg-[--card] border-[--border]">
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
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
