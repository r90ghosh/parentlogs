'use client'

import { useEffect } from 'react'
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

export default function NotificationSettingsPage() {
  const { toast } = useToast()
  const { permission, isSupported, requestPermission, isGranted, isDenied } = useNotificationPermission()
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
      body: 'This is a test notification from ParentLogs!',
      tag: 'test',
    })
  }

  if (!isSupported) {
    return (
      <div className="p-4 md:ml-64 space-y-4 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-white">Notifications</h1>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your browser doesn't support push notifications. Try using a modern browser like Chrome, Firefox, or Edge.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-4 md:ml-64 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-white">Notifications</h1>
      </div>

      {/* Permission Status */}
      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isGranted ? (
              <Bell className="h-5 w-5 text-accent-500" />
            ) : (
              <BellOff className="h-5 w-5 text-surface-500" />
            )}
            Push Notifications
          </CardTitle>
          <CardDescription>
            {isGranted
              ? 'You will receive push notifications on this device'
              : 'Enable push notifications to stay updated'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDenied ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Notifications are blocked. Please enable them in your browser settings, then refresh this page.
              </AlertDescription>
            </Alert>
          ) : isGranted && isSubscribed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent-500">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Notifications enabled</span>
              </div>
              <Button
                variant="outline"
                onClick={handleDisableNotifications}
                disabled={subscriptionLoading}
              >
                {subscriptionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Disable'}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleEnableNotifications}
              disabled={subscriptionLoading}
              className="w-full"
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
            >
              Send Test Notification
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      {preferencesLoading ? (
        <Card className="bg-surface-900 border-surface-800">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Task Notifications */}
          <Card className="bg-surface-900 border-surface-800">
            <CardHeader>
              <CardTitle className="text-lg">Task Reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily task digest</Label>
                  <p className="text-xs text-surface-400">Get a morning summary of today's tasks</p>
                </div>
                <Switch
                  checked={preferences?.task_reminders ?? true}
                  onCheckedChange={(checked) => handleTogglePreference('task_reminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Due date reminders</Label>
                  <p className="text-xs text-surface-400">Remind me when tasks are due</p>
                </div>
                <Switch
                  checked={preferences?.due_date_reminders ?? true}
                  onCheckedChange={(checked) => handleTogglePreference('due_date_reminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Overdue alerts</Label>
                  <p className="text-xs text-surface-400">Alert me about overdue tasks</p>
                </div>
                <Switch
                  checked={preferences?.overdue_alerts ?? true}
                  onCheckedChange={(checked) => handleTogglePreference('overdue_alerts', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Partner Notifications */}
          <Card className="bg-surface-900 border-surface-800">
            <CardHeader>
              <CardTitle className="text-lg">Partner Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Partner activity</Label>
                  <p className="text-xs text-surface-400">Notify when partner completes tasks or logs</p>
                </div>
                <Switch
                  checked={preferences?.partner_activity ?? true}
                  onCheckedChange={(checked) => handleTogglePreference('partner_activity', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Shift change reminder</Label>
                  <p className="text-xs text-surface-400">Remind to do shift handoff</p>
                </div>
                <Switch
                  checked={preferences?.shift_reminders ?? false}
                  onCheckedChange={(checked) => handleTogglePreference('shift_reminders', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Briefing Notifications */}
          <Card className="bg-surface-900 border-surface-800">
            <CardHeader>
              <CardTitle className="text-lg">Weekly Briefings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>New briefing alert</Label>
                  <p className="text-xs text-surface-400">Notify when a new weekly briefing is available</p>
                </div>
                <Switch
                  checked={preferences?.weekly_briefing ?? true}
                  onCheckedChange={(checked) => handleTogglePreference('weekly_briefing', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card className="bg-surface-900 border-surface-800">
            <CardHeader>
              <CardTitle className="text-lg">Quiet Hours</CardTitle>
              <CardDescription>
                Pause notifications during these hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable quiet hours</Label>
                </div>
                <Switch
                  checked={preferences?.quiet_hours_enabled ?? false}
                  onCheckedChange={(checked) => handleTogglePreference('quiet_hours_enabled', checked)}
                />
              </div>

              {preferences?.quiet_hours_enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start time</Label>
                    <Select
                      value={preferences?.quiet_hours_start || '22:00'}
                      onValueChange={(value) => handleQuietHoursChange('quiet_hours_start', value)}
                    >
                      <SelectTrigger className="bg-surface-800 border-surface-700">
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
                    <Label>End time</Label>
                    <Select
                      value={preferences?.quiet_hours_end || '07:00'}
                      onValueChange={(value) => handleQuietHoursChange('quiet_hours_end', value)}
                    >
                      <SelectTrigger className="bg-surface-800 border-surface-700">
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
