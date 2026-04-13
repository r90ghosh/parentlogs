import { useState, useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Lock,
  ClipboardList,
  Package,
  Baby,
  Shield,
  Heart,
  Home,
  Stethoscope,
  Car,
  Shirt,
  RotateCcw,
} from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { ScreenHeader } from '@/components/ui/ScreenHeader'
import {
  useChecklists,
  useChecklistById,
  useToggleChecklistItem,
  useResetChecklist,
} from '@/hooks/use-checklists'
import { useColors } from '@/hooks/use-colors'
import type { ChecklistWithItems } from '@tdc/services'
import * as Haptics from 'expo-haptics'

const CATEGORY_ICONS: Record<string, typeof Package> = {
  'Hospital': Stethoscope,
  'Registry': Baby,
  'Safety': Shield,
  'Nursery': Home,
  'Gear': Car,
  'Clothing': Shirt,
  'Health': Heart,
}

function getCategoryIcon(name: string) {
  for (const [key, Icon] of Object.entries(CATEGORY_ICONS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return Icon
    }
  }
  return ClipboardList
}

interface ChecklistCardProps {
  checklist: ChecklistWithItems
  isExpanded: boolean
  onToggle: () => void
}

function ChecklistCard({ checklist, isExpanded, onToggle }: ChecklistCardProps) {
  const colors = useColors()
  const toggleItem = useToggleChecklistItem()
  const resetChecklist = useResetChecklist()
  const detailQuery = useChecklistById(isExpanded ? checklist.checklist_id : '')

  function handleReset() {
    Alert.alert(
      'Reset Checklist?',
      'This will uncheck all items. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
            resetChecklist.mutate(checklist.checklist_id)
          },
        },
      ]
    )
  }
  const Icon = getCategoryIcon(checklist.name)

  const items = isExpanded && detailQuery.data?.items
    ? detailQuery.data.items
    : []

  return (
    <GlassCard style={[styles.checklistCard, checklist.is_locked && styles.checklistLocked]}>
      <Pressable
        onPress={() => {
          if (checklist.is_locked) return
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          onToggle()
        }}
        style={styles.checklistHeader}
      >
        <View style={[styles.checklistIconWrap, { backgroundColor: colors.copperDim }]}>
          <Icon size={20} color={checklist.is_locked ? colors.textDim : colors.copper} />
        </View>
        <View style={styles.checklistInfo}>
          <View style={styles.checklistTitleRow}>
            <Text
              style={[
                styles.checklistName,
                { color: colors.textSecondary },
                checklist.is_locked && { color: colors.textDim },
              ]}
              numberOfLines={1}
            >
              {checklist.name}
            </Text>
            {checklist.is_locked && <Lock size={14} color={colors.textDim} />}
          </View>
          <Text style={[styles.checklistMeta, { color: colors.textMuted }]}>
            {checklist.progress.completed}/{checklist.progress.total} items
          </Text>
        </View>
        <View style={styles.checklistRight}>
          {/* Reset button (only when completed > 0 and not locked) */}
          {!checklist.is_locked && checklist.progress.completed > 0 && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.()
                handleReset()
              }}
              hitSlop={8}
              style={[styles.resetButton, { backgroundColor: colors.coralDim }]}
            >
              <RotateCcw size={14} color={colors.coral} />
            </Pressable>
          )}
          {/* Progress circle */}
          <View style={[styles.progressCircle, { backgroundColor: colors.copperDim }]}>
            <Text style={[styles.progressText, { color: colors.copper }]}>
              {checklist.progress.percentage}%
            </Text>
          </View>
          {!checklist.is_locked && (
            isExpanded ? (
              <ChevronUp size={18} color={colors.textMuted} />
            ) : (
              <ChevronDown size={18} color={colors.textMuted} />
            )
          )}
        </View>
      </Pressable>

      {/* Progress bar */}
      <View style={[styles.progressBarOuter, { backgroundColor: colors.subtleBg }]}>
        <View
          style={[
            styles.progressBarInner,
            {
              width: `${checklist.progress.percentage}%`,
              backgroundColor:
                checklist.progress.percentage === 100 ? colors.sage : colors.copper,
            },
          ]}
        />
      </View>

      {/* Expanded items */}
      {isExpanded && (
        <View style={[styles.checklistItems, { borderTopColor: colors.border }]}>
          {detailQuery.isLoading ? (
            <View style={styles.itemsLoading}>
              <ActivityIndicator color={colors.copper} size="small" />
            </View>
          ) : items.length > 0 ? (
            items.map((item: any) => (
              <Pressable
                key={item.item_id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  toggleItem.mutate({
                    checklistId: checklist.checklist_id,
                    itemId: item.item_id,
                    completed: !item.completed,
                  })
                }}
                style={[styles.checklistItem, { borderBottomColor: colors.pressed }]}
              >
                <View
                  style={[
                    styles.itemCheckbox,
                    { borderColor: colors.textDim },
                    item.completed && { backgroundColor: colors.sage, borderColor: colors.sage },
                  ]}
                >
                  {item.completed && <Check size={10} color={colors.bg} />}
                </View>
                <View style={styles.itemContent}>
                  <Text
                    style={[
                      styles.itemName,
                      { color: colors.textSecondary },
                      item.completed && { textDecorationLine: 'line-through', color: colors.textMuted },
                    ]}
                  >
                    {item.item}
                  </Text>
                  {item.details ? (
                    <Text style={[styles.itemDetails, { color: colors.textMuted }]} numberOfLines={2}>
                      {item.details}
                    </Text>
                  ) : null}
                </View>
                {item.required && (
                  <View style={[styles.requiredBadge, { backgroundColor: colors.copperDim }]}>
                    <Text style={[styles.requiredText, { color: colors.copper }]}>Req</Text>
                  </View>
                )}
              </Pressable>
            ))
          ) : (
            <Text style={[styles.noItemsText, { color: colors.textMuted }]}>No items in this checklist</Text>
          )}
        </View>
      )}
    </GlassCard>
  )
}

