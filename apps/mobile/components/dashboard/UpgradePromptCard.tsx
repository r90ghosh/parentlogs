import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Crown } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useColors } from '@/hooks/use-colors'
import { useAuth } from '@/components/providers/AuthProvider'

export function UpgradePromptCard() {
  const router = useRouter()
  const colors = useColors()
  const { profile } = useAuth()

  // Only show for free tier
  if (
    profile?.subscription_tier === 'premium' ||
    profile?.subscription_tier === 'lifetime'
  ) {
    return null
  }

  return (
    <GlassCard style={[styles.card, { borderColor: colors.goldGlow }]}>
      <View style={styles.inner}>
        <View style={[styles.iconBadge, { backgroundColor: colors.goldDim }]}>
          <Crown size={20} color={colors.gold} />
        </View>
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Unlock the full journey</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Get full timeline, partner sync & more
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => router.push('/(screens)/upgrade')}
        style={[styles.cta, { backgroundColor: colors.goldDim, borderColor: colors.goldGlow }]}
      >
        <Text style={[styles.ctaText, { color: colors.gold }]}>See Plans</Text>
      </Pressable>
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderWidth: 1,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  cta: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  ctaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
  },
})
