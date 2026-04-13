import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  X,
  Bell,
  CheckSquare,
  BookOpen,
  Users,
  Newspaper,
  Crown,
  Star,
  Moon,
  Mail,
  CalendarCheck,
  Activity,
  Repeat,
} from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import { supabase } from '@/lib/supabase'
import * as Haptics from 'expo-haptics'

interface NotificationToggleProps {
  icon: React.ReactNode
  label: string
  description: string
  value: boolean
  onToggle: (value: boolean) => void
  disabled?: boolean
}

function NotificationToggle({
  icon,
  label,
  description,
  value,
  onToggle,
  disabled,
}: NotificationToggleProps) {
  const colors = useColors()
  return (
    <View style={[styles.toggleRow, { borderBottomColor: colors.border }, disabled && styles.toggleRowDisabled]}>
      <View style={styles.toggleLeft}>
        {icon}
        <View style={styles.toggleInfo}>
          <Text style={[styles.toggleLabel, { color: colors.textSecondary }]}>{label}</Text>
          <Text style={[styles.toggleDesc, { color: colors.textMuted }]}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={(v) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          onToggle(v)
        }}
        trackColor={{ false: colors.textDim, true: 'rgba(196,112,63,0.5)' }}
        thumbColor={value ? colors.copper : colors.textMuted}
        ios_backgroundColor={colors.textDim}
        disabled={disabled}
      />
    </View>
  )
}

interface Preferences {
  push_enabled: boolean
  task_reminders_7_day: boolean
  task_reminders_3_day: boolean
  task_reminders_1_day: boolean
  weekly_briefing: boolean
  partner_activity: boolean
  milestone_notifications: boolean
  quiet_hours_enabled: boolean
  quiet_hours_start: string
  quiet_hours_end: string
  // Email notification preferences (UI-only toggles, saved alongside push prefs)
  email_weekly_briefing: boolean
  email_task_digest: boolean
  email_milestones: boolean
  email_lifecycle: boolean
  re_engagement_emails: boolean
}

