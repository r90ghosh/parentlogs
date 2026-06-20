import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Newspaper, Wallet, ClipboardList, Users, User, Bell, Palette, CreditCard,
  ShieldCheck, HelpCircle, MessageCircleQuestion, MessageSquarePlus, Info,
  Crown, LogOut, ChevronRight, ArrowRight, type LucideIcon,
} from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors, type ColorTokens } from '@/hooks/use-colors'
import { SectionLabel } from '@/components/digest'

export default function MoreScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { signOut, profile } = useAuth()

  const tier = profile?.subscription_tier ?? 'free'
  const tierLabel = tier === 'premium' ? 'Premium' : tier === 'lifetime' ? 'Lifetime' : 'Free plan'
  const isFree = tier === 'free'
  const go = (path: string) => router.push(path as never)

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profile}>
          <View style={[styles.avatar, { backgroundColor: colors.accentSoft }]}>
            <Text style={[styles.avatarText, { color: colors.accentInk }]}>{(profile?.full_name || 'U').charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.ink }]}>{profile?.full_name || 'User'}</Text>
            <Text style={[styles.tier, { color: colors.muted }]}>{tierLabel}</Text>
          </View>
        </View>

        <Group label="Tools" colors={colors}>
          <Row icon={Newspaper} label="Library" onPress={() => go('/(tabs)/more/content')} colors={colors} />
          <Row icon={Wallet} label="Budget" onPress={() => go('/(tabs)/more/budget')} colors={colors} />
          <Row icon={ClipboardList} label="Checklists" onPress={() => go('/(tabs)/more/checklists')} colors={colors} last />
        </Group>

        <Group label="Family" colors={colors}>
          <Row icon={Users} label="Family" onPress={() => go('/(tabs)/more/family')} colors={colors} last />
        </Group>

        <Group label="Account" colors={colors}>
          <Row icon={User} label="Profile" onPress={() => go('/(tabs)/more/settings')} colors={colors} />
          <Row icon={Bell} label="Notifications" onPress={() => go('/(tabs)/more/notifications')} colors={colors} />
          <Row icon={Palette} label="Appearance" onPress={() => go('/(screens)/appearance')} colors={colors} />
          <Row icon={CreditCard} label="Subscription" onPress={() => go('/(screens)/upgrade')} colors={colors} />
          <Row icon={ShieldCheck} label="Security" onPress={() => go('/(tabs)/more/change-password')} colors={colors} last />
        </Group>

        <Group label="Support" colors={colors}>
          <Row icon={HelpCircle} label="Help" onPress={() => go('/(tabs)/more/help')} colors={colors} />
          <Row icon={MessageCircleQuestion} label="FAQ" onPress={() => go('/(tabs)/more/faq')} colors={colors} />
          <Row icon={MessageSquarePlus} label="Send feedback" onPress={() => go('/(tabs)/more/feedback')} colors={colors} />
          <Row icon={Info} label="About" onPress={() => go('/(tabs)/more/about')} colors={colors} last />
        </Group>

        {isFree && (
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); go('/(screens)/upgrade') }}
            style={({ pressed }) => [styles.upgrade, { backgroundColor: colors.accentSoft, opacity: pressed ? 0.85 : 1 }]}
          >
            <Crown size={20} color={colors.accentInk} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.upgradeTitle, { color: colors.accentInk }]}>Upgrade to Premium</Text>
              <Text style={[styles.upgradeSub, { color: colors.ink2 }]}>Full timeline, partner sync &amp; more</Text>
            </View>
            <ArrowRight size={18} color={colors.accentInk} strokeWidth={2} />
          </Pressable>
        )}

        <Group label="" colors={colors}>
          <Pressable
            onPress={() => Alert.alert('Sign out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign out', style: 'destructive', onPress: signOut },
            ])}
            style={({ pressed }) => [styles.row, { backgroundColor: pressed ? colors.cardHover : 'transparent' }]}
          >
            <LogOut size={20} color={colors.coral} />
            <Text style={[styles.rowLabel, { color: colors.coral }]}>Sign out</Text>
          </Pressable>
        </Group>
      </ScrollView>
    </View>
  )
}

function Group({ label, colors, children }: { label: string; colors: ColorTokens; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      {!!label && <SectionLabel>{label}</SectionLabel>}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>{children}</View>
    </View>
  )
}

function Row({ icon: Icon, label, onPress, colors, last }: { icon: LucideIcon; label: string; onPress: () => void; colors: ColorTokens; last?: boolean }) {
  return (
    <Pressable
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress() }}
      style={({ pressed }) => [styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.line2 }, { backgroundColor: pressed ? colors.cardHover : 'transparent' }]}
    >
      <Icon size={20} color={colors.muted} />
      <Text style={[styles.rowLabel, { color: colors.ink }]}>{label}</Text>
      <ChevronRight size={18} color={colors.faint} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 16, paddingHorizontal: 20 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 26 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Jakarta-ExtraBold', fontSize: 20 },
  name: { fontFamily: 'Jakarta-Bold', fontSize: 18 },
  tier: { fontFamily: 'Jakarta-Medium', fontSize: 13, marginTop: 2 },
  group: { marginBottom: 18 },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, paddingHorizontal: 16 },
  rowLabel: { flex: 1, fontFamily: 'Jakarta-SemiBold', fontSize: 15.5 },
  upgrade: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 17, borderRadius: 16, marginBottom: 18 },
  upgradeTitle: { fontFamily: 'Jakarta-Bold', fontSize: 15.5 },
  upgradeSub: { fontFamily: 'Jakarta-Medium', fontSize: 12.5, marginTop: 3 },
})
