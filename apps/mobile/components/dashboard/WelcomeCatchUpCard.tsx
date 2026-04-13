import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { RefreshCw } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useColors } from '@/hooks/use-colors'
import { useBacklogCount } from '@/hooks/use-triage'

export function WelcomeCatchUpCard() {
  const router = useRouter()
  const colors = useColors()
  const { data: backlogCount } = useBacklogCount()

  if (!backlogCount || backlogCount === 0) return null

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.goldDim }]}>
          <RefreshCw size={18} color={colors.gold} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome back!</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            You have {backlogCount} task{backlogCount === 1 ? '' : 's'} that need attention
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => router.push('/(screens)/triage')}
        style={[styles.cta, { backgroundColor: colors.goldDim, borderColor: colors.goldGlow }]}
      >
        <Text style={[styles.ctaText, { color: colors.gold }]}>Review Tasks</Text>
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
