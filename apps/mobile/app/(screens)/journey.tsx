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
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { X, ChevronDown, ChevronUp, Compass } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { useCurrentPhase, useJourneyContent } from '@/hooks/use-journey'
import { PILLAR_CONFIG } from '@tdc/shared/constants/dad-pillar-config'
import type { DadChallengeContent, DadChallengePillar } from '@tdc/shared/types/dad-journey'
import * as Haptics from 'expo-haptics'

const PILLAR_COLORS: Record<DadChallengePillar, string> = {
  anxiety: '#d4836b',
  baby_bonding: '#6b8f71',
  relationship: '#c47a8f',
  finances: '#5b9bd5',
  knowledge: '#c4703f',
  planning: '#d4a853',
  extended_family: '#7a6f62',
}

const PILLAR_BG_COLORS: Record<DadChallengePillar, string> = {
  anxiety: 'rgba(212,131,107,0.1)',
  baby_bonding: 'rgba(107,143,113,0.1)',
  relationship: 'rgba(196,122,143,0.1)',
  finances: 'rgba(91,155,213,0.1)',
  knowledge: 'rgba(196,112,63,0.1)',
  planning: 'rgba(212,168,83,0.1)',
  extended_family: 'rgba(122,111,98,0.1)',
}

interface PillarTileProps {
  content: DadChallengeContent
  config: typeof PILLAR_CONFIG[number] | undefined
  isExpanded: boolean
  onToggle: () => void
  delay: number
}

function PillarTile({ content, config, isExpanded, onToggle, delay }: PillarTileProps) {
  const color = PILLAR_COLORS[content.pillar]
  const bgColor = PILLAR_BG_COLORS[content.pillar]

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
            <Text style={styles.pillarHeadline}>{content.headline}</Text>
          </View>
          {isExpanded ? (
            <ChevronUp size={18} color="#7a6f62" />
          ) : (
            <ChevronDown size={18} color="#7a6f62" />
          )}
        </Pressable>

        {/* Preview text (always visible) */}
        {!isExpanded && (
          <Text style={styles.pillarPreview} numberOfLines={2}>
            {content.preview}
          </Text>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Narrative */}
            <Text style={styles.narrative}>{content.narrative}</Text>

            {/* Action Items */}
            {content.action_items?.length > 0 && (
              <View style={styles.actionSection}>
                <Text style={styles.actionSectionTitle}>Action Items</Text>
                {content.action_items.map((action, idx) => (
                  <View key={idx} style={styles.actionItem}>
                    <View
                      style={[
                        styles.actionBullet,
                        { backgroundColor: color },
                      ]}
                    />
                    <View style={styles.actionContent}>
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionDesc}>
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
                <Text style={styles.actionSectionTitle}>From the Trenches</Text>
                {content.dad_quotes.map((q, idx) => (
                  <View key={idx} style={styles.quoteCard}>
                    <Text style={styles.quoteText}>"{q.quote}"</Text>
                    <Text style={styles.quoteAttribution}>
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
  const router = useRouter()
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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Dad Journey</Text>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={20} color="#7a6f62" />
        </Pressable>
      </View>

      {contentQuery.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#c4703f" size="large" />
        </View>
      ) : sortedContent.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Compass size={40} color="#4a4239" />
          <Text style={styles.emptyTitle}>No challenges yet</Text>
          <Text style={styles.emptySubtitle}>
            Challenge content for your current phase will appear here
          </Text>
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
              tintColor="#c4703f"
            />
          }
        >
          {/* Phase header */}
          <CardEntrance delay={0}>
            <View style={styles.phaseHeader}>
              <Compass size={20} color="#c4703f" />
              <View>
                <Text style={styles.phaseLabel}>Your current phase</Text>
                <Text style={styles.phaseName}>{phaseLabel}</Text>
              </View>
            </View>
          </CardEntrance>

          <CardEntrance delay={60}>
            <Text style={styles.introText}>
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
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  flex: {
    flex: 1,
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
    color: '#7a6f62',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  phaseName: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#faf6f0',
    marginTop: 2,
  },
  introText: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
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
    color: '#ede6dc',
    marginTop: 2,
  },
  pillarPreview: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // Expanded content
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(237,230,220,0.06)',
    paddingTop: 16,
  },
  narrative: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#ede6dc',
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
    color: '#7a6f62',
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
    color: '#ede6dc',
  },
  actionDesc: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
    marginTop: 2,
    lineHeight: 18,
  },

  // Quotes
  quotesSection: {
    marginBottom: 8,
  },
  quoteCard: {
    backgroundColor: 'rgba(237,230,220,0.04)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(196,112,63,0.3)',
  },
  quoteText: {
    fontFamily: 'Jost-Regular',
    fontStyle: 'italic',
    fontSize: 13,
    color: '#ede6dc',
    lineHeight: 20,
  },
  quoteAttribution: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 8,
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
