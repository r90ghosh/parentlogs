import { useState, useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronDown, ChevronUp, Compass } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { ScreenHeader } from '@/components/ui/ScreenHeader'
import { useCurrentPhase, useJourneyContent } from '@/hooks/use-journey'
import { useColors } from '@/hooks/use-colors'
import { PILLAR_CONFIG } from '@tdc/shared/constants/dad-pillar-config'
import type { DadChallengeContent, DadChallengePillar } from '@tdc/shared/types/dad-journey'
import * as Haptics from 'expo-haptics'

const PILLAR_COLOR_KEYS: Record<DadChallengePillar, 'coral' | 'sage' | 'rose' | 'sky' | 'copper' | 'gold' | 'textMuted'> = {
  anxiety: 'coral',
  baby_bonding: 'sage',
  relationship: 'rose',
  finances: 'sky',
  knowledge: 'copper',
  planning: 'gold',
  extended_family: 'textMuted',
}

const PILLAR_BG_KEYS: Record<DadChallengePillar, 'coralDim' | 'sageDim' | 'roseDim' | 'skyDim' | 'copperDim' | 'goldDim' | 'subtleBg'> = {
  anxiety: 'coralDim',
  baby_bonding: 'sageDim',
  relationship: 'roseDim',
  finances: 'skyDim',
  knowledge: 'copperDim',
  planning: 'goldDim',
  extended_family: 'subtleBg',
}

interface PillarTileProps {
  content: DadChallengeContent
  config: typeof PILLAR_CONFIG[number] | undefined
  isExpanded: boolean
  onToggle: () => void
  delay: number
}

