import { StyleSheet, View } from 'react-native'
import { SkeletonBlock } from './SkeletonBlock'
import { useColors } from '@/hooks/use-colors'

export function BriefingSkeleton() {
  const colors = useColors()
  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: colors.card }]}>
        <SkeletonBlock height={14} width="30%" radius={4} style={{ marginBottom: 10 }} />
        <SkeletonBlock height={28} width="80%" radius={6} style={{ marginBottom: 8 }} />
        <SkeletonBlock height={14} width="50%" radius={4} />
      </View>

      {/* Sections */}
      {[0, 1, 2].map((i) => (
        <View key={i} style={[styles.section, { backgroundColor: colors.card }]}>
          <SkeletonBlock height={18} width="40%" radius={6} style={{ marginBottom: 12 }} />
          <SkeletonBlock height={12} width="100%" radius={4} style={{ marginBottom: 6 }} />
          <SkeletonBlock height={12} width="95%" radius={4} style={{ marginBottom: 6 }} />
          <SkeletonBlock height={12} width="88%" radius={4} />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 16,
  },
  hero: {
    padding: 20,
    borderRadius: 14,
    minHeight: 160,
    justifyContent: 'center',
  },
  section: {
    padding: 20,
    borderRadius: 14,
    minHeight: 120,
  },
})
