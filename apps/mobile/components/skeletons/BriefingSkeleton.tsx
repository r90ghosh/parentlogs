import { StyleSheet, View } from 'react-native'
import { SkeletonBlock } from './SkeletonBlock'
import { useColors } from '@/hooks/use-colors'

export function BriefingSkeleton() {
  const colors = useColors()
  return (
    <View>
      {/* Hero */}
      <View style={styles.hero}>
        <SkeletonBlock height={34} width="52%" radius={8} />
        <SkeletonBlock height={14} width="68%" radius={4} style={{ marginTop: 12 }} />
        <SkeletonBlock height={5} width="100%" radius={5} style={{ marginTop: 16 }} />
        <SkeletonBlock height={20} width="88%" radius={6} style={{ marginTop: 18 }} />
      </View>

      {/* Section label */}
      <SkeletonBlock height={11} width="24%" radius={3} style={styles.label} />

      {/* Feed rows */}
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={[styles.row, { borderBottomColor: colors.line2 }]}>
          <SkeletonBlock height={10} width="22%" radius={3} />
          <SkeletonBlock height={16} width={i % 2 ? '84%' : '92%'} radius={5} style={{ marginTop: 9 }} />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 22, paddingTop: 18 },
  label: { marginHorizontal: 24, marginTop: 26 },
  row: { paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1 },
})
