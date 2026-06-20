import { useState, useMemo, useCallback } from 'react'
import { View, Text, Pressable, FlatList, Modal, TextInput, RefreshControl, Share, Alert, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Upload, Plus, Check, X } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/use-colors'
import {
  useBudgetTemplates,
  useBudgetSummary,
  useAddToBudget,
  useTogglePurchased,
  useAddCustomBudgetItem,
} from '@/hooks/use-budget'
import { ScopeSwitch, PhaseChips } from '@/components/digest'
import type { BudgetTemplate, FamilyBudgetItem } from '@tdc/shared/types'

type Tab = 'my' | 'browse'
type Tier = 'value' | 'premium'

const CUSTOM_CATEGORIES = ['Nursery', 'Feeding', 'Clothing', 'Gear', 'Safety', 'Health', 'Registry', 'Hospital', 'Travel', 'Other']

function formatPrice(cents: number): string {
  if (!cents) return 'Free'
  return `$${Math.round(cents / 100)}`
}

export default function BudgetScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()

  const [tab, setTab] = useState<Tab>('my')
  const [tier, setTier] = useState<Tier>('value')
  const [category, setCategory] = useState<string>('all')
  const [showExport, setShowExport] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customPrice, setCustomPrice] = useState('')
  const [customCat, setCustomCat] = useState(CUSTOM_CATEGORIES[0])

  const templatesQuery = useBudgetTemplates(undefined)
  const summaryQuery = useBudgetSummary()
  const addToBudget = useAddToBudget()
  const togglePurchased = useTogglePurchased()
  const addCustomItem = useAddCustomBudgetItem()

  const summary = summaryQuery.data
  const myItems = useMemo(() => (summary?.familyItems ?? []) as FamilyBudgetItem[], [summary])
  const allTemplates = useMemo(() => (templatesQuery.data ?? []) as BudgetTemplate[], [templatesQuery.data])

  const addedTemplateIds = useMemo(() => {
    const s = new Set<string>()
    myItems.forEach((i) => i.budget_template_id && s.add(i.budget_template_id))
    return s
  }, [myItems])

  const categories = useMemo(() => {
    const set = new Set<string>()
    allTemplates.forEach((t) => t.category && set.add(t.category))
    return ['all', ...Array.from(set)]
  }, [allTemplates])

  const browseItems = useMemo(
    () => (category === 'all' ? allTemplates : allTemplates.filter((t) => t.category === category)),
    [allTemplates, category]
  )

  const planned = (tier === 'premium' ? summary?.grandTotalMax : summary?.grandTotalMin) ?? 0
  const spent = summary?.purchasedTotal ?? 0
  const left = Math.max(0, planned - spent)
  const boughtCount = myItems.filter((i) => i.is_purchased).length
  const pct = planned > 0 ? Math.min(100, (spent / planned) * 100) : 0

  const onToggle = useCallback(
    (itemId: string, purchased: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      togglePurchased.mutate({ itemId, isPurchased: !purchased })
    },
    [togglePurchased]
  )
  const onAdd = useCallback(
    (templateId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      addToBudget.mutate({ templateId })
    },
    [addToBudget]
  )

  const onExport = async () => {
    const lines = ['The Dad Center — Budget', '']
    myItems.forEach((i) =>
      lines.push(`${i.is_purchased ? '[x]' : '[ ]'} ${i.item} — ${formatPrice(i.actual_price ?? i.estimated_price ?? 0)}${i.category ? ` (${i.category})` : ''}`)
    )
    lines.push('', `Planned: ${formatPrice(planned)}`, `Spent: ${formatPrice(spent)}`, `Left: ${formatPrice(left)}`)
    setShowExport(false)
    try {
      await Share.share({ message: lines.join('\n') })
    } catch {
      /* user cancelled */
    }
  }

  const submitCustom = () => {
    const name = customName.trim()
    if (!name) {
      Alert.alert('Item name is required')
      return
    }
    const cents = customPrice.trim() ? Math.round(parseFloat(customPrice) * 100) : 0
    if (customPrice.trim() && isNaN(cents)) {
      Alert.alert('Enter a valid price')
      return
    }
    addCustomItem.mutate(
      { item: name, category: customCat, estimatedPrice: cents },
      {
        onSuccess: () => {
          setShowCustom(false)
          setCustomName('')
          setCustomPrice('')
          setCustomCat(CUSTOM_CATEGORIES[0])
          setTab('my')
        },
        onError: () => Alert.alert('Error', 'Failed to add item. Please try again.'),
      }
    )
  }

  const TierToggle = (
    <ScopeSwitch
      style={styles.tier}
      value={tier}
      onChange={(k) => setTier(k as Tier)}
      options={[
        { key: 'value', label: 'Best value' },
        { key: 'premium', label: 'Premium' },
      ]}
    />
  )

  const myHeader = (
    <View>
      <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.line }]}>
        <View style={styles.sumRow}>
          <SumStat label="Planned" value={formatPrice(planned)} colors={colors} />
          <SumStat label="Spent" value={formatPrice(spent)} colors={colors} accent />
          <SumStat label="Left" value={formatPrice(left)} colors={colors} />
        </View>
        <View style={[styles.progress, { backgroundColor: colors.line }]}>
          <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: colors.sage }]} />
        </View>
        <Text style={[styles.sumMeta, { color: colors.muted }]}>{boughtCount} of {myItems.length} bought</Text>
      </View>
      {TierToggle}
    </View>
  )

  const browseHeader = (
    <View>
      {TierToggle}
      <PhaseChips chips={categories.map((c) => ({ key: c, label: c === 'all' ? 'All' : c }))} activeKey={category} onSelect={setCategory} />
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.ink }]}>Budget</Text>
        <Pressable onPress={() => setShowExport(true)} hitSlop={8} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <Upload size={18} color={colors.ink2} />
        </Pressable>
      </View>
      <ScopeSwitch
        style={styles.scope}
        value={tab}
        onChange={(k) => setTab(k as Tab)}
        options={[
          { key: 'my', label: 'My list' },
          { key: 'browse', label: 'Browse' },
        ]}
      />

      {tab === 'my' ? (
        <FlatList
          data={myItems}
          keyExtractor={(i) => i.id}
          ListHeaderComponent={myHeader}
          contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={summaryQuery.isRefetching} onRefresh={() => summaryQuery.refetch()} tintColor={colors.accent} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.ink }]}>Start your budget</Text>
              <Text style={[styles.emptySub, { color: colors.muted }]}>Browse the catalog to add items, or add your own.</Text>
              <Pressable onPress={() => setTab('browse')} style={[styles.emptyBtn, { backgroundColor: colors.accent }]}>
                <Text style={styles.emptyBtnText}>Browse items</Text>
              </Pressable>
            </View>
          }
          ListFooterComponent={
            myItems.length > 0 ? (
              <Pressable onPress={() => setShowCustom(true)} style={styles.addCustom}>
                <Plus size={16} color={colors.accentInk} />
                <Text style={[styles.addCustomText, { color: colors.accentInk }]}>Add custom item</Text>
              </Pressable>
            ) : null
          }
          renderItem={({ item }) => {
            const price = item.actual_price ?? item.estimated_price ?? 0
            return (
              <Pressable
                onPress={() => onToggle(item.id, item.is_purchased)}
                style={({ pressed }) => [styles.row, { borderBottomColor: colors.line2, backgroundColor: pressed ? colors.cardHover : 'transparent' }]}
              >
                <View style={[styles.check, { borderColor: item.is_purchased ? colors.sage : colors.line, backgroundColor: item.is_purchased ? colors.sage : 'transparent' }]}>
                  {item.is_purchased && <Check size={12} color="#fff" strokeWidth={3} />}
                </View>
                <View style={styles.rowBody}>
                  <Text style={[styles.rowTitle, { color: item.is_purchased ? colors.muted : colors.ink, textDecorationLine: item.is_purchased ? 'line-through' : 'none' }]} numberOfLines={1}>
                    {item.item}
                  </Text>
                  <View style={styles.tags}>
                    <Text style={[styles.tag, { color: colors.muted }]}>{item.category}</Text>
                    {item.is_recurring && <Text style={[styles.tagAccent, { color: colors.accentInk }]}>· Monthly</Text>}
                    {item.is_custom && <Text style={[styles.tagAccent, { color: colors.accentInk }]}>· Custom</Text>}
                  </View>
                </View>
                <Text style={[styles.price, { color: colors.ink }]}>{formatPrice(price)}</Text>
              </Pressable>
            )
          }}
        />
      ) : (
        <FlatList
          data={browseItems}
          keyExtractor={(t) => t.budget_id}
          ListHeaderComponent={browseHeader}
          contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const added = addedTemplateIds.has(item.budget_id)
            const price = tier === 'premium' ? item.price_max : item.price_min
            const brand = tier === 'premium' ? item.brand_premium : item.brand_value
            return (
              <View style={[styles.row, { borderBottomColor: colors.line2 }]}>
                <View style={styles.rowBody}>
                  <Text style={[styles.rowTitle, { color: colors.ink }]} numberOfLines={1}>{item.item}</Text>
                  <View style={styles.tags}>
                    <Text style={[styles.tag, { color: colors.muted }]}>{formatPrice(price)}</Text>
                    {!!brand && <Text style={[styles.tag, { color: colors.muted }]} numberOfLines={1}>· {brand}</Text>}
                  </View>
                </View>
                <Pressable
                  onPress={() => !added && onAdd(item.budget_id)}
                  disabled={added}
                  style={[styles.addBtn, { borderColor: added ? colors.line : colors.accent, backgroundColor: added ? 'transparent' : colors.accent }]}
                >
                  <Text style={[styles.addBtnText, { color: added ? colors.muted : '#fff' }]}>{added ? 'Added' : 'Add'}</Text>
                </Pressable>
              </View>
            )
          }}
        />
      )}

      {tab === 'my' && (
        <Pressable onPress={() => setTab('browse')} style={[styles.fab, { bottom: insets.bottom + 100, backgroundColor: colors.accent }]}>
          <Plus size={24} color="#fff" strokeWidth={2.4} />
        </Pressable>
      )}

      {/* Export sheet */}
      <Modal visible={showExport} transparent animationType="slide" onRequestClose={() => setShowExport(false)}>
        <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={() => setShowExport(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: insets.bottom + 16 }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.sheetTitle, { color: colors.ink }]}>Export budget</Text>
            <Pressable onPress={onExport} style={[styles.sheetBtn, { borderColor: colors.line }]}>
              <Upload size={18} color={colors.ink2} />
              <Text style={[styles.sheetBtnText, { color: colors.ink }]}>Share list</Text>
            </Pressable>
            <Text style={[styles.sheetNote, { color: colors.faint }]}>Your family budget is already shared in-app. (CSV / PDF export coming soon.)</Text>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Custom item modal */}
      <Modal visible={showCustom} transparent animationType="slide" onRequestClose={() => setShowCustom(false)}>
        <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={() => setShowCustom(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: insets.bottom + 16 }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHead}>
              <Text style={[styles.sheetTitle, { color: colors.ink }]}>Add custom item</Text>
              <Pressable onPress={() => setShowCustom(false)} hitSlop={10}><X size={20} color={colors.ink2} /></Pressable>
            </View>
            <TextInput style={[styles.input, { color: colors.ink, borderColor: colors.line, backgroundColor: colors.bg }]} placeholder="Item name" placeholderTextColor={colors.faint} value={customName} onChangeText={setCustomName} />
            <TextInput style={[styles.input, { color: colors.ink, borderColor: colors.line, backgroundColor: colors.bg }]} placeholder="Price (optional)" placeholderTextColor={colors.faint} value={customPrice} onChangeText={setCustomPrice} keyboardType="decimal-pad" />
            <View style={styles.catWrap}>
              {CUSTOM_CATEGORIES.map((c) => (
                <Pressable key={c} onPress={() => setCustomCat(c)} style={[styles.catChip, { borderColor: customCat === c ? colors.accent : colors.line, backgroundColor: customCat === c ? colors.accent : 'transparent' }]}>
                  <Text style={[styles.catChipText, { color: customCat === c ? '#fff' : colors.ink2 }]}>{c}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={submitCustom} style={[styles.primaryBtn, { backgroundColor: colors.accent }]}>
              <Text style={styles.primaryBtnText}>Add item</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

function SumStat({ label, value, colors, accent }: { label: string; value: string; colors: ReturnType<typeof useColors>; accent?: boolean }) {
  return (
    <View style={styles.sumStat}>
      <Text style={[styles.sumValue, { color: accent ? colors.accentInk : colors.ink }]}>{value}</Text>
      <Text style={[styles.sumLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  title: { fontFamily: 'Jakarta-ExtraBold', fontSize: 26, letterSpacing: -0.6 },
  iconBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  scope: { marginHorizontal: 22, marginTop: 10, marginBottom: 6 },
  tier: { marginHorizontal: 22, marginTop: 8, marginBottom: 6 },
  summary: { marginHorizontal: 20, marginTop: 8, padding: 18, borderRadius: 18, borderWidth: 1 },
  sumRow: { flexDirection: 'row' },
  sumStat: { flex: 1, alignItems: 'center', gap: 4 },
  sumValue: { fontFamily: 'Jakarta-ExtraBold', fontSize: 22, letterSpacing: -0.5 },
  sumLabel: { fontFamily: 'Jakarta-Medium', fontSize: 12 },
  progress: { height: 6, borderRadius: 6, overflow: 'hidden', marginTop: 16 },
  progressFill: { height: '100%', borderRadius: 6 },
  sumMeta: { fontFamily: 'Jakarta-Medium', fontSize: 12.5, textAlign: 'center', marginTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, paddingHorizontal: 22, borderBottomWidth: 1 },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rowBody: { flex: 1, minWidth: 0 },
  rowTitle: { fontFamily: 'Jakarta-SemiBold', fontSize: 15.5, letterSpacing: -0.1 },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  tag: { fontFamily: 'Jakarta-Medium', fontSize: 12, flexShrink: 1 },
  tagAccent: { fontFamily: 'Jakarta-Bold', fontSize: 12 },
  price: { fontFamily: 'Jakarta-Bold', fontSize: 14, marginLeft: 'auto', paddingLeft: 8 },
  addBtn: { borderWidth: 1, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 16, marginLeft: 8 },
  addBtnText: { fontFamily: 'Jakarta-Bold', fontSize: 12.5 },
  empty: { alignItems: 'center', paddingTop: 56, paddingHorizontal: 40 },
  emptyTitle: { fontFamily: 'Jakarta-Bold', fontSize: 18 },
  emptySub: { fontFamily: 'Jakarta-Medium', fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: 8 },
  emptyBtn: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, marginTop: 18 },
  emptyBtnText: { fontFamily: 'Jakarta-Bold', fontSize: 14, color: '#fff' },
  addCustom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 20 },
  addCustomText: { fontFamily: 'Jakarta-Bold', fontSize: 14 },
  fab: { position: 'absolute', right: 20, width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sheetTitle: { fontFamily: 'Jakarta-Bold', fontSize: 17, marginBottom: 14 },
  sheetBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 14, padding: 16 },
  sheetBtnText: { fontFamily: 'Jakarta-SemiBold', fontSize: 15 },
  sheetNote: { fontFamily: 'Jakarta-Medium', fontSize: 12, marginTop: 12, lineHeight: 17 },
  input: { fontFamily: 'Jakarta-Medium', fontSize: 15, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10 },
  catWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 2, marginBottom: 14 },
  catChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 13 },
  catChipText: { fontFamily: 'Jakarta-SemiBold', fontSize: 12.5 },
  primaryBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryBtnText: { fontFamily: 'Jakarta-Bold', fontSize: 15, color: '#fff' },
})
