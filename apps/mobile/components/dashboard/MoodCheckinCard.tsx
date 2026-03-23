import { View, Text, StyleSheet } from 'react-native'
import { GlassCard } from '@/components/glass'
import { MoodEmojiPop } from '@/components/animations'
import { useSubmitMood } from '@/hooks/use-dashboard'
import type { MoodLevel, MoodCheckin } from '@tdc/shared/types/dad-journey'

const MOODS: { level: MoodLevel; emoji: string; label: string }[] = [
  { level: 'struggling', emoji: '😣', label: 'Struggling' },
  { level: 'rough', emoji: '😔', label: 'Rough' },
  { level: 'okay', emoji: '😐', label: 'Okay' },
  { level: 'good', emoji: '🙂', label: 'Good' },
  { level: 'great', emoji: '😄', label: 'Great' },
]

interface MoodCheckinCardProps {
  todaysCheckin: MoodCheckin | null | undefined
}

export function MoodCheckinCard({ todaysCheckin }: MoodCheckinCardProps) {
  const submitMood = useSubmitMood()

  if (todaysCheckin) {
    const moodConfig = MOODS.find((m) => m.level === todaysCheckin.mood)
    return (
      <GlassCard style={styles.card}>
        <View style={styles.checkedInRow}>
          <Text style={styles.checkedEmoji}>{moodConfig?.emoji ?? '✓'}</Text>
          <View>
            <Text style={styles.checkedTitle}>Checked in today</Text>
            <Text style={styles.checkedSubtitle}>
              Feeling {moodConfig?.label?.toLowerCase() ?? todaysCheckin.mood}
            </Text>
          </View>
        </View>
        {(todaysCheckin.mood === 'struggling' || todaysCheckin.mood === 'rough') && (
          <View style={styles.crisisResources}>
            <Text style={styles.crisisText}>
              If you're having a tough time, you're not alone. Talk to someone:
            </Text>
            <Text style={styles.crisisPhone}>Postpartum Support International: 1-800-944-4773</Text>
          </View>
        )}
      </GlassCard>
    )
  }

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>How are you feeling?</Text>
      <Text style={styles.subtitle}>Quick daily check-in</Text>
      <View style={styles.emojiRow}>
        {MOODS.map((mood) => (
          <MoodEmojiPop
            key={mood.level}
            emoji={mood.emoji}
            label={mood.label}
            isSelected={false}
            onPress={() => submitMood.mutate(mood.level)}
          />
        ))}
      </View>
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    color: '#faf6f0',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    marginBottom: 16,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkedInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkedEmoji: {
    fontSize: 32,
    fontFamily: 'System',
  },
  checkedTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    color: '#6b8f71',
  },
  checkedSubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#7a6f62',
    marginTop: 2,
  },
  crisisResources: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(237,230,220,0.06)',
  },
  crisisText: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    color: '#7a6f62',
    lineHeight: 16,
    marginBottom: 4,
  },
  crisisPhone: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
    color: '#5b9bd5',
    lineHeight: 16,
  },
})
