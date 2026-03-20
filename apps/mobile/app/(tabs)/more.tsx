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
} from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import * as Haptics from 'expo-haptics'

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onPress: () => void
  color?: string
}

function MenuItem({ icon, label, onPress, color }: MenuItemProps) {
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
      <ChevronRight size={18} color="#4a4239" />
    </Pressable>
  )
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { signOut, profile } = useAuth()

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
      >
        <Text style={styles.title}>More</Text>

        {/* Tools section */}
        <Text style={styles.sectionTitle}>Tools</Text>
        <View style={styles.section}>
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
        </View>

        {/* Account section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.section}>
          <MenuItem
            icon={<Crown size={20} color="#d4a853" />}
            label="Upgrade to Premium"
            onPress={() => router.push('/(screens)/upgrade')}
          />
          <MenuItem
            icon={<Settings size={20} color="#7a6f62" />}
            label="Settings"
            onPress={() => router.push('/(screens)/settings')}
          />
          <MenuItem
            icon={<LogOut size={20} color="#d4836b" />}
            label="Sign Out"
            onPress={signOut}
            color="#d4836b"
          />
        </View>

        {/* Profile info */}
        {profile && (
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profile.full_name || 'User'}
            </Text>
            <Text style={styles.profileTier}>
              {profile.subscription_tier === 'premium'
                ? 'Premium'
                : profile.subscription_tier === 'lifetime'
                  ? 'Lifetime'
                  : 'Free Plan'}
            </Text>
          </View>
        )}
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
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#faf6f0',
    marginBottom: 32,
  },
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
    backgroundColor: '#201c18',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
    overflow: 'hidden',
    marginBottom: 24,
  },
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
  profileInfo: {
    alignItems: 'center',
    paddingTop: 16,
    gap: 4,
  },
  profileName: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    color: '#7a6f62',
  },
  profileTier: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#4a4239',
  },
})
