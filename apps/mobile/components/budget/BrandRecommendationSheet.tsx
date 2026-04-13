import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native'
import { X, Crown, Sparkles, Calendar, Lightbulb } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useColors } from '@/hooks/use-colors'
import type { BudgetTemplate } from '@tdc/shared/types'

interface BrandRecommendationSheetProps {
  item: BudgetTemplate | null
  onClose: () => void
}

export function BrandRecommendationSheet({
  item,
  onClose,
}: BrandRecommendationSheetProps) {
  const colors = useColors()

  if (!item) return null

  const hasPremiumPick = !!item.brand_premium
  const hasBestValue = !!item.brand_value
  const hasWhenToBuy = !!item.notes
  const hasDadTip = !!item.description

  return (
    <Modal
      visible={!!item}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouchable} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.borderHover }]}>
          {/* Handle bar */}
          <View style={[styles.handleBar, { backgroundColor: colors.borderHover }]} />

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.subtleBg }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
              {item.item}
            </Text>
            <Pressable onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.subtleBg }]}>
              <X size={18} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Premium Pick */}
            {hasPremiumPick && (
              <GlassCard style={styles.sectionCard}>
                <View style={[styles.accentBorder, { backgroundColor: colors.gold }]} />
                <View style={styles.sectionInner}>
                  <View style={styles.sectionHeader}>
                    <Crown size={16} color={colors.gold} />
                    <Text style={[styles.sectionLabel, { color: colors.gold }]}>
                      Premium Pick
                    </Text>
                  </View>
                  <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>{item.brand_premium}</Text>
                </View>
              </GlassCard>
            )}

            {/* Best Value */}
            {hasBestValue && (
              <GlassCard style={[styles.sectionCard, { borderColor: colors.sageDim }]}>
                <View style={[styles.accentBorder, { backgroundColor: colors.sage }]} />
                <View style={styles.sectionInner}>
                  <View style={styles.sectionHeader}>
                    <Sparkles size={16} color={colors.sage} />
                    <Text style={[styles.sectionLabel, { color: colors.sage }]}>
                      Best Value
                    </Text>
                  </View>
                  <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>{item.brand_value}</Text>
                </View>
              </GlassCard>
            )}

            {/* When to Buy */}
            {hasWhenToBuy && (
              <GlassCard style={[styles.sectionCard, { borderColor: colors.skyDim }]}>
                <View style={[styles.accentBorder, { backgroundColor: colors.sky }]} />
                <View style={styles.sectionInner}>
                  <View style={styles.sectionHeader}>
                    <Calendar size={16} color={colors.sky} />
                    <Text style={[styles.sectionLabel, { color: colors.sky }]}>
                      When to Buy
                    </Text>
                  </View>
                  <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>{item.notes}</Text>
                </View>
              </GlassCard>
            )}

            {/* Dad Tip */}
            {hasDadTip && (
              <GlassCard style={[styles.sectionCard, { borderColor: colors.copperDim }]}>
                <View style={[styles.accentBorder, { backgroundColor: colors.copper }]} />
                <View style={styles.sectionInner}>
                  <View style={styles.sectionHeader}>
                    <Lightbulb size={16} color={colors.copper} />
                    <Text style={[styles.sectionLabel, { color: colors.copper }]}>
                      Dad Tip
                    </Text>
                  </View>
                  <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>{item.description}</Text>
                </View>
              </GlassCard>
            )}

            {/* Empty state when no brand data */}
            {!hasPremiumPick && !hasBestValue && !hasWhenToBuy && !hasDadTip && (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  No recommendations available for this item yet.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    flex: 1,
    marginRight: 12,
    lineHeight: 28,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
    paddingBottom: 8,
  },
  sectionCard: {
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 0,
  },
  accentBorder: {
    width: 3,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  sectionInner: {
    flex: 1,
    padding: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionContent: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
})
