import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { ClipboardList, ChevronRight } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useColors } from '@/hooks/use-colors'
import { useChecklists } from '@/hooks/use-checklists'

export function ChecklistProgressCard() {
  const router = useRouter()
  const colors = useColors()
  const { data: checklists } = useChecklists()

  if (!checklists || checklists.length === 0) return null

  const preview = checklists.filter((c) => !c.is_locked).slice(0, 3)
  if (preview.length === 0) return null

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.copperDim }]}>
          <ClipboardList size={18} color={colors.copper} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Checklists</Text>
      </View>

      <View style={styles.list}>
        {preview.map((checklist) => (
          <View key={checklist.checklist_id} style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowName, { color: colors.textSecondary }]} numberOfLines={1}>
                {checklist.name}
              </Text>
              <Text style={[styles.rowMeta, { color: colors.textMuted }]}>
                {checklist.progress.completed} of {checklist.progress.total} items
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.textDim }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${checklist.progress.percentage}%` as `${number}%`,
                    backgroundColor:
                      checklist.progress.percentage === 100 ? colors.sage : colors.copper,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => router.push('/(screens)/checklists')}
        style={styles.viewAll}
      >
        <Text style={[styles.viewAllText, { color: colors.copper }]}>View All</Text>
        <ChevronRight size={14} color={colors.copper} />
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
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
  },
  list: {
    gap: 14,
    marginBottom: 14,
  },
  row: {
    gap: 6,
  },
  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  rowName: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  rowMeta: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  viewAllText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
  },
})
