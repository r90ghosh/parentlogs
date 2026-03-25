import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Crown } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useAuth } from '@/components/providers/AuthProvider'

export function UpgradePromptCard() {
  const router = useRouter()
  const { profile } = useAuth()

  // Only show for free tier
  if (
    profile?.subscription_tier === 'premium' ||
    profile?.subscription_tier === 'lifetime'
  ) {
    return null
  }

  return (
    <GlassCard style={styles.card}>
      <View style={styles.inner}>
        <View style={styles.iconBadge}>
          <Crown size={20} color="#d4a853" />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>Unlock the full journey</Text>
          <Text style={styles.subtitle}>
            Get full timeline, partner sync & more
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => router.push('/(screens)/upgrade')}
        style={styles.cta}
      >
        <Text style={styles.ctaText}>See Plans</Text>
      </Pressable>
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.25)',
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
    backgroundColor: 'rgba(212,168,83,0.12)',
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
    color: '#faf6f0',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
    lineHeight: 18,
  },
  cta: {
    backgroundColor: 'rgba(212,168,83,0.15)',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.3)',
  },
  ctaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    color: '#d4a853',
  },
})
