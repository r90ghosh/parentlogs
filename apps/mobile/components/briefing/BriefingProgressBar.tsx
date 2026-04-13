import { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import { useColors } from '@/hooks/use-colors'

interface BriefingProgressBarProps {
  week: number
  isPregnancy: boolean
}

export function BriefingProgressBar({ week, isPregnancy }: BriefingProgressBarProps) {
  const colors = useColors()
  const total = isPregnancy ? 40 : 104
  const progress = Math.min(Math.max(week / total, 0), 1)

  const animWidth = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start()
  }, [progress, animWidth])

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted }]}>
        Week {week} of {total}
      </Text>
      <View style={[styles.track, { backgroundColor: colors.textDim }]}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: colors.copper },
            {
              width: animWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
    marginBottom: 6,
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
  },
})