export default function ChecklistsScreen() {
  const insets = useSafeAreaInsets()
  const colors = useColors()
  const checklistsQuery = useChecklists()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleRefresh = useCallback(() => {
    checklistsQuery.refetch()
  }, [checklistsQuery])

  const renderChecklist = useCallback(
    ({ item, index }: { item: ChecklistWithItems; index: number }) => (
      <CardEntrance delay={index * 80}>
        <ChecklistCard
          checklist={item}
          isExpanded={expandedId === item.checklist_id}
          onToggle={() =>
            setExpandedId(
              expandedId === item.checklist_id ? null : item.checklist_id
            )
          }
        />
      </CardEntrance>
    ),
    [expandedId]
  )

  const checklistHeader = (
    <ScreenHeader title="Checklists" leftAction="close" transparent />
  )

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>

      {/* Content */}
      {checklistsQuery.isLoading ? (
        <View style={styles.loadingContainer}>
          {checklistHeader}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colors.copper} size="large" />
          </View>
        </View>
      ) : !checklistsQuery.data || checklistsQuery.data.length === 0 ? (
        <View style={styles.emptyContainer}>
          {checklistHeader}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12 }}>
            <ClipboardList size={40} color={colors.textDim} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No checklists available</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Checklists will appear here once your family is set up
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={checklistsQuery.data}
          keyExtractor={(item) => item.checklist_id}
          renderItem={renderChecklist}
          numColumns={1}
          ListHeaderComponent={checklistHeader}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={checklistsQuery.isRefetching}
              onRefresh={handleRefresh}
              tintColor={colors.copper}
            />
          }
          ListFooterComponent={
            <Text style={[styles.disclaimerText, { color: colors.textDim }]}>
              Medical guidance in checklists is general reference only. Confirm medication dosages and emergency procedures with your pediatrician.
            </Text>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingTop: 8,
  },

  // Checklist card
  checklistCard: {
    overflow: 'hidden',
    padding: 0,
  },
  checklistLocked: {
    opacity: 0.5,
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  checklistIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistInfo: {
    flex: 1,
  },
  checklistTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checklistName: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    flex: 1,
  },
  checklistMeta: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  checklistRight: {
    alignItems: 'center',
    gap: 4,
  },
  resetButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Progress
  progressCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
  },
  progressBarOuter: {
    height: 3,
    marginHorizontal: 16,
  },
  progressBarInner: {
    height: 3,
    borderRadius: 1.5,
  },

  // Expanded items
  checklistItems: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    marginTop: 8,
  },
  itemsLoading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
  },
  itemCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
  },
  itemDetails: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
  requiredBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  requiredText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noItemsText: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },

  // Disclaimer
  disclaimerText: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    lineHeight: 16,
  },

  // Loading / Empty
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
})
