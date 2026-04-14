import { StyleSheet, View } from 'react-native'
import { SkeletonBlock } from './SkeletonBlock'
import { useColors } from '@/hooks/use-colors'

/**
 * Matches the dashboard card outline shapes so the layout doesn't shift
 * when real content swaps in. No BlurView — opaque surface over the
 * AppBackground gradient.
 */
export function DashboardSkeleton() {
  const colors = useColors()

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <View style={styles.greeting}>
        <SkeletonBlock height={28} width="55%" radius={6} />
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <SkeletonCard colorBg={colors.card} tall />
        <SkeletonCard colorBg={colors.card} />
        <SkeletonCard colorBg={colors.card} />
        <SkeletonCard colorBg={colors.card} short />
        <SkeletonCard colorBg={colors.card} />
      </View>
    </View>
  )
}

function SkeletonCard({
  colorBg,
  tall,
  short,
}: {
  colorBg: string
  tall?: boolean
  short?: boolean
}) {
  const height = tall ? 160 : short ? 72 : 120
  return (
    <View style={[styles.card, { backgroundColor: colorBg, height }]}>
      <SkeletonBlock height={12} width="35%" radius={4} style={{ marginBottom: 12 }} />
      <SkeletonBlock height={20} width="75%" radius={6} style={{ marginBottom: 10 }} />
      {!short && <SkeletonBlock height={14} width="60%" radius={4} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  greeting: {
    marginBottom: 24,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    justifyContent: 'center',
  },
})