function PillarTile({ content, config, isExpanded, onToggle, delay }: PillarTileProps) {
  const colors = useColors()
  const colorKey = PILLAR_COLOR_KEYS[content.pillar]
  const bgKey = PILLAR_BG_KEYS[content.pillar]
  const color = colors[colorKey]
  const bgColor = colors[bgKey]

  return (
    <CardEntrance delay={delay}>
      <GlassCard style={styles.pillarCard}>
        {/* Copper-top border accent */}
        <View style={[styles.pillarAccent, { backgroundColor: color }]} />

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            onToggle()
          }}
          style={styles.pillarHeader}
        >
          <View style={[styles.pillarIconWrap, { backgroundColor: bgColor }]}>
            <Text style={styles.pillarEmoji}>{config?.icon || '?'}</Text>
          </View>
          <View style={styles.pillarInfo}>
            <Text style={[styles.pillarLabel, { color }]}>
              {config?.label || content.pillar}
            </Text>
            <Text style={[styles.pillarHeadline, { color: colors.textSecondary }]}>{content.headline}</Text>
          </View>
          {isExpanded ? (
            <ChevronUp size={18} color={colors.textMuted} />
          ) : (
            <ChevronDown size={18} color={colors.textMuted} />
          )}
        </Pressable>

        {/* Preview text (always visible) */}
        {!isExpanded && (
          <Text style={[styles.pillarPreview, { color: colors.textMuted }]} numberOfLines={2}>
            {content.preview}
          </Text>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <View style={[styles.expandedContent, { borderTopColor: colors.border }]}>
            {/* Narrative */}
            <Text style={[styles.narrative, { color: colors.textSecondary }]}>{content.narrative}</Text>

            {/* Action Items */}
            {content.action_items?.length > 0 && (
              <View style={styles.actionSection}>
                <Text style={[styles.actionSectionTitle, { color: colors.textMuted }]}>Action Items</Text>
                {content.action_items.map((action, idx) => (
                  <View key={idx} style={styles.actionItem}>
                    <View
                      style={[
                        styles.actionBullet,
                        { backgroundColor: color },
                      ]}
                    />
                    <View style={styles.actionContent}>
                      <Text style={[styles.actionTitle, { color: colors.textSecondary }]}>{action.title}</Text>
                      <Text style={[styles.actionDesc, { color: colors.textMuted }]}>
                        {action.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Dad Quotes */}
            {content.dad_quotes?.length > 0 && (
              <View style={styles.quotesSection}>
                <Text style={[styles.actionSectionTitle, { color: colors.textMuted }]}>From the Trenches</Text>
                {content.dad_quotes.map((q, idx) => (
                  <View key={idx} style={[styles.quoteCard, { backgroundColor: colors.pressed, borderLeftColor: colors.copperGlow }]}>
                    <Text style={[styles.quoteText, { color: colors.textSecondary }]}>"{q.quote}"</Text>
                    <Text style={[styles.quoteAttribution, { color: colors.textMuted }]}>
                      — {q.attribution}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </GlassCard>
    </CardEntrance>
  )
}

export default function JourneyScreen() {
  const insets = useSafeAreaInsets()
  const colors = useColors()
  const phase = useCurrentPhase()
  const contentQuery = useJourneyContent(phase)
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null)

  const handleRefresh = useCallback(() => {
    contentQuery.refetch()
  }, [contentQuery])

  // Sort content to match PILLAR_CONFIG order
  const sortedContent = (contentQuery.data || []).sort((a, b) => {
    const aIdx = PILLAR_CONFIG.findIndex((p) => p.pillar === a.pillar)
    const bIdx = PILLAR_CONFIG.findIndex((p) => p.pillar === b.pillar)
    return aIdx - bIdx
  })

  const phaseLabel = phase
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  const journeyHeader = (
    <ScreenHeader title="Dad Journey" leftAction="close" transparent />
  )

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>

      {contentQuery.isLoading ? (
        <View style={styles.loadingContainer}>
          {journeyHeader}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colors.copper} size="large" />
          </View>
        </View>
      ) : sortedContent.length === 0 ? (
        <View style={styles.emptyContainer}>
          {journeyHeader}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12 }}>
            <Compass size={40} color={colors.textDim} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No challenges yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Challenge content for your current phase will appear here
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={contentQuery.isRefetching}
              onRefresh={handleRefresh}
              tintColor={colors.copper}
            />
          }
        >
          {journeyHeader}
          {/* Phase header */}
          <CardEntrance delay={0}>
            <View style={styles.phaseHeader}>
              <Compass size={20} color={colors.copper} />
              <View>
                <Text style={[styles.phaseLabel, { color: colors.textMuted }]}>Your current phase</Text>
                <Text style={[styles.phaseName, { color: colors.textPrimary }]}>{phaseLabel}</Text>
              </View>
            </View>
          </CardEntrance>

          <CardEntrance delay={60}>
            <Text style={[styles.introText, { color: colors.textMuted }]}>
              Seven pillars of the dad journey. Tap to explore challenges,
              actions, and real stories from other dads.
            </Text>
          </CardEntrance>

          {/* Pillar tiles */}
          {sortedContent.map((content, index) => {
            const config = PILLAR_CONFIG.find(
              (p) => p.pillar === content.pillar
            )
            return (
              <PillarTile
                key={content.id}
                content={content}
                config={config}
                isExpanded={expandedPillar === content.id}
                onToggle={() =>
                  setExpandedPillar(
                    expandedPillar === content.id ? null : content.id
                  )
                }
                delay={120 + index * 80}
              />
            )
          })}

          {/* Disclaimer */}
          <Text style={[styles.disclaimerText, { color: colors.textDim }]}>
            Content is for informational and self-reflection purposes only. For mental health concerns, please consult a qualified professional.
          </Text>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingTop: 8,
  },

  // Phase header
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  phaseLabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  phaseName: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    marginTop: 2,
  },
  introText: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },

  // Pillar card
  pillarCard: {
    overflow: 'hidden',
    padding: 0,
  },
  pillarAccent: {
    height: 3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  pillarIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarEmoji: {
    fontSize: 22,
  },
  pillarInfo: {
    flex: 1,
  },
  pillarLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pillarHeadline: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    marginTop: 2,
  },
  pillarPreview: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // Expanded content
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  narrative: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },

  // Action items
  actionSection: {
    marginBottom: 20,
  },
  actionSectionTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  actionItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
  },
  actionDesc: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },

  // Quotes
  quotesSection: {
    marginBottom: 8,
  },
  quoteCard: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  quoteText: {
    fontFamily: 'Jost-Regular',
    fontStyle: 'italic',
    fontSize: 13,
    lineHeight: 20,
  },
  quoteAttribution: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    marginTop: 8,
  },

  // Disclaimer
  disclaimerText: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
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
