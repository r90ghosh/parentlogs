import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { ClipboardList, ChevronRight } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useChecklists } from '@/hooks/use-checklists'

export function ChecklistProgressCard() {
  const router = useRouter()
  const { data: checklists } = useChecklists()

  if (!checklists || checklists.length === 0) return null

  const preview = checklists.filter((c) => !c.is_locked).slice(0, 3)
  if (preview.length === 0) return null

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <ClipboardList size={18} color="#c4703f" />
        </View>
        <Text style={styles.title}>Checklists</Text>
      </View>

      <View style={styles.list}>
        {preview.map((checklist) => (
          <View key={checklist.checklist_id} style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowName} numberOfLines={1}>
                {checklist.name}
              </Text>
              <Text style={styles.rowMeta}>
                {checklist.progress.completed} of {checklist.progress.total} items
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${checklist.progress.percentage}%` as `${number}%`,
                    backgroundColor:
                      checklist.progress.percentage === 100 ? '#6b8f71' : '#c4703f',
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
        <Text style={styles.viewAllText}>View All</Text>
        <ChevronRight size={14} color="#c4703f" />
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
    backgroundColor: 'rgba(196,112,63,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
    color: '#faf6f0',
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
    color: '#ede6dc',
    flex: 1,
    marginRight: 8,
  },
  rowMeta: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4a4239',
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
    color: '#c4703f',
  },
})
