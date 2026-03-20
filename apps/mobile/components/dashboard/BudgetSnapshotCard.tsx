import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Wallet, ChevronRight } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'

export function BudgetSnapshotCard() {
  const router = useRouter()

  return (
    <Pressable onPress={() => router.push('/(screens)/budget')}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Wallet size={18} color="#d4a853" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Budget Planner</Text>
            <Text style={styles.subtitle}>Track your baby expenses</Text>
          </View>
          <ChevronRight size={20} color="#7a6f62" />
        </View>
      </GlassCard>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212,168,83,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
    color: '#faf6f0',
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
    marginTop: 2,
  },
})
