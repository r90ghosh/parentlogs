import { View, Text, StyleSheet } from 'react-native'
import { format, subDays } from 'date-fns'
import { GlassCard } from '@/components/glass'
import { MoodEmojiPop } from '@/components/animations'
import { useColors } from '@/hooks/use-colors'
import { useSubmitMood, useMoodHistory } from '@/hooks/use-journey'
import type { MoodLevel, MoodCheckin } from '@tdc/shared/types/dad-journey'

const MOODS: { level: MoodLevel; emoji: string; label: string }[] = [
  { level: 'struggling', emoji: '😣', label: 'Struggling' },
  { level: 'rough', emoji: '😔', label: 'Rough' },
  { level: 'okay', emoji: '😐', label: 'Okay' },
  { level: 'good', emoji: '🙂', label: 'Good' },
  { level: 'great', emoji: '😄', label: 'Great' },
]

function getMoodEmoji(level: MoodLevel): string {
  return MOODS.find((m) => m.level === level)?.emoji ?? '•'
}

function getStreak(checkins: MoodCheckin[]): number {
  if (!checkins.length) return 0

  let streak = 0
  // Cap loop to number of fetched checkins + 1 (to detect the gap)
  for (let i = 0; i <= checkins.length; i++) {
    const dateStr = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const hasCheckin = checkins.some(
      (c) => format(new Date(c.checked_in_at), 'yyyy-MM-dd') === dateStr
    )
    if (hasCheckin) {
      streak++
    } else {
      break
    }
  }

  return streak
}

interface MoodCheckinCardProps {
  todaysCheckin: MoodCheckin | null | undefined
}

export function MoodCheckinCard({ todaysCheckin }: MoodCheckinCardProps) {
  const colors = useColors()
  const submitMood = useSubmitMood()
  const { data: history } = useMoodHistory(7)

  if (todaysCheckin) {
    const moodConfig = MOODS.find((m) => m.level === todaysCheckin.mood)

    // Build last 7 days array (6 days ago to today), timezone-safe
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
    )

    const streak = history ? getStreak(history) : 0

    return (
      <GlassCard style={styles.card}>
        <View style={styles.checkedInRow}>
          <Text style={styles.checkedEmoji}>{moodConfig?.emoji ?? '✓'}</Text>
          <View>
            <Text style={[styles.checkedTitle, { color: colors.sage }]}>Checked in today</Text>
            <Text style={[styles.checkedSubtitle, { color: colors.textMuted }]}>
              Feeling {moodConfig?.label?.toLowerCase() ?? todaysCheckin.mood}
            </Text>
          </View>
        </View>

        {/* History dots */}
        {history && history.length > 0 && (
          <View style={styles.historyRow}>
            {last7Days.map((dateStr) => {
              const checkin = history.find(
                (c) => format(new Date(c.checked_in_at), 'yyyy-MM-dd') === dateStr
              )
              return (
                <View
                  key={dateStr}
                  style={[
                    styles.historyDot,
                    checkin
                      ? { backgroundColor: colors.copperDim }
                      : { backgroundColor: colors.textDim },
                  ]}
                >
                  {checkin && (
                    <Text style={styles.historyDotEmoji}>
                      {getMoodEmoji(checkin.mood)}
                    </Text>
                  )}
                </View>
              )
            })}
          </View>
        )}

        {/* Streak */}
        {streak > 0 && (
          <Text style={[styles.streakText, { color: colors.gold }]}>🔥 {streak} day streak</Text>
        )}

        {(todaysCheckin.mood === 'struggling' || todaysCheckin.mood === 'rough') && (
          <View style={[styles.crisisResources, { borderTopColor: colors.subtleBg }]}>
            <Text style={[styles.crisisText, { color: colors.textMuted }]}>
              If you're having a tough time, you're not alone. Talk to someone:
            </Text>
            <Text style={[styles.crisisPhone, { color: colors.sky }]}>Postpartum Support International: 1-800-944-4773</Text>
          </View>
        )}
      </GlassCard>
    )
  }

  return (
    <GlassCard style={styles.card}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>How are you feeling?</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Quick daily check-in</Text>
      <View style={styles.emojiRow}>
        {MOODS.map((mood) => (
          <MoodEmojiPop
            key={mood.level}
            emoji={mood.emoji}
            label={mood.label}
            isSelected={false}
            onPress={() => submitMood.mutate({ mood: mood.level })}
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
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
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
  },
  checkedTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
  },
  checkedSubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    marginTop: 2,
  },
  crisisResources: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  crisisText: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 4,
  },
  crisisPhone: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
    lineHeight: 16,
  },
  historyRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
    justifyContent: 'flex-start',
  },
  historyDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDotEmoji: {
    fontSize: 14,
  },
  streakText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    marginTop: 8,
  },
})
