import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Wallet, ChevronRight } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useColors } from '@/hooks/use-colors'

export function BudgetSnapshotCard() {
  const router = useRouter()
  const colors = useColors()

  return (
    <Pressable onPress={() => router.push('/(screens)/budget')}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconBadge, { backgroundColor: colors.goldDim }]}>
            <Wallet size={18} color={colors.gold} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Budget Planner</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>Track your baby expenses</Text>
          </View>
          <ChevronRight size={20} color={colors.textMuted} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    marginTop: 2,
  },
})
