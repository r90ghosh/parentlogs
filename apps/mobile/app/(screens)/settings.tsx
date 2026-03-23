import { useState } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
  Linking,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import {
  X,
  ChevronRight,
  User,
  Users,
  UserPlus,
  Bell,
  CreditCard,
  LogOut,
  Trash2,
  Copy,
  Crown,
  Share2,
  ExternalLink,
  KeyRound,
} from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRevenueCat } from '@/components/providers/RevenueCatProvider'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import * as Haptics from 'expo-haptics'
import * as WebBrowser from 'expo-web-browser'

interface SettingsRowProps {
  icon: React.ReactNode
  label: string
  value?: string
  onPress?: () => void
  color?: string
  danger?: boolean
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  color,
  danger,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          onPress()
        }
      }}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.settingsRow,
        pressed && onPress && styles.settingsRowPressed,
      ]}
    >
      <View style={styles.settingsRowLeft}>
        {icon}
        <Text
          style={[
            styles.settingsRowLabel,
            danger && styles.dangerText,
            color ? { color } : null,
          ]}
        >
          {label}
        </Text>
      </View>
      <View style={styles.settingsRowRight}>
        {value && <Text style={styles.settingsRowValue}>{value}</Text>}
        {onPress && <ChevronRight size={16} color="#4a4239" />}
      </View>
    </Pressable>
  )
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { signOut, profile, family, user } = useAuth()
  const { isPro, customerInfo } = useRevenueCat()
  const [deletingAccount, setDeletingAccount] = useState(false)

  const tierLabel =
    profile?.subscription_tier === 'premium'
      ? 'Premium'
      : profile?.subscription_tier === 'lifetime'
        ? 'Lifetime'
        : 'Free'

  async function handleCopyInviteCode() {
    if (!family?.invite_code) return
    try {
      await Share.share({
        message: family.invite_code,
      })
    } catch {
      // User cancelled
    }
  }

  async function handleShareInviteCode() {
    if (!family?.invite_code) return
    try {
      await Share.share({
        message: `Join me on The Dad Center! Use invite code: ${family.invite_code}\n\nDownload at thedadcenter.com`,
      })
    } catch {
      // User cancelled
    }
  }

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: signOut,
      },
    ])
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.\n\nIf you have an active subscription, deleting your account will NOT cancel it. Please cancel your subscription in Settings > Subscriptions before deleting your account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            setDeletingAccount(true)
            try {
              const response = await fetch(
                `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`,
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${(await (await import('@/lib/supabase')).supabase.auth.getSession()).data.session?.access_token}`,
                    'Content-Type': 'application/json',
                  },
                }
              )
              if (response.ok) {
                await signOut()
              } else {
                Alert.alert(
                  'Error',
                  'Failed to delete account. Please try again or contact support.'
                )
              }
            } catch {
              Alert.alert('Error', 'Something went wrong. Please try again.')
            } finally {
              setDeletingAccount(false)
            }
          },
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={20} color="#7a6f62" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <CardEntrance delay={0}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <GlassCard style={styles.section}>
            <SettingsRow
              icon={<User size={18} color="#ede6dc" />}
              label="Name"
              value={profile?.full_name || 'Not set'}
              onPress={() => router.push('/(screens)/edit-profile')}
            />
            <SettingsRow
              icon={<User size={18} color="#7a6f62" />}
              label="Role"
              value={
                profile?.role === 'dad'
                  ? 'Dad'
                  : profile?.role === 'mom'
                    ? 'Mom'
                    : profile?.role || 'Not set'
              }
              onPress={() => router.push('/(screens)/edit-profile')}
            />
          </GlassCard>
        </CardEntrance>

        {/* Family Section */}
        <CardEntrance delay={80}>
          <Text style={styles.sectionTitle}>Family</Text>
          <GlassCard style={styles.section}>
            <SettingsRow
              icon={<Users size={18} color="#c47a8f" />}
              label="Family Members"
              onPress={() => router.push('/(screens)/family')}
            />
            {family?.invite_code && (
              <>
                <View style={styles.inviteCodeRow}>
                  <View style={styles.settingsRowLeft}>
                    <UserPlus size={18} color="#6b8f71" />
                    <View>
                      <Text style={styles.settingsRowLabel}>Invite Code</Text>
                      <Text style={styles.inviteCode}>
                        {family.invite_code}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.inviteActions}>
                    <Pressable
                      onPress={handleCopyInviteCode}
                      style={styles.inviteActionButton}
                    >
                      <Copy size={16} color="#6b8f71" />
                    </Pressable>
                    <Pressable
                      onPress={handleShareInviteCode}
                      style={styles.inviteActionButton}
                    >
                      <Share2 size={16} color="#6b8f71" />
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </GlassCard>
        </CardEntrance>

        {/* Notifications */}
        <CardEntrance delay={160}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <GlassCard style={styles.section}>
            <SettingsRow
              icon={<Bell size={18} color="#5b9bd5" />}
              label="Notification Preferences"
              onPress={() => router.push('/(screens)/notifications')}
            />
          </GlassCard>
        </CardEntrance>

        {/* Security */}
        <CardEntrance delay={200}>
          <Text style={styles.sectionTitle}>Security</Text>
          <GlassCard style={styles.section}>
            <SettingsRow
              icon={<KeyRound size={18} color="#c4703f" />}
              label={
                user?.identities?.some((i) => i.provider === 'email')
                  ? 'Change Password'
                  : 'Set Password'
              }
              onPress={() => router.push('/(screens)/change-password')}
            />
          </GlassCard>
        </CardEntrance>

        {/* Subscription */}
        <CardEntrance delay={280}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <GlassCard style={styles.section}>
            <View style={styles.subscriptionRow}>
              <View style={styles.settingsRowLeft}>
                <CreditCard size={18} color="#d4a853" />
                <View>
                  <Text style={styles.settingsRowLabel}>Current Plan</Text>
                  <View style={styles.tierBadgeRow}>
                    {(profile?.subscription_tier === 'premium' ||
                      profile?.subscription_tier === 'lifetime') && (
                      <Crown size={12} color="#d4a853" />
                    )}
                    <Text
                      style={[
                        styles.tierBadgeText,
                        (profile?.subscription_tier === 'premium' ||
                          profile?.subscription_tier === 'lifetime') &&
                          styles.tierBadgeTextPremium,
                      ]}
                    >
                      {tierLabel}
                    </Text>
                  </View>
                  {profile?.subscription_tier === 'lifetime' && (
                    <Text style={styles.subscriptionDetail}>Never expires</Text>
                  )}
                  {profile?.subscription_tier === 'premium' && customerInfo?.entitlements?.active?.['The Dad Center Pro']?.expirationDate && (
                    <Text style={styles.subscriptionDetail}>
                      Renews {new Date(customerInfo.entitlements.active['The Dad Center Pro'].expirationDate!).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            {isPro || profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'lifetime' ? (
                <SettingsRow
                  icon={<ExternalLink size={18} color="#d4a853" />}
                  label="Manage Subscription"
                  onPress={() => {
                    Alert.alert(
                      'Manage Subscription',
                      'You can manage or cancel your subscription in your device settings.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Open Settings',
                          onPress: () => {
                            const url = Platform.OS === 'ios'
                              ? 'https://apps.apple.com/account/subscriptions'
                              : 'https://play.google.com/store/account/subscriptions'
                            Linking.openURL(url)
                          },
                        },
                      ]
                    )
                  }}
                />
              ) : (
                <SettingsRow
                  icon={<Crown size={18} color="#d4a853" />}
                  label="Upgrade to Premium"
                  onPress={() => router.push('/(screens)/upgrade')}
                  color="#d4a853"
                />
              )}
          </GlassCard>
        </CardEntrance>

        {/* Legal */}
        <CardEntrance delay={360}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <GlassCard style={styles.section}>
            <SettingsRow
              icon={<ExternalLink size={18} color="#7a6f62" />}
              label="Privacy Policy"
              onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/privacy')}
            />
            <SettingsRow
              icon={<ExternalLink size={18} color="#7a6f62" />}
              label="Terms of Service"
              onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/terms')}
            />
          </GlassCard>
        </CardEntrance>

        {/* About */}
        <CardEntrance delay={400}>
          <Text style={styles.sectionTitle}>About</Text>
          <GlassCard style={styles.section}>
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                The Dad Center provides general pregnancy and parenting information for educational purposes only. It is not intended as medical advice. Always consult your healthcare provider for medical decisions.
              </Text>
            </View>
          </GlassCard>
        </CardEntrance>

        {/* Sign Out */}
        <CardEntrance delay={440}>
          <GlassCard style={styles.section}>
            <SettingsRow
              icon={<LogOut size={18} color="#d4836b" />}
              label="Sign Out"
              onPress={handleSignOut}
              danger
            />
          </GlassCard>
        </CardEntrance>

        {/* Danger Zone */}
        <CardEntrance delay={480}>
          <Text style={styles.dangerSectionTitle}>Danger Zone</Text>
          <GlassCard style={styles.dangerSection}>
            <Pressable
              onPress={handleDeleteAccount}
              disabled={deletingAccount}
              style={({ pressed }) => [
                styles.settingsRow,
                pressed && styles.settingsRowPressed,
              ]}
            >
              <View style={styles.settingsRowLeft}>
                <Trash2 size={18} color="#d4836b" />
                <Text style={[styles.settingsRowLabel, styles.dangerText]}>
                  Delete Account
                </Text>
              </View>
              {deletingAccount && (
                <ActivityIndicator size="small" color="#d4836b" />
              )}
            </Pressable>
            <Text style={styles.dangerDescription}>
              Permanently delete your account, family data, and all associated
              information. This cannot be undone.
            </Text>
          </GlassCard>
        </CardEntrance>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
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
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
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
    color: '#7a6f62',
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

  // Settings row
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  settingsRowPressed: {
    backgroundColor: 'rgba(237,230,220,0.04)',
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  settingsRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsRowLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
    color: '#ede6dc',
  },
  settingsRowValue: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    color: '#7a6f62',
  },

  // Invite code
  inviteCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  inviteCode: {
    fontFamily: 'Jost-Medium',
    fontSize: 18,
    color: '#6b8f71',
    letterSpacing: 2,
    marginTop: 4,
  },
  inviteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  inviteActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(107,143,113,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Subscription
  subscriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  tierBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  tierBadgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#7a6f62',
  },
  tierBadgeTextPremium: {
    color: '#d4a853',
  },
  subscriptionDetail: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 2,
  },

  // Danger
  dangerSectionTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#d4836b',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 8,
  },
  dangerSection: {
    overflow: 'hidden',
    marginBottom: 24,
    padding: 0,
    borderColor: 'rgba(212,131,107,0.15)',
  },
  dangerText: {
    color: '#d4836b',
  },
  dangerDescription: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#4a4239',
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Disclaimer
  disclaimerContainer: {
    padding: 16,
  },
  disclaimerText: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#7a6f62',
    lineHeight: 20,
  },
})