const DEFAULT_PREFS: Preferences = {
  push_enabled: true,
  task_reminders_7_day: true,
  task_reminders_3_day: true,
  task_reminders_1_day: true,
  weekly_briefing: true,
  partner_activity: true,
  milestone_notifications: true,
  quiet_hours_enabled: false,
  quiet_hours_start: '22:00',
  quiet_hours_end: '07:00',
  email_weekly_briefing: true,
  email_task_digest: false,
  email_milestones: true,
  email_lifecycle: true,
  re_engagement_emails: true,
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { user, profile } = useAuth()
  const colors = useColors()
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const isPremium =
    profile?.subscription_tier === 'premium' ||
    profile?.subscription_tier === 'lifetime'

  // Load preferences
  useEffect(() => {
    async function loadPrefs() {
      if (!user?.id) return
      try {
        const { data } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (data) {
           
          const extras = (data as any).extras as Record<string, boolean> | null ?? {}
          setPrefs({
            push_enabled: data.push_enabled ?? true,
            task_reminders_7_day: data.task_reminders_7_day ?? true,
            task_reminders_3_day: data.task_reminders_3_day ?? true,
            task_reminders_1_day: data.task_reminders_1_day ?? true,
            weekly_briefing: data.weekly_briefing ?? true,
            partner_activity: data.partner_activity ?? true,
            milestone_notifications: data.milestone_notifications ?? true,
            quiet_hours_enabled: data.quiet_hours_enabled ?? false,
            quiet_hours_start: data.quiet_hours_start ?? '22:00',
            quiet_hours_end: data.quiet_hours_end ?? '07:00',
            email_weekly_briefing: extras.email_weekly_briefing ?? true,
            email_task_digest: extras.email_task_digest ?? false,
            email_milestones: extras.email_milestones ?? true,
            email_lifecycle: extras.email_lifecycle ?? true,
            re_engagement_emails: extras.re_engagement_emails ?? true,
          })
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false)
      }
    }
    loadPrefs()
  }, [user?.id])

  const updatePref = useCallback(
    async (key: keyof Preferences, value: boolean) => {
      if (!user?.id) return

      // Check premium for push notifications beyond free window
      if (!isPremium && key === 'push_enabled' && value) {
        // Check if in 30-day free window
        if (profile?.created_at) {
          const signupDate = new Date(profile.created_at)
          const now = new Date()
          const daysSince = Math.floor(
            (now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24)
          )
          if (daysSince > 30) {
            Alert.alert(
              'Premium Feature',
              'Push notifications beyond 30 days require a premium subscription.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Upgrade',
                  onPress: () => router.push('/(screens)/upgrade'),
                },
              ]
            )
            return
          }
        }
      }

      const newPrefs = { ...prefs, [key]: value }
      setPrefs(newPrefs)

      setSaving(true)
      try {
        const emailKeys = [
          'email_weekly_briefing',
          'email_task_digest',
          'email_milestones',
          'email_lifecycle',
          're_engagement_emails',
        ] as const

        if ((emailKeys as readonly string[]).includes(key)) {
          // Email prefs: store in extras JSON column
          const { data: existing } = await supabase
            .from('notification_preferences')
            .select('extras')
            .eq('user_id', user.id)
            .maybeSingle()
           
          const currentExtras = ((existing as any)?.extras as Record<string, boolean>) ?? {}
          await supabase.from('notification_preferences').upsert(
            {
              user_id: user.id,
               
              extras: { ...currentExtras, [key]: value } as any,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )
        } else {
          await supabase.from('notification_preferences').upsert(
            {
              user_id: user.id,
              [key]: value,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )
        }
      } catch {
        // Revert on failure
        setPrefs(prefs)
        Alert.alert('Error', 'Failed to update notification preferences.')
      } finally {
        setSaving(false)
      }
    },
    [user?.id, prefs, isPremium, profile?.created_at, router]
  )

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
          <Pressable onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: colors.subtleBg }]}>
            <X size={20} color={colors.textMuted} />
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.copper} size="large" />
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
            {saving && (
              <ActivityIndicator
                size="small"
                color={colors.copper}
                style={styles.savingIndicator}
              />
            )}
          </View>
          <Pressable onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: colors.subtleBg }]}>
            <X size={20} color={colors.textMuted} />
          </Pressable>
        </View>
        {/* Master toggle */}
        <CardEntrance delay={0}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>General</Text>
          <GlassCard style={styles.section}>
            <NotificationToggle
              icon={<Bell size={18} color={colors.copper} />}
              label="Push Notifications"
              description="Enable or disable all push notifications"
              value={prefs.push_enabled}
              onToggle={(v) => updatePref('push_enabled', v)}
            />
          </GlassCard>
        </CardEntrance>

        {/* Premium notice for free users */}
        {!isPremium && (
          <CardEntrance delay={60}>
            <Pressable
              onPress={() => router.push('/(screens)/upgrade')}
              style={[styles.premiumNotice, { backgroundColor: colors.goldDim, borderColor: 'rgba(212,168,83,0.15)' }]}
            >
              <Crown size={16} color={colors.gold} />
              <Text style={[styles.premiumNoticeText, { color: colors.gold }]}>
                Free users get push notifications for 30 days. Upgrade for
                unlimited notifications.
              </Text>
            </Pressable>
          </CardEntrance>
        )}

        {/* Task reminders */}
        <CardEntrance delay={120}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Task Reminders</Text>
          <GlassCard style={styles.section}>
            <NotificationToggle
              icon={<CheckSquare size={18} color={colors.sage} />}
              label="Task Reminders"
              description="Get notified when tasks are coming due"
              value={
                prefs.task_reminders_7_day ||
                prefs.task_reminders_3_day ||
                prefs.task_reminders_1_day
              }
              onToggle={(v) => {
                updatePref('task_reminders_7_day', v)
                updatePref('task_reminders_3_day', v)
                updatePref('task_reminders_1_day', v)
              }}
              disabled={!prefs.push_enabled}
            />
          </GlassCard>
        </CardEntrance>

        {/* Weekly briefing */}
        <CardEntrance delay={200}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Briefings</Text>
          <GlassCard style={styles.section}>
            <NotificationToggle
              icon={<BookOpen size={18} color={colors.sky} />}
              label="Weekly Briefing"
              description="Receive your weekly dad briefing notification"
              value={prefs.weekly_briefing}
              onToggle={(v) => updatePref('weekly_briefing', v)}
              disabled={!prefs.push_enabled}
            />
          </GlassCard>
        </CardEntrance>

        {/* Partner activity */}
        <CardEntrance delay={280}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Family</Text>
          <GlassCard style={styles.section}>
            <NotificationToggle
              icon={<Users size={18} color={colors.rose} />}
              label="Partner Activity"
              description="Get notified when your partner completes tasks or checks in"
              value={prefs.partner_activity}
              onToggle={(v) => updatePref('partner_activity', v)}
              disabled={!prefs.push_enabled}
            />
          </GlassCard>
        </CardEntrance>

        {/* Milestones */}
        <CardEntrance delay={340}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Milestones</Text>
          <GlassCard style={styles.section}>
            <NotificationToggle
              icon={<Star size={18} color={colors.gold} />}
              label="Milestone Notifications"
              description="Get notified about baby milestones and development markers"
              value={prefs.milestone_notifications}
              onToggle={(v) => updatePref('milestone_notifications', v)}
              disabled={!prefs.push_enabled}
            />
          </GlassCard>
        </CardEntrance>

        {/* Quiet Hours */}
        <CardEntrance delay={400}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Quiet Hours</Text>
          <GlassCard style={styles.section}>
            <NotificationToggle
              icon={<Moon size={18} color={colors.rose} />}
              label="Quiet Hours"
              description={
                prefs.quiet_hours_enabled
                  ? `No notifications from ${prefs.quiet_hours_start} to ${prefs.quiet_hours_end}`
                  : 'Silence notifications during sleeping hours'
              }
              value={prefs.quiet_hours_enabled}
              onToggle={(v) => updatePref('quiet_hours_enabled', v)}
              disabled={!prefs.push_enabled}
            />
            {prefs.quiet_hours_enabled && prefs.push_enabled && (
              <View style={[styles.quietHoursRow, { borderTopColor: colors.border }]}>
                <View style={styles.quietTimeBlock}>
                  <Text style={[styles.quietTimeLabel, { color: colors.textMuted }]}>Start</Text>
                  <Text style={[styles.quietTimeValue, { color: colors.textSecondary }]}>{prefs.quiet_hours_start}</Text>
                </View>
                <Text style={[styles.quietTimeSeparator, { color: colors.textDim }]}>to</Text>
                <View style={styles.quietTimeBlock}>
                  <Text style={[styles.quietTimeLabel, { color: colors.textMuted }]}>End</Text>
                  <Text style={[styles.quietTimeValue, { color: colors.textSecondary }]}>{prefs.quiet_hours_end}</Text>
                </View>
              </View>
            )}
          </GlassCard>
        </CardEntrance>

        {/* Email Notifications */}
        <CardEntrance delay={460}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Email Notifications</Text>
          <GlassCard style={styles.section}>
            <NotificationToggle
              icon={<BookOpen size={18} color={colors.sky} />}
              label="Weekly Briefing"
              description="Receive your weekly briefing by email"
              value={prefs.email_weekly_briefing}
              onToggle={(v) => updatePref('email_weekly_briefing', v)}
            />
            <NotificationToggle
              icon={<CheckSquare size={18} color={colors.coral} />}
              label="Overdue Task Digest"
              description="Email digest of tasks that need attention"
              value={prefs.email_task_digest}
              onToggle={(v) => updatePref('email_task_digest', v)}
            />
            <NotificationToggle
              icon={<CalendarCheck size={18} color={colors.gold} />}
              label="Milestone Alerts"
              description="Email alerts for baby milestones"
              value={prefs.email_milestones}
              onToggle={(v) => updatePref('email_milestones', v)}
            />
            <NotificationToggle
              icon={<Activity size={18} color={colors.sage} />}
              label="Lifecycle Updates"
              description="Important app updates and new features"
              value={prefs.email_lifecycle}
              onToggle={(v) => updatePref('email_lifecycle', v)}
            />
            <NotificationToggle
              icon={<Repeat size={18} color={colors.textMuted} />}
              label="Re-engagement"
              description="Gentle reminders when you haven't checked in"
              value={prefs.re_engagement_emails}
              onToggle={(v) => updatePref('re_engagement_emails', v)}
            />
          </GlassCard>
        </CardEntrance>

        {/* Info text */}
        <CardEntrance delay={360}>
          <Text style={[styles.infoText, { color: colors.textDim }]}>
            Notification preferences are synced across all your devices. You can
            also manage notifications in your device settings.
          </Text>
        </CardEntrance>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  savingIndicator: {
    marginLeft: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // Section
  sectionTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 8,
  },
  section: {
    overflow: 'hidden',
    marginBottom: 24,
    padding: 0,
  },

  // Toggle row
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  toggleRowDisabled: {
    opacity: 0.4,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    marginRight: 12,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
  },
  toggleDesc: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    marginTop: 2,
  },

  // Premium notice
  premiumNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  premiumNoticeText: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },

  // Quiet hours
  quietHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  quietTimeBlock: {
    alignItems: 'center',
    gap: 4,
  },
  quietTimeLabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
  },
  quietTimeValue: {
    fontFamily: 'Jost-Medium',
    fontSize: 18,
  },
  quietTimeSeparator: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
  },

  // Info text
  infoText: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
    marginTop: 8,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
