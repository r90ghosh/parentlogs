import { StyleSheet, View } from 'react-native'
import { SkeletonBlock } from './SkeletonBlock'
import { useColors } from '@/hooks/use-colors'

export function TasksSkeleton() {
  const colors = useColors()
  return (
    <View style={styles.container}>
      {/* Title row */}
      <View style={styles.titleRow}>
        <SkeletonBlock height={32} width={110} radius={8} />
        <SkeletonBlock height={40} width={40} radius={20} />
      </View>

      {/* Search */}
      <SkeletonBlock height={44} width="100%" radius={12} style={{ marginTop: 12 }} />

      {/* Stats row */}
      <View style={styles.statsRow}>
        <SkeletonBlock height={64} width="31%" radius={12} />
        <SkeletonBlock height={64} width="31%" radius={12} />
        <SkeletonBlock height={64} width="31%" radius={12} />
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        <SkeletonBlock height={32} width={70} radius={16} />
        <SkeletonBlock height={32} width={90} radius={16} />
        <SkeletonBlock height={32} width={80} radius={16} />
      </View>

      {/* Section header */}
      <SkeletonBlock height={20} width="45%" radius={6} style={{ marginTop: 20, marginBottom: 12 }} />

      {/* Task rows */}
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={[styles.taskRow, { backgroundColor: colors.card }]}>
          <SkeletonBlock height={24} width={24} radius={12} />
          <View style={styles.taskRowContent}>
            <SkeletonBlock height={16} width="75%" radius={4} />
            <SkeletonBlock height={12} width="40%" radius={4} style={{ marginTop: 8 }} />
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  taskRowContent: {
    flex: 1,
  },
})
