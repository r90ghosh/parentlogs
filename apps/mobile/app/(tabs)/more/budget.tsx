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
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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
import { ScreenHeader } from '@/components/ui/ScreenHeader'
import {
  useBudgetTemplates,
  useBudgetSummary,
  useAddToBudget,
  useTogglePurchased,
  useAddCustomBudgetItem,
} from '@/hooks/use-budget'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import type { BudgetPeriod, BudgetPriority, BudgetTemplate, FamilyBudgetItem } from '@tdc/shared/types'
import { BUDGET_TIMELINE_CATEGORIES } from '@tdc/shared/utils/budget-timeline'
import * as Haptics from 'expo-haptics'

const BUDGET_CATEGORIES = [
  'Nursery', 'Feeding', 'Clothing', 'Gear', 'Safety', 'Health',
  'Registry', 'Hospital', 'Travel', 'Other',
]

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
  const { profile } = useAuth()
  const colors = useColors()
  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod | null>(null)
  const [activeTab, setActiveTab] = useState<TabMode>('browse')
  const [selectedPriority, setSelectedPriority] = useState<PriorityFilter>('all')
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customItemName, setCustomItemName] = useState('')
  const [customCategory, setCustomCategory] = useState(BUDGET_CATEGORIES[0])
  const [customPrice, setCustomPrice] = useState('')

  const templatesQuery = useBudgetTemplates(selectedPeriod ?? undefined)
  const summaryQuery = useBudgetSummary()
  const addToBudget = useAddToBudget()
  const togglePurchased = useTogglePurchased()
  const addCustomItem = useAddCustomBudgetItem()

  const isRefreshing = templatesQuery.isRefetching || summaryQuery.isRefetching

  const handleRefresh = useCallback(() => {
    templatesQuery.refetch()
    summaryQuery.refetch()
  }, [templatesQuery, summaryQuery])

  // Filter templates by period and priority when browsing
  const browseItems = useMemo(() => {
    if (!templatesQuery.data) return []
    if (selectedPriority === 'all') return templatesQuery.data
    return templatesQuery.data.filter((t: BudgetTemplate) => t.priority === selectedPriority)
  }, [templatesQuery.data, selectedPriority])

  // Get family budget items
  const myBudgetItems = useMemo(() => {
    if (!summaryQuery.data?.familyItems) return []
    return summaryQuery.data.familyItems
  }, [summaryQuery.data])

  // Build a set of template IDs already in the family budget
  const addedTemplateIds = useMemo(() => {
    const set = new Set<string>()
    myBudgetItems.forEach((item: FamilyBudgetItem) => {
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

  function handleSubmitCustomItem() {
    const name = customItemName.trim()
    const priceStr = customPrice.trim()
    if (!name) {
      Alert.alert('Item name is required')
      return
    }
    const price = priceStr ? Math.round(parseFloat(priceStr) * 100) : 0
    if (priceStr && isNaN(price)) {
      Alert.alert('Enter a valid price')
      return
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    addCustomItem.mutate(
      { item: name, category: customCategory, estimatedPrice: price },
      {
        onSuccess: () => {
          setShowCustomModal(false)
          setCustomItemName('')
          setCustomPrice('')
          setCustomCategory(BUDGET_CATEGORIES[0])
          setActiveTab('my-budget')
        },
        onError: () => {
          Alert.alert('Error', 'Failed to add custom item. Please try again.')
        },
      }
    )
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
        <CardEntrance delay={index * 60}>
        <GlassCard style={styles.budgetItemCard}>
          <View style={styles.budgetItemHeader}>
            <View style={styles.budgetItemInfo}>
              <Text style={[styles.budgetItemName, { color: colors.textSecondary }]}>{item.item}</Text>
              <Text style={[styles.budgetItemCategory, { color: colors.textMuted }]}>{item.category}</Text>
            </View>
            <View style={styles.budgetItemPriceCol}>
              <Text style={[styles.budgetItemPrice, { color: colors.gold }]}>
                {formatRange(item.price_min, item.price_max)}
              </Text>
              {item.priority === 'must-have' && (
                <View style={[styles.mustHaveBadge, { backgroundColor: colors.copperDim }]}>
                  <Text style={[styles.mustHaveText, { color: colors.copper }]}>Must-have</Text>
                </View>
              )}
            </View>
          </View>
          {item.description ? (
            <Text style={[styles.budgetItemDesc, { color: colors.textMuted }]} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          {hasBrands && (
            <View style={styles.brandsContainer}>
              {item.brand_premium ? (
                <View style={styles.brandRow}>
                  <Crown size={12} color={colors.gold} />
                  <Text style={[styles.brandPremiumText, { color: colors.gold }]} numberOfLines={1}>
                    {item.brand_premium}
                  </Text>
                </View>
              ) : null}
              {item.brand_value ? (
                <View style={styles.brandRow}>
                  <Sparkles size={12} color={colors.sage} />
                  <Text style={[styles.brandValueText, { color: colors.sage }]} numberOfLines={1}>
                    {item.brand_value}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
          <View style={styles.budgetItemFooter}>
            <Text style={[styles.budgetItemPeriod, { color: colors.textDim }]}>{item.period}</Text>
            {!isAdded ? (
              <Pressable
                onPress={() => handleAddItem(item.budget_id)}
                style={[styles.addButton, { backgroundColor: colors.copperDim, borderColor: colors.copperGlow }]}
                disabled={addToBudget.isPending}
              >
                <Plus size={14} color={colors.copper} />
                <Text style={[styles.addButtonText, { color: colors.copper }]}>Add</Text>
              </Pressable>
            ) : (
              <View style={styles.addedBadge}>
                <Check size={12} color={colors.sage} />
                <Text style={[styles.addedText, { color: colors.sage }]}>Added</Text>
              </View>
            )}
          </View>
        </GlassCard>
        </CardEntrance>
      )
    },
    [addedTemplateIds, addToBudget.isPending, colors]
  )

  const renderMyBudgetItem = useCallback(
    ({ item, index }: { item: FamilyBudgetItem; index: number }) => (
      <CardEntrance delay={index * 60}>
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
                  { borderColor: colors.textDim },
                  item.is_purchased && { backgroundColor: colors.sage, borderColor: colors.sage },
                ]}
              >
                {item.is_purchased && (
                  <Check size={12} color={colors.bg} />
                )}
              </View>
              <View style={styles.budgetItemInfo}>
                <Text
                  style={[
                    styles.budgetItemName,
                    { color: colors.textSecondary },
                    item.is_purchased && { textDecorationLine: 'line-through', color: colors.textMuted },
                  ]}
                >
                  {item.item}
                </Text>
                <Text style={[styles.budgetItemCategory, { color: colors.textMuted }]}>
                  {item.category}
                </Text>
              </View>
            </View>
            <Text style={[styles.budgetItemPrice, { color: colors.gold }]}>
              {formatPrice(
                item.actual_price || item.estimated_price || 0
              )}
            </Text>
          </View>
        </GlassCard>
      </Pressable>
      </CardEntrance>
    ),
    [togglePurchased, colors]
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
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Total Budget</Text>
                  <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>
                    {formatRange(
                      summaryQuery.data.grandTotalMin,
                      summaryQuery.data.grandTotalMax
                    )}
                  </Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Purchased</Text>
                  <Text style={[styles.summaryValue, { color: colors.sage }]}>
                    {formatPrice(summaryQuery.data.purchasedTotal)}
                  </Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Remaining</Text>
                  <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>
                    {formatPrice(summaryQuery.data.remainingTotal)}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </CardEntrance>
        )}
      </View>
    ),
    [activeTab, summaryQuery.data, colors]
  )

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>

      {/* Header */}
      <ScreenHeader title="Budget Planner" leftAction="close" transparent />

      {/* Tab toggle */}
      <View style={styles.tabRow}>
        <View style={[styles.tabContainer, { backgroundColor: colors.glassBg, borderColor: colors.border }]}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              setActiveTab('browse')
            }}
            style={[styles.tab, activeTab === 'browse' && { backgroundColor: colors.copperDim }]}
          >
            <ShoppingCart
              size={14}
              color={activeTab === 'browse' ? colors.copper : colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                { color: colors.textMuted },
                activeTab === 'browse' && { color: colors.copper },
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
            style={[styles.tab, activeTab === 'my-budget' && { backgroundColor: colors.copperDim }]}
          >
            <DollarSign
              size={14}
              color={activeTab === 'my-budget' ? colors.copper : colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                { color: colors.textMuted },
                activeTab === 'my-budget' && { color: colors.copper },
              ]}
            >
              My Budget
            </Text>
          </Pressable>
        </View>
        {activeTab === 'my-budget' && (
          <Pressable
            onPress={() => setShowCustomModal(true)}
            style={[styles.addCustomButton, { backgroundColor: colors.copperDim, borderColor: colors.copperGlow }]}
            accessibilityLabel="Add custom item"
          >
            <Plus size={16} color={colors.copper} />
          </Pressable>
        )}
      </View>

      {/* Timeline bar (browse mode only) */}
      {activeTab === 'browse' && (
        <>
          <View style={styles.timelineBar}>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timelineContent}
            >
              {BUDGET_TIMELINE_CATEGORIES.map((item) => {
                const isActive = selectedPeriod === item.id
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                      setSelectedPeriod(isActive ? null : item.id)
                    }}
                    style={[
                      styles.timelinePill,
                      { backgroundColor: colors.pillBg, borderColor: colors.borderHover },
                      isActive && { backgroundColor: colors.copperGlow, borderColor: colors.copper },
                    ]}
                  >
                    <Text
                      style={[
                        styles.timelinePillText,
                        { color: colors.textSecondary },
                        isActive && { color: colors.copper },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>

          {/* Priority filter pills */}
          <View style={styles.priorityBar}>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.priorityContent}
            >
              {PRIORITY_FILTERS.map((filter) => {
                const isActive = selectedPriority === filter.id
                return (
                  <Pressable
                    key={filter.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                      setSelectedPriority(isActive ? 'all' : filter.id)
                    }}
                    style={[
                      styles.priorityPill,
                      { backgroundColor: colors.pillBg, borderColor: colors.borderHover },
                      isActive && { backgroundColor: colors.goldGlow, borderColor: colors.gold },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityPillText,
                        { color: colors.textSecondary },
                        isActive && { color: colors.gold },
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>
        </>
      )}

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.copper} size="large" />
        </View>
      ) : currentData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <DollarSign size={40} color={colors.textDim} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            {activeTab === 'browse'
              ? 'No items found'
              : 'Your budget is empty'}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
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
              ? (renderBrowseItem as any)
              : (renderMyBudgetItem as any)
          }
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={
            <Text style={[styles.disclaimerText, { color: colors.textDim }]}>
              For planning purposes only. Not financial or medical advice. Consult your pediatrician before administering any medication.
            </Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.copper}
            />
          }
        />
      )}

      {/* Add Custom Item Modal */}
      <Modal
        visible={showCustomModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <KeyboardAvoidingView
          style={[styles.modalOverlay, Platform.OS !== 'ios' && { backgroundColor: colors.overlay }]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {Platform.OS === 'ios' && (
            <BlurView tint={colors.blurTint} intensity={30} style={StyleSheet.absoluteFill} />
          )}
          <View style={[styles.modalSheet, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Add Custom Item</Text>
              <Pressable
                onPress={() => setShowCustomModal(false)}
                style={[styles.modalClose, { backgroundColor: colors.subtleBg }]}
              >
                <X size={20} color={colors.textMuted} />
              </Pressable>
            </View>

            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Item Name</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
              value={customItemName}
              onChangeText={setCustomItemName}
              placeholder="e.g. Baby Monitor"
              placeholderTextColor={colors.textDim}
              maxLength={80}
            />

            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryPills}
            >
              {BUDGET_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setCustomCategory(cat)}
                  style={[
                    styles.categoryPill,
                    { backgroundColor: colors.subtleBg, borderColor: colors.border },
                    customCategory === cat && { backgroundColor: colors.copperDim, borderColor: colors.copper },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      { color: colors.textMuted },
                      customCategory === cat && { color: colors.copper },
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Estimated Price (optional)</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
              value={customPrice}
              onChangeText={setCustomPrice}
              placeholder="e.g. 49.99"
              placeholderTextColor={colors.textDim}
              keyboardType="decimal-pad"
              maxLength={10}
            />

            <Pressable
              onPress={handleSubmitCustomItem}
              style={[
                styles.submitButton,
                { backgroundColor: colors.copper },
                addCustomItem.isPending && styles.submitButtonDisabled,
              ]}
              disabled={addCustomItem.isPending}
            >
              <Text style={[styles.submitButtonText, { color: colors.textPrimary }]}>
                {addCustomItem.isPending ? 'Adding...' : 'Add to Budget'}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Tab toggle
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
  },
  addCustomButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  tabText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
  },

  // Timeline bar
  timelineBar: {
    marginBottom: 10,
    minHeight: 42,
  },
  timelineContent: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 4,
  },
  timelinePill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  timelinePillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    lineHeight: 18,
  },

  // Priority filter bar
  priorityBar: {
    marginBottom: 12,
    minHeight: 38,
  },
  priorityContent: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 4,
  },
  priorityPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  priorityPillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    lineHeight: 18,
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
  },
  budgetItemCategory: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  budgetItemPriceCol: {
    alignItems: 'flex-end',
  },
  budgetItemPrice: {
    fontFamily: 'Jost-Medium',
    fontSize: 15,
  },
  budgetItemDesc: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
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
    flex: 1,
  },
  brandValueText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
    flex: 1,
  },

  // Must-have badge
  mustHaveBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  mustHaveText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
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
    borderWidth: 1,
  },
  addButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
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
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  summaryLabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: 'Jost-Medium',
    fontSize: 16,
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
  disclaimerText: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 8,
    lineHeight: 16,
  },

  // Custom item modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Jost-Regular',
    fontSize: 15,
  },
  categoryPills: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryPillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
})
