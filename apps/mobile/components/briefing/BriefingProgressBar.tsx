import { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'

interface BriefingProgressBarProps {
  week: number
  isPregnancy: boolean
}

export function BriefingProgressBar({ week, isPregnancy }: BriefingProgressBarProps) {
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
      <Text style={styles.label}>
        Week {week} of {total}
      </Text>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
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
    color: '#7a6f62',
    marginBottom: 6,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4a4239',
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#c4703f',
  },
})
