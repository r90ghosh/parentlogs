import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Brain, ChevronRight } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useColors } from '@/hooks/use-colors'
import { useJourneyContent, useCurrentPhase } from '@/hooks/use-journey'

const PILLAR_EMOJIS: Record<string, string> = {
  knowledge: '📚',
  planning: '📋',
  finances: '💰',
  anxiety: '🧘',
  baby_bonding: '👶',
  relationship: '💜',
  extended_family: '👨‍👩‍👧',
}

export function OnYourMindCard() {
  const router = useRouter()
  const colors = useColors()
  const phase = useCurrentPhase()
  const { data: content } = useJourneyContent(phase)

  if (!content || content.length === 0) return null

  const tiles = content.slice(0, 2)

  return (
    <GlassCard style={[styles.card, { borderLeftColor: colors.gold }]}>
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.goldDim }]}>
          <Brain size={18} color={colors.gold} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>On Your Mind</Text>
      </View>

      <View style={styles.tilesContainer}>
        {tiles.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push('/(screens)/journey')}
            style={[styles.tile, { backgroundColor: colors.pressed, borderColor: colors.border }]}
          >
            <Text style={styles.tileEmoji}>
              {item.icon || PILLAR_EMOJIS[item.pillar] || '💡'}
            </Text>
            <View style={styles.tileContent}>
              <Text style={[styles.tileTitle, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.headline}
              </Text>
              <Text style={[styles.tileDesc, { color: colors.textMuted }]} numberOfLines={2}>
                {item.preview}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderLeftWidth: 3,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
  },
  tilesContainer: {
    gap: 10,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  tileEmoji: {
    fontSize: 22,
  },
  tileContent: {
    flex: 1,
  },
  tileTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
  },
  tileDesc: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
})
