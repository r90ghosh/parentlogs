import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Sliders } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useDadProfile } from '@/hooks/use-journey'
import { useAuth } from '@/components/providers/AuthProvider'

export function PersonalizeCard() {
  const router = useRouter()
  const { profile } = useAuth()
  const { data: dadProfile, isLoading } = useDadProfile()

  // Only for dads
  if (profile?.role !== 'dad') return null

  // Still loading — don't flash the card
  if (isLoading) return null

  // Profile exists — already personalized
  if (dadProfile) return null

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <Sliders size={18} color="#c4703f" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Personalize your experience</Text>
          <Text style={styles.subtitle}>
            Answer 5 quick questions to get tailored content
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => router.push('/(screens)/personalize' as never)}
        style={styles.cta}
      >
        <Text style={styles.ctaText}>Get Started</Text>
      </Pressable>
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(196,112,63,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerText: {
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
    backgroundColor: '#c4703f',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    color: '#faf6f0',
  },
})
