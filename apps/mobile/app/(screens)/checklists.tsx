import { useState, useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import {
  X,
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
} from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import {
  useChecklists,
  useChecklistById,
  useToggleChecklistItem,
} from '@/hooks/use-checklists'
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
  const toggleItem = useToggleChecklistItem()
  const detailQuery = useChecklistById(isExpanded ? checklist.checklist_id : '')
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
        <View style={styles.checklistIconWrap}>
          <Icon size={20} color={checklist.is_locked ? '#4a4239' : '#c4703f'} />
        </View>
        <View style={styles.checklistInfo}>
          <View style={styles.checklistTitleRow}>
            <Text
              style={[
                styles.checklistName,
                checklist.is_locked && styles.checklistNameLocked,
              ]}
              numberOfLines={1}
            >
              {checklist.name}
            </Text>
            {checklist.is_locked && <Lock size={14} color="#4a4239" />}
          </View>
          <Text style={styles.checklistMeta}>
            {checklist.progress.completed}/{checklist.progress.total} items
          </Text>
        </View>
        <View style={styles.checklistRight}>
          {/* Progress circle */}
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>
              {checklist.progress.percentage}%
            </Text>
          </View>
          {!checklist.is_locked && (
            isExpanded ? (
              <ChevronUp size={18} color="#7a6f62" />
            ) : (
              <ChevronDown size={18} color="#7a6f62" />
            )
          )}
        </View>
      </Pressable>

      {/* Progress bar */}
      <View style={styles.progressBarOuter}>
        <View
          style={[
            styles.progressBarInner,
            {
              width: `${checklist.progress.percentage}%`,
              backgroundColor:
                checklist.progress.percentage === 100 ? '#6b8f71' : '#c4703f',
            },
          ]}
        />
      </View>

      {/* Expanded items */}
      {isExpanded && (
        <View style={styles.checklistItems}>
          {detailQuery.isLoading ? (
            <View style={styles.itemsLoading}>
              <ActivityIndicator color="#c4703f" size="small" />
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
                style={styles.checklistItem}
              >
                <View
                  style={[
                    styles.itemCheckbox,
                    item.completed && styles.itemCheckboxChecked,
                  ]}
                >
                  {item.completed && <Check size={10} color="#12100e" />}
                </View>
                <View style={styles.itemContent}>
                  <Text
                    style={[
                      styles.itemName,
                      item.completed && styles.itemNameChecked,
                    ]}
                  >
                    {item.item}
                  </Text>
                  {item.details ? (
                    <Text style={styles.itemDetails} numberOfLines={2}>
                      {item.details}
                    </Text>
                  ) : null}
                </View>
                {item.required && (
                  <View style={styles.requiredBadge}>
                    <Text style={styles.requiredText}>Req</Text>
                  </View>
                )}
              </Pressable>
            ))
          ) : (
            <Text style={styles.noItemsText}>No items in this checklist</Text>
          )}
        </View>
      )}
    </GlassCard>
  )
}

export default function ChecklistsScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Checklists</Text>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={20} color="#7a6f62" />
        </Pressable>
      </View>

      {/* Content */}
      {checklistsQuery.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#c4703f" size="large" />
        </View>
      ) : !checklistsQuery.data || checklistsQuery.data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ClipboardList size={40} color="#4a4239" />
          <Text style={styles.emptyTitle}>No checklists available</Text>
          <Text style={styles.emptySubtitle}>
            Checklists will appear here once your family is set up
          </Text>
        </View>
      ) : (
        <FlatList
          data={checklistsQuery.data}
          keyExtractor={(item) => item.checklist_id}
          renderItem={renderChecklist}
          numColumns={1}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={checklistsQuery.isRefetching}
              onRefresh={handleRefresh}
              tintColor="#c4703f"
            />
          }
          ListFooterComponent={
            <Text style={styles.disclaimerText}>
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
    backgroundColor: '#12100e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(196,112,63,0.1)',
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
    color: '#ede6dc',
    flex: 1,
  },
  checklistNameLocked: {
    color: '#4a4239',
  },
  checklistMeta: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 2,
  },
  checklistRight: {
    alignItems: 'center',
    gap: 4,
  },

  // Progress
  progressCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(196,112,63,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    color: '#c4703f',
  },
  progressBarOuter: {
    height: 3,
    backgroundColor: 'rgba(237,230,220,0.06)',
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
    borderTopColor: 'rgba(237,230,220,0.06)',
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
    borderBottomColor: 'rgba(237,230,220,0.04)',
  },
  itemCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4a4239',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  itemCheckboxChecked: {
    backgroundColor: '#6b8f71',
    borderColor: '#6b8f71',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    color: '#ede6dc',
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#7a6f62',
  },
  itemDetails: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 3,
    lineHeight: 16,
  },
  requiredBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(212,131,107,0.12)',
    marginTop: 2,
  },
  requiredText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 9,
    color: '#d4836b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noItemsText: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    textAlign: 'center',
    paddingVertical: 16,
  },

  // Disclaimer
  disclaimerText: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    color: '#4a4239',
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
    color: '#faf6f0',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    textAlign: 'center',
  },
})
