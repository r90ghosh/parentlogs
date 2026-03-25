import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Brain, ChevronRight } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
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
  const phase = useCurrentPhase()
  const { data: content } = useJourneyContent(phase)

  if (!content || content.length === 0) return null

  const tiles = content.slice(0, 2)

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <Brain size={18} color="#d4a853" />
        </View>
        <Text style={styles.title}>On Your Mind</Text>
      </View>

      <View style={styles.tilesContainer}>
        {tiles.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push('/(screens)/journey')}
            style={styles.tile}
          >
            <Text style={styles.tileEmoji}>
              {item.icon || PILLAR_EMOJIS[item.pillar] || '💡'}
            </Text>
            <View style={styles.tileContent}>
              <Text style={styles.tileTitle} numberOfLines={1}>
                {item.headline}
              </Text>
              <Text style={styles.tileDesc} numberOfLines={2}>
                {item.preview}
              </Text>
            </View>
            <ChevronRight size={16} color="#7a6f62" />
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
    borderLeftColor: '#d4a853',
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
    backgroundColor: 'rgba(212,168,83,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
    color: '#faf6f0',
  },
  tilesContainer: {
    gap: 10,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(237,230,220,0.04)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
  },
  tileEmoji: {
    fontSize: 22,
    fontFamily: 'System',
  },
  tileContent: {
    flex: 1,
  },
  tileTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#ede6dc',
  },
  tileDesc: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 2,
    lineHeight: 17,
  },
})
