import { View, Text, Pressable, StyleSheet, type ViewStyle } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, X } from 'lucide-react-native'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  leftAction?: 'back' | 'close' | React.ReactNode
  rightAction?: React.ReactNode
  onLeftPress?: () => void
  transparent?: boolean
  style?: ViewStyle
}

export function ScreenHeader({
  title,
  subtitle,
  leftAction = 'back',
  rightAction,
  onLeftPress,
  transparent = false,
  style,
}: ScreenHeaderProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const handleLeftPress = onLeftPress ?? (() => router.back())

  function renderLeftAction() {
    if (leftAction === 'back') {
      return (
        <Pressable
          onPress={handleLeftPress}
          style={styles.actionCircle}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ChevronLeft size={20} color="#ede6dc" />
        </Pressable>
      )
    }
    if (leftAction === 'close') {
      return (
        <Pressable
          onPress={handleLeftPress}
          style={styles.actionCircle}
          accessibilityLabel="Close"
          accessibilityRole="button"
        >
          <X size={20} color="#ede6dc" />
        </Pressable>
      )
    }
    return <View style={styles.actionSlot}>{leftAction}</View>
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 12 },
        !transparent && styles.withBackground,
        style,
      ]}
    >
      <View style={styles.leftSlot}>{renderLeftAction()}</View>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.rightSlot}>
        {rightAction ?? <View style={styles.spacer} />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  withBackground: {
    backgroundColor: 'transparent',
  },
  leftSlot: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightSlot: {
    width: 40,
    alignItems: 'flex-end',
  },
  actionSlot: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(237,230,220,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Jost-SemiBold',
    fontSize: 18,
    color: '#faf6f0',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
    textAlign: 'center',
    marginTop: 2,
  },
  spacer: {
    width: 40,
    height: 40,
  },
})
