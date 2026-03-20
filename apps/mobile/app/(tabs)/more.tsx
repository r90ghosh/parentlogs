import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import {
  DollarSign,
  ClipboardList,
  Compass,
  Settings,
  Crown,
  LogOut,
  ChevronRight,
  Users,
  UserPlus,
  User,
  Bell,
  CreditCard,
} from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
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
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onPress()
      }}
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
      ]}
    >
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={[styles.menuItemLabel, color ? { color } : null]}>
          {label}
        </Text>
      </View>
      {showChevron && <ChevronRight size={18} color="#4a4239" />}
    </Pressable>
  )
}

export default function MoreScreen() {
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <CardEntrance delay={0}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {(profile?.full_name || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileHeaderInfo}>
              <Text style={styles.profileName}>
                {profile?.full_name || 'User'}
              </Text>
              <Text style={styles.profileTier}>{tierLabel}</Text>
            </View>
          </View>
        </CardEntrance>

        {/* Tools section */}
        <CardEntrance delay={80}>
          <Text style={styles.sectionTitle}>Tools</Text>
          <GlassCard style={styles.section}>
            <MenuItem
              icon={<DollarSign size={20} color="#d4a853" />}
              label="Budget Planner"
              onPress={() => router.push('/(screens)/budget')}
            />
            <MenuItem
              icon={<ClipboardList size={20} color="#6b8f71" />}
              label="Checklists"
              onPress={() => router.push('/(screens)/checklists')}
            />
            <MenuItem
              icon={<Compass size={20} color="#5b9bd5" />}
              label="Dad Journey"
              onPress={() => router.push('/(screens)/journey')}
            />
          </GlassCard>
        </CardEntrance>

        {/* Family section */}
        <CardEntrance delay={160}>
          <Text style={styles.sectionTitle}>Family</Text>
          <GlassCard style={styles.section}>
            <MenuItem
              icon={<Users size={20} color="#c47a8f" />}
              label="Family Members"
              onPress={() => router.push('/(screens)/settings')}
            />
            <MenuItem
              icon={<UserPlus size={20} color="#6b8f71" />}
              label="Invite Partner"
              onPress={() => router.push('/(screens)/settings')}
            />
          </GlassCard>
        </CardEntrance>

        {/* Account section */}
        <CardEntrance delay={240}>
          <Text style={styles.sectionTitle}>Account</Text>
          <GlassCard style={styles.section}>
            <MenuItem
              icon={<User size={20} color="#ede6dc" />}
              label="Profile"
              onPress={() => router.push('/(screens)/settings')}
            />
            <MenuItem
              icon={<Bell size={20} color="#5b9bd5" />}
              label="Notifications"
              onPress={() => router.push('/(screens)/notifications')}
            />
            <MenuItem
              icon={<CreditCard size={20} color="#d4a853" />}
              label="Subscription"
              onPress={() => router.push('/(screens)/upgrade')}
            />
            <MenuItem
              icon={<Settings size={20} color="#7a6f62" />}
              label="Settings"
              onPress={() => router.push('/(screens)/settings')}
            />
          </GlassCard>
        </CardEntrance>

        {/* Upgrade CTA for free users */}
        {profile?.subscription_tier !== 'premium' &&
          profile?.subscription_tier !== 'lifetime' && (
            <CardEntrance delay={320}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                  router.push('/(screens)/upgrade')
                }}
                style={styles.upgradeCard}
              >
                <LinearGradient
                  colors={['rgba(196,112,63,0.15)', 'rgba(212,168,83,0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.upgradeGradient}
                >
                  <Crown size={22} color="#d4a853" />
                  <View style={styles.upgradeInfo}>
                    <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                    <Text style={styles.upgradeSubtitle}>
                      Full timeline, partner sync & more
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#d4a853" />
                </LinearGradient>
              </Pressable>
            </CardEntrance>
          )}

        {/* Sign Out */}
        <CardEntrance delay={400}>
          <GlassCard style={styles.section}>
            <MenuItem
              icon={<LogOut size={20} color="#d4836b" />}
              label="Sign Out"
              onPress={signOut}
              color="#d4836b"
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
    backgroundColor: '#12100e',
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
    backgroundColor: 'rgba(196,112,63,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(196,112,63,0.3)',
  },
  avatarText: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#c4703f',
  },
  profileHeaderInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 22,
    color: '#faf6f0',
  },
  profileTier: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#7a6f62',
    marginTop: 2,
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

  // Menu items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  menuItemPressed: {
    backgroundColor: 'rgba(237,230,220,0.04)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuItemLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 16,
    color: '#ede6dc',
  },

  // Upgrade CTA
  upgradeCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
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
    color: '#d4a853',
  },
  upgradeSubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#7a6f62',
    marginTop: 2,
  },
})
