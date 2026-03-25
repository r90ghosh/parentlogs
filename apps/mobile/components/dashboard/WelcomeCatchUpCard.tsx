import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { RefreshCw } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useBacklogCount } from '@/hooks/use-triage'

export function WelcomeCatchUpCard() {
  const router = useRouter()
  const { data: backlogCount } = useBacklogCount()

  if (!backlogCount || backlogCount === 0) return null

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <RefreshCw size={18} color="#d4a853" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>
            You have {backlogCount} task{backlogCount === 1 ? '' : 's'} that need attention
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => router.push('/(screens)/triage')}
        style={styles.cta}
      >
        <Text style={styles.ctaText}>Review Tasks</Text>
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
    backgroundColor: 'rgba(212,168,83,0.12)',
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
    backgroundColor: 'rgba(212,168,83,0.12)',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
  },
  ctaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    color: '#d4a853',
  },
})
