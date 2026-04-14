import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import {
  DollarSign,
  ClipboardList,
  Compass,
  Crown,
  LogOut,
  ChevronRight,
  Users,
  UserPlus,
  User,
  Bell,
  CreditCard,
  Newspaper,
  HelpCircle,
  Info,
  MessageCircleQuestion,
  Palette,
  BookOpen,
  MessageSquarePlus,
  Video,
} from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import * as Haptics from 'expo-haptics'

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onPress: () => void
  color?: string
  showChevron?: boolean
}

function MenuItem({ icon, label, onPress, color, showChevron = true }: MenuItemProps) {
  const colors = useColors()
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onPress()
      }}
      style={({ pressed }) => [
        styles.menuItem,
        { borderBottomColor: colors.subtleBg },
        pressed && { backgroundColor: colors.pressed },
      ]}
    >
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={[styles.menuItemLabel, { color: color || colors.textSecondary }]}>
          {label}
        </Text>
      </View>
      {showChevron && <ChevronRight size={18} color={colors.textDim} />}
    </Pressable>
  )
}

export default function MoreScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { signOut, profile, family } = useAuth()

  const tierLabel =
    profile?.subscription_tier === 'premium'
      ? 'Premium'
      : profile?.subscription_tier === 'lifetime'
        ? 'Lifetime'
        : 'Free Plan'

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: 16,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <CardEntrance delay={0}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.copperGlow, borderColor: 'rgba(196,112,63,0.3)' }]}>
              <Text style={[styles.avatarText, { color: colors.copper }]}>
                {(profile?.full_name || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileHeaderInfo}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                {profile?.full_name || 'User'}
              </Text>
              <Text style={[styles.profileTier, { color: colors.textMuted }]}>{tierLabel}</Text>
            </View>
          </View>
        </CardEntrance>

        {/* Tools section */}
        <CardEntrance delay={80}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Tools</Text>
          <GlassCard style={styles.section}>
            <MenuItem
              icon={<DollarSign size={20} color={colors.gold} />}
              label="Budget Planner"
              onPress={() => router.push('/(tabs)/more/budget')}
            />
            <MenuItem
              icon={<ClipboardList size={20} color={colors.sage} />}
              label="Checklists"
              onPress={() => router.push('/(tabs)/more/checklists')}
            />
            <MenuItem
              icon={<Compass size={20} color={colors.sky} />}
              label="Dad Journey"
              onPress={() => router.push('/(tabs)/more/journey')}
            />
            <MenuItem
              icon={<Newspaper size={20} color={colors.sky} />}
              label="Blog"
              onPress={() => router.push('/(tabs)/more/content')}
            />
            <MenuItem
              icon={<Video size={20} color={colors.copper} />}
              label="Video Library"
              onPress={() => router.push('/(tabs)/more/videos')}
            />
            <MenuItem
              icon={<BookOpen size={20} color={colors.sky} />}
              label="Dad Tips"
              onPress={() => {
                const stage = (family as { stage?: string } | null)?.stage
                router.push(
                  stage
                    ? `/(tabs)/more/content?stage=${encodeURIComponent(stage)}&title=Dad+Tips`
                    : '/(tabs)/more/content?title=Dad+Tips'
                )
              }}
            />
          </GlassCard>
        </CardEntrance>

        {/* Family section */}
        <CardEntrance delay={160}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Family</Text>
          <GlassCard style={styles.section}>
            <MenuItem
              icon={<Users size={20} color={colors.rose} />}
              label="Family Members"
              onPress={() => router.push('/(tabs)/more/family')}
            />
            <MenuItem
              icon={<UserPlus size={20} color={colors.sage} />}
              label="Invite Partner"
              onPress={() => router.push('/(tabs)/more/family')}
            />
          </GlassCard>
        </CardEntrance>

        {/* Account section */}
        <CardEntrance delay={240}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Account</Text>
          <GlassCard style={styles.section}>
            <MenuItem
              icon={<User size={20} color={colors.textSecondary} />}
              label="Profile"
              onPress={() => router.push('/(tabs)/more/settings')}
            />
            <MenuItem
              icon={<Palette size={20} color={colors.copper} />}
              label="Appearance"
              onPress={() => router.push('/(screens)/appearance')}
            />
            <MenuItem
              icon={<Bell size={20} color={colors.sky} />}
              label="Notifications"
              onPress={() => router.push('/(tabs)/more/notifications')}
            />
            <MenuItem
              icon={<CreditCard size={20} color={colors.gold} />}
              label="Subscription"
              onPress={() => router.push('/(screens)/upgrade')}
            />
            <MenuItem
              icon={<HelpCircle size={20} color={colors.sage} />}
              label="Help & Support"
              onPress={() => router.push('/(tabs)/more/help')}
            />
            <MenuItem
              icon={<MessageSquarePlus size={20} color={colors.copper} />}
              label="Send Feedback"
              onPress={() => router.push('/(tabs)/more/feedback')}
            />
          </GlassCard>
        </CardEntrance>

        {/* Info section */}
        <CardEntrance delay={320}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Info</Text>
          <GlassCard style={styles.section}>
            <MenuItem
              icon={<Info size={20} color={colors.copper} />}
              label="About The Dad Center"
              onPress={() => router.push('/(tabs)/more/about')}
            />
            <MenuItem
              icon={<MessageCircleQuestion size={20} color={colors.sky} />}
              label="FAQ"
              onPress={() => router.push('/(tabs)/more/faq')}
            />
          </GlassCard>
        </CardEntrance>

        {/* Upgrade CTA for free users */}
        {profile?.subscription_tier !== 'premium' &&
          profile?.subscription_tier !== 'lifetime' && (
            <CardEntrance delay={400}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                  router.push('/(screens)/upgrade')
                }}
                style={[styles.upgradeCard, { borderColor: colors.goldDim }]}
              >
                <LinearGradient
                  colors={[colors.copperDim, colors.goldDim]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.upgradeGradient}
                >
                  <Crown size={22} color={colors.gold} />
                  <View style={styles.upgradeInfo}>
                    <Text style={[styles.upgradeTitle, { color: colors.gold }]}>Upgrade to Premium</Text>
                    <Text style={[styles.upgradeSubtitle, { color: colors.textMuted }]}>
                      Full timeline, partner sync & more
                    </Text>
                  </View>
                  <ChevronRight size={18} color={colors.gold} />
                </LinearGradient>
              </Pressable>
            </CardEntrance>
          )}

        {/* Sign Out */}
        <CardEntrance delay={480}>
          <GlassCard style={styles.section}>
            <MenuItem
              icon={<LogOut size={20} color={colors.coral} />}
              label="Sign Out"
              onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: signOut },
              ])}
              color={colors.coral}
              showChevron={false}
            />
          </GlassCard>
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
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Profile header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarText: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
  },
  profileHeaderInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 22,
  },
  profileTier: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    marginTop: 2,
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

  // Menu items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuItemLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 16,
  },

  // Upgrade CTA
  upgradeCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  upgradeInfo: {
    flex: 1,
  },
  upgradeTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  upgradeSubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    marginTop: 2,
  },
})
