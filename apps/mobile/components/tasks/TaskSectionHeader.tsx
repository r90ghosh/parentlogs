import { View, Text, StyleSheet } from 'react-native'
import { useColors } from '@/hooks/use-colors'

interface TaskSectionHeaderProps {
  title: string
  count: number
  accentColor?: string
  dimmed?: boolean
}

export function TaskSectionHeader({
  title,
  count,
  accentColor,
  dimmed = false,
}: TaskSectionHeaderProps) {
  const colors = useColors()
  const resolvedAccent = accentColor ?? colors.textPrimary
  const isNeutral = !accentColor || resolvedAccent === colors.textPrimary || resolvedAccent === colors.textMuted

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {!isNeutral && (
          <View style={[styles.dot, { backgroundColor: resolvedAccent }]} />
        )}
        <Text
          style={[
            styles.title,
            { color: resolvedAccent },
            dimmed && styles.titleDimmed,
          ]}
        >
          {title}
        </Text>
      </View>
      <View
        style={[
          styles.countBadge,
          !isNeutral
            ? { backgroundColor: resolvedAccent + '18' }
            : { backgroundColor: colors.subtleBg },
        ]}
      >
        <Text
          style={[
            styles.countText,
            !isNeutral
              ? { color: resolvedAccent }
              : { color: colors.textDim },
          ]}
        >
          {count}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  title: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  titleDimmed: {
    opacity: 0.6,
  },
  countBadge: {
    borderRadius: 10,
    minWidth: 24,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontFamily: 'Karla-Bold',
    fontSize: 11,
  },
})
