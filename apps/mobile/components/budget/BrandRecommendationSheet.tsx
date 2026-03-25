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
import type { BudgetTemplate } from '@tdc/shared/types'

interface BrandRecommendationSheetProps {
  item: BudgetTemplate | null
  onClose: () => void
}

export function BrandRecommendationSheet({
  item,
  onClose,
}: BrandRecommendationSheetProps) {
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
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {item.item}
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={18} color="#7a6f62" />
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
                <View style={styles.accentBorder} />
                <View style={styles.sectionInner}>
                  <View style={styles.sectionHeader}>
                    <Crown size={16} color="#d4a853" />
                    <Text style={[styles.sectionLabel, styles.sectionLabelGold]}>
                      Premium Pick
                    </Text>
                  </View>
                  <Text style={styles.sectionContent}>{item.brand_premium}</Text>
                </View>
              </GlassCard>
            )}

            {/* Best Value */}
            {hasBestValue && (
              <GlassCard style={[styles.sectionCard, styles.sectionCardSage]}>
                <View style={[styles.accentBorder, styles.accentBorderSage]} />
                <View style={styles.sectionInner}>
                  <View style={styles.sectionHeader}>
                    <Sparkles size={16} color="#6b8f71" />
                    <Text style={[styles.sectionLabel, styles.sectionLabelSage]}>
                      Best Value
                    </Text>
                  </View>
                  <Text style={styles.sectionContent}>{item.brand_value}</Text>
                </View>
              </GlassCard>
            )}

            {/* When to Buy */}
            {hasWhenToBuy && (
              <GlassCard style={[styles.sectionCard, styles.sectionCardSky]}>
                <View style={[styles.accentBorder, styles.accentBorderSky]} />
                <View style={styles.sectionInner}>
                  <View style={styles.sectionHeader}>
                    <Calendar size={16} color="#5b9bd5" />
                    <Text style={[styles.sectionLabel, styles.sectionLabelSky]}>
                      When to Buy
                    </Text>
                  </View>
                  <Text style={styles.sectionContent}>{item.notes}</Text>
                </View>
              </GlassCard>
            )}

            {/* Dad Tip */}
            {hasDadTip && (
              <GlassCard style={[styles.sectionCard, styles.sectionCardCopper]}>
                <View style={[styles.accentBorder, styles.accentBorderCopper]} />
                <View style={styles.sectionInner}>
                  <View style={styles.sectionHeader}>
                    <Lightbulb size={16} color="#c4703f" />
                    <Text style={[styles.sectionLabel, styles.sectionLabelCopper]}>
                      Dad Tip
                    </Text>
                  </View>
                  <Text style={styles.sectionContent}>{item.description}</Text>
                </View>
              </GlassCard>
            )}

            {/* Empty state when no brand data */}
            {!hasPremiumPick && !hasBestValue && !hasWhenToBuy && !hasDadTip && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
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
    backgroundColor: '#1a1714',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(237,230,220,0.1)',
    paddingBottom: 40,
    maxHeight: '85%',
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(237,230,220,0.2)',
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
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#faf6f0',
    flex: 1,
    marginRight: 12,
    lineHeight: 28,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(237,230,220,0.06)',
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
  sectionCardSage: {
    borderColor: 'rgba(107,143,113,0.15)',
  },
  sectionCardSky: {
    borderColor: 'rgba(91,155,213,0.15)',
  },
  sectionCardCopper: {
    borderColor: 'rgba(196,112,63,0.15)',
  },
  accentBorder: {
    width: 3,
    backgroundColor: '#d4a853',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  accentBorderSage: {
    backgroundColor: '#6b8f71',
  },
  accentBorderSky: {
    backgroundColor: '#5b9bd5',
  },
  accentBorderCopper: {
    backgroundColor: '#c4703f',
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
  sectionLabelGold: {
    color: '#d4a853',
  },
  sectionLabelSage: {
    color: '#6b8f71',
  },
  sectionLabelSky: {
    color: '#5b9bd5',
  },
  sectionLabelCopper: {
    color: '#c4703f',
  },
  sectionContent: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#ede6dc',
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    textAlign: 'center',
  },
})
