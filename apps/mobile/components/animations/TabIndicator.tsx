import { useEffect } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface AnimatedTabBarProps {
  state: {
    index: number
    routes: { key: string; name: string; params?: object }[]
  }
  descriptors: Record<string, {
    options: {
      title?: string
      tabBarAccessibilityLabel?: string
      tabBarIcon?: (props: { color: string; size: number; focused: boolean }) => React.ReactNode
    }
  }>
  navigation: {
    emit: (event: { type: string; target: string; canPreventDefault?: boolean }) => { defaultPrevented: boolean }
    navigate: (name: string, params?: object) => void
  }
  isDark: boolean
}

export function AnimatedTabBar({
  state,
  descriptors,
  navigation,
  isDark,
}: AnimatedTabBarProps) {
  const reducedMotion = useReducedMotion()
  const insets = useSafeAreaInsets()
  const tabCount = state.routes.length
  const indicatorLeft = useSharedValue(0)

  useEffect(() => {
    if (reducedMotion) {
      indicatorLeft.value = state.index / tabCount
    } else {
      indicatorLeft.value = withTiming(state.index / tabCount, { duration: 250 })
    }
  }, [state.index, tabCount, reducedMotion])

  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${indicatorLeft.value * 100}%` as `${number}%`,
    width: `${100 / tabCount}%` as `${number}%`,
  }))

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {Platform.OS === 'ios' && (
        <BlurView
          tint={isDark ? 'dark' : 'light'}
          intensity={isDark ? 80 : 60}
          style={StyleSheet.absoluteFill}
        />
      )}

      <Animated.View style={[styles.indicator, indicatorStyle]}>
        <View style={styles.indicatorLine} />
      </Animated.View>

      <View style={styles.tabs}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index
          const color = isFocused
            ? '#c4703f'
            : isDark ? '#7a6f62' : '#6b7280'

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              style={styles.tab}
            >
              {options.tabBarIcon?.({ color, size: 24, focused: isFocused })}
              <Text
                style={[
                  styles.label,
                  { color },
                ]}
              >
                {options.title ?? route.name}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(237,230,220,0.08)',
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(26,23,20,0.95)',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 2,
    alignItems: 'center',
  },
  indicatorLine: {
    width: '40%',
    height: 2,
    backgroundColor: '#c4703f',
    borderRadius: 1,
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    gap: 2,
  },
  label: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
  },
})
