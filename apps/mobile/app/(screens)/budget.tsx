import { useState, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import {
  X,
  Check,
  Plus,
  ShoppingCart,
  DollarSign,
  Crown,
  Sparkles,
} from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { useBudgetTemplates, useBudgetSummary, useAddToBudget, useTogglePurchased } from '@/hooks/use-budget'
import { useAuth } from '@/components/providers/AuthProvider'
import type { BudgetPeriod, BudgetPriority, BudgetTemplate, FamilyBudgetItem } from '@tdc/shared/types'
import { BUDGET_TIMELINE_CATEGORIES } from '@tdc/shared/utils/budget-timeline'
import * as Haptics from 'expo-haptics'

type TabMode = 'browse' | 'my-budget'
type PriorityFilter = 'all' | BudgetPriority

const PRIORITY_FILTERS: { id: PriorityFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'must-have', label: 'Must-have' },
  { id: 'good-to-have', label: 'Nice-to-have' },
  { id: 'tip', label: 'Tips' },
  { id: 'doctor', label: 'Doctor' },
]

export default function BudgetScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { profile } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod | null>(null)
  const [activeTab, setActiveTab] = useState<TabMode>('browse')
  const [selectedPriority, setSelectedPriority] = useState<PriorityFilter>('all')

  const templatesQuery = useBudgetTemplates(selectedPeriod ?? undefined)
  const summaryQuery = useBudgetSummary()
  const addToBudget = useAddToBudget()
  const togglePurchased = useTogglePurchased()

  const isRefreshing = templatesQuery.isRefetching || summaryQuery.isRefetching

  const handleRefresh = useCallback(() => {
    templatesQuery.refetch()
    summaryQuery.refetch()
  }, [templatesQuery, summaryQuery])

  // Filter templates by period and priority when browsing
  const browseItems = useMemo(() => {
    if (!templatesQuery.data) return []
    if (selectedPriority === 'all') return templatesQuery.data
    return templatesQuery.data.filter((t) => t.priority === selectedPriority)
  }, [templatesQuery.data, selectedPriority])

  // Get family budget items
  const myBudgetItems = useMemo(() => {
    if (!summaryQuery.data?.familyItems) return []
    return summaryQuery.data.familyItems
  }, [summaryQuery.data])

  // Build a set of template IDs already in the family budget
  const addedTemplateIds = useMemo(() => {
    const set = new Set<string>()
    myBudgetItems.forEach((item) => {
      if (item.budget_template_id) set.add(item.budget_template_id)
    })
    return set
  }, [myBudgetItems])

  function handleAddItem(templateId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    addToBudget.mutate({ templateId })
  }

  function handleTogglePurchased(itemId: string, currentlyPurchased: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    togglePurchased.mutate({ itemId, isPurchased: !currentlyPurchased })
  }

  function formatPrice(cents: number): string {
    if (cents === 0) return 'Free'
    return `$${Math.round(cents / 100)}`
  }

  function formatRange(min: number, max: number): string {
    if (min === max || max === 0) return formatPrice(min)
    return `${formatPrice(min)} - ${formatPrice(max)}`
  }

  const renderBrowseItem = useCallback(
    ({ item, index }: { item: BudgetTemplate; index: number }) => {
      const isAdded = addedTemplateIds.has(item.budget_id)
      const hasBrands = item.brand_premium || item.brand_value
      return (
        <GlassCard style={styles.budgetItemCard}>
          <View style={styles.budgetItemHeader}>
            <View style={styles.budgetItemInfo}>
              <Text style={styles.budgetItemName}>{item.item}</Text>
              <Text style={styles.budgetItemCategory}>{item.category}</Text>
            </View>
            <View style={styles.budgetItemPriceCol}>
              <Text style={styles.budgetItemPrice}>
                {formatRange(item.price_min, item.price_max)}
              </Text>
              {item.priority === 'must-have' && (
                <View style={styles.mustHaveBadge}>
                  <Text style={styles.mustHaveText}>Must-have</Text>
                </View>
              )}
            </View>
          </View>
          {item.description ? (
            <Text style={styles.budgetItemDesc} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          {hasBrands && (
            <View style={styles.brandsContainer}>
              {item.brand_premium ? (
                <View style={styles.brandRow}>
                  <Crown size={12} color="#d4a853" />
                  <Text style={styles.brandPremiumText} numberOfLines={1}>
                    {item.brand_premium}
                  </Text>
                </View>
              ) : null}
              {item.brand_value ? (
                <View style={styles.brandRow}>
                  <Sparkles size={12} color="#6b8f71" />
                  <Text style={styles.brandValueText} numberOfLines={1}>
                    {item.brand_value}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
          <View style={styles.budgetItemFooter}>
            <Text style={styles.budgetItemPeriod}>{item.period}</Text>
            {!isAdded ? (
              <Pressable
                onPress={() => handleAddItem(item.budget_id)}
                style={styles.addButton}
                disabled={addToBudget.isPending}
              >
                <Plus size={14} color="#c4703f" />
                <Text style={styles.addButtonText}>Add</Text>
              </Pressable>
            ) : (
              <View style={styles.addedBadge}>
                <Check size={12} color="#6b8f71" />
                <Text style={styles.addedText}>Added</Text>
              </View>
            )}
          </View>
        </GlassCard>
      )
    },
    [addedTemplateIds, addToBudget.isPending]
  )

  const renderMyBudgetItem = useCallback(
    ({ item, index }: { item: FamilyBudgetItem; index: number }) => (
      <Pressable
        onPress={() => handleTogglePurchased(item.id, item.is_purchased)}
      >
        <GlassCard
          style={[
            styles.budgetItemCard,
            item.is_purchased && styles.budgetItemPurchased,
          ]}
        >
          <View style={styles.budgetItemHeader}>
            <View style={styles.myBudgetLeft}>
              <View
                style={[
                  styles.checkbox,
                  item.is_purchased && styles.checkboxChecked,
                ]}
              >
                {item.is_purchased && (
                  <Check size={12} color="#12100e" />
                )}
              </View>
              <View style={styles.budgetItemInfo}>
                <Text
                  style={[
                    styles.budgetItemName,
                    item.is_purchased && styles.budgetItemNamePurchased,
                  ]}
                >
                  {item.item}
                </Text>
                <Text style={styles.budgetItemCategory}>
                  {item.category}
                </Text>
              </View>
            </View>
            <Text style={styles.budgetItemPrice}>
              {formatPrice(
                item.actual_price || item.estimated_price || 0
              )}
            </Text>
          </View>
        </GlassCard>
      </Pressable>
    ),
    [togglePurchased]
  )

  const isLoading =
    activeTab === 'browse' ? templatesQuery.isLoading : summaryQuery.isLoading

  const currentData =
    activeTab === 'browse' ? browseItems : myBudgetItems

  const ListHeaderComponent = useMemo(
    () => (
      <View>
        {/* Summary stats for My Budget */}
        {activeTab === 'my-budget' && summaryQuery.data && (
          <CardEntrance delay={0}>
            <GlassCard style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Budget</Text>
                  <Text style={styles.summaryValue}>
                    {formatRange(
                      summaryQuery.data.grandTotalMin,
                      summaryQuery.data.grandTotalMax
                    )}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Purchased</Text>
                  <Text style={[styles.summaryValue, styles.summaryValueGreen]}>
                    {formatPrice(summaryQuery.data.purchasedTotal)}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Remaining</Text>
                  <Text style={styles.summaryValue}>
                    {formatPrice(summaryQuery.data.remainingTotal)}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </CardEntrance>
        )}
      </View>
    ),
    [activeTab, summaryQuery.data]
  )

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Budget Planner</Text>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={20} color="#7a6f62" />
        </Pressable>
      </View>

      {/* Tab toggle */}
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            setActiveTab('browse')
          }}
          style={[styles.tab, activeTab === 'browse' && styles.tabActive]}
        >
          <ShoppingCart
            size={14}
            color={activeTab === 'browse' ? '#c4703f' : '#7a6f62'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'browse' && styles.tabTextActive,
            ]}
          >
            Browse
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            setActiveTab('my-budget')
          }}
          style={[styles.tab, activeTab === 'my-budget' && styles.tabActive]}
        >
          <DollarSign
            size={14}
            color={activeTab === 'my-budget' ? '#c4703f' : '#7a6f62'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'my-budget' && styles.tabTextActive,
            ]}
          >
            My Budget
          </Text>
        </Pressable>
      </View>

      {/* Timeline bar (browse mode only) */}
      {activeTab === 'browse' && (
        <>
          <FlatList
            horizontal
            data={BUDGET_TIMELINE_CATEGORIES}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timelineContent}
            style={styles.timelineBar}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  setSelectedPeriod(
                    selectedPeriod === item.id ? null : item.id
                  )
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                  borderRadius: 20,
                  backgroundColor: selectedPeriod === item.id ? 'rgba(196,112,63,0.2)' : 'rgba(42,38,34,0.9)',
                  borderWidth: 1,
                  borderColor: selectedPeriod === item.id ? '#c4703f' : 'rgba(237,230,220,0.2)',
                }}
              >
                <Text
                  className=""
                  style={{
                    fontFamily: 'Karla-SemiBold',
                    fontSize: 14,
                    color: selectedPeriod === item.id ? '#c4703f' : '#faf6f0',
                    textDecorationLine: 'none',
                    opacity: 1,
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            )}
          />

          {/* Priority filter pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.priorityContent}
            style={styles.priorityBar}
          >
            {PRIORITY_FILTERS.map((filter) => (
              <Pressable
                key={filter.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  setSelectedPriority(
                    selectedPriority === filter.id ? 'all' : filter.id
                  )
                }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 16,
                  backgroundColor: selectedPriority === filter.id ? 'rgba(212,168,83,0.2)' : 'rgba(42,38,34,0.9)',
                  borderWidth: 1,
                  borderColor: selectedPriority === filter.id ? '#d4a853' : 'rgba(237,230,220,0.2)',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Karla-SemiBold',
                    fontSize: 13,
                    color: selectedPriority === filter.id ? '#d4a853' : '#faf6f0',
                  }}
                >
                  {filter.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#c4703f" size="large" />
        </View>
      ) : currentData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <DollarSign size={40} color="#4a4239" />
          <Text style={styles.emptyTitle}>
            {activeTab === 'browse'
              ? 'No items found'
              : 'Your budget is empty'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'browse'
              ? 'Try selecting a different period or filter'
              : 'Browse items and add them to your budget'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item: BudgetTemplate | FamilyBudgetItem) =>
            activeTab === 'browse'
              ? (item as BudgetTemplate).budget_id
              : (item as FamilyBudgetItem).id
          }
          renderItem={
            activeTab === 'browse'
              ? (renderBrowseItem as any) // eslint-disable-line @typescript-eslint/no-explicit-any -- union data type, render functions matched conditionally
              : (renderMyBudgetItem as any) // eslint-disable-line @typescript-eslint/no-explicit-any
          }
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={
            <Text style={styles.disclaimerText}>
              For planning purposes only. Not financial advice.
            </Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#c4703f"
            />
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

  // Tab toggle
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: 'rgba(32,28,24,0.8)',
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.06)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: 'rgba(196,112,63,0.15)',
  },
  tabText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    color: '#7a6f62',
  },
  tabTextActive: {
    color: '#c4703f',
  },

  // Timeline bar
  timelineBar: {
    maxHeight: 44,
    marginBottom: 8,
  },
  timelineContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  timelinePill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: 'rgba(42,38,34,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.15)',
  },
  timelinePillActive: {
    backgroundColor: 'rgba(196,112,63,0.2)',
    borderColor: '#c4703f',
  },
  timelinePillText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#ede6dc',
  },
  timelinePillTextActive: {
    color: '#c4703f',
  },

  // Priority filter bar
  priorityBar: {
    maxHeight: 40,
    marginBottom: 12,
  },
  priorityContent: {
    paddingHorizontal: 20,
    gap: 6,
  },
  priorityPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(42,38,34,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.15)',
  },
  priorityPillActive: {
    backgroundColor: 'rgba(212,168,83,0.2)',
    borderColor: '#d4a853',
  },
  priorityPillText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#ede6dc',
  },
  priorityPillTextActive: {
    color: '#d4a853',
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    gap: 10,
  },

  // Budget item card
  budgetItemCard: {
    padding: 16,
    marginBottom: 2,
  },
  budgetItemPurchased: {
    opacity: 0.6,
  },
  budgetItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  budgetItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  budgetItemName: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    color: '#ede6dc',
  },
  budgetItemNamePurchased: {
    textDecorationLine: 'line-through',
    color: '#7a6f62',
  },
  budgetItemCategory: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 2,
  },
  budgetItemPriceCol: {
    alignItems: 'flex-end',
  },
  budgetItemPrice: {
    fontFamily: 'Jost-Medium',
    fontSize: 15,
    color: '#d4a853',
  },
  budgetItemDesc: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
    marginTop: 8,
    lineHeight: 18,
  },
  budgetItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  budgetItemPeriod: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#4a4239',
  },

  // Brand recommendations
  brandsContainer: {
    marginTop: 10,
    gap: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandPremiumText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
    color: '#d4a853',
    flex: 1,
  },
  brandValueText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
    color: '#6b8f71',
    flex: 1,
  },

  // Must-have badge
  mustHaveBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(196,112,63,0.12)',
  },
  mustHaveText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
    color: '#c4703f',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Add button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(196,112,63,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(196,112,63,0.2)',
  },
  addButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#c4703f',
  },

  // Added badge
  addedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addedText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#6b8f71',
  },

  // My budget
  myBudgetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4a4239',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6b8f71',
    borderColor: '#6b8f71',
  },

  // Summary card
  summaryCard: {
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(237,230,220,0.08)',
  },
  summaryLabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    color: '#7a6f62',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: 'Jost-Medium',
    fontSize: 16,
    color: '#ede6dc',
  },
  summaryValueGreen: {
    color: '#6b8f71',
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
  disclaimerText: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    color: '#4a4239',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 8,
    lineHeight: 16,
  },
})
